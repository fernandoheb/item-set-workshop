const http = require('http');
const https = require('https');
const cs = require('concat-stream');

const key='f39f8547-5363-4eaa-ad2c-f76f5ed9bbd2';

const defaultError = '{"error": "Bad request.", "code": 400 }';

// HTTPS GET request helper
// Returns a JSON object based on the response of a GET request on given url
function getData(url, callback) {
  https.get(url, function(res) {
    var status = res.statusCode;

    res.pipe(cs({encoding: 'string'}, function(str) {
      callback({data: str, code: status});
    }));
  });
}

// Get Summoner History
// Requires summoner name and a region to get its recent matches
exports.getHistory = function(summoner, region, callback) {
  summoner = summoner.toLowerCase();
  var url = 'https://' + region + '.api.pvp.net' + '/api/lol/' + region +
    '/v1.4/summoner/by-name/' + summoner + '?api_key=' + key;

  // Get summoner ID
  getData(url, function(obj) {
    switch (obj.code) {
      case 200: // Summoner Ok
        var objJSON = JSON.parse(obj.data);
        var summonerID = objJSON[summoner].id;
        var url = 'https://' + region + '.api.pvp.net' + '/api/lol/' + region +
          '/v1.3/game/by-summoner/' + summonerID + '/recent?api_key=' + key;

        // Get Matches
        getData(url, function(obj) {
          switch (obj.code) {
            case 200: // Match History Ok
              callback(obj.data);
              break;
            default: // Some kind of error
              callback(defaultError);
          }
        });
        break;

      case 404: // Summoner not found
        callback('{"error": "The summoner was not found.", "code": 404 }');
        break;

      default: // Some kind of error
        callback(defaultError);
        break;
    }
  });
};

// Get Match Data
// Sends a match data given its matchID and region
exports.getMatch = function(matchID, region, timeline, callback) {
  var url = 'https://' + region + '.api.pvp.net' + '/api/lol/' + region +
    '/v2.2/match/' + matchID + '?includeTimeline=' + timeline + '&api_key=' + key;

  getData(url, function(obj) {
    switch (obj.code) {
      case 200: // Match Data Ok
        callback(obj.data);
        break;
      default: // Some kind of error
        callback(defaultError);
    }
  });
};
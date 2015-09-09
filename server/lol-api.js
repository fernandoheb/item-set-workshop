const http = require('http');
const https = require('https');
const cs = require('concat-stream');

const key='f39f8547-5363-4eaa-ad2c-f76f5ed9bbd2';

// HTTPS GET request helper
// Returns a JSON object based on the response of a GET request on given url
function getJSON(url, callback) {
  https.get(url, function(res) {
    var status = res.statusCode;

    if (status === 200) {
      res.pipe(cs({encoding: 'string'}, function(str) {
        callback(JSON.parse(str));
      }))
    } else {
      callback({error: 'Request error. Code: ' + status + '.'});
    }
  })
}

// Get Summoner History
// Requires summoner name and a region to get its recent matches
exports.getHistory = function(summoner, region, callback) {
  summoner = summoner.toLowerCase();
  var url = 'https://' + region + '.api.pvp.net' + '/api/lol/' + region +
    '/v1.4/summoner/by-name/' + summoner + '?api_key=' + key;

  // Get summoner ID
  getJSON(url, function(obj) {
    var summonerID = obj[summoner].id;
    var url = 'https://' + region + '.api.pvp.net' + '/api/lol/' + region +
      '/v1.3/game/by-summoner/' + summonerID + '/recent?api_key=' + key;

    // Get Matches
    getJSON(url, function(obj) {
      callback(obj);
    })
  });
};

// Get Match Data
// Sends a match data given its matchID and region
exports.getMatch = function(matchID, region, timeline, callback) {
  var url = 'https://' + region + '.api.pvp.net' + '/api/lol/' + region +
    '/v2.2/match/' + matchID + '?includeTimeline=' + timeline + '&api_key=' + key;

  getJSON(url, function(obj) {
    callback(obj);
  });
};
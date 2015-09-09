const express = require('express');
const http = require('http');

const lolApi = require('./server/lol-api.js');
const league = require('./server/league.js');

// Instantiate server
var app = express();

// Common configuration
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

// Configure routing resources
app.use(express.static('app'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/' + 'index.html');
});

// LOL API ROUTES (ALL RETURN A JSON RESPONSE)

// Match History route
// Returns a match history information based on a summoner on a region
app.get('/api/matchHistory', function(req, res) {
  var summoner = req.query.summoner.toLowerCase();
  var region = req.query.region.toLowerCase();

  if (!summoner) res.json({error: 'Bad request. No summoner specified.'});
  else if (!region) res.json({error: 'Bad request. No region specified.'});
  else if (league.regions.indexOf(region) < 0) res.json({error: 'Bad request. Unknown region.'});

  else {
    // History response
    lolApi.getHistory(summoner, region, function(obj) {
      res.json(obj);
    });
  }

});

// Match Data Route
// Returns the relevant data of a specified match
app.get('/api/matchData', function(req, res) {
  var matchId = req.query.matchId;
  var region = req.query.region;

  if (!matchId) res.json({error: 'Bad request. No match specified.'});
  else if (!region) res.json({error: 'Bad request. No region specified.'});
  else if (league.regions.indexOf(region) < 0) res.json({error: 'Bad request. Unknown region.'});

  else {
    // Match response
    lolApi.getMatch(matchId, region, false, function(obj) {
      res.json(obj);
    });
  }

});

// Data Dragon version
app.get('/api/dragonVersion', function(req, res) {
  var region = req.query.region;
  var index = league.regions.indexOf(region);

  if (!region) res.json({error: 'Bad request. No region specified.'});
  else if (index < 0) res.json({error: 'Bad request. Unknown region.'});

  else {
    // Version response
    res.json({ddversion: league.ddversion[index]});
  }

});

// Champions List
app.get('/api/champions', function(req, res){
  res.json(league.champions);
});

// Summoner Spells List
app.get('/api/summonerSpells', function(req, res){
  res.send(league.summonerSpells);
});

// Start server
app.listen(port, ip);

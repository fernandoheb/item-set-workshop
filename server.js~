const express = require('express');
const scripts = require('./server/scripts.js')
const lolServers = ["br","lan","eune","euw","kr","las","na","oce","ru","tr"];

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

/*
//daily update
function daily(){
  return scripts.daily();
}
daily();*/

// Give Match History
app.get('/api/matchHistory', function(req, res){
  if(req.query.sumName!=undefined&&req.query.region!=undefined){
    if(!scripts.inArray(lolServers,req.query.region)){
      res.send('{"error":"invalid server"}');
      return;
    }
    scripts.getHistory(req.query.sumName,req.query.region,function(text){
      res.send(text);
    });
    return;
  }
  return res.send('{"error":"Bad request"}');
});

// Give Match data
app.get('/api/matchData', function(req, res){
  if(req.query.matchId!=undefined&&req.query.region!=undefined){
    if(!scripts.inArray(lolServers,req.query.region)){
      res.send('{"error":"invalid server"}');
      return;
    }
    scripts.getMatch(req.query.matchId,false,req.query.region,function(text){
      res.send(text);
    });
    return;
  }
  return res.send('{"error":"Bad request"}');
});

//Give ddragonVersion
app.get('/api/ddragon', function(req, res){
  if(req.query.region!=undefined){
    if(!scripts.inArray(lolServers,req.query.region)){
      res.send('{"error":"invalid server"}');
      return;
    }
    var i = 0;
    while(lolServers[i]!=req.query.region){i++;}
    return res.send(scripts.ddragonVersion[i]);
  }
  return res.send('{"error":"Bad request"}');
});

//Give champions dictionary
app.get('/api/champDic', function(req, res){
  return res.send(scripts.champions);
});

//Give summoner spells dictionary
app.get('/api/summonerSpells', function(req, res){
  return res.send(scripts.summonerSpells);
});


// Start server
app.listen(port, ip);

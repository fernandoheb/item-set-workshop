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
app.get(/^\/userName=%22(.+)%22&region=%22(.+)%22$/, function(req, res){
  if(!scripts.inArray(lolServers,req.params[1])){
    res.send('{"error":"invalid server"}');
    return;
  }
  scripts.getHistory(req.params[0],req.params[1],function(text){
    res.send(text);
  });
});

// Give Match data
app.get(/^\/matchId=%22(.+)%22&region=%22(.+)%22$/, function(req, res){
  if(!scripts.inArray(lolServers,req.params[1])){
    res.send('{"error":"invalid server"}');
    return;
  }
  scripts.getMatch(req.params[0],false,req.params[1],function(text){
    res.send(text);
  });
});

//Give ddragonVersion
app.get(/^\/ddragon&region=%22(.+)%22$/, function(req, res){
  if(!scripts.inArray(lolServers,req.params[0])){
    res.send('{"error":"invalid server"}');
    return;
  }
  var i = 0;
  while(lolServers[i]!=req.params[0]){i++;}
  return res.send(scripts.ddragonVersion[i]);
});

//Give champions dictionary
app.get(/^\/champDic$/, function(req, res){
  return res.send(scripts.champions);
});


// Start server
app.listen(port, ip);

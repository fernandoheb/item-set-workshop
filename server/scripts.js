const key='api_key=f39f8547-5363-4eaa-ad2c-f76f5ed9bbd2';
const http = require('http');
const https = require("https");

get = function(options,onResult){
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res){
        var output = '';
        console.log(options.host + ':' + res.statusCode);

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            onResult(res.statusCode,output);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();

};

/*
userName as string ej: "pipimax"
region as string ej: "lan"
callback as a function that recives a json with the history data
*/
function getHistory(userName,region,callback){
  
  //get summoner id
  var lowerName = userName.toLowerCase();
  var options = {
    host: (region+'.api.pvp.net'),
    port: 443,
    path: ('/api/lol/'+region+'/v1.4/summoner/by-name/'+lowerName+'?'+key),
    method: 'GET'
  };
  get(options,function middle1(code,text){
    if(code==404){//No summoner data found for any specified inputs
      return callback('{"error":"no summoner data"}');
    }
    if(code==500||code==503){//rito server error, try again
      return get(options,middle1);
    }
    if(code==200){
      var summoner = JSON.parse(text)//summoner data
      //get history
      options = {
        host: (region+'.api.pvp.net'),
        port: 443,
        path: ('/api/lol/'+region+'/v1.3/game/by-summoner/'+summoner[lowerName].id+'/recent?'+key),
        method: 'GET'
      };
      
      get(options,function middle2(code,text){
        if(code==500||code==503){//rito server error, try again
          return get(options,middle2);
        }
        if(code==200){
          return callback(text);
        }
        return callback('{"error":"unknown"}');
      });
      return;
    }
    return callback('{"error":"unknown"}');
  });
}

/*
matchId as string, id of match
timeline as boolean, whether or not to include timeline
region as string ej: "lan"
callback as a function that recives a json with the match data
*/
function getMatch(matchId,timeline,region,callback){
  var options = {
    host: (region+'.api.pvp.net'),
    port: 443,
    path: ('/api/lol/'+region+'/v2.2/match/'+matchId+'?includeTimeline='+timeline+'&'+key),
    method: 'GET'
  };

  get(options,function middle1(code,text){
    if(code==404){//Match not found
      return callback('{"error":"Match not found"}');
    }
    if(code==500||code==503){//rito server error, try again
      return get(options,middle1);
    }
    if(code==200){
      return callback(text);;
    }
    return callback('{"error":"unknown"}');
  });
}

/*
retorna una lista de 7 elementos con los items finales de un jagador en orden
matchjson as json representing the match
numPlayer as int from 1-12, the number of the player
*/
function getItemsByPlayer(mj,numPlayer){
  return [mj.participants[numPlayer].stats.item0,mj.participants[numPlayer].stats.item1,mj.participants[numPlayer].stats.item2,mj.participants[numPlayer].stats.item3,mj.participants[numPlayer].stats.item4,mj.participants[numPlayer].stats.item5,mj.participants[numPlayer].stats.item6];
}

/*
given a match json object, returns an array of arrays, each of them having:
 > summonerName
 > championId
 > teamId
 > First summoner spell ID
 > Second summoner spell ID
 > kills
 > deaths
 > assists
 > champLevel
 > minionsKilled
 > goldEarned

*/
function getDetails(mj){
  var playerNum = mj.participantIdentities.length;
  var i = 0;
  var arr;
  var output = [];
  while(i<10){
    arr = [mj.participantIdentities[i].player.summonerName,mj.participants[i].championId,mj.participants[i].teamId,mj.participants[i].spell1Id,mj.participants[i].spell2Id,mj.participants[i].stats.kills,mj.participants[i].stats.deaths,mj.participants[i].stats.assists,mj.participants[i].stats.champLevel,mj.participants[i].stats.minionsKilled+mj.participants[i].stats.neutralMinionsKilled,mj.participants[i].stats.goldEarned];
    output.push(arr);
    i++;
  }
  return output;
}

function inArray(arr,obj){
  var tam = arr.length;
  var i = 0;
  var out = false;
  while(i<tam&&arr[i]!=obj){i++;}
  return !(i==tam);
}

exports.inArray = inArray;
exports.getHistory = getHistory;
exports.getMatch = getMatch;
/*
getHistory("JoseD92","lan",function(jj){
  var j = JSON.parse(jj);
  getMatch(j.games[0].gameId,false,'lan',function (yy){
    var y = JSON.parse(yy);
    console.log(getDetails(y));
  });
});/*
getHistory("JoseD922","lan",function(j){
  console.log(j);
});*/






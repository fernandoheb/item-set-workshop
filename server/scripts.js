const key='api_key=f39f8547-5363-4eaa-ad2c-f76f5ed9bbd2';
const http = require('http');
const https = require("https");
const lolServers = ["br","lan","eune","euw","kr","las","na","oce","ru","tr"];
var ddragonVersion = ["5.16.1","5.16.1","5.16.1","5.16.1","5.16.1","5.16.1","5.16.1","5.16.1","5.16.1","5.16.1"];
var champions = '{"1":"Annie","2":"Olaf","3":"Galio","4":"TwistedFate","5":"XinZhao","6":"Urgot","7":"Leblanc","8":"Vladimir","9":"FiddleSticks","10":"Kayle","11":"MasterYi","12":"Alistar","13":"Ryze","14":"Sion","15":"Sivir","16":"Soraka","17":"Teemo","18":"Tristana","19":"Warwick","20":"Nunu","21":"MissFortune","22":"Ashe","23":"Tryndamere","24":"Jax","25":"Morgana","26":"Zilean","27":"Singed","28":"Evelynn","29":"Twitch","30":"Karthus","31":"Chogath","32":"Amumu","33":"Rammus","34":"Anivia","35":"Shaco","36":"DrMundo","37":"Sona","38":"Kassadin","39":"Irelia","40":"Janna","41":"Gangplank","42":"Corki","43":"Karma","44":"Taric","45":"Veigar","48":"Trundle","50":"Swain","51":"Caitlyn","53":"Blitzcrank","54":"Malphite","55":"Katarina","56":"Nocturne","57":"Maokai","58":"Renekton","59":"JarvanIV","60":"Elise","61":"Orianna","62":"MonkeyKing","63":"Brand","64":"LeeSin","67":"Vayne","68":"Rumble","69":"Cassiopeia","72":"Skarner","74":"Heimerdinger","75":"Nasus","76":"Nidalee","77":"Udyr","78":"Poppy","79":"Gragas","80":"Pantheon","81":"Ezreal","82":"Mordekaiser","83":"Yorick","84":"Akali","85":"Kennen","86":"Garen","89":"Leona","90":"Malzahar","91":"Talon","92":"Riven","96":"KogMaw","98":"Shen","99":"Lux","101":"Xerath","102":"Shyvana","103":"Ahri","104":"Graves","105":"Fizz","106":"Volibear","107":"Rengar","110":"Varus","111":"Nautilus","112":"Viktor","113":"Sejuani","114":"Fiora","115":"Ziggs","117":"Lulu","119":"Draven","120":"Hecarim","121":"Khazix","122":"Darius","126":"Jayce","127":"Lissandra","131":"Diana","133":"Quinn","134":"Syndra","143":"Zyra","150":"Gnar","154":"Zac","157":"Yasuo","161":"Velkoz","201":"Braum","222":"Jinx","223":"TahmKench","236":"Lucian","238":"Zed","245":"Ekko","254":"Vi","266":"Aatrox","267":"Nami","268":"Azir","412":"Thresh","421":"RekSai","429":"Kalista","432":"Bard"}'
var summonerSpells = '{"1":"SummonerBoost","2":"SummonerClairvoyance","3":"SummonerExhaust","4":"SummonerFlash","6":"SummonerHaste","7":"SummonerHeal","11":"SummonerSmite","12":"SummonerTeleport","13":"SummonerMana","14":"SummonerDot","17":"SummonerOdinGarrison","21":"SummonerBarrier","30":"SummonerPoroRecall","31":"SummonerPoroThrow","32":"SummonerSnowball"}';

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

/*function daily(){
  //check ddragon server versions
  var i = 0;
  var options = {
    host: 'global.api.pvp.net',
    port: 443,
    path: ('/api/lol/static-data/'+lolServers[i]+'/v1.2/versions?'+key),
    method: 'GET'
  };
  var f = function help(code,text){
    ddragonVersion[i] = JSON.parse(text)[0];
    i++;
    if(i==lolServers.length){return;}
    options = {
      host: 'global.api.pvp.net',
      port: 443,
      path: ('/api/lol/static-data/'+lolServers[i]+'/v1.2/versions?'+key),
      method: 'GET'
    };
    get(options,f);
  }
  get(options,f);

  setTimeout(daily,86399000);
}*/

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
//exports.daily = daily;
exports.ddragonVersion = ddragonVersion;
exports.champions = champions;
exports.summonerSpells = summonerSpells;






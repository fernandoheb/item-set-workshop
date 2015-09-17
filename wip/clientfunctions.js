// TODO MOVE TO CLIENT
/*
 retorna una lista de 7 elementos con los items finales de un jagador en orden
 matchjson as json representing the match
 numPlayer as int from 1-12, the number of the player
 */
function getItemsByPlayer(mj,numPlayer){
  return [mj.participants[numPlayer].stats.item0,
    mj.participants[numPlayer].stats.item1,
    mj.participants[numPlayer].stats.item2,
    mj.participants[numPlayer].stats.item3,
    mj.participants[numPlayer].stats.item4,
    mj.participants[numPlayer].stats.item5,
    mj.participants[numPlayer].stats.item6];
}

// TODO MOVE TO CLIENT
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
  while(i<playerNum){
    arr = [mj.participantIdentities[i].player.summonerName,mj.participants[i].championId,mj.participants[i].teamId,mj.participants[i].spell1Id,mj.participants[i].spell2Id,mj.participants[i].stats.kills,mj.participants[i].stats.deaths,mj.participants[i].stats.assists,mj.participants[i].stats.champLevel,mj.participants[i].stats.minionsKilled+mj.participants[i].stats.neutralMinionsKilled,mj.participants[i].stats.goldEarned];
    output.push(arr);
    i++;
  }
  return output;
}
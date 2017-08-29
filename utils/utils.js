var getTokenTime = function(){
  let replaceTimeStr = function(times){
    return times.map(time => time < 10 ? '0'+time : time.toString());
  }
  let date = new Date();
  let array = replaceTimeStr([date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()]);
  function* objectEntries() {
    let propKeys = Object.keys(this);
    for (let propKey of propKeys) {
      yield this[propKey];
    }
  }
  array[Symbol.iterator] = objectEntries;
  let tokenTime = '';
  for (let value of array) {
    tokenTime += `${value}`;
  }
  return tokenTime;
}

module.exports = {
  getTokenTime
}

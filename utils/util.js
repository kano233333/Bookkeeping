const formatTime = (date,type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let time;
  switch(type){
    case "month":
      time = [year, month].map(formatNumber).join('-')
      break;
    case "day":
      time = [year, month, day].map(formatNumber).join('-')
      break;
    case "detail":
      time = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return time
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getWeek(dt){
  let d1 = new Date(dt);
  let d2 = new Date(dt);
  d2.setMonth(0);
  d2.setDate(1);
  let rq = d1-d2;
  let days = Math.ceil(rq/(24*60*60*1000));
  let num = Math.ceil(days/7);
  return num;
}

module.exports = {
  formatTime: formatTime,
  getWeek: getWeek
}

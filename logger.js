const fs = require("fs");

const logData = (file, data) => {
  fs.appendFile(file, data, (err) => {
    if (err) throw err;
  });
};

const getDate = () => {
  let d = new Date();

  return d.getFullYear() + '-' + formatNumber(d.getMonth()+1) + '-' + formatNumber(d.getDate());
};

const getDateTime = () => {
  let d = new Date();

  return formatNumber(d.getDate()) + '/' + formatNumber(d.getMonth()+1) + '/' + d.getFullYear() + ' ' + formatNumber(d.getHours()) + ':' + formatNumber(d.getMinutes());
};

const formatNumber = (n) => {
  if (n < 10)
    return '0' + n;

  return n;
};

module.exports = {
  writeUriCall: (uri) => {
    let file = './log/call/call_' + getDate() + '.txt';
    let data = '[' + getDateTime() + '] Call: ' + uri + '\n';

    logData(file, data);
  },
  writeCrawlerError: (err) => {
    let file = './log/error/error_' + getDate() + '.txt';
    let data = '[' + getDateTime() + '] ' + err + '\n';

    logData(file, data);
  },
};

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logfilepath = path.join(__dirname, '..', 'log.txt');
    console.log("LOG PATH: " + this.logfilepath);
  }

  logToConsole(message){
    console.log(message);
  }

  logToFile(message){
    let date = new Date();
    let timestamp = date.getTime();
    message = date + " " + timestamp + ":\n" + message;
    fs.appendFile(this.logfilepath, message, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  }

  log(message){
    this.logToConsole(message);
    this.logToFile(message);
  }
}

const logger = new Logger();

module.exports = logger;
const fs = require('fs');

class Logger {
  constructor() {
    this.logfilepath = '../log.txt';
  }

  logToConsole(message){
    console.log(message);
  }

  logToFile(message){
    let date = new Date();
    let timestamp = date.getTime();
    message = datestamp + " " + timestamp + ":\n" + message;
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
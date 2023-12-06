const fs = require('fs');
const path = require('path');

class Logger {
	constructor() {
		this.logfilepath = path.join(__dirname, '..', 'log.txt');
		console.log("LOG PATH: " + this.logfilepath);
	}

	logToConsole(message) {
		console.log(message);
	}

	async checkLogFileSize() {
		const MAX_SIZE_MB = 1;
		try {
			let stats = await fs.promises.stat(this.logfilepath);
			let fileSizeInBytes = stats.size;
			let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
			if (fileSizeInMegabytes >= MAX_SIZE_MB) {
				await fs.promises.truncate(this.logfilepath, 0);
			}
		} catch (error) {
			throw error;
		}
	}

	async logToFile(message) {
		let date = new Date();
		let timestamp = date.getTime();
		message = date + " " + timestamp + ":\n" + message;
		try {
			await this.checkLogFileSize();
			await fs.promises.appendFile(this.logfilepath, message);
		} catch (error) {
			throw error;
		}
	}

	async log(message) {
		try {
			this.logToConsole(message);
			await this.logToFile(message);
		} catch (error) {
			throw error;
		}
	}
}

const logger = new Logger();

module.exports = logger;
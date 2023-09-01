const log4js = require("log4js");

log4js.configure({
	appenders: {
		consoleOut: {
			type: "console",
			layout: {
				type: "colored"
			}
		},
		fileOut: {
			type: "dateFile",
			filename: "logs/app.log",
			pattern: "yyyy-MM-dd",
			alwaysIncludePattern: false,
			numBackups: 10
		},
		error: {
			type: "dateFile",
			filename: "logs/app-error.log",
			pattern: "yyyy-MM-dd",
			alwaysIncludePattern: false,
			numBackups: 10
		}
	},
	replaceConsole: true,
	categories: {
		default: { appenders: ["fileOut", "consoleOut"], level: "debug" },
		error: { appenders: ["consoleOut", "error"], level: "warn" }
	}
});

const defaultLogger = log4js.getLogger("default");
const errorLogger = log4js.getLogger("error");

module.exports = {
	trace() {
		return defaultLogger.trace.call(defaultLogger, ...arguments);
	},
	debug() {
		return defaultLogger.debug.call(defaultLogger, ...arguments);
	},
	info() {
		return defaultLogger.info.call(defaultLogger, ...arguments);
	},
	warn() {
		errorLogger.warn.call(errorLogger, ...arguments);
	},
	error() {
		defaultLogger.info.call(defaultLogger, ...arguments);
		errorLogger.error.call(errorLogger, ...arguments);
	}
};

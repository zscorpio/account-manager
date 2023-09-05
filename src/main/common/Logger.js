import logger from "electron-log";
import path from "path";
import FsUtils from "../utils/FsUtils";
import DateUtils from "../utils/DateUtils";

logger.transports.file.level = "info";
logger.transports.file.maxSize = 1002430; // 10M
logger.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";
logger.transports.file.resolvePathFn = () => {
	return path.join(FsUtils.getRootPath(), `log/${DateUtils.formatYMD()}.log`);
};

export default {
	info(param) {
		logger.info(param);
	},
	warn(param) {
		logger.warn(param);
	},
	error(param) {
		logger.error(param);
	},
	debug(param) {
		logger.debug(param);
	},
	verbose(param) {
		logger.verbose(param);
	},
	silly(param) {
		logger.silly(param);
	}
};

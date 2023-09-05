import FsUtils from "../utils/FsUtils";

export default {
	get: async function () {
		let systemConfigFile = FsUtils.getSystemConfigFile();
		let systemConfig = FsUtils.readFileSync(systemConfigFile);
		return {
			rootPath: FsUtils.getRootPath(),
			executablePath: systemConfig.executablePath
		};
	},
	update: async function (data) {
		let systemConfigFile = FsUtils.getSystemConfigFile();
		let systemConfig = FsUtils.readFileSync(systemConfigFile);
		if (data) {
			if (data.rootPath) {
				systemConfig.rootPath = data.rootPath;
			}
			if (data.executablePath) {
				systemConfig.executablePath = data.executablePath;
			}
			FsUtils.writeFileSync(systemConfigFile, JSON.stringify(systemConfig));
		}
	}
};

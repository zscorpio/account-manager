import FsUtils from "../utils/FsUtils";

export default {
	get: async function () {
		return {
			rootPath: FsUtils.getRootPath()
		};
	},
	update: async function (data) {
		let systemConfigFile = FsUtils.getSystemConfigFile();
		let systemConfig = FsUtils.readFileSync(systemConfigFile);
		if (data && data.rootPath) {
			systemConfig.rootPath = data.rootPath;
			FsUtils.writeFileSync(systemConfigFile, JSON.stringify(systemConfig));
		}
	}
};

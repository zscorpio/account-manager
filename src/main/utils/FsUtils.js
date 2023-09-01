import fs from "fs";
import path from "path";
import demoData from "../const/demoData";

const { app } = require("electron");

export default {
	readFileSync(file, defaultValue = {}) {
		let cacheInfo = "";
		if (fs.existsSync(file)) {
			cacheInfo = fs.readFileSync(file);
		}
		if (JSON.stringify(cacheInfo) !== "{}" && cacheInfo.length !== 0) {
			cacheInfo = JSON.parse(cacheInfo);
		} else {
			cacheInfo = defaultValue;
		}
		return cacheInfo;
	},
	writeFileSync(file, data) {
		const directory = path.dirname(file);
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}

		return fs.writeFileSync(file, data);
	},
	getUserDataPath(uniqueId) {
		return this.getRootPath() + "/userData/" + uniqueId;
	},
	deleteUserDataLock(uniqueId) {
		let singletonLockPath = this.getUserDataPath(uniqueId) + "/SingletonLock";
		try {
			fs.unlinkSync(singletonLockPath);
		} catch (e) {
			/* empty */
		}
	},
	getCacheFile(uniqueId) {
		const cacheFilePath = this.getRootPath() + "/data/";
		if (!fs.existsSync(cacheFilePath)) {
			fs.mkdirSync(cacheFilePath);
		}
		return cacheFilePath + uniqueId + ".cache";
	},
	getAccountConfigPath() {
		const accountConfigPath = this.getRootPath() + "/account/";
		if (!fs.existsSync(accountConfigPath)) {
			fs.mkdirSync(accountConfigPath);
			this.initDemoData();
		}
		return accountConfigPath;
	},
	initDemoData() {
		const accountConfigPath = this.getAccountConfigPath();
		console.log("demoDatademoData", demoData);
		this.writeFileSync(accountConfigPath + "/demoData.json", JSON.stringify(demoData));
	},
	getRootPath() {
		let systemConfig = this.readFileSync(this.getSystemConfigFile());
		if (systemConfig.rootPath) {
			return systemConfig.rootPath;
		}
		// 如果目录不存在需要创建
		const rootPath = this.getProjectRootPath() + "/customData";
		if (!fs.existsSync(rootPath)) {
			fs.mkdirSync(rootPath);
		}
		return rootPath;
	},
	getProjectRootPath() {
		return app.getPath("userData");
	},
	getSystemConfigFile() {
		return this.getProjectRootPath() + "/config.json";
	}
};

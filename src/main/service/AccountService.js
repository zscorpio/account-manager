import OpenAIService from "./OpenAIService";
import ZOOMService from "./ZOOMService";
import FsUtils from "../utils/FsUtils";
import fs from "fs";
import path from "path";
import BaseAccountService from "./BaseAccountService";

let accountMap = {};

// 遍历目录下的所有.json文件，读取内容合并成一个大数组
function getAllAccountConfig(directory) {
	let accountConfig = [];

	// 获取目录下所有文件名
	const fileNames = fs.readdirSync(directory);

	fileNames.forEach((fileName) => {
		const filePath = path.join(directory, fileName);

		if (path.extname(filePath) === ".json") {
			try {
				const fileContent = FsUtils.readFileSync(filePath);
				accountConfig.push(fileContent);
			} catch (error) {
				console.error(`读取文件 ${filePath} 失败：`, error);
			}
		}
	});

	return accountConfig;
}

export default {
	getAccountList: function () {
		let accountConfigPath = FsUtils.getAccountConfigPath();
		let accountConfig = getAllAccountConfig(accountConfigPath);
		for (let i in accountConfig) {
			let accountList = accountConfig[i].accountList;
			let type = accountConfig[i].type;
			let homePage = accountConfig[i].homePage;
			for (let j in accountList) {
				let account = accountList[j];
				if (!account.uniqueId) {
					account.uniqueId = type + "_" + account.account;
					accountConfig[i].accountList[j].uniqueId = account.uniqueId;
				}
				if (!account.homePage) {
					account.homePage = homePage;
					accountConfig[i].accountList[j].homePage = homePage;
				}
				if (!account.type) {
					account.type = type;
					accountConfig[i].accountList[j].type = type;
				}
				accountMap[account.uniqueId] = account;
				let data = FsUtils.readFileSync(
					FsUtils.getCacheFile(account.uniqueId, {
						auth: {},
						data: {},
						lastUpdateTime: 0
					})
				);
				accountConfig[i].accountList[j].lastUpdateTime = data.lastUpdateTime;
				accountConfig[i].accountList[j].data = data.data;
			}
		}

		accountConfig.sort((a, b) => {
			let orderA = a.order || 1000000;
			let orderB = b.order || 1000000;
			return orderA - orderB;
		});

		return accountConfig;
	},
	openHomePage: async function (data) {
		let account = accountMap[data.uniqueId];
		if (account.type === "openai") {
			const openAIService = new OpenAIService(account);
			await openAIService.openHomePage();
		}
		if (account.type === "zoom") {
			const zoomService = new ZOOMService(account);
			return await zoomService.openHomePage();
		}
		const baseAccountService = new BaseAccountService(account);
		return await baseAccountService.openHomePage();
	},
	updateData: async function (data) {
		let account = accountMap[data.uniqueId];
		if (account.type === "openai") {
			const openAIService = new OpenAIService(account);
			return await openAIService.updateData();
		}
		if (account.type === "zoom") {
			const zoomService = new ZOOMService(account);
			return await zoomService.updateData();
		}
		const baseAccountService = new BaseAccountService(account);
		return await baseAccountService.updateData();
	}
};

// const log = require("../common/LogConfig");
import PuppeteerUtils from "../utils/PuppeteerUtils";
import FsUtils from "../utils/FsUtils";

class BaseAccountService {
	constructor(config) {
		this.config = config;
		this.config.cacheFile = FsUtils.getCacheFile(config.uniqueId);
	}

	async openHomePage() {
		let page = null;
		let homePage = this.config.homePage;
		try {
			const puppeteerResult = await PuppeteerUtils.start(this.config.uniqueId);
			page = puppeteerResult.page;
			this.page = page;
			// await page.goto(homePage);
			await page.goto(homePage);
			const logined = await this.checkIfLogined();
			if (!logined) {
				await this.login();
			}
		} catch (error) {
			console.warn("BaseAccountService#openHomePage exception, ", this.config.uniqueId, error.message);
		}
	}

	async checkIfLogined() {}

	async login() {}

	async getCurrentData() {}

	async updateData() {}
}

export default BaseAccountService;

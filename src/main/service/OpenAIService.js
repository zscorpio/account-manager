import BaseAccountService from "./BaseAccountService";
import SysUtils from "../utils/SysUtils";
import DateUtils from "../utils/DateUtils";
import FsUtils from "../utils/FsUtils";
import fs from "fs";
import axios from "axios";
import PuppeteerUtils from "../utils/PuppeteerUtils";
import CalUtils from "../utils/CalUtils";
import log from "../common/Logger";

class OpenAIService extends BaseAccountService {
	async openHomePage() {
		await super.openHomePage();
	}

	async checkIfLogined() {
		await SysUtils.sleep(3000);
		const userDetail = await this.page.$(".user-details-org");
		return userDetail !== null;
	}

	async login(headless = false) {
		// let browser;
		try {
			const puppeteerResult = await PuppeteerUtils.start(this.config.uniqueId, headless);
			let page = puppeteerResult.page;
			// browser = puppeteerResult.browser;
			let { account, password } = this.config;
			let cacheFile = FsUtils.getCacheFile(this.config.uniqueId);
			await page.goto("https://platform.openai.com/login?launch");
			let logined = null;
			try {
				logined = await page.waitForSelector(".launcher-menu, .ovr-section", { timeout: 5000 });
			} catch (e) {
				/* empty */
			}
			if (!logined) {
				await page.waitForSelector("#username");
				await page.$eval("#username", (input) => (input.value = ""));
				await page.type("#username", account, { delay: parseInt(Math.random() * 50 + "") });
				const submitBtn = await page.$("button");
				await submitBtn.click();
				await page.waitForSelector("#password");
				await page.type("#password", password, { delay: parseInt(Math.random() * 50 + "") });
				const loginBtn = (await page.$$("button"))[2];
				await loginBtn.click();
			}
			await page.waitForSelector(".launcher-menu, .ovr-section");
			await page.goto(this.config.homePage);
			const response = await PuppeteerUtils.waitForResponse(page, "dashboard/billing/credit_grants", "GET");
			let authorization = response.request().headers()["authorization"];
			let cacheInfo = FsUtils.readFileSync(cacheFile, {
				auth: {},
				data: {},
				lastUpdateTime: 0
			});
			cacheInfo.auth.authorization = authorization;
			FsUtils.writeFileSync(cacheFile, JSON.stringify(cacheInfo));
			return authorization;
		} catch (e) {
			log.error("OpenAIService#login", e);
		} finally {
			// if (browser != null) {
			// 	browser.close();
			// }
		}
	}

	async updateData() {
		let config = this.config;
		let { account, password } = this.config;

		let cacheInfo = {};
		if (fs.existsSync(config.cacheFile)) {
			cacheInfo = fs.readFileSync(config.cacheFile);
		}
		if (JSON.stringify(cacheInfo) !== "{}" && cacheInfo.length !== 0) {
			cacheInfo = JSON.parse(cacheInfo);
		}
		let logined = false;
		let authorization = cacheInfo?.auth?.authorization;
		if (authorization) {
			const usageData = await this.getUsageData(authorization);
			if (usageData != null) {
				logined = true;
			}
		}
		if (!logined) {
			authorization = await this.login(true);
		}
		let result = await this.getBalance(account, password, authorization);
		log.info("OpenAIService#updateData", result);

		return result;
	}

	async getBalance(account, password, authorization) {
		const subscriptionData = await this.getSubscription(authorization);
		const creditGrantsData = await this.getCreditGrants(authorization);
		if (subscriptionData != null && creditGrantsData != null) {
			return await this.genResponse(account, subscriptionData, creditGrantsData, authorization);
		} else {
			return "fail";
		}
	}

	async getCreditGrants(authorization) {
		try {
			const creditGrantsData = await axios.get("https://api.openai.com/dashboard/billing/credit_grants", {
				timeout: 5000,
				headers: {
					authorization: authorization
				}
			});
			return creditGrantsData.data;
		} catch (e) {
			return null;
		}
	}

	async getUsageData(authorization, startDate = DateUtils.formatMonthStartDate("America/New_York")) {
		try {
			const usageData = await axios.get(
				"https://api.openai.com/dashboard/billing/usage?end_date=" +
					DateUtils.formatNextMonthStartDate("America/New_York") +
					"&start_date=" +
					startDate,
				{
					timeout: 5000,
					headers: {
						authorization: authorization
					}
				}
			);
			return usageData.data;
		} catch (e) {
			return null;
		}
	}

	async getSubscription(authorization) {
		try {
			const subscriptionData = await axios.get("https://api.openai.com/dashboard/billing/subscription", {
				timeout: 5000,
				headers: {
					authorization: authorization
				}
			});
			return subscriptionData.data;
		} catch (e) {
			return null;
		}
	}

	async genResponse(account, subscriptionData, creditGrantsData, authorization) {
		let startDate = DateUtils.formatMonthStartDate("America/New_York");
		let total = subscriptionData.hard_limit_usd;
		if (subscriptionData.billing_mechanism === "advance" || (total <= 6 && !subscriptionData.has_credit_card)) {
			total = creditGrantsData.total_granted;
			startDate = DateUtils.formatPreMonthStartDate("America/New_York", 2);
		}
		let usage = 0;

		const usageData = await this.getUsageData(authorization, startDate);

		if (usageData.total_usage) {
			usage = (usageData.total_usage / 100).toFixed(2);
		}
		let left = (total - usage).toFixed(2);
		if (left <= 0) {
			left = 0;
		}
		const result = {
			total,
			usage,
			left,
			percent: CalUtils.progressPercentage(left, total),
			type: "openai"
		};
		let cacheFile = FsUtils.getCacheFile(this.config.uniqueId);
		let cacheInfo = FsUtils.readFileSync(cacheFile, {
			auth: {},
			data: {},
			lastUpdateTime: 0
		});
		cacheInfo.data = result;
		cacheInfo.lastUpdateTime = DateUtils.currentSecond();
		FsUtils.writeFileSync(cacheFile, JSON.stringify(cacheInfo));
		return result;
	}
}

export default OpenAIService;

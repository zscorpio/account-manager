import BaseAccountService from "./BaseAccountService";
import SysUtils from "../utils/SysUtils";
import PuppeteerUtils from "../utils/PuppeteerUtils";

class ZOOMService extends BaseAccountService {
	async openHomePage() {
		await super.openHomePage();
	}

	async checkIfLogined() {
		await SysUtils.sleep(3000);
		const userDetail = await this.page.$(".sidebar-menu");
		return userDetail !== null;
	}

	async login(headless = false) {
		let browser;
		try {
			const puppeteerResult = await PuppeteerUtils.start(this.config.uniqueId, headless);
			let page = puppeteerResult.page;
			browser = puppeteerResult.browser;
			let { account, password, homePage } = this.config;
			await page.goto(homePage);
			const emailInput = await page.waitForSelector("#email");
			await emailInput.type(account);
			const passwordInput = await page.$("#password");
			await passwordInput.type(password);
			const loginBtn = await page.$("#js_btn_login");
			await loginBtn.click();
			await page.waitForSelector(".sidebar-menu");
			await page.goto(homePage);
		} catch (e) {
			console.log(e);
		} finally {
			// if (browser != null) {
			// 	browser.close();
			// }
		}
	}
}

export default ZOOMService;

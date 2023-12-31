import puppeteer from "puppeteer";
import FsUtils from "./FsUtils";
import log from "../common/Logger";

global.__browser = {};

export default {
	async start(uniqueId, headless) {
		if (global.__browser[uniqueId] != null) {
			try {
				let browser = global.__browser[uniqueId];
				let page = await browser.newPage();

				return {
					browser,
					page
				};
			} catch (e) {
				log.error("PuppeteerUtil#start error", e);
			}
		}

		let systemConfigFile = FsUtils.getSystemConfigFile();
		let systemConfig = FsUtils.readFileSync(systemConfigFile);

		let options = {
			headless: false,
			defaultViewport: null,
			ignoreHTTPSErrors: false,
			ignoreDefaultArgs: ["--enable-automation", "--disable-extensions"],
			userDataDir: FsUtils.getUserDataPath(uniqueId),
			args: [
				"--no-sandbox",
				"--lang=zh-CN",
				"--disable-blink-features=AutomationControlled",
				// `--window-size=${1440},${1000}`
				"--start-maximized",
				"--enable-easy-off-store-extension-install"
			]
			// executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
		};
		FsUtils.deleteUserDataLock(uniqueId);
		if (headless) {
			options.headless = "new";
		}
		if (systemConfig.executablePath) {
			options.executablePath = systemConfig.executablePath;
		}
		const browser = await puppeteer.launch(options);
		global.__browser[uniqueId] = browser;
		browser.on("disconnected", () => {
			delete global.__browser[uniqueId];
		});

		const page = await browser.newPage();
		await page.evaluateOnNewDocument(() => {
			const newProto = navigator.__proto__;
			delete newProto.webdriver;
			navigator.__proto__ = newProto;
		});
		return {
			browser,
			page
		};
	},
	async waitForResponse(page, url, method) {
		let resolveCallback;
		const responsePromise = new Promise((resolve) => {
			resolveCallback = resolve;
		});

		page.on("response", (response) => {
			if (response.url().indexOf(url) > -1 && response.request().method() === method) {
				resolveCallback(response);
			}
		});

		await responsePromise;
		page.off("response");
		return await responsePromise;
	}
};

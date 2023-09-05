import { autoUpdater } from "electron-updater";
import { ipcMain, app, dialog } from "electron";
import log from "../common/Logger";
import path from "path";

export default {
	init: function () {
		Object.defineProperty(app, "isPackaged", {
			get() {
				return true;
			}
		});
		autoUpdater.updateConfigPath = path.join(__dirname, "../../dev-app-update.yml");

		app.on("ready", function () {
			autoUpdater.checkForUpdatesAndNotify();
		});

		// 触发检查更新(此方法用于被渲染线程调用，例如页面点击检查更新按钮来调用此方法)
		ipcMain.on("check-for-update", () => {
			log.info("UpdateService#init, 触发检查更新");
			autoUpdater.checkForUpdates();
		});

		// 设置自动下载为false(默认为true，检测到有更新就自动下载)
		autoUpdater.autoDownload = false;
		// 检测下载错误
		autoUpdater.on("error", (error) => {
			log.error("UpdateService#init, 更新异常", error);
		});

		autoUpdater.on("update-available", function (releaseInfo) {
			log.info("UpdateService#init, 检测到新版本，确认是否下载");
			let releaseNotes = releaseInfo.releaseNotes;
			let releaseContent = "";
			if (releaseNotes) {
				if (typeof releaseNotes === "string") {
					releaseContent = releaseNotes;
				} else if (Array.isArray(releaseNotes)) {
					releaseNotes.forEach(function (releaseNote) {
						releaseContent += releaseNote + "\n";
					});
				}
			} else {
				releaseContent = "暂无更新说明";
			}
			// 弹框确认是否下载更新（releaseContent是更新日志）
			dialog
				.showMessageBox({
					type: "info",
					title: "应用有新的更新",
					detail: releaseContent,
					message: "发现新版本，是否现在更新？",
					buttons: ["否", "是"]
				})
				.then(function (response) {
					if (response.response === 1) {
						// 下载更新
						autoUpdater.downloadUpdate();
					}
				});
		});

		// 检测是否需要更新
		autoUpdater.on("checking-for-update", () => {
			log.info("正在检查更新...");
		});
		// 检测到可以更新时
		autoUpdater.on("update-available", (releaseInfo) => {
			log.info("检测到新版本，确认是否下载", releaseInfo);
		});
		// 更新下载进度
		autoUpdater.on("download-progress", (progress) => {
			log.info("下载进度", progress);
		});
		// 当需要更新的内容下载完成后
		autoUpdater.on("update-downloaded", () => {
			log.info("下载完成，准备更新");
			dialog
				.showMessageBox({
					title: "安装更新",
					message: "更新下载完毕，应用将重启并进行安装"
				})
				.then(() => {
					// 退出并安装应用
					setImmediate(() => autoUpdater.quitAndInstall());
				});
		});
	}
};

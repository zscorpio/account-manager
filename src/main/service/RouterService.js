import { ipcMain } from "electron";
import API from "../const/API";
import AccountService from "./AccountService";
import SettingService from "./SettingService";
import SystemService from "./SystemService";

export default {
	init: function () {
		ipcMain.handle(API.data.getAccountList, async () => {
			return AccountService.getAccountList();
		});
		ipcMain.handle(API.data.openHomePage, async (event, data) => {
			return await AccountService.openHomePage(data);
		});
		ipcMain.handle(API.data.updateData, async (event, data) => {
			return await AccountService.updateData(data);
		});

		ipcMain.handle(API.setting.get, async () => {
			return await SettingService.get();
		});
		ipcMain.handle(API.setting.update, async (event, data) => {
			return await SettingService.update(data);
		});

		ipcMain.handle(API.system.dialog, async () => {
			return await SystemService.dialog();
		});
		ipcMain.handle(API.system.openFolder, async (event, data) => {
			return await SystemService.openFolder(data);
		});
	}
};

const { dialog, shell } = require("electron");

export default {
	dialog: async function () {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["openDirectory", "createDirectory"]
		});
		if (!canceled) {
			return filePaths[0];
		} else {
			return "";
		}
	},
	openFolder: async function (data) {
		if (data && data.path) {
			await shell.openPath(data.path);
		}
	}
};

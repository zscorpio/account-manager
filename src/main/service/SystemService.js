const { dialog, shell } = require("electron");

export default {
	dialog: async function (propertie = "openDirectory") {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ["createDirectory", "treatPackageAsDirectory", propertie]
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

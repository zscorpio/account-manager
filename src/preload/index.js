import {contextBridge, ipcRenderer} from "electron";
import {electronAPI} from "@electron-toolkit/preload";
import API from "../main/const/API";

// Custom APIs for renderer
const request = {
	invoke: (name, param) => ipcRenderer.invoke(name, param)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("request", request);
		contextBridge.exposeInMainWorld("API", API);
	} catch (error) {
		console.error(error);
	}
} else {
	window.electron = electronAPI;
	window.API = API;
	window.request = request;
}

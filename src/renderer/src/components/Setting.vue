<template>
	<a-form :model="form" :style="{ width: '1000px' }">
		<a-form-item field="rootPath" label="数据目录" extra="更改目录需要手动转移数据, 建议切换到个人目录">
			<a-input v-model="settings.rootPath" placeholder="请自定义用户数据目录" disabled />
			<a-button :style="{ marginLeft: '10px' }" @click="openRootPath">打开目录</a-button>
			<a-button type="primary" :style="{ marginLeft: '10px' }" @click="changeRootPath">更换目录</a-button>
		</a-form-item>
		<a-form-item field="executablePath" label="浏览器目录">
			<template #extra>
				<div>可以自定义本机安装的chrome浏览器, 默认的浏览器可能会存在一些限制</div>
				<div>Mac Chrome地址一般是/Applications/Google Chrome.app/Contents/MacOS/Google Chrome</div>
			</template>
			<a-input v-model="settings.executablePath" placeholder="你可以自定义浏览器执行路径" disabled />
			<a-button type="primary" :style="{ marginLeft: '10px' }" @click="changeExecutablePath">更换执行路径</a-button>
		</a-form-item>
	</a-form>
</template>
<script>
export default {
	data() {
		return {
			settings: {},
			form: {}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData: async function () {
			this.settings = await window.request.invoke(window.API.setting.get, "");
		},
		openRootPath: async function () {
			await window.request.invoke(window.API.system.openFolder, {
				path: this.settings.rootPath
			});
		},
		changeExecutablePath: async function () {
			const executablePath = await window.request.invoke(window.API.system.dialogFile, "");
			if (executablePath) {
				this.settings.executablePath = executablePath;
				await window.request.invoke(window.API.setting.update, {
					executablePath: executablePath
				});
			}
		},
		changeRootPath: async function () {
			const rootPath = await window.request.invoke(window.API.system.dialog, "");
			if (rootPath) {
				this.settings.rootPath = rootPath;
				await window.request.invoke(window.API.setting.update, {
					rootPath: rootPath
				});
			}
		}
	}
};
</script>

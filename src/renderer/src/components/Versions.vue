<script>
import { reactive } from "vue";

export default {
	data() {
		const versions = reactive({ ...window.electron.process.versions });
		return {
			versions
		};
	},
	methods: {
		goToHome: function () {
			this.$router.push("/home");
		}
	}
};
</script>

<template>
	<ul class="versions">
		<li class="electron-version">Electron v{{ versions.electron }}</li>
		<li class="chrome-version">Chromium v{{ versions.chrome }}</li>
		<li class="node-version">Node v{{ versions.node }}</li>
		<li class="v8-version">V8 v{{ versions.v8 }}</li>
	</ul>
	<div @click="goToHome">Page A</div>
</template>

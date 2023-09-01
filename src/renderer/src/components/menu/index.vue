<template>
	<div class="menu-wrapper">
		<a-menu :style="{ width: '200px', height: '100%' }" show-collapse-button @menu-item-click="clickMenu">
			<a-menu-item key="/" data-obj="1">账号管理</a-menu-item>
			<a-menu-item key="/setting" data-obj="2">系统设置</a-menu-item>
		</a-menu>
	</div>
</template>

<script>
export default {
	methods: {
		clickMenu: function (key) {
			this.$router.push(key);
		}
	}
};
</script>

<style lang="less" scoped></style>

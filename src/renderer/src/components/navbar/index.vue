<template>
	<div class="navbar">
		<div class="left-side">
			<a-space>
				<img alt="logo" src="../../asset/images/icon.png" style="width: 33px; height: 33px" />
				<a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5"> Account Manager </a-typography-title>
				<!--				<icon-menu-fold style="font-size: 22px; cursor: pointer" />-->
			</a-space>
		</div>
	</div>
</template>

<script setup></script>

<style scoped lang="less">
.navbar {
	display: flex;
	justify-content: space-between;
	height: 100%;
	background-color: var(--color-bg-2);
	border-bottom: 1px solid var(--color-border);
}

.left-side {
	display: flex;
	align-items: center;
	padding-left: 20px;
}

.center-side {
	flex: 1;
}

.right-side {
	display: flex;
	padding-right: 20px;
	list-style: none;

	:deep(.locale-select) {
		border-radius: 20px;
	}

	li {
		display: flex;
		align-items: center;
		padding: 0 10px;
	}

	a {
		color: var(--color-text-1);
		text-decoration: none;
	}

	.nav-btn {
		border-color: rgb(var(--gray-2));
		color: rgb(var(--gray-8));
		font-size: 16px;
	}

	.trigger-btn,
	.ref-btn {
		position: absolute;
		bottom: 14px;
	}

	.trigger-btn {
		margin-left: 14px;
	}
}
</style>

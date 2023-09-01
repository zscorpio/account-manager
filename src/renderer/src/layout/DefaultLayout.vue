<script setup>
import NavBar from "@/components/navbar/index.vue";
import Footer from "@/components/footer/index.vue";
import Menu from "@/components/menu/index.vue";
import PageLayout from "./PageLayout.vue";
</script>
<template>
	<a-layout class="layout">
		<div class="layout-navbar">
			<NavBar />
		</div>
		<a-layout>
			<a-layout>
				<a-layout-sider
					class="layout-sider"
					breakpoint="xl"
					:collapsible="true"
					:style="{ paddingTop: '60px' }"
					:hide-trigger="true"
				>
					<Menu />
				</a-layout-sider>
				<a-layout class="layout-content" style="">
					<a-layout-content>
						<PageLayout />
					</a-layout-content>
					<Footer />
				</a-layout>
			</a-layout>
		</a-layout>
	</a-layout>
</template>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
	width: 100%;
	height: 100%;
}

.layout-navbar {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;
	height: @nav-size-height;
}

.layout-sider {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	height: 100%;
	transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

	&::after {
		position: absolute;
		top: 0;
		right: -1px;
		display: block;
		width: 1px;
		height: 100%;
		background-color: var(--color-border);
		content: "";
	}

	> :deep(.arco-layout-sider-children) {
		overflow-y: hidden;
	}
}

.menu-wrapper {
	height: 100%;
	overflow: auto;
	overflow-x: hidden;

	:deep(.arco-menu) {
		::-webkit-scrollbar {
			width: 12px;
			height: 4px;
		}

		::-webkit-scrollbar-thumb {
			border: 4px solid transparent;
			background-clip: padding-box;
			border-radius: 7px;
			background-color: var(--color-text-4);
		}

		::-webkit-scrollbar-thumb:hover {
			background-color: var(--color-text-3);
		}
	}
}

.layout-content {
	min-height: calc(100vh - 60px);
	overflow-y: hidden;
	//background-color: var(--color-fill-2);
	transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
	padding-left: 220px;
	padding-top: 60px;
	margin-top: 10px;
}
</style>
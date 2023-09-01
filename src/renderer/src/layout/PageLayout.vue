<template>
	<!--	<router-view v-slot="{ Component, route }">-->
	<!--		<transition name="fade" mode="out-in" appear>-->
	<!--			<component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />-->
	<!--			&lt;!&ndash;			<keep-alive v-else :include="cacheList">&ndash;&gt;-->
	<!--			&lt;!&ndash;				<component :is="Component" :key="route.fullPath" />&ndash;&gt;-->
	<!--			&lt;!&ndash;			</keep-alive>&ndash;&gt;-->
	<!--		</transition>-->
	<!--	</router-view>-->
	<router-view v-slot="{ Component }">
		<component :is="Component" />
	</router-view>
</template>

<script lang="ts" setup></script>

<style scoped lang="less"></style>

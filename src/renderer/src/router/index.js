import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
	{
		path: "/",
		name: "version",
		component: () => import("../layout/DefaultLayout.vue"),
		redirect: "/account",
		children: [
			{
				path: "/account",
				name: "账号管理",
				component: () => import("../components/Account.vue")
			},
			{
				path: "/setting",
				name: "系统设置",
				component: () => import("../components/Setting.vue")
			}
		]
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router;

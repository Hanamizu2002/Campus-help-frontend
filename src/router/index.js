import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
		path: "*",
		component: () => import("@v/Error.vue")
	},

	//用户
	{
		path: "/",
		redirect: "/login"
	},

	{
		path: "/login",
		component: () => import("@v/user/Login.vue")
	},

	{
		path: "/home",
		component: () => import("@v/user/Home.vue"),
		children: [{
				path: "/",
				meta: {
					title: '首页'
				},
				component: () => import("@v/user/children/Index.vue")
			},
			{
				path: "task",
				meta: {
					title: "发布任务"
				},
				component: () => import('@v/user/children/Task.vue')
			},
			{
				path: "myProfile",
				meta: {
					title: "个人信息"
				},
				component: () => import('@v/user/children/MyProfile.vue')
			},
		]
	},
	{
		path: "/admin",
		component: () => import("@v/admin/Login.vue"),
	},
	{
		path: "/admin/home",
		component: () => import("@v/admin/Home.vue"),
		children: [{
				path: "/",
				meta: {
					title: "首页"
				},
				component: () => import("@v/admin/children/Index.vue")
			},
			{
				name: "adminSchool",
				path: "school",
				meta: {
					title: "学校信息"
				},
				component: () => import("@v/admin/children/School.vue")
			},
			{
				name: "adminStudent",
				path: "student",
				meta: {
					title: "用户信息"
				},
				component: () => import("@v/admin/children/Student.vue")
			},
			{
				name: "task",
				path: "task",
				meta: {
					title: "任务信息"
				},
				component: () => import("@v/admin/children/Task.vue")
			},
		]
	}
]

const router = new VueRouter({
	routes
})

export default router
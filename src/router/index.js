import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: "*",
        component: () => import("@v/error.vue")
    },

    //用户
    {
        path: "/",
        redirect: "/login"
    },

    {
        path: "/login",
        component: () => import("@v/user/login.vue")
    },

    {
        path: "/home",
        component: () => import("@v/user/home.vue"),
        children: [
            {
                path: "/",
                meta: {title: '首页'},
                component: () => import("@v/user/children/index.vue")
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router

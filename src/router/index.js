import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../components/login.vue'
// import home from '../components/Home.vue'
// import welcome from '../components/Welcome.vue'
// import users from '../components/users/Users.vue'
// import rights from '../components/power/Rights.vue'
// import roles from '../components/power/Roles.vue'
// import cate from '../components/goods/Cate.vue'
// import params from '../components/goods/Params.vue'
// import goodList from '../components/goods/goodList.vue'
// import Add from '../components/goods/Add.vue'
// import order from '../components/order/order.vue'
// import report from '../components/report/report.vue'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')

const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/users/Users.vue')

const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')

const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')

const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/goodList.vue')

const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/order.vue')

const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: '/rights',
    component: Rights
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/categories',
    component: Cate
  }, {
    path: '/params',
    component: Params
  }, {
    path: '/goods',
    component: GoodsList
  }, {
    path: '/goods/add',
    component: Add
  }, {
    path: '/orders',
    component: Order
  }, {
    path: '/reports',
    component: Report
  }]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由器导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转过来
  const tokenStr = window.sessionStorage.getItem('token')
  if (tokenStr) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/users/Users.vue'
import rights from '../components/power/Rights.vue'
import roles from '../components/power/Roles.vue'
import cate from '../components/goods/Cate.vue'
import params from '../components/goods/Params.vue'
import goodList from '../components/goods/goodList.vue'
import Add from '../components/goods/Add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: login
}, {
  path: '/home',
  component: home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: welcome
  }, {
    path: '/users',
    component: users
  }, {
    path: '/rights',
    component: rights
  }, {
    path: '/roles',
    component: roles
  }, {
    path: '/categories',
    component: cate
  }, {
    path: '/params',
    component: params
  }, {
    path: '/goods',
    component: goodList
  }, {
    path: '/goods/add',
    component: Add
  }, {
    path: '/orders',
    component: order
  }, {
    path: '/reports',
    component: report
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

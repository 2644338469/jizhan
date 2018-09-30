/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import { isURL } from '@/utils/validate'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'shop-cate' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/shop-brand', component: _import('demo/shop-brand'), name: 'shop-brand', meta: { title: '品牌管理', isTab: true } },
    { path: '/shop-cate', component: _import('demo/shop-cate'), name: 'shop-cate', meta: { title: '分类管理', isTab: true } },
    { path: '/shop-list', component: _import('demo/shop-list'), name: 'shop-list', meta: { title: '商品管理', isTab: true } },
    { path: '/data-report', component: _import('demo/data-report'), name: 'data-report', meta: { title: '数据报表', isTab: true } },
    { path: '/data-expense', component: _import('modules/sys/expense'), name: 'expense', meta: { title: '用户管理', isTab: true } },
    { path: '/thumbnail', component: _import('demo/thumbnail'), name: 'thumbnail', meta: { title: '产品详情图', isTab: true } },
    { path: '/sys-shop', component: _import('modules/sys/shop'), name: 'shop', meta: { title: '商品库', isTab: true } },
    { path: '/notify-List', component: _import('demo/notify-List'), name: 'notify-List', meta: { title: '订单信息提醒', isTab: true } },
    { path: '/order-List', component: _import('modules/sys/orderList'), name: 'order-List', meta: { title: '订单管理', isTab: true } },
    { path: '/deliveryDetail', component: _import('demo/deliveryDetail'), name: 'deliveryDetail', meta: { title: '出入库记录', isTab: true } },
  ]
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  var navDataList = [
    {
      'menuId': 1,
      'parentId': 0,
      'parentName': null,
      'name': '飞翩物流后台',
      'url': null,
      'perms': null,
      'type': 0,
      'icon': 'system',
      'orderNum': 0,
      'open': null,
      'list': [
        {
          'menuId': 6,
          'parentId': 1,
          'parentName': null,
          'name': '供应商管理',
          'url': 'job/supplier',
          'perms': null,
          'type': 1,
          'icon': 'job',
          'orderNum': 5,
          'open': null,
          'list': null
        },
        {
          'menuId': 28,
          'parentId': 1,
          'parentName': null,
          'name': '采购订单管理',
          'url': 'sys/purchase',
          'perms': 'sys:purchase:list,sys:purchase:info,sys:purchase:save,sys:purchase:update,sys:purchase:delete',
          'type': 1,
          'icon': 'log',
          'orderNum': 6,
          'open': null,
          'list': null
        },
        {
          'menuId': 29,
          'parentId': 1,
          'parentName': null,
          'name': '身份证审核',
          'url': 'sys/confirmID',
          'perms': 'sys:confirmID:list,sys:confirmID:info,sys:confirmID:save,sys:confirmID:update,sys:confirmID:delete',
          'type': 1,
          'icon': 'admin',
          'orderNum': 6,
          'open': null,
          'list': null
        },
        {
          'menuId': 30,
          'parentId': 1,
          'parentName': null,
          'name': '仓库订单管理',
          'url': 'sys/orderexport',
          'perms': 'sys:orderexport:list,sys:orderexport:info,sys:orderexport:save,sys:orderexport:update,sys:orderexport:delete',
          'type': 1,
          'icon': 'log',
          'orderNum': 6,
          'open': null,
          'list': null
        },
        {
          'menuId': 31,
          'parentId': 1,
          'parentName': null,
          'name': '仓库商品管理',
          'url': 'sys/warehousegoods',
          'perms': 'sys:warehousegoods:list,sys:warehousegoods:info,sys:warehousegoods:save,sys:warehousegoods:update,sys:warehousegoods:delete',
          'type': 1,
          'icon': 'shouye',
          'orderNum': 6,
          'open': null,
          'list': null
        },
        {
          'menuId': 32,
          'parentId': 1,
          'parentName': null,
          'name': '航班信息',
          'url': 'sys/flightInformation',
          'perms': 'sys:flightInformation:list,sys:flightInformation:info,sys:flightInformation:save,sys:flightInformation:update,sys:flightInformation:delete',
          'type': 1,
          'icon': 'tixing',
          'orderNum': 6,
          'open': null,
          'list': null
        },
      ]
    }
  ]
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
    next()
  } else {
    fnAddDynamicMenuRoutes(navDataList)
    router.options.isAddDynamicMenuRoutes = true
    sessionStorage.setItem('menuList', JSON.stringify(navDataList || '[]'))
    next({ ...to, replace: true })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router

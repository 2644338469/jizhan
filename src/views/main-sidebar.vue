<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-submenu index="demo">
          <template slot="title">
            <img class="logo-img" src="~@/assets/img/jizhan-logo.png" alt="集栈供应链logo">
            <span>集栈供应链</span>
          </template>
          <el-menu-item index="商品管理" @click="$router.push({ name: 'shop-list' })">
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">商品管理</span>
          </el-menu-item>
          <el-menu-item index="数据报表" @click="$router.push({ name: 'data-report' })">
            <icon-svg name="sql" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">数据报表</span>
          </el-menu-item>
          <el-menu-item index="用户管理" @click="$router.push({ name: 'expense' })">
            <icon-svg name="admin" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">用户管理</span>
	    </el-menu-item>
          <el-menu-item index="订单管理" @click="$router.push({ name: 'order-List' })">
            <icon-svg name="config" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-submenu>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  export default {
    data () {
      return {
        dynamicMenuRoutes: []
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
    },
    methods: {
      // 路由操作
      routeHandle (route) {
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      }
    }
  }
</script>
<style>
.site-sidebar--dark .site-sidebar__menu.el-menu, .site-sidebar--dark > .el-menu--popup, .site-sidebar--dark-popper .site-sidebar__menu.el-menu, .site-sidebar--dark-popper > .el-menu--popup {
  background-color: #1d1d1d !important;
}
.site-sidebar--dark, .site-sidebar--dark-popper {
    background-color: #1d1d1d !important;
}
.span-title{
  font-weight: 600;
  font-size: 17px;
  color: #fff;
}
.logo-img{
  width: 25px;
  height: 25px;
  margin-top: -5px;
}
</style>

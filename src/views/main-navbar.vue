<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">集栈供应链后台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">集栈</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  export default {
    data () {
      return {
        updatePassowrdVisible: false
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/user/logout'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            // window.location.href='https://www.jizhangyl.com/jizhangyl/wechat/qrAuthorize?returnUrl=https://www.jizhangyl.com/jizhangyl/user/login'
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style>
.site-navbar{
  background-color: #000;
}
.site-sidebar--dark, .site-sidebar--dark-popper {
    background-color: #131313;
}
.site-sidebar--dark .site-sidebar__menu.el-menu, .site-sidebar--dark > .el-menu--popup, .site-sidebar--dark-popper .site-sidebar__menu.el-menu, .site-sidebar--dark-popper > .el-menu--popup {
    background-color: #131313;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu, .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu.is-opened, .site-sidebar--dark > .el-menu--popup .el-menu, .site-sidebar--dark > .el-menu--popup .el-submenu.is-opened, .site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu, .site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-submenu.is-opened, .site-sidebar--dark-popper > .el-menu--popup .el-menu, .site-sidebar--dark-popper > .el-menu--popup .el-submenu.is-opened{
    background-color: #080808;
}
</style>

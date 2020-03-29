<template>
  <el-container class="home-container">
    <el-header class="header">
      <div>
        <img src="../assets/20191204223407.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button id="logOutButton" @click="logout">log out</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' :'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :unique-opened=true
          background-color="#383838"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span> {{ item.authName }} </span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
}
</script>

<style lang="less" scoped>
#logOutButton{
  font-size: 16px;
  padding: 8px 8px;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(0,122,204);
  color: aliceblue;
  // height: 200px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
      font-size: 20px;
    }
  }
}
.el-header > div > img {
  height: 60px;
  width: 64px;
  vertical-align: bottom;
}
.el-aside {
  background-color: rgb(56,56,56);
  color: white;
  font-size: 20px;
  .el-menu{
    border-right: 0;
  }
}
.el-main {
  background-color: rgb(30,30,30);
}
.toggle-button{
  background-color: rgb(45,45,45);
  color:rgb(0,122,204);
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.1em;
  cursor: pointer;

}
</style>

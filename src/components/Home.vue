<template>
  <el-container class='home-container'>
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click='logout'>退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'50px':'200px'" >
        <div class='toggle-button' @click='toggleCollapse'>||||</div>
        <!-- 导航菜单 -->
        <el-menu  @open='clearActivePath' :default-active="activePath" :router='true' unique-opened :collapse="isCollapse" :collapse-transition="false" background-color="#333744" text-color="#fff"   active-text-color="#ffd04b"  class="el-menu-vertical-demo">
            <!-- 一级菜单 -->
            <el-submenu @click.native='test' :index='item.id+""' :key="item.id" v-for="item in menuList" >
                <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item @click="saveNavState('/'+child.path)" :index="'/' +child.path" :key=" child.id" v-for="child in item.children">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{child.authName}}</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: null,
      iconsObj: {
        //   添加图标
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
    this.getMenuItems()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuItems () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
      console.log(res)
    },
    // 切换菜单栏的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    clearActivePath () {
      window.sessionStorage.removeItem('activePath')
      this.activePath = ''
    },
    test () {
      // element 在subitem绑定失效 使用 .native可以解决
      console.log('test')
    }

  }

}

</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    // 侧轴布局
    align-items: center;
    color: #fff;
    font-size: 20px;

    div {
      display: flex;
      align-items: center;

      span {
        margin-left: 10px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
      margin-right: 15px;
  }
  .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 20px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer
  }
</style>

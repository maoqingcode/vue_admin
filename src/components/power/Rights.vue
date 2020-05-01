<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 显示数据 -->
    <el-table :data="rightlist" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
          <el-tag v-if="scope.row.level === '1'" type="success">二级权限</el-tag>
          <el-tag v-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightlist: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      console.log('============')
      const {
        data: res
      } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.rightlist = res.data
    }

  }
}

</script>

<style lang="less" scoped>

</style>

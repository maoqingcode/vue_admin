<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="roleList" border>
      <!-- 添加展开列 -->
      <el-table-column type="expand">
        <!-- 三级权限 -->
        <template slot-scope="scope">
          <el-row :class='["bdbottom",levelOne === 0 ? "bdtop":"","vcenter"]'
            v-for="(itemOne,levelOne) in scope.row.children" :key='itemOne.id'>
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close='removeRightById(scope.row,itemOne.id)'>{{itemOne.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <!-- 通过 for 循环 嵌套渲染二级权限 -->
              <el-row :class='[levelTwo === 0 ? "":"bdtop","vcenter"]' v-for='(itemTwo,levelTwo) in itemOne.children'
                :key='itemTwo.id'>
                <el-col :span="6">
                  <el-tag closable @close='removeRightById(scope.row,itemTwo.id)' type="success">{{itemTwo.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" closable @close='removeRightById(scope.row,itemThree.id)'
                    v-for='(itemThree) in itemTwo.children' :key='itemThree.id'>{{itemThree.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>

      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click='showRightDialog(scope.row)' >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible"  @close="setRightDialogClosed" width="50%">
      <el-tree ref="treeRef" :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightList: [{ id: 101, authName: '商品管理', path: 'goods', pid: 0, children: [{ id: 104, authName: '商品列表', path: 'goods', pid: 101, children: [{ id: 105, authName: '添加商品', path: 'goods', pid: '104,101' }, { id: 116, authName: '商品修改', path: 'goods', pid: '104,101' }, { id: 117, authName: '商品删除', path: 'goods', pid: '104,101' }, { id: 150, authName: '更新商品图片', path: 'goods', pid: '104,101' }, { id: 151, authName: '更新商品属性', path: 'goods', pid: '104,101' }, { id: 152, authName: '更新商品状态', path: 'goods', pid: '104,101' }, { id: 153, authName: '获取商品详情', path: 'goods', pid: '104,101' }] }, { id: 115, authName: '分类参数', path: 'params', pid: 101, children: [{ id: 142, authName: '获取参数列表', path: 'categories', pid: '115,101' }, { id: 143, authName: '创建商品参数', path: 'categories', pid: '115,101' }, { id: 144, authName: '删除商品参数', path: 'categories', pid: '115,101' }] }, { id: 121, authName: '商品分类', path: 'categories', pid: 101, children: [{ id: 122, authName: '添加分类', path: 'categories', pid: '121,101' }, { id: 123, authName: '删除分类', path: 'categories', pid: '121,101' }, { id: 149, authName: '获取分类详情', path: 'categories', pid: '121,101' }] }] }, { id: 102, authName: '订单管理', path: 'orders', pid: 0, children: [{ id: 107, authName: '订单列表', path: 'orders', pid: 102, children: [{ id: 109, authName: '添加订单', path: 'orders', pid: '107,102' }, { id: 154, authName: '订单更新', path: 'orders', pid: '107,102' }, { id: 155, authName: '获取订单详情', path: 'orders', pid: '107,102' }] }] }, { id: 103, authName: '权限管理', path: 'rights', pid: 0, children: [{ id: 111, authName: '角色列表', path: 'roles', pid: 103, children: [{ id: 129, authName: '添加角色', path: 'roles', pid: '111,103' }, { id: 130, authName: '删除角色', path: 'roles', pid: '111,103' }, { id: 134, authName: '角色授权', path: 'roles', pid: '111,103' }, { id: 135, authName: '取消角色授权', path: 'roles', pid: '111,103' }, { id: 138, authName: '获取角色列表', path: 'roles', pid: '111,103' }, { id: 139, authName: '获取角色详情', path: 'roles', pid: '111,103' }, { id: 140, authName: '更新角色信息', path: 'roles', pid: '111,103' }, { id: 141, authName: '更新角色权限', path: 'roles', pid: '111,103' }] }, { id: 112, authName: '权限列表', path: 'rights', pid: 103, children: [{ id: 147, authName: '查看权限', path: 'rights', pid: '112,103' }] }] }, { id: 125, authName: '用户管理', path: 'users', pid: 0, children: [{ id: 110, authName: '用户列表', path: 'users', pid: 125, children: [{ id: 131, authName: '添加用户', path: 'users', pid: '110,125' }, { id: 132, authName: '删除用户', path: 'users', pid: '110,125' }, { id: 133, authName: '更新用户', path: 'users', pid: '110,125' }, { id: 136, authName: '获取用户详情', path: 'users', pid: '110,125' }, { id: 137, authName: '分配用户角色', path: 'users', pid: '110,125' }, { id: 159, authName: '设置管理状态', path: 'users', pid: '110,125' }] }] }, { id: 145, authName: '数据统计', path: 'reports', pid: 0, children: [{ id: 146, authName: '数据报表', path: 'reports', pid: 145, children: [{ id: 148, authName: '查看数据', path: 'reports', pid: '146,145' }] }] }],
      treeProps: {
        // 通过label设置树形节点文本展示authName
        label: 'authName',
        // 设置通过children属性展示子节点信息
        children: 'children'
      },
      //   默认选中的节点数值
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const {
        data: res
      } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.roleList = res.data
    },
    async removeRightById (role, rightId) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const {
        data: res
      } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      role.children = res.data
    },
    async showRightDialog (role) {
      console.log('role ' + role.children)
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightList = res.data

      this.getAllDefKeys(role, this.defKeys)
      console.log(this.rightList)
      this.setRightDialogVisible = !this.setRightDialogVisible
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      console.log('调用了')
      this.defKeys = []
    },
    // 获取所有叶子节点
    getAllDefKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getAllDefKeys(item, arr))
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        //   展开运算符
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log('keys ' + keys)
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRoleList()
      this.setRightDialogVisible = false
    }

  }
}
</script>

<style lang="less" scoped>
  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>

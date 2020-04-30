<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model='userInfo.query' clearable @clear='queryUserList'>
            <el-button slot="append" icon="el-icon-search" @click="queryUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='dialogFormVisible=true'>添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户列表 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change='switchUserChange(scope.row)' active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <!-- 用户操作 -->
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button @click="updateUserForm(scope.row.id)" type="primary" icon="el-icon-edit" size='mini'></el-button>
          <!-- 删除 -->
          <el-button @click="deleteUser(scope.row.id)" type="danger" icon="el-icon-delete" size='mini'></el-button>
          <!-- 分配角色 -->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
      :current-page="userInfo.pagenum" :page-size="userInfo.pagesize" :total="total" :page-sizes="[1,2,5,10]"
      layout="total,prev, pager, next">
    </el-pagination>
    <!-- 添加用户 -->
    <el-dialog title='添加用户' :visible.sync="dialogFormVisible" >
      <el-form :model='addForm' :rules="addFormRules" ref='addFormRef' label-width="70px">
         <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click='dialogFormVisible = false' >取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改用户  -->
    <el-dialog title='修改用户' :visible.sync="updateFormVisible" >
      <el-form :model='updateForm' :rules="updateFormRules" ref='upateFormRef' label-width="70px">
         <el-form-item label="用户名" prop="username">
            <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click='updateFormVisible = false' >取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 1,
      userList: [],
      dialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]

      },
      // 修改用户
      updateForm: {
        username: '',
        email: '',
        mobile: ''
      },
      updateFormVisible: false,
      updateFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]

      }
    }
  },
  created () {
    this.queryUserList()
  },
  methods: {
    async queryUserList () {
      const {
        data: res
      } = await this.$http.get('users', {
        params: this.userInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }

      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.userInfo.pagesize = newSize
      this.queryUserList()
    },
    handleCurrentChange (currentPage) {
      this.userInfo.pagenum = currentPage
      this.queryUserList()
    },
    // 处理用户状态开关
    async switchUserChange (userInfo) {
      // console.log(userInfo)
      //   ?? 使用 ${}
      const {
        data: res
      } = await this.$http.put(
          `/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('用户状态更新成功')
    },
    handleAddUserFormCLose () {
      this.$refs.addFormRef.resetFields()
    },
    // 增加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('用户提交数据无效')
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogFormVisible = false
        this.queryUserList()
      })
    },
    // 修改用户
    async updateUserForm (id) {
      // console.log('id' + id)
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res.data)
      this.updateForm = res.data
      this.updateFormVisible = !this.updateFormVisible
    },
    updateUser (id) {
      // 进行校验
      this.$refs.upateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('用户提交数据无效')
        }
        const { data: res } = await this.$http.put('/users/' + this.updateForm.id, {
          email: this.updateForm.email,
          mobile: this.updateForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.updateFormVisible = !this.updateFormVisible
        this.queryUserList()
      })
    },
    async deleteUser (id) {
      const res = await this.$confirm('确认删除该用户,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(res)
      if (res !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: result } = await this.$http.delete('users/' + id)
      // 判断如果删除失败，就做提示
      if (result.meta.status !== 200) return this.$message.error('删除用户失败')
      // 修改成功的提示
      this.$message.success('删除用户成功')
      // 重新请求最新的数据
      // 解决 删除最后一页最后一条时，页面数据问空的问题
      const mtotal = this.total - 1
      if (mtotal % this.userInfo.pagesize === 0) {
        this.userInfo.pagenum = this.userInfo.pagenum - 1
      }
      this.queryUserList()
    }

  }
}

</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 20px;
  }

  .el-table_1_column_7 {
    .cell {
      text-align: center;
    }
  }

  .el-pagination {
    text-align: center;
  }

</style>

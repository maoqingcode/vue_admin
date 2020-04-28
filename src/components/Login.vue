<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        label-width="0"
        :model="loginform"
        ref="loginref"
        :rules="formrules"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginform.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginform: {
        username: 'admin',
        password: '123456'
      },
      formrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '长度在不少于3个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginref.validate(async val => {
        // console.log(val)
        if (!val) {
          return
        }
        // 将返回对象解构处理，并命名为res
        const { data: res } = await this.$http.post('login', this.loginform)
        if (res.meta.status !== 200) {
          // 登录失败
          // console.log(this.$message)
          return this.$message.error('登录失败', res.meta.msg)
        }
        this.$message.success('登录成功')
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        // 编程式跳转 导航至/home
        this.$router.push('/home')
      })
    },
    // 表单重置方法this表示当前组件对象 refs 表示实例化一个表单对象
    resetLoginForm () {
      // console.log(this.$refs)
      this.$refs.loginref.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  width: 100%;
  height: 100%;
}
.login_box {
  width: 400px;
  height: 300px;
  border-radius: 3px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avater_box {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

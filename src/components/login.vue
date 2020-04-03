<template>
  <div class="login_container">
    <div class="login_box">
      <!-- avatar -->
      <div class="avatar_box">
        <img src="../assets/20191204223407.png" alt="" />
      </div>
      <!-- 表單 -->
      <el-form ref="loginFormRef" :model="loginForm"  label-width="0px" class="login_form" :rules="loginFormRules">
        <!-- username -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- button area-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">LOGIN</el-button>
          <el-button type="info" @click="resetLoginForm">RESET</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 登入表单的数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          {
            required: true, message: '请输入名称', trigger: 'blur'
          }, {
            min: 3, max: 10, message: '用户名的长度在3~10之间', trigger: 'blur'
          }
        ],
        password: {
          min: 6, message: '密码要大于6个字符', trigger: 'blur'
        }
      }

    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        // this.$http.post('login', this.loginForm)
        //   .then((ret) => {
        //     if (ret.data.meta.status !== 200) {
        //       return this.$message.error('登入失败')
        //     } else {
        //       this.$message.success('登入成功')
        //       console.log(ret.data.data)
        //     }
        //   })
        const res = await this.$http.post('login', this.loginForm)
        if (res.data.meta.status !== 200) {
          return this.$message.error('error')
        }
        this.$message.success('success')
        window.sessionStorage.setItem('token', res.data.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: rgb(200,235,223);
  height: 100%;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.login_box {
  background-color: #ffffff;
  width: 450px;
  height: 300px;
  border-radius: 7px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #cccccc;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ddd;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

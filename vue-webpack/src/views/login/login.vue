<template>
  <div class="login-view">
    <div class="login-content">

      <div class="login-title">
        <img class="logo-img" :src="require('@img/logo.jpg')" alt="logo" />
        系统登录
      </div>


      <el-form ref="loginFormRef" class="login-form" :model="param" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名" size="large">
            <template #prepend>
              <I name="UserFilled" size="14" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="param.password" placeholder="密码" size="large" :type="passwordType" @keyup.enter="submitForm">
            <template #prepend>
              <I v-if="passwordLock" name="Lock" size="14" @click="switchPass" />
              <I v-else name="Unlock" size="14" @click="switchPass" />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" :loading="btnLoading" @click="submitForm">登录</el-button>
        </div>
        <!-- <p class="login-tips">用户名: admin 密码: 123</p>
        <p class="login-tips">用户名: editor 密码: 456</p> -->
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const btnLoading = ref(false)
const loginFormRef = ref()
const passwordLock = ref(true)
const passwordType = ref('password')

const param = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const switchPass = () => {
  if (passwordLock.value) {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
  passwordLock.value = !passwordLock.value
}

const submitForm = async () => {
  console.log(loginFormRef)
  loginFormRef.value.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      store
        .dispatch('user/login', param)
        .then(() => {
          router.push('/')
        })
        .finally(() => {
          btnLoading.value = false
        })
    } else {
      ElMessage.error('请输入用户名和密码')
    }
  })
}
</script>

<style scoped>
.login-view {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-color: #235bae; */
  background: linear-gradient(to  right, #FCFBE3, #1064AA);

  /* background-image: url('../../assets/img/login_bg.jpg');
  background-size: cover; */
}

.login-title-box {
  display: flex;


}

.login-title {
margin-top: 16px;
  width: 100%;
  font-size: 20px;
  line-height: 50px;
    color: #1e1e1e;
  text-align: center;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  /* border-bottom: 1px solid #ddd; */
}

.login-content {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 450px;
  margin: -190px 0 0 -175px;
  overflow: hidden;
  /* background: rgba(255, 255, 255, 0.4);
   */
   background-color: #fff;
  border-radius: 10px;
}

.logo-img {
  width: 50px;
  height: 50px;
margin-left: 30px;
border-radius: 8px;
margin-right: 6px;
}

.login-form {
  padding: 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #be1480;
}

.el-icon-lock,
.el-icon-unlock {
  cursor: pointer;
}</style>

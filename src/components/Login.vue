<template>
  <div class="login-root">
    <div class="login">
      <div class="login-head">
        <img class="login-logo" src="../assets/img/logo.png" alt="" />
        <p class="login-title">高校毕业设计（论文）管理系统</p>
      </div>
      <el-form
        :model="userInfo"
        :rules="rules"
        ref="userInfo"
        class="login-form"
      >
        <el-form-item prop="id">
          <el-input placeholder="请输入用户名" v-model="userInfo.id">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="userInfo.password"
            type="password"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-select v-model="userInfo.role" placeholder="请选择">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :value="item.authority"
            :label="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="submit">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from "../network/request";
import Qs from "qs";
export default {
  data() {
    return {
      lastLoginTime: "",
      userInfo: {
        id: "",
        password: "",
        role: "student",
      },
      options: [
        {
          authority: "leader",
          value: "领导",
        },
        {
          authority: "administrator",
          value: "管理员",
        },
        {
          authority: "teacher",
          value: "教师",
        },
        {
          authority: "student",
          value: "学生",
        },
      ],

      rules: {
        id: [{ required: true, message: "请输入用户名", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs["userInfo"].validate((valid) => {
        if (valid) {
          if (true) {
            request(
              "/LoginServlet",
              Qs.stringify({
                id: this.userInfo.id,
                password: this.userInfo.password,
                role: this.userInfo.role,
                lastLoginTime: this.userInfo.role == "leader" ? Date.now() : "",
              }),
              {
                "Content-Type": "application/x-www-form-urlencoded",
              }
            )
              .then((res) => {
                if (res.data.isLogin) {
                  sessionStorage.setItem("id", this.userInfo.id);
                  sessionStorage.setItem("role", this.userInfo.role);
                  this.$store.commit({
                    type: "updateUser",
                    newUser: this.userInfo,
                  });
                  this.$store.commit({
                    type: "updateUserName",
                    newName: res.data.name
                  })
                  this.$router.push(this.$store.state.user.role);
                } else {
                  this.$message({
                    showClose: true,
                    message: "用户名或密码错误！",
                    type: "error",
                    duration: 1500,
                  });
                  this.userInfo.password = "";
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
.login-root {
  height: 100vh;
  background: url("../assets/img/background.png") no-repeat;
  background-size: 100%;
  overflow: hidden;
  min-width: 1366px;
  min-height: 625px;
}
.login {
  height: 400px;
  width: 350px;
  text-align: center;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.login-head {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.login-logo {
  height: 80px;
  width: 80px;
  margin: 0 auto;
  border-radius: 50%;
}
.login-title {
  font-size: 23px;
  font-weight: 700;
  color: #02529f;
}
.login-form {
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.login-form .el-form-item {
  margin: 0;
}
</style>
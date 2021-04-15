<template>
  <header class="common-header">
    <section class="common-header-left">
      <img src="../assets/img/logo.png" class="logo" alt="" />
      <span class="title flex-row-around">高校毕业设计（论文）管理系统</span>
    </section>
    <!-- 教师模块 -->
    <div
      v-if="$store.state.user.role == 'teacher'"
      class="flex-row-around"
      @click="switchOperationPage"
    >
      <el-button size="small" type="primary">
        <i
          class="el-icon-caret-left"
          v-if="this.$route.path == '/teacher/instructstudents'"
        ></i>
        {{
          this.$route.path == "/teacher/instructstudents"
            ? "查看题目"
            : "指导学生"
        }}
        <i
          class="el-icon-caret-right"
          v-if="this.$route.path == '/teacher/addselecttopic'"
        ></i>
      </el-button>
    </div>
    <section class="flex-row-around">
      <div
        v-if="
          $store.state.user.role == 'student' ||
          $store.state.user.role == 'teacher'
        "
        style="margin-right: 50px"
      >
        <el-badge is-dot class="item">
          <i
            class="iconfont el-icon-lingdang2"
            style="font-size: 24px; color: #1296db; cursor: pointer"
          ></i>
        </el-badge>
      </div>
      <span>{{ $store.state.userName + "，您好！" }}</span>
      <i
        class="iconfont el-icon-edit"
        v-if="$store.state.user.role == 'teacher'"
        @click="dialogShow = true"
      ></i>
      <el-popover
        v-else
        placement="bottom-start"
        trigger="click"
        ref="elpopoveredit"
      >
        <div>
          <el-form
            :model="ruleForm"
            status-icon
            ref="ruleForm"
            :label-width="$store.state.user.role == 'student' ? '55px' : '65px'"
          >
            <el-form-item
              :label="$store.state.user.role == 'student' ? '学号' : '职工号'"
              prop="id"
              style="margin-bottom: 15px"
            >
              <el-input
                v-model="this.$store.state.user.id"
                :disabled="true"
                size="small"
                style="width: 150px"
              ></el-input>
            </el-form-item>

            <el-form-item
              style="margin-bottom: 0"
              label="密码"
              prop="password"
              :rules="[
                {
                  required: true,
                  message: '密码不能为空',
                  trigger: 'change',
                },
                {
                  min: 8,
                  message: '密码长度不能小于8个字符',
                  trigger: 'blur',
                }
              ]"
            >
              <el-input
                type="password"
                v-model="ruleForm.password"
                size="small"
                style="width: 150px"
                @input="passwordChange"
              ></el-input>
            </el-form-item>
          </el-form>
          <div
            class="flex-row-around"
            style="margin-top: 20px"
            v-if="showEditPassword"
          >
            <el-button size="mini" @click="submit">确认</el-button>
            <el-button size="mini" @click="quit">取消</el-button>
          </div>
        </div>
        <i class="iconfont el-icon-edit" slot="reference"></i>
      </el-popover>
      <el-button size="small" class="back" @click="back">退出</el-button>
    </section>
    <edit-teacher-info-dialog
      :dialogShow.sync="dialogShow"
      :operate.sync="operate"
      :refreshOperation.sync="refreshOperation"
      :entrance="entrance"
    ></edit-teacher-info-dialog>
  </header>
</template>

<script>
import EditTeacherInfoDialog from "./EditTeacherInfoDialog.vue";
import { request } from "../network/request";
import Qs from "qs";

export default {
  components: {
    "edit-teacher-info-dialog": EditTeacherInfoDialog,
  },
  data() {
    return {
      password: "",
      ruleForm: {
        id: "",
        password: "",
      },
      dialogShow: false,
      operate: "edit",
      refreshOperation: false,
      entrance: "header",
      showEditPassword: false,
    };
  },
  props: {
    isAddSelectTopic: Boolean,
  },
  methods: {
    back() {
      
    },
    passwordChange() {
      console.log("change", this.ruleForm.password);
      this.showEditPassword = true;
    },
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          request(
            "/ChangePasswordServlet",
            Qs.stringify({
              id: this.$store.state.user.id,
              password: this.ruleForm.password,
              role: this.$store.state.user.role,
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
          this.$store.commit({
            type: "updatePassword",
            newPassword: this.ruleForm.password,
          });
          this.showEditPassword = false;
          this.$refs["elpopoveredit"].doClose();
        } else {
          return false;
        }
      });
    },
    quit() {
      this.ruleForm.password = this.$store.state.user.password;
      console.log("quit", this.ruleForm.password);
      this.showEditPassword = false;
      this.$refs["elpopoveredit"].doClose();
    },
    switchOperationPage() {
      this.$emit("update:isAddSelectTopic", !this.isAddSelectTopic);
    },
  },
  watch: {
    "$store.state.user": {
      handler(val, oldVal) {
        this.ruleForm.id = val.id;
        this.ruleForm.password = val.password;
      },
      deep: true,
    },
    refreshOperation(val, oldVal) {
      if (val == true) {
        console.log("-----------shuaxin-------");
        request(
          "/QueryTeacherServlet",
          Qs.stringify({
            teacherId: this.$store.state.user.id,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            this.$store.commit({
              type: "updateTeacherMyInfo",
              newInfo: res.data.teachers[0],
            });
            console.log(res);
          })
          .catch((err) => {
            consoel.log(err);
          });
        console.log("更新结束");
        console.log(this.$store.state.teacherMyInfo);
        this.refreshOperation = false;
      }
    },
  },
  created() {
    console.log("header------------------");
  },
};
</script>

<style>
.common-header {
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #eee;
}
.common-header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.logo {
  height: 55px;
  width: 55px;
  border-radius: 50%;
  margin-right: 15px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  color: #1296db;
  text-shadow: 5px 5px 5px rgba(0, 0, 255, 0.5);
}
.back {
  background-color: #1296db;
  color: white;
  margin-left: 50px;
}
</style>
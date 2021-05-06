<template>
  <header class="common-header">
    <section class="common-header-left">
      <img src="../assets/img/logo.png" class="logo" alt="" />
      <span class="title flex-row-around">高校毕业设计（论文）管理系统</span>
    </section>
    <!-- 教师模块 -->
    <div v-if="$store.state.user.role == 'teacher' && showTime" class="flex-column-center">
      <span style="margin-bottom: 2px">{{
        moduleName + "开始时间：" + (startTime == null ? "暂无" : startTime)
      }}</span>
      <span style="margin-top: 2px">
        {{ moduleName + "结束时间：" + (endTime == null ? "暂无" : endTime) }}
      </span>
    </div>
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
    <div
      v-else-if="$store.state.user.role == 'student' && showCountDown"
      class="count-down"
    >
      {{ str }}
      <section v-if="inputTime == null">暂无</section>
      <section v-else>
        <span v-if="day > 0">{{ day + "天" }}</span>
        <span v-if="day >= 0 && hour >= 0">{{ hour + "小时" }}</span>
        <span v-if="minute >= 0">{{ minute + "分" }}</span>
        <span v-if="second >= 0">{{ second + "秒" }}</span>
      </section>
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
                },
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
  inject: ["reload"],
  components: {
    "edit-teacher-info-dialog": EditTeacherInfoDialog,
  },
  data() {
    return {
      password: "",
      ruleForm: {
        id: "",
        password: "",
        role: "",
      },
      dialogShow: false,
      operate: "edit",
      refreshOperation: false,
      entrance: "header",
      showEditPassword: false,
      showCountDown: false,
      inputTime: null,
      str: "",
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      timer: null,
      showTime: true,
      startTime: "",
      endTime: "",
      moduleName: "",
    };
  },
  props: {
    nextModule: String,
  },
  methods: {
    back() {},
    countDown() {
      let nowTime = +new Date();
      let time = +new Date(this.inputTime);
      let seconds = (time - nowTime) / 1000;
      let d = parseInt(seconds / 60 / 60 / 24);
      this.day = d;
      let h = parseInt((seconds / 60 / 60) % 24);
      h = h < 10 ? "0" + h : h;
      this.hour = h;
      let m = parseInt((seconds / 60) % 60);
      m = m < 10 ? "0" + m : m;
      this.minute = m;
      let s = parseInt(seconds % 60);
      s = s < 10 ? "0" + s : s;
      this.second = s;
      if (new Date(this.inputTime) <= new Date()) {
        this.inputTime = null;
        clearInterval(this.timer);
        this.reload();
      }
    },
    passwordChange() {
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
      this.showEditPassword = false;
      this.$refs["elpopoveredit"].doClose();
    },
    switchOperationPage() {
      request(
        "/QueryModuleTimeServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          role: this.$store.state.user.role,
          moduleName: "选题",
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          if (
            res.data.endTime != null &&
            new Date(res.data.endTime) < new Date().getTime()
          ) {
            if (this.$route.path == "/teacher/addselecttopic") {
              this.$router.push("/teacher/instructstudents");
            } else if (this.$route.path == "/teacher/instructstudents") {
              this.$router.push("/teacher/addselecttopic");
            }
          } else {
            this.$message({
              showClose: true,
              message: "选题阶段尚未结束！",
              type: "warning",
            });
          }
          console.log(res);
        })
        .catch((err) => {
          consoel.log(err);
        });
    },
  },
  watch: {
    "$store.state.user": {
      handler(val, oldVal) {
        this.ruleForm.id = val.id;
        this.ruleForm.password = val.password;
        this.ruleForm.role = val.role;
        if (val.role == "teacher") {
          request(
            "/QueryCurrentModuleInfoServlet",
            Qs.stringify({
              id: val.id,
              role: "teacher",
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
              this.moduleName = res.data.moduleName;
              this.startTime = res.data.startTime;
              this.endTime = res.data.endTime;
              if( new Date(res.data.endTime) <= new Date() && res.data.moduleName == '选题' ) {
                this.showTime = false;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      deep: true,
    },
    nextModule(val, oldVal) {
      if (val != null) {
        let moduleName = "";
        if (val == "选题未开始") {
          moduleName = "选题";
        } else if (val == "选题已开始") {
          moduleName = "选题";
        } else {
          moduleName = val;
        }
        request(
          "/CountDownServlet",
          Qs.stringify({
            id: this.$store.state.user.id,
            moduleName: moduleName,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            if (val == "选题未开始") {
              this.str = "距离选题开始还剩：";
              if (res.data.time[0] == null) {
                this.inputTime = null;
              } else {
                this.inputTime = res.data.time[0];
                this.countDown();
                this.timer = setInterval(this.countDown, 1000);
              }
            } else if (val == "选题已开始") {
              this.str = "距离选题结束还剩：";
              if (res.data.time[1] == null) {
                this.inputTime = null;
              } else {
                this.inputTime = res.data.time[1];
                this.countDown();
                this.timer = setInterval(this.countDown, 1000);
              }
            } else {
              this.str = "距离" + moduleName + "开始还剩：";
              if (res.data.time[0] == null) {
                this.inputTime = null;
              } else {
                this.inputTime = res.data.time[0];
                this.countDown();
                this.timer = setInterval(this.countDown, 1000);
              }
            }
            this.showCountDown = true;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    refreshOperation(val, oldVal) {
      if (val == true) {
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
        this.refreshOperation = false;
      }
    },
  },
  created() {},
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
.count-down {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.back {
  background-color: #1296db;
  color: white;
  margin-left: 50px;
}
</style>
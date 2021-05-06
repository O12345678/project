<template>
  <el-dialog
    custom-class="edit-teacher-info-dialog"
    :title="'编辑 ' + info.name + ' 教师的信息'"
    :visible.sync="isShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form :model="info" ref="validateInfo">
      <div class="edit-teacher-info-dialog-body">
        <div class="flex-row-between">
          教师编号:
          <el-form-item
            prop="id"
            :rules="[
              {
                required: true,
                message: '编号不能为空',
                trigger: 'change',
              },
            ]"
          >
            <el-input
              style="width: 150px"
              v-model="info.id"
              placeholder="请输入教师编号"
              size="small"
              :disabled="operate == 'edit'"
            ></el-input>
          </el-form-item>
          教师姓名:
          <el-form-item
            prop="name"
            :rules="[
              {
                required: true,
                message: '姓名不能为空',
                trigger: 'change',
              },
            ]"
          >
            <el-input
              style="width: 150px"
              v-model="info.name"
              placeholder="请输入教师姓名"
              size="small"
            ></el-input>
          </el-form-item>
        </div>
        <div class="flex-row-between">
          密码:
          <el-form-item
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
            ><el-input
              style="width: 150px"
              v-model="info.password"
              placeholder="请输入密码"
              size="small"
            ></el-input
          ></el-form-item>
          职称:
          <el-select
            v-model="info.jobTitle"
            placeholder="请选择职称"
            size="small"
            style="width: 150px"
            clearable
          >
            <el-option v-for="item in jobTitles" :key="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="flex-row-between">
          教育水平:
          <el-select
            v-model="info.educationLevel"
            placeholder="请选择教育水平"
            size="small"
            style="width: 150px"
            clearable
            @change="change"
          >
            <el-option
              v-for="(item, index) in educationLevels"
              :key="index"
              :value="item"
              @click.native="changeADEL(index)"
            >
            </el-option>
          </el-select>
          学位:
          <el-select
            v-model="info.academicDegree"
            placeholder="请选择学位"
            size="small"
            style="width: 150px"
            clearable
            @change="change"
          >
            <el-option
              v-for="(item, index) in academicDegrees"
              :key="index"
              :value="item"
              @click.native="changeADEL(index)"
            >
            </el-option>
          </el-select>
        </div>
        <div class="flex-row-between">
          联系方式:
          <el-input
            style="width: 150px"
            v-model="info.tel"
            placeholder="请输入联系方式"
            size="small"
          ></el-input>
          邮箱:
          <el-form-item
            prop="email"
            :rules="[
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              style="width: 200px"
              v-model="info.email"
              placeholder="请输入邮箱"
              size="small"
            ></el-input
          ></el-form-item>
        </div></div
    ></el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="quitEditInfo">取 消</el-button>
      <el-button type="primary" @click="submitEditInfo('validateInfo')"
        >确 定</el-button
      >
    </div></el-dialog
  >
</template>

<script>
import { deepCopy } from "../assets/js/utils";
import { request } from "../network/request";
import Qs from "qs";

export default {
  data() {
    return {
      info: {
        id: "",
        password: "",
        name: "",
        faculty: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      },
      isShow: this.dialogShow,
      academicDegrees: ["学士", "硕士", "博士"],
      educationLevels: ["大学本科", "硕士研究生", "博士研究生"],
      jobTitles: ["讲师", "副教授", "教授"],
    };
  },
  props: {
    teacherInfo: Object,
    dialogShow: Boolean,
    operate: String,
    refreshOperation: Boolean,
    entrance: String,
  },
  methods: {
    deepCopy,
    changeADEL(index) {
      this.info.academicDegree = this.academicDegrees[index];
      this.info.educationLevel = this.educationLevels[index];
    },
    change(val) {
      if (val == "") {
        this.info.academicDegree = "";
        this.info.educationLevel = "";
      }
    },
    submitEditInfo(validateName) {
      this.$refs[validateName].validate((valid) => {
        if (valid) {
          this.$emit("update:dialogShow", false);
          request(
            "/UpdateTeacherServlet",
            Qs.stringify({
              id: this.$store.state.user.id,
              role: "administrator",
              info: encodeURI(JSON.stringify(this.info), "utf-8"),
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
              this.$emit("update:refreshOperation", true);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message({
            showClose: true,
            message: "请输入正确的信息!",
            type: "error",
          });
          return false;
        }
      });
    },
    quitEditInfo() {
      this.$emit("update:dialogShow", false);
      if (this.entrance == "header") {
        deepCopy(this.info, this.$store.state.teacherMyInfo);
      } //else if (this.entrance == "manage") {
      //   deepCopy(this.info, this.teacherInfo);
      // }
    },
  },
  watch: {
    dialogShow: {
      handler(val, oldVal) {
        this.isShow = val;
      },
      deep: true,
    },
    teacherInfo: {
      handler(val, oldVal) {
        deepCopy(this.info, val);
      },
      deep: true,
    },
    "$store.state.teacherMyInfo": {
      handler(val, oldVal) {
        deepCopy(this.info, val);
      },
      deep: true,
    },
  },
  mounted() {
    if (this.entrance == "header") {
      deepCopy(this.info, this.$store.state.teacherMyInfo);
    } else if (this.entrance == "manage") {
      deepCopy(this.info, this.teacherInfo);
    }
  },
};
</script>

<style>
.edit-teacher-info-dialog {
  width: 550px;
  height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.edit-teacher-info-dialog-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
}
.edit-teacher-info-dialog .el-dialog__body {
  padding: 10px 20px 0;
}
.edit-teacher-info-dialog .el-form-item {
  margin: 0;
}
</style>
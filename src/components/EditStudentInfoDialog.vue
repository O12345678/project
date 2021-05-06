<template>
  <el-dialog
    custom-class="edit-student-info-dialog"
    :title="'编辑学生' + info.name + '的信息'"
    :visible.sync="isShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      :model="info"
      label-width="60px"
      ref="studentInfoForm"
      class="edit-student-info-dialog-body"
    >
      <div class="flex-row-between">
        <el-form-item
          label="学号:"
          prop="id"
          :rules="[
            { required: true, message: '请输入学号', trigger: 'change' },
          ]"
        >
          <el-input
            style="width: 150px"
            v-model="info.id"
            placeholder="请输入学号"
            size="small"
            :disabled="operate == 'edit'"
          ></el-input
        ></el-form-item>

        <el-form-item
          label="学生姓名:"
          label-width="100px"
          prop="name"
          :rules="[
            { required: true, message: '请输入学生姓名', trigger: 'change' },
          ]"
        >
          <el-input
            style="width: 150px"
            v-model="info.name"
            placeholder="请输入学生姓名"
            size="small"
          ></el-input
        ></el-form-item>

        <el-form-item
          label="密码:"
          prop="password"
          :rules="[
            { required: true, message: '请输入密码', trigger: 'change' },
            {
              min: 8,
              message: '密码长度不能小于8个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            style="width: 150px"
            v-model="info.password"
            placeholder="请输入密码"
            size="small"
          ></el-input
        ></el-form-item>
      </div>
      <div class="flex-row-between">
        <el-form-item
          v-if="operate == 'edit'"
          label="学院:"
          prop="faculty"
          :rules="[
            { required: true, message: '请选择学院', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="info.faculty"
            placeholder="请选择学院"
            size="small"
            style="width: 200px"
            clearable
            @change="facultyChange"
          >
            <el-option v-for="item in departments" :key="item" :value="item">
            </el-option> </el-select
        ></el-form-item>
        <el-form-item v-else-if="operate == 'add'" label="年级:">
          <el-input
            size="small"
            style="width: 150px"
            v-model="info.grade"
            :disabled="true"
          ></el-input
        ></el-form-item>
        <el-form-item
          label="专业:"
          prop="profession"
          :rules="[
            { required: true, message: '请选择专业', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="info.profession"
            placeholder="请选择专业"
            size="small"
            style="width: 180px"
            clearable
            @change="professionChange"
          >
            <el-option
              v-for="(item, index) in professions"
              :key="index"
              :value="item"
            >
            </el-option> </el-select
        ></el-form-item>

        <el-form-item
          label="班级:"
          prop="classNumber"
          :rules="[
            { required: true, message: '请选择班级', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="info.classNumber"
            placeholder="请选择班级"
            size="small"
            style="width: 120px"
            clearable
          >
            <el-option
              v-for="item in classNumbers"
              :key="item"
              :value="item"
              :label="item + '班'"
            >
            </el-option> </el-select
        ></el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="quitEditInfo">取 消</el-button>
      <el-button type="primary" @click="submitEditInfo()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { request } from "../network/request";
import Qs from "qs";
import { deepCopy } from "../assets/js/utils";
export default {
  data() {
    return {
      info: {
        id: "",
        password: "",
        name: "",
        faculty: "",
        profession: "",
        classNumber: "",
      },
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
      isShow: this.dialogShow,
      departments: [],
      professions: [],
      classNumbers: [],
    };
  },
  props: {
    studentInfo: Object,
    dialogShow: Boolean,
    operate: String,
    refreshOperation: Boolean,
  },
  methods: {
    facultyChange(value) {
      // 联动
      this.info.profession = "";
      this.info.classNumber = "";
      this.professions = [];
      this.classNumbers = [];
      request(
        "/QueryProfessionByFacultyServlet",
        Qs.stringify({
          faculty: value,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.professions = res.data.professions;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    professionChange(value) {
      // 联动
      this.info.classNumber = "";
      this.classNumbers = [];

      request(
        "/QueryClassNumberServlet",
        Qs.stringify({
          profession: value,
          grade: this.currentAcademicYear - 3,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.classNumbers = res.data.classNumbers;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitEditInfo() {
      this.$refs["studentInfoForm"].validate((valid) => {
        if (valid) {
          request(
            "/UpdateStudentServlet",
            Qs.stringify({
              info: encodeURI(JSON.stringify(this.info), "utf-8"),
              userId: this.$store.state.user.id,
              role: "administrator",
              grade: this.currentAcademicYear - 3
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
              this.$emit("update:dialogShow", false);
              this.$emit("update:refreshOperation", true);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    quitEditInfo() {
      this.$emit("update:dialogShow", false);
    },
  },
  watch: {
    dialogShow(val, oldVal) {
      this.isShow = val;
    },
    studentInfo(val, oldVal) {
      deepCopy(this.info, val);
      if (val.id == "") {
        request(
          "/QueryProfessionServlet",
          Qs.stringify({
            id: this.$store.state.user.id,
            role: "administrator",
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.professions = res.data.professions;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        request(
          "/EditStudentInfoDialogInitServlet",
          Qs.stringify({
            grade: this.currentAcademicYear - 3,
            faculty: val.faculty,
            profession: val.profession,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.departments = res.data.facultys;
            this.professions = res.data.professions;
            this.classNumbers = res.data.classNumbers;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style>
.edit-student-info-dialog {
  width: 750px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.edit-student-info-dialog-body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 120px;
}
.edit-student-info-dialog .el-dialog__body {
  padding: 10px 20px 0;
}
.edit-student-info-dialog .el-form-item {
  margin: 0;
}
</style>
<template>
  <div style="width: 900px">
    <div>
      <div class="flex-row-between" style="margin-bottom: 10px">
        专业:
        <el-select
          v-model="searchStudent.profession"
          placeholder="请选择专业"
          size="small"
          style="width: 160px"
          clearable
          @change="professionChange"
        >
          <el-option
            v-for="(item, index) in professions"
            :key="index"
            :value="item"
            :label="item.name"
          >
          </el-option>
        </el-select>
        班级:
        <el-select
          v-model="searchStudent.classNumber"
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
          </el-option>
        </el-select>
        学号:
        <el-select
          clearable
          v-model="searchStudent.id"
          value-key="id"
          placeholder="请输入学号"
          size="small"
          style="width: 120px"
          filterable
        >
          <el-option
            v-for="(item, index) in studentIds"
            :key="index"
            :value="item"
            :label="item"
          >
          </el-option>
        </el-select>
        学生姓名:
        <el-select
          clearable
          v-model="searchStudent.name"
          value-key="id"
          placeholder="请输入学生姓名"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in studentNames"
            :key="index"
            :value="item"
            :label="item"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="addStudent()"
          style="margin-left: 10px"
          >添加</el-button
        >
        <el-button type="primary" size="small" @click="studentQuery()"
          >查询</el-button
        >
      </div>
    </div>
    <el-table
      :data="
        studentInfos.slice(
          (studentInfoCurrentPage - 1) * studentInfoPageSize,
          studentInfoCurrentPage * studentInfoPageSize
        )
      "
      :height="405"
      style="width: 100%"
      size="medium"
    >
      <el-table-column
        label="学号"
        prop="id"
        width="120px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="学生姓名"
        prop="name"
        width="150px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <!-- <el-table-column
        label="学院"
        prop="faculty"
        width="180px"
        :resizable="false"
        align="center"
      ></el-table-column> -->
      <el-table-column
        label="专业"
        prop="profession"
        min-width="150px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="班级"
        width="120px"
        :resizable="false"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.classNumber + "班" }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="180px" :resizable="false">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.password"
            :readonly="true"
            :type="scope.row.showType"
            size="small"
            class="student-info-table-password input-border-none"
          >
            <i
              slot="suffix"
              class="el-input__icon iconfont"
              :class="{
                'el-icon-yincang': scope.row.showType == 'text',
                'el-icon-xianshi': scope.row.showType == 'password',
              }"
              @click="showPassword(scope.row)"
            ></i>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <div class="flex-row-around">
            <el-button
              @click="
                studentInfoEdit(
                  alterPage(
                    studentInfoCurrentPage,
                    studentInfoPageSize,
                    scope.$index
                  )
                )
              "
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              size="small"
              @click="studentInfoDelete(scope.row.id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" style="margin-top: 15px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="studentInfoCurrentPage"
        :page-size="8"
        :page-sizes="[8, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="studentInfos.length"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
    <edit-student-info-dialog
      :studentInfo.sync="studentInfo"
      :dialogShow.sync="dialogShow"
      :operate.sync="operate"
      :refreshOperation.sync="refreshOperation"
    ></edit-student-info-dialog>
  </div>
</template>

<script>
import { alterPage } from "../assets/js/utils.js";
import { deepCopy } from "../assets/js/utils.js";
import { querySearchAsync } from "../assets/js/utils.js";
import { createStateFilter } from "../assets/js/utils.js";
import EditStudentInfoDialog from "./EditStudentInfoDialog.vue";
import { request } from "../network/request";
import Qs from "qs";
export default {
  components: {
    "edit-student-info-dialog": EditStudentInfoDialog,
  },
  data() {
    return {
      studentInfo: {
        id: "",
        password: "",
        name: "",
        faculty: "",
        profession: "",
        classNumber: "",
      },
      dialogShow: false,
      operate: "edit",
      searchStudent: {
        id: "",
        name: "",
        profession: "",
        classNumber: "",
      },
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
      professions: [],
      classNumbers: [],
      studentNames: [],
      studentIds: [],
      studentInfos: [
        {
          id: "",
          password: "12345678",
          name: "",
          faculty: "",
          profession: "",
          classNumber: "",
          showType: "password",
        },
      ],
      studentInfoCurrentPage: 1,
      studentInfoPageSize: 8,
      refreshOperation: false,
    };
  },
  methods: {
    alterPage,
    deepCopy,
    querySearchAsync,
    createStateFilter,
    handleSizeChange(size) {
      this.studentInfoPageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.studentInfoCurrentPage = currentPage;
    },
    studentInfoEdit(index) {
      this.studentInfo = {
        id: "",
        password: "",
        name: "",
        faculty: "",
        profession: "",
        classNumber: "",
      };
      deepCopy(this.studentInfo, this.studentInfos[index]);
      this.operate = "edit";
      this.dialogShow = true;
    },
    studentInfoDelete(id) {
      request(
        "/DeleteStudentServlet",
        Qs.stringify({
          id: id,
          userId: this.$store.state.user.id,
          role: "administrator",
          studentId: this.searchStudent.id,
          name: this.searchStudent.name,
          profession: this.searchStudent.profession,
          classNumber: this.searchStudent.classNumber,
          grade: this.currentAcademicYear - 3,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.studentInfos = res.data.studentInfos;
          this.studentNames = res.data.studentNames;
          this.studentIds = res.data.studentIds;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    studentQuery() {
      
      request(
        "/QueryStudentServlet",
        Qs.stringify({
          userId: this.$store.state.user.id,
          role: "administrator",
          studentId: this.searchStudent.id,
          name: this.searchStudent.name,
          profession: this.searchStudent.profession,
          classNumber: this.searchStudent.classNumber,
          grade: this.currentAcademicYear - 3,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.studentInfos = res.data.studentInfos;
          this.studentInfoCurrentPage = 1;
          this.studentNames = res.data.studentNames;
          this.studentIds = res.data.studentIds;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addStudent() {
      this.studentInfo = {
        id: "",
        password: "",
        name: "",
        faculty: "",
        grade: this.currentAcademicYear - 3,
        profession: "",
        classNumber: "",
      };
      this.operate = "add";
      this.dialogShow = true;
    },
    professionChange(value) {
      // 联动
      this.searchStudent.classNumber = "";
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
    showPassword(row) {
      if (row.showType == "password") {
        row.showType = "text";
      } else if (row.showType == "text") {
        row.showType = "password";
      }
    },
  },
  created() {
    request(
      "/StudentInfoManageInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id"),
        grade: this.currentAcademicYear - 3,
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        this.professions = res.data.professions;
        this.studentInfos = res.data.studentInfos;
        this.studentNames = res.data.studentNames;
        this.studentIds = res.data.studentIds;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
    refreshOperation(val, oldVal) {
      if (val) {
        request(
          "/QueryStudentServlet",
          Qs.stringify({
            userId: this.$store.state.user.id,
            role: "administrator",
            studentId: this.searchStudent.id,
            name: this.searchStudent.name,
            profession: this.searchStudent.profession,
            classNumber: this.searchStudent.classNumber,
            grade: this.currentAcademicYear - 3,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            this.studentInfos = res.data.studentInfos;
            this.studentNames = res.data.studentNames;
            this.studentIds = res.data.studentIds;
            console.log(res);
          })
          .catch((err) => {
            UpdateStudentServlet(err);
          });
        this.refreshOperation = false;
      }
    },
  },
};
</script>

<style>
.student-info-table-password input {
  padding-left: 5px;
}
</style>
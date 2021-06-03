<template>
  <div style="width: 900px">
    <div class="flex-row-between" style="margin-bottom: 20px">
      学生姓名:
      <el-select
        clearable
        v-model="searchArrange.student"
        placeholder="请输入学生姓名"
        size="small"
        style="width: 150px"
        filterable
      >
        <el-option
          v-for="(item, index) in studentNames"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      答辩老师:
      <el-select
        clearable
        v-model="searchArrange.replyTeacher"
        placeholder="请输入教师"
        size="small"
        style="width: 150px"
        filterable
      >
        <el-option
          v-for="(item, index) in teacherNames"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      评审老师:
      <el-select
        clearable
        v-model="searchArrange.reviewTeacher"
        placeholder="请输入教师"
        size="small"
        style="width: 150px"
        filterable
      >
        <el-option
          v-for="(item, index) in teacherNames"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      答辩地点:
      <el-select
        clearable
        v-model="searchArrange.place"
        placeholder="请选择地点"
        size="small"
        style="width: 130px"
      >
        <el-option v-for="(item, index) in places" :key="index" :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="flex-row-between" style="margin-bottom: 20px">
      专业:
      <el-select
        clearable
        v-model="searchArrange.profession"
        value-key="id"
        placeholder="请选择专业"
        size="small"
        style="width: 200px"
        @change="professionChange"
        filterable
      >
        <el-option
          v-for="(item, index) in professions"
          :key="index"
          :value="item"
        >
        </el-option>
      </el-select>
      班级:
      <el-select
        clearable
        v-model="searchArrange.classNumber"
        placeholder="请选择班级"
        size="small"
        style="width: 140px"
      >
        <el-option
          v-for="(item, index) in classNumbers"
          :key="index"
          :value="item"
          :label="item + '班'"
        >
        </el-option>
      </el-select>
      答辩时间:
      <el-date-picker
        v-model="searchArrange.dateTime"
        type="datetime"
        size="small"
        style="width: 200px"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="请选择日期时间"
      >
      </el-date-picker>
      <el-popconfirm
        confirm-button-text="确认"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        title="将发布当前所有数据，是否确认？"
        @confirm="arrangeExport()"
      >
        <el-button slot="reference" type="primary" size="small">发布</el-button>
      </el-popconfirm>

      <el-button type="primary" size="small" @click="arrangeQuery()"
        >查询</el-button
      >
    </div>
    <el-table
      style="width: 100%"
      :height="361"
      :data="
        arrangeData.slice(
          (arrangeCurrentPage - 1) * arrangePageSize,
          arrangeCurrentPage * arrangePageSize
        )
      "
    >
      <el-table-column
        align="center"
        :resizable="false"
        label="学生姓名"
        width="120"
        prop="student.name"
      >
      </el-table-column>
      <el-table-column label="专业" width="150px" :resizable="false">
        <template slot-scope="scope">
          <span style="white-space: nowrap">{{
            scope.row.student.profession
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" width="100px" :resizable="false">
        <template slot-scope="scope">
          {{ scope.row.student.classNumber + "班" }}
        </template></el-table-column
      >
      <el-table-column
        align="center"
        :resizable="false"
        label="答辩教师"
        width="120"
      >
        <template slot-scope="scope">
          <a
            @click="
              showDetailInfoDialog(
                teacherDetailInfo,
                arrangeData[
                  alterPage(arrangeCurrentPage, arrangePageSize, scope.$index)
                ].replyTeacher,
                teacherDetailInfoDialogVisible
              )
            "
            >{{ scope.row.replyTeacher.name }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        label="评审教师"
        width="120"
      >
        <template slot-scope="scope">
          <a
            @click="
              showDetailInfoDialog(
                teacherDetailInfo,
                arrangeData[
                  alterPage(arrangeCurrentPage, arrangePageSize, scope.$index)
                ].reviewTeacher,
                teacherDetailInfoDialogVisible
              )
            "
            >{{ scope.row.reviewTeacher.name }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="dateTime"
        :resizable="false"
        label="答辩时间"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        prop="place"
        label="答辩地点"
        min-width="100"
      ></el-table-column>
    </el-table>
    <div class="pagination" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="arrangeCurrentPage"
        :page-size="7"
        :page-sizes="[3, 7, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="arrangeData.length"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
    <teacher-detail-dialog
      :appendToBody="false"
      :teacherDetailInfo.sync="teacherDetailInfo"
      :teacherDetailInfoDialogVisible.sync="teacherDetailInfoDialogVisible"
    ></teacher-detail-dialog>
  </div>
</template>

<script>
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import { showDetailInfoDialog } from "../assets/js/utils.js";
import { alterPage } from "../assets/js/utils.js";
import { deepCopy } from "../assets/js/utils.js";
import { querySearchAsync } from "../assets/js/utils.js";
import { createStateFilter } from "../assets/js/utils.js";
import { request } from "../network/request";
import Qs from "qs";
export default {
  components: {
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      teacherDetailInfo: {
        id: "",
        name: "",
        faculty: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      },
      teacherDetailInfoDialogVisible: {
        value: false,
      },
      searchArrange: {
        student: "",
        replyTeacher: "",
        reviewTeacher: "",
        place: "",
        replyTime: "",
        profession: "",
        classNumber: "",
      },
      arrangeCurrentPage: 1,
      arrangePageSize: 7,
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
      studentNames: [],
      teacherNames: [],
      places: ["6-101", "6-102", "6-103", "6-104", "6-105", "6-106", "6-107"],
      arrangeData: [
        {
          student: {
            id: "",
            name: "",
            profession: "",
            classNumber: "",
          },
          replyTeacher: {
            id: "",
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
          reviewTeacher: {
            id: "",
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
          place: "",
          dateTime: "",
        },
      ],
      professions: [],
      classNumbers: [],
    };
  },
  methods: {
    showDetailInfoDialog,
    alterPage,
    deepCopy,
    querySearchAsync,
    createStateFilter,

    handleSizeChange(size) {
      this.arrangePageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.arrangeCurrentPage = currentPage;
    },
    arrangeQuery() {
      request(
        "/QueryReplyArrangeGatherServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          role: "administrator",
          student: this.searchArrange.student,
          replyTeacher: this.searchArrange.replyTeacher,
          reviewTeacher: this.searchArrange.reviewTeacher,
          place: this.searchArrange.place,
          dateTime: this.searchArrange.dateTime,
          profession: this.searchArrange.profession,
          classNumber: this.searchArrange.classNumber,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.arrangeData = res.data.arrangeData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    arrangeExport() {
      if (this.arrangeData.length <= 0) {
        this.$message({
          showClose: true,
          message: "数据为空！",
          type: "warning",
        });
      } else {
        request(
          "/ExportReplyArrangeServlet",
          Qs.stringify({
            id: this.$store.state.user.id,
            replyArrange: encodeURI(JSON.stringify(this.arrangeData), "utf-8"),
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            if (res.data.flag) {
              this.$message({
                showClose: true,
                message: "发布成功！",
                type: "success",
              });
            }
            else {
              this.$message({
                showClose: true,
                message: "发布失败！",
                type: "warrning",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    professionChange(value) {
      // 联动
      this.searchArrange.classNumber = "";
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
  },
  created() {
    // 初始化专业，初始化所有数据，初始化学生姓名，老师姓名
    request(
      "/ReplyArrangeGatherInitServlet",
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
        this.teacherNames = res.data.teacherNames;
        this.studentNames = res.data.studentNames;
        this.arrangeData = res.data.arrangeData;
        this.professions = res.data.professions;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
</style>
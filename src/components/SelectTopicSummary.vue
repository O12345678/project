<template>
  <div style="width: 900px">
    <div>
      <div class="flex-row-between">
        学生姓名:
        <el-select
          clearable
          v-model="searchInfo.student"
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
        专业:
        <el-select
          clearable
          v-model="searchInfo.profession"
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
          v-model="searchInfo.classNumber"
          placeholder="请选择班级"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="(item, index) in classNumbers"
            :key="index"
            :value="item"
            :label="item + '班'"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          @click="query()"
          style="margin-left: 40px"
          >查询</el-button
        >
      </div>
      <div class="flex-row-between" style="width: 800px; margin: 15px 0 20px">
        题目:
        <el-input
          placeholder="请输入内容"
          v-model="searchInfo.topic"
          clearable
          size="small"
          style="width: 250px"
        >
        </el-input>
        选题难度:
        <el-select
          clearable
          v-model="searchInfo.degreeOfDifficulty"
          placeholder="请选择难度"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in degreeOfDifficulties"
            :key="index"
            :value="item"
          >
          </el-option>
        </el-select>
        指导教师:
        <el-select
          clearable
          v-model="searchInfo.teacher"
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
      </div>
    </div>
    <el-table
      style="width: 100%"
      :height="361"
      :data="
        selectTopicInfos.slice(
          (selectTopicInfoCurrentPage - 1) * selectTopicInfoPageSize,
          selectTopicInfoCurrentPage * selectTopicInfoPageSize
        )
      "
    >
      <el-table-column
        type="index"
        width="50px"
        :resizable="false"
        align="center"
        label="序号"
        ><template slot-scope="scope">
          <span>{{
            (selectTopicInfoCurrentPage - 1) * selectTopicInfoPageSize +
            scope.$index +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="topic"
        label="题目"
        min-width="180px"
        :resizable="false"
      >
        <template slot-scope="scope">
          <a
            style="white-space: nowrap"
            @click="
              showDetailInfoDialog(
                topicDetailInfo,
                selectTopicInfos[
                  alterPage(
                    selectTopicInfoCurrentPage,
                    selectTopicInfoPageSize,
                    scope.$index
                  )
                ],
                topicDetailInfoDialogVisible
              )
            "
            >{{ scope.row.name }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="degreeOfDifficulty"
        :resizable="false"
        label="选题难度"
        width="120px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="student.name"
        :resizable="false"
        label="学生姓名"
        width="150px"
      >
      </el-table-column>
      <el-table-column label="专业" width="150px" :resizable="false">
        <template slot-scope="scope">
          {{ scope.row.student.profession }}
        </template></el-table-column
      >
      <el-table-column
        label="班级"
        width="100px"
        :resizable="false"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.student.classNumber + "班" }}
        </template></el-table-column
      >

      <el-table-column
        align="center"
        :resizable="false"
        label="指导教师"
        width="120"
      >
        <template slot-scope="scope">
          <a
            @click="
              showDetailInfoDialog(
                teacherDetailInfo,
                selectTopicInfos[
                  alterPage(
                    selectTopicInfoCurrentPage,
                    selectTopicInfoPageSize,
                    scope.$index
                  )
                ].teacher,
                teacherDetailInfoDialogVisible
              )
            "
            >{{ scope.row.teacher.name }}</a
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="selectTopicInfoCurrentPage"
        :page-size="7"
        :page-sizes="[7, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="selectTopicInfos.length"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
    <topic-detail-dialog
      :topicDetailInfo.sync="topicDetailInfo"
      :topicDetailInfoDialogVisible.sync="topicDetailInfoDialogVisible"
    ></topic-detail-dialog>
    <teacher-detail-dialog
      :appendToBody="false"
      :teacherDetailInfo.sync="teacherDetailInfo"
      :teacherDetailInfoDialogVisible.sync="teacherDetailInfoDialogVisible"
    ></teacher-detail-dialog>
  </div>
</template>

<script>
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
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
    "topic-detail-dialog": TopicDetailInfoDialog,
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      topicDetailInfo: {
        id: "",
        name: "",
        declaredYear: "",
        type: "",
        pattern: "",
        degreeOfDifficulty: "",
        content: "",
        require: "",
        finalNumber: 1,
        teacher: {
          id: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
        },
      },
      topicDetailInfoDialogVisible: {
        value: false,
      },
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
      selectTopicInfoCurrentPage: 1,
      selectTopicInfoPageSize: 7,
      selectTopicInfos: [
        {
          id: "",
          name: "",
          declaredYear: "",
          type: "",
          pattern: "",
          degreeOfDifficulty: "",
          content: "",
          require: "",
          progress: "",
          finalNumber: 1,
          student: {
            id: "",
            name: "",
            profession: "",
            classNumber: "",
          },
          teacher: {
            id: "",
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
        },
      ],
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
      students: [
        {
          id: "",
          name: "",
          class: "",
        },
      ],
      teachers: [
        {
          id: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
        },
      ],
      studentNames: [],
      teacherNames: [],
      professions: [],
      classNumbers: [],
      degreeOfDifficulties: ["容易", "适中", "难"],
      searchInfo: {
        student: "",
        profession: "",
        classNumber: "",
        topic: "",
        degreeOfDifficulty: "",
        teacher: "",
      },
    };
  },
  methods: {
    showDetailInfoDialog,
    alterPage,
    deepCopy,
    querySearchAsync,
    createStateFilter,
    handleSizeChange(size) {
      this.selectTopicInfoPageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.selectTopicInfoCurrentPage = currentPage;
    },
    professionChange(value) {
      this.searchInfo.classNumber = "";
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
    query() {
      request(
        "/QuerySelectTopicSummaryServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          grade: this.currentAcademicYear - 3,
          studentName: this.searchInfo.student,
          profession: this.searchInfo.profession,
          classNumber: this.searchInfo.classNumber,
          topic: this.searchInfo.topic,
          degreeOfDifficulty: this.searchInfo.degreeOfDifficulty,
          teacherName: this.searchInfo.teacher,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.selectTopicInfos = res.data.selectTopicInfos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    request(
      "/SelectTopicSummaryInitServlet",
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
        this.studentNames = res.data.studentNames;
        this.teacherNames = res.data.teacherNames;
        this.selectTopicInfos = res.data.selectTopicInfos;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
</style>
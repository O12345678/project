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
            v-for="(item, index) in students"
            :key="index"
            :value="item.name"
          >
          </el-option>
        </el-select>
        专业:
        <el-select
          clearable
          v-model="searchInfo.class.profession"
          placeholder="请选择专业"
          size="small"
          style="width: 200px"
          @change="professionChange"
          filterable
        >
          <el-option
            v-for="(item, index) in professions"
            :key="index"
            :value="item.profession"
          >
          </el-option>
        </el-select>
        班级:
        <el-select
          clearable
          v-model="searchInfo.class.classNumber"
          placeholder="请选择班级"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="(item, index) in classNumbers"
            :key="index"
            :value="item"
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
        选题模式:
        <el-select
          clearable
          v-model="searchInfo.pattern"
          placeholder="请选择模式"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in patterns"
            :key="index"
            :value="item.name"
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
            v-for="(item, index) in teachers"
            :key="index"
            :value="item.name"
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
        prop="pattern"
        :resizable="false"
        label="选题模式"
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
        width="150"
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
          name: "高校毕业设计管理系统",
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
            name: "张三",
            profession: "计算机科学与技术",
            classNumber: "一班",
          },
          teacher: {
            id: "",
            name: "王刚",
            faculty: "",
            jobTitle: "讲师",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
        },
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
            profession: "信息安全",
            classNumber: "一班",
          },
          teacher: {
            id: "",
            name: "李刚",
            faculty: "",
            jobTitle: "",
            educationLevel: "本科",
            academicDegree: "学士学位",
            tel: "13965478912",
            email: "",
          },
        },
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
            profession: "计算机科学与技术",
            classNumber: "二班",
          },
          teacher: {
            id: "",
            name: "王飞",
            faculty: "",
            jobTitle: "",
            educationLevel: "博士",
            academicDegree: "博士学位",
            tel: "15645789123",
            email: "",
          },
        },
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
            profession: "计算机科学与技术",
            classNumber: "一班",
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
            profession: "计算机科学与技术",
            classNumber: "一班",
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
            profession: "计算机科学与技术",
            classNumber: "一班",
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
            profession: "计算机科学与技术",
            classNumber: "一班",
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
            profession: "计算机科学与技术",
            classNumber: "一班",
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
            profession: "计算机科学与技术",
            classNumber: "一班",
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
      professions: [],
      classNumbers: [],
      patterns: [],
      searchInfo: {
        name: "",
        class: {
          profession: "",
          classNumber: "",
        },
        topic: "",
        pattern: "",
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
      // 联动
      console.log(value);
      // 数据库查询班号-----------------------------------------------------------
    },
    query() {
      // 数据库查询班号-----------------------------------------------------------
    },
  },
};
</script>

<style>
</style>
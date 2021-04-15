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
          v-for="(item, index) in students"
          :key="index"
          :value="item.name"
        >
        </el-option>
      </el-select>
      答辩老师:
      <el-select
        clearable
        v-model="searchArrange.teacher1"
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
      评审老师:
      <el-select
        clearable
        v-model="searchArrange.teacher2"
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
      <el-button type="primary" size="small" @click="exportFile"
        >导出</el-button
      >
    </div>
    <div class="flex-row-between" style="margin-bottom: 20px">
      答辩时间:
      <el-date-picker
        v-model="searchArrange.replyTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
        style="width: 360px"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>
      答辩地点:
      <el-select
        clearable
        v-model="searchArrange.place"
        placeholder="请选择地点"
        size="small"
      >
        <el-option v-for="(item, index) in places" :key="index" :value="item">
        </el-option>
      </el-select>

      <el-button type="primary" size="small" @click="arrangeQuery()"
        >查询</el-button
      >
    </div>
    <el-table
      style="width: 100%"
      :height="352"
      :data="
        arrangeData.slice(
          (arrangeCurrentPage - 1) * arrangePageSize,
          arrangeCurrentPage * arrangePageSize
        )
      "
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        label="学生姓名"
        width="100"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>学号: {{ scope.row.student.id }}</p>
            <p>姓名: {{ scope.row.student.name }}</p>
            <p>专业: {{ scope.row.student.profession }}</p>
            <p>班级: {{ scope.row.student.classNumber + "班" }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="small">{{ scope.row.student.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        label="答辩教师"
        width="100"
      >
        <template slot-scope="scope">
          <a
            @click="
              showDetailInfoDialog(
                teacherDetailInfo,
                arrangeData[
                  alterPage(arrangeCurrentPage, arrangePageSize, scope.$index)
                ].teacher1,
                teacherDetailInfoDialogVisible
              )
            "
            >{{ scope.row.teacher1.name }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        label="评审教师"
        width="100"
      >
        <template slot-scope="scope">
          <a
            @click="
              showDetailInfoDialog(
                teacherDetailInfo,
                arrangeData[
                  alterPage(arrangeCurrentPage, arrangePageSize, scope.$index)
                ].teacher2,
                teacherDetailInfoDialogVisible
              )
            "
            >{{ scope.row.teacher2.name }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        label="答辩时间"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.replyTime[0] }} <br />
          {{ scope.row.replyTime[1] }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :resizable="false"
        prop="place"
        label="答辩地点"
        min-width="100"
      ></el-table-column>
    </el-table>
    <div class="pagination" style="margin-top: 15px">
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
        teacher1: "",
        teacher2: "",
        place: "",
        replyTime: [],
      },
      arrangeCurrentPage: 1,
      arrangePageSize: 7,
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
      places: [],
      arrangeData: [
        {
          student: {
            id: "",
            name: "",
            profession: "",
            classNumber: "",
          },
          teacher1: {
            id: "",
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
          teacher2: {
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
          replyTime: ["2020-03-02 16:49:00", "2021-03-02 16:49:00"],
        },
      ],
      multipleSelection: "",
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
      // this.searchArrange-----------------------------------------------------------
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      console.log(val);
    },
    exportFile() {},
  },
  created() {
    this.arrangeData = [
      {
        student: {
          id: "1",
          name: "张三",
          profession: "计算机科学与技术",
          classNumber: 1,
        },
        teacher1: { id: "1", name: "李明", academicDegree: '博士学位', educationLevel: '博士' },
        teacher2: { id: "2", name: "李刚" },
        place: "28-A201",
        replyTime: [],
      },
      {
        student: {
          id: "2",
          name: "李四",
          profession: "计算机科学与技术",
          classNumber: 3,
        },
        teacher1: { id: "1", name: "李明", jobTitle: '副教授'},
        teacher2: { id: "3", name: "小红", tel: '13645879123'},
        place: "5-301",
        replyTime: [],
      },
      {
        student: {
          id: "3",
          name: "王二麻子",
          profession: "信息安全",
          classNumber: 1,
        },
        teacher1: { id: "4", name: "王强" },
        teacher2: { id: "3", name: "小红" },
        place: "28-A201",
        replyTime: [],
      },
      {
        student: {
          id: "4",
          name: "马六",
          profession: "物联网",
          classNumber: 1,
        },
        teacher1: { id: "1", name: "李明" },
        teacher2: { id: "4", name: "王强" },
        place: "28-A201",
        replyTime: [],
      },
      {
        student: {
          id: "5",
          name: "李四",
          profession: "信息安全",
          classNumber: 2,
        },
        teacher1: { id: "2", name: "李刚" },
        teacher2: { id: "5", name: "李刚" },
        place: "5-301",
        replyTime: [],
      },
      // "张三"'李四'王二麻子'"马六""李四"
      // "李明""李刚""小红""王强""李刚"
    ];
    this.places = ["28-A201", "5-301"];
    this.teachers = [
      {
        id: "1",
        name: "李明",
      },
      {
        id: "2",
        name: "李刚",
      },
      {
        id: "3",
        name: "小红",
      },
      {
        id: "4",
        name: "王强",
      },
      {
        id: "5",
        name: "李刚",
      },
    ];
    this.students = [
      {
        id: "1",
        name: "张三",
        class: "计算机科学与技术一班",
      },
      {
        id: "2",
        name: "李四",
        class: "计算机科学与技术三班",
      },
      {
        id: "3",
        name: "王二麻子",
        class: "信息安全一班",
      },
      {
        id: "4",
        name: "马六",
        class: "物联网一班",
      },
      {
        id: "5",
        name: "李四",
        class: "信息安全二班",
      },
    ];
  },
};
</script>

<style>
</style>
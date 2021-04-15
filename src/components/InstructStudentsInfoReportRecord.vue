<template>
  <el-table
    :data="reportRecord"
    style="width: 100%"
    height="435"
    class="instruct-student-info-report-record-table"
  >
    <el-table-column label="序号" type="index" width="50"></el-table-column>
    <el-table-column label="报告文件" min-width="250px" :resizable="false">
      <template slot-scope="scope">
        <a>{{ scope.row.file.name }}</a>
      </template></el-table-column
    >
    <el-table-column
      label="提交时间"
      width="150px"
      prop="dateTime"
      :resizable="false"
    ></el-table-column>
    <el-table-column
      label="评语"
      width="230px"
      :resizable="false"
      align="center"
      class-name="instruct-student-info-report-record-remark"
    >
      <template slot-scope="scope">
        <el-input
          type="textarea"
          v-model="scope.row.remark"
          resize="none"
          class="textarea-border-none"
        ></el-input>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      prop="state"
      width="120px"
      :resizable="false"
      align="center"
      class="flex-row-around"
    >
      <template slot-scope="scope">
        <div v-if="scope.row.approvalStatus == '已通过'">已通过</div>
        <div v-if="scope.row.approvalStatus == '已退回'">已退回</div>
        <div v-if="scope.row.approvalStatus == '未批阅'">
          <el-button
            type="text"
            style="color: #67c23a"
            @click="deal(scope.row, 'approvalStatus', '已通过')"
            >通过</el-button
          >
          <el-button
            type="text"
            style="color: #f56c6c"
            @click="deal(scope.row, 'approvalStatus', '已退回')"
            >退回</el-button
          >
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      reportRecord: [
        {
          file: {
            name: "20175308-张凤强-开题报告.doc",
            path: "",
          },
          dateTime: "2021-03-18 16:07:01",
          remark: "",
          approvalStatus: "已通过",
        },
        {
          file: {
            name: "20175308-张凤强-开题报告.doc",
            path: "",
          },
          dateTime: "2021-03-18 16:07:01",
          remark: "",
          approvalStatus: "未批阅",
        },
        {
          file: {
            name: "20175308-张凤强-开题报告.doc",
            path: "",
          },
          dateTime: "2021-03-18 16:07:01",
          remark: "",
          approvalStatus: "已退回",
        },
        {
          file: {
            name: "20175308-张凤强-开题报告.doc",
            path: "",
          },
          dateTime: "2021-03-18 16:07:01",
          remark: "",
          approvalStatus: "未批阅",
        },
      ],
    };
  },
  methods: {
    deal(reportRecord, approvalStatus, value) {
      //数据库修改 graduationProject可以获取id...-----------------------------------------------------------
      reportRecord[approvalStatus] = value;
      // 评语
    },
  },
};
</script>

<style>
.instruct-student-info-report-record-table .el-table__body tr,
.instruct-student-info-report-record-table .el-table__body td {
  height: 65px !important;
}
.instruct-student-info-report-record-remark textarea {
  height: 55px !important;
}
</style>
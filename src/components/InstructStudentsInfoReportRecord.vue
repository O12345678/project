<template>
  <div>
    <table class="customize-table" style="margin: 10px 0 20px">
      <tr>
        <td class="width160">{{ moduleName + "状态：" }}</td>
        <td class="width320">{{ status }}</td>
        <td class="width160">{{ moduleName + "文件:" }}</td>
        <td class="width320">
          <span v-show="status == '未定稿'">未定稿</span>
          <a
            v-show="status == '已确定'"
            :href="
              '/apis/FileDownloadServlet?path=' +
              encodeURI(report.path, 'utf-8') +
              '&fileName=' +
              encodeURI(moduleName + '.doc', 'utf-8')
            "
            >{{ moduleName + ".doc" }}</a
          >
        </td>
      </tr>
    </table>
    <el-table
      :data="reportRecord"
      style="width: 100%"
      height="370"
      class="instruct-student-info-report-record-table"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="报告文件" min-width="250px" :resizable="false">
        <template slot-scope="scope">
          <a
            style="white-space: nowrap"
            :href="
              '/apis/FileDownloadServlet?path=' +
              encodeURI(scope.row.path, 'utf-8') +
              '&fileName=' +
              encodeURI(scope.row.name, 'utf-8')
            "
            >{{ scope.row.name }}</a
          >
        </template></el-table-column
      >
      <el-table-column
        label="提交时间"
        width="150px"
        prop="submitTime"
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
            :readonly="scope.row.status != '未批阅' || !canDeal"
            resize="none"
            class="textarea-border-none"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120px"
        :resizable="false"
        align="center"
        class="flex-row-around"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status == '已确定'">已确定</div>
          <div v-if="scope.row.status == '已批阅'">已批阅</div>
          <div v-if="scope.row.status == '未批阅'">
            <el-button
              type="text"
              style="color: #67c23a"
              @click="deal(scope.row, '已确定')"
              :disabled="!canDeal"
              >通过</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="deal(scope.row, '已批阅')"
              :disabled="!canDeal"
              >退回</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { request } from "../network/request";
import Qs from "qs";
export default {
  data() {
    return {
      reportRecord: [],
      report: {
        id: null,
        path: null,
      },
      status: "",
      canDeal: true,
    };
  },
  props: {
    moduleName: String,
  },
  methods: {
    deal(report, value) {
      // 获取当前报告数据、修改数据库
      report.status = value;
      request(
        "/UpdateReportServlet",
        Qs.stringify({
          topicId: this.$store.state.instructStudentInfo.id,
          studentId: this.$store.state.instructStudentInfo.studentId,
          moduleName: this.moduleName,
          report: encodeURI(JSON.stringify(report), "utf-8"),
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.status = res.data.status;
          this.report =
            res.data.report == null
              ? {
                  id: null,
                  path: null,
                }
              : res.data.report;
          this.reportRecord = res.data.reportRecord;
          if (res.data.status == "已确定") {
            this.canDeal = false;
          } else if (
            res.data.endTime != null &&
            new Date(res.data.endTime) < new Date().getTime()
          ) {
            this.canDeal = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    "$store.state.instructStudentInfo": {
      handler(val, oldVal) {
        request(
          "/InstructStudentDetailInfoInitServlet",
          Qs.stringify({
            topicId: val.id,
            studentId: val.studentId,
            moduleName: this.moduleName,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.status = res.data.status;
            this.report =
              res.data.report == null
                ? {
                    id: null,
                    path: null,
                  }
                : res.data.report;
            this.reportRecord = res.data.reportRecord;
            if (res.data.status == "已确定") {
              this.canDeal = false;
            } else if (
              res.data.endTime != null &&
              new Date(res.data.endTime) < new Date().getTime()
            ) {
              this.canDeal = false;
            } else {
              this.canDeal = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      deep: true,
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
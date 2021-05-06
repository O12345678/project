<template>
  <el-tabs
    v-model="activeTab"
    type="border-card"
    class="instruct-students-info-root"
    @tab-click="handleTabClick"
    :before-leave="leaveTab"
  >
    <el-tab-pane name="任务书" style="height: 400px" class="flex-column-center">
      <span slot="label"
        ><i class="iconfont el-icon-renwushuxiazai"></i> 下发任务书</span
      >
      <div
        style="
          height: 220px;
          width: 360px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        "
      >
        <el-upload
          drag
          action="/apis/UploadTaskBookServlet"
          :data="extraData"
          :before-upload="handleBeforeUpload"
          :on-progress="handleUploadProgress"
          :on-error="handleUploadError"
          :on-success="handleUploadSuccess"
          :show-file-list="false"
          :disabled="taskBook.id != null"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将任务书文件拖到此处，或<em>点击上传</em>
            <section style="color: #f56c6c; margin-top: 5px">
              仅可上传一次且不可修改
            </section>
          </div>
        </el-upload>

        <a
          v-show="taskBook.id != null"
          style="
            height: 25px;
            color: #1296db;
            background-color: #f5f7fa;
            padding: 0 5px;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
          :href="
            '/apis/FileDownloadServlet?path=' +
            encodeURI(taskBook.path, 'utf-8') +
            '&fileName=' +
            encodeURI('任务书.doc', 'utf-8')
          "
          ><i class="el-icon-document" style="padding-right: 5px"></i>任务书</a
        >
      </div>
    </el-tab-pane>
    <el-tab-pane v-for="(item, index) in tabNames" :name="item" :key="index"
      ><span slot="label"
        ><i class="iconfont el-icon-kaitibaogao"></i> {{ item }}</span
      >
      <instruct-students-info-report-record
        :key="$store.state.instructStudentInfo.topicId"
        :moduleName="item"
      ></instruct-students-info-report-record>
    </el-tab-pane>
    <el-tab-pane label="评审" name="评审"
      ><span slot="label"
        ><i class="iconfont el-icon-pingshenhuizong"></i> 评审</span
      >
      <div>
        <div style="height: 35px" class="flex-row-between">
          <div style="width: 120px">
            成绩:
            <el-input-number
              :controls="false"
              v-model="grade"
              @input.native="onInput0_100"
              :min="0"
              :max="100"
              size="small"
              style="width: 80px"
            ></el-input-number>
          </div>
          <el-button type="primary" plain size="small" @click="submitReview"
            >提交</el-button
          >
        </div>
        <div style="margin: 15px 0 10px">评语:</div>
        <el-input
          type="textarea"
          v-model="remark"
          resize="none"
          class="instruct-students-info-remark"
        ></el-input>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import InstructStudentsInfoReportRecord from "../components/InstructStudentsInfoReportRecord.vue";
import { request } from "../network/request";
import Qs from "qs";
export default {
  components: {
    "instruct-students-info-report-record": InstructStudentsInfoReportRecord,
  },
  data() {
    return {
      activeTab: null,
      tabIcons: [
        "iconfont el-icon-kaitibaogao",
        "iconfont el-icon-zhongqijiancha",
        "iconfont el-icon-biyesheji",
        "iconfont el-icon-lunwen",
      ],
      tabNames: ["开题报告", "中期检查", "毕业设计", "毕业论文"],
      extraData: {
        teacherId: "",
        topicId: "",
      },
      taskBook: {
        id: null,
        path: "",
      },
      grade: undefined,
      remark: "",
    };
  },
  created() {},
  methods: {
    test() {},
    leaveTab(activeName, oldActiveName) {},
    handleTabClick(currentTab) {},
    onInput0_100(e) {
      this.$message.closeAll();
      if (e.target.value < 0 || e.target.value > 100) {
        this.$message.warning("只能输入0-100之间的数！");
      }
      e.target.value =
        (e.target.value >= 0 &&
          e.target.value <= 100 &&
          e.target.value.match(/^\d{1,3}(\.\d*)?$/)[0]) ||
        null;
    },
    handleBeforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      this.extraData.teacherId = this.$store.state.user.id;
      this.extraData.topicId = this.$store.state.instructStudentInfo.id;
      if (extension != "doc" && extension != "docx") {
        this.$message({
          showClose: true,
          message: "仅支持.doc或.docx文件！",
          type: "warning",
        });
        return false;
      }
    },
    handleUploadProgress(event, file, fileList) {},
    handleUploadError(err, file, fileList) {
      this.$message({
        showClose: true,
        message: "上传失败！",
        type: "error",
      });
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      this.$message({
        showClose: true,
        message: "上传成功",
        type: "success",
      });
      this.taskBook = response.taskBook;
    },
    submitReview() {
      if (
        this.grade == null ||
        this.grade == undefined ||
        this.remark.trim() == ""
      ) {
        this.$message({
          showClose: true,
          message: "成绩或评语不能为空！",
          type: "warning",
        });
      } else {
        request(
          "/SubmitReviewServlet",
          Qs.stringify({
            id: this.$store.state.user.id,
            role: "teacher",
            topicId: this.$store.state.instructStudentInfo.id,
            grade: this.grade,
            remark: encodeURI(this.remark, "utf-8"),
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            if (res.data.state) {
              this.$message({
                showClose: true,
                message: "提交成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "毕业设计尚未结束不能进行评审",
                type: "warning",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  watch: {
    "$store.state.instructStudentInfo": {
      handler(val, oldVal) {
        request(
          "/InstructStudentInfoInitServlet",
          Qs.stringify({
            topicId: val.id,
            studentId: val.studentId,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res); // progress status
            this.activeTab =
              res.data.progress == "选题" ? "任务书" : res.data.progress;
            this.grade = res.data.grade == null ? undefined : res.data.grade;
            this.remark = res.data.remark;
            this.taskBook =
              res.data.taskBook == null
                ? {
                    id: null,
                    path: "",
                  }
                : res.data.taskBook;
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
.instruct-students-info-root {
  width: 865px;
}
.instruct-students-info-remark textarea {
  height: 250px !important;
}
</style>
<template>
  <div>
    <div v-if="false" class="flex-column-center" style="height: 400px">
      <img src="../assets/img/notOpen.png" alt="" />
      <h3 style="margin-top: 50px">暂未开放</h3>
    </div>
    <div>
      <el-collapse-transition>
        <div v-show="topShow">
          <div>
            <div>
              <table class="customize-table">
                <tr>
                  <td class="width160">我的毕业设计题目:</td>
                  <td class="width320">
                    <a @click="topicDetailInfoDialogVisible.value = true">{{
                      $store.state.myTopic.name
                    }}</a>
                  </td>
                  <td class="width160">指导教师:</td>
                  <td class="width320">
                    <a @click="teacherDetailInfoDialogVisible.value = true">{{
                      $store.state.myTopic.teacher.name
                    }}</a>
                  </td>
                </tr>
              </table>
              <table style="margin-top: 20px" class="customize-table">
                <tr>
                  <td class="width160">
                    {{ $store.state.activeModule + "结束时间:" }}
                  </td>
                  <td class="width320">{{ moduleInfo.endTime }}</td>
                  <td class="width160">
                    {{ $store.state.activeModule + "状态:" }}
                  </td>
                  <td class="width320">{{ moduleInfo.status }}</td>
                </tr>
                <tr>
                  <td class="width160">
                    {{
                      $store.state.activeModule +
                      ($store.state.activeModule == "毕业设计"
                        ? "说明:"
                        : "模板:")
                    }}
                  </td>
                  <td class="width320">
                    <span v-if="moduleInfo.template == null">暂无</span>
                    <a
                      v-else
                      :href="
                        '/apis/FileDownloadServlet?path=' +
                        encodeURI(moduleInfo.template.path, 'utf-8') +
                        '&fileName=' +
                        encodeURI(
                          $store.state.userName +
                            '.' +
                            $store.state.activeModule +
                            '.doc',
                          'utf-8'
                        )
                      "
                      >{{
                        $store.state.userName + "." + $store.state.activeModule
                      }}</a
                    >
                  </td>
                  <td class="width160">
                    {{ "我的" + $store.state.activeModule + ":" }}
                  </td>
                  <td class="width320">
                    <a
                      v-if="moduleInfo.myReport != null"
                      :href="
                        '/apis/FileDownloadServlet?path=' +
                        encodeURI(moduleInfo.myReport.path, 'utf-8') +
                        '&fileName=' +
                        encodeURI($store.state.activeModule + ($store.state.activeModule == '毕业设计' ? '.zip' : '.doc'), 'utf-8')
                      "
                      >{{
                        $store.state.activeModule +
                        ($store.state.activeModule == "毕业设计"
                          ? ".zip"
                          : ".doc")
                      }}</a
                    >
                    <span v-else>未定稿</span>
                  </td>
                </tr>
              </table>
            </div>

            <div class="flex-row-around" style="height: 300px">
              <el-upload
                drag
                action="/apis/FileUploadServlet"
                :data="extraData"
                :before-upload="handleBeforeUpload"
                :on-progress="handleUploadProgress"
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :show-file-list="false"
                :disabled="
                  moduleInfo.status == '已确定' ||
                  new Date(moduleInfo.endTime) < new Date().getTime()
                "
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
            </div>
          </div>
          <h3 style="margin: 0; cursor: pointer" @click="topShow = false">
            提交记录
          </h3>
        </div>
      </el-collapse-transition>

      <div v-show="!topShow">
        <div class="flex-row-between">
          <h3 style="margin: 0" @click="topShow = false">提交记录</h3>
          <el-button
            type="primary"
            size="small"
            @click.native.prevent="topShow = true"
            >back
          </el-button>
        </div>
        <el-table :data="submitRecord" style="width: 100%" :height="406">
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column label="报告文件" width="250px" :resizable="false">
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
            width="200px"
            prop="submitTime"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            label="评语"
            min-width="250px"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                type="textarea"
                v-model="scope.row.remark"
                resize="none"
                class="textarea-border-none"
                :readonly="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            width="150px"
            :resizable="false"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <topic-detail-dialog
      :topicDetailInfo.sync="$store.state.myTopic"
      :topicDetailInfoDialogVisible.sync="topicDetailInfoDialogVisible"
    ></topic-detail-dialog>
    <teacher-detail-dialog
      :appendToBody="false"
      :teacherDetailInfo.sync="$store.state.myTeacher"
      :teacherDetailInfoDialogVisible.sync="teacherDetailInfoDialogVisible"
    ></teacher-detail-dialog>
  </div>
</template>

<script>
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import Vue from "vue";
Vue.component(CollapseTransition.name, CollapseTransition);
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import { request } from "../network/request";
import Qs from "qs";

export default {
  components: {
    "topic-detail-dialog": TopicDetailInfoDialog,
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      topShow: true,
      submitRecord: [
        {
          id: "",
          name: "",
          path: "",
          remark: "",
          status: "未批阅",
          submitTime: "",
          type: "",
        },
      ],
      extraData: {
        studentId: "",
        activeModule: "",
      },
      topicDetailInfoDialogVisible: {
        value: false,
      },
      teacherDetailInfoDialogVisible: {
        value: false,
      },
      moduleInfo: {
        endTime: "",
        status: "",
        template: null,
        myReport: null,
      },
    };
  },
  methods: {
    handleBeforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      this.extraData.studentId = this.$store.state.user.id;
      this.extraData.activeModule = this.$store.state.activeModule;
      if (
        this.$store.state.activeModule != "毕业设计" &&
        extension != "doc" &&
        extension != "docx"
      ) {
        this.$message({
          showClose: true,
          message: "仅支持.doc或.docx文件！",
          type: "warning",
        });
        return false;
      } else if (
        this.$store.state.activeModule == "毕业设计" &&
        extension != "zip"
      ) {
        this.$message({
          showClose: true,
          message: "仅支持.zip文件！",
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
      this.moduleInfo.status = response.status;
      this.moduleInfo.myReport = response.myReport;
      this.submitRecord = response.reportRecord;
      if (response.status == "已结束") {
        this.$message({
          showClose: true,
          message: "当前阶段已结束无法继续上传！",
          type: "warning",
        });
      } else if (response.status == "已确定")
        this.$message({
          showClose: true,
          message: "你的报告已确定无法继续上传！",
          type: "warning",
        });
      else {
        this.$message({
          showClose: true,
          message: "上传成功！",
          type: "success",
        });
      }
    },
  },
  props: {},
  watch: {
    "$store.state.activeModule": function (val, oldVal) {
      request(
        "/InitStudentPaneServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          activeModule: val,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.moduleInfo.endTime = res.data.endTime;
          this.moduleInfo.myReport = res.data.myReport;
          this.moduleInfo.status = res.data.status;
          this.moduleInfo.template = res.data.template;
          this.submitRecord = res.data.reportRecord;
          // 结束不可编辑，确认不可编辑
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};

// 上传，增加提交记录
// 点击修改
// 提交记录获取
</script>

<style>
</style>




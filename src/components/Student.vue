<template>
  <div class="root">
    <common-header></common-header>
    <div id="download"></div>
    <div class="common-body-column">
      <div class="student-top">
        <el-steps
          simple
          style="height: 40px; padding: 5px 40px"
          :process-status="processStatus"
          finish-status="success"
          :active="stepActive"
        >
          <el-step title="选题" icon="iconfont el-icon-xuanti"></el-step>
          <!-- <el-step
            title="任务书"
            icon="iconfont el-icon-renwushuxiazai"
          ></el-step> -->
          <el-step
            title="开题报告"
            icon="iconfont el-icon-kaitibaogao"
          ></el-step>
          <el-step
            title="中期检查"
            icon="iconfont el-icon-zhongqijiancha"
          ></el-step>
          <el-step title="毕业设计" icon="iconfont el-icon-biyesheji"></el-step>
          <el-step title="毕业论文" icon="iconfont el-icon-lunwen"></el-step>
          <el-step
            title="成绩查询"
            icon="iconfont el-icon-chengjichaxun"
          ></el-step>
        </el-steps>
      </div>
      <div class="student-bottom">
        <el-tabs
          tab-position="left"
          style="height: 450px"
          v-model="activeName"
          @tab-click="tabClick"
          :before-leave="leaveTab"
        >
          <el-tab-pane label="选题" name="选题" class="student-select">
            <el-collapse-transition>
              <div v-show="!topicShow">
                <div class="flex-row-between" style="margin-bottom: 20px">
                  题目:
                  <el-input
                    v-model="searchInfo.topic"
                    placeholder="请输入题目"
                    style="width: 250px"
                    size="small"
                    clearable
                  />
                  指导教师:
                  <el-select
                    clearable
                    v-model="searchInfo.teacher"
                    placeholder="请输入教师"
                    size="small"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in teachers"
                      :key="index"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                  状态:
                  <el-select
                    v-model="searchInfo.state"
                    placeholder="请选择状态"
                    size="small"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in states"
                      :key="index"
                      :value="item"
                      :label="item"
                    >
                    </el-option>
                  </el-select>
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 80px"
                    @click="searchTopic()"
                    >查询</el-button
                  >
                </div>
                <el-table
                  :data="
                    topicData.slice(
                      (selectCurrentPage - 1) * selectPageSize,
                      selectCurrentPage * selectPageSize
                    )
                  "
                  :height="361"
                  border
                  style="width: 100%"
                  size="medium"
                >
                  <el-table-column
                    type="index"
                    width="50px"
                    :resizable="false"
                    align="center"
                    label="序号"
                    ><template slot-scope="scope">
                      <span>{{
                        (selectCurrentPage - 1) * selectPageSize +
                        scope.$index +
                        1
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="题目"
                    min-width="250px"
                    :resizable="false"
                  >
                    <template slot-scope="scope">
                      <a
                        @click="
                          showDetailInfoDialog(
                            topicDetailInfo,
                            topicData[
                              alterPage(
                                selectCurrentPage,
                                selectPageSize,
                                scope.$index
                              )
                            ],
                            topicDetailInfoDialogVisible
                          )
                        "
                        >{{ scope.row.name }}</a
                      >
                    </template></el-table-column
                  >
                  <el-table-column
                    label="难度"
                    min-width="100px"
                    :resizable="false"
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.degreeOfDifficulty }}
                    </template></el-table-column
                  >
                  <el-table-column
                    label="指导教师"
                    width="150px"
                    :resizable="false"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <a
                        @click="
                          showDetailInfoDialog(
                            teacherDetailInfo,
                            topicData[
                              alterPage(
                                selectCurrentPage,
                                selectPageSize,
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
                  <el-table-column
                    label="状态"
                    width="150px"
                    :resizable="false"
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.state == "已确定"
                          ? "已确定"
                          : scope.row.selectNum >= scope.row.totalNum
                          ? "已满"
                          : scope.row.selectNum + "/" + scope.row.totalNum
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          select(
                            alterPage(
                              selectCurrentPage,
                              selectPageSize,
                              scope.$index
                            ),
                            scope.row
                          )
                        "
                        type="text"
                        size="small"
                        :disabled="
                          scope.row.selectNum >= scope.row.totalNum ||
                          !canChoice ||
                          scope.row.state == '已确定'
                        "
                      >
                        选择
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="student-select-pagination">
                  <h3 style="margin: 0" @click="topicShow = true">
                    我的已选题目
                  </h3>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="selectCurrentPage"
                    :page-size="7"
                    :page-sizes="[7, 10]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="topicData.length"
                    prev-text="上一页"
                    next-text="下一页"
                  >
                  </el-pagination>
                </div>
              </div>
            </el-collapse-transition>
            <div style="height: 400px" v-show="topicShow">
              <div class="flex-row-between">
                <h3 style="margin: 0">我的已选题目</h3>
                <el-button
                  type="success"
                  size="small"
                  @click.native.prevent="topicShow = false"
                  >继续选题
                </el-button>
              </div>
              <el-table :data="myChoiceTopicData" style="width: 100%">
                <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                ></el-table-column>
                <el-table-column
                  label="题目"
                  min-width="250px"
                  :resizable="false"
                >
                  <template slot-scope="scope">
                    <a
                      @click="
                        showDetailInfoDialog(
                          topicDetailInfo,
                          myChoiceTopicData[scope.$index],
                          topicDetailInfoDialogVisible
                        )
                      "
                      >{{ scope.row.name }}</a
                    >
                  </template></el-table-column
                >
                <el-table-column
                  label="难度"
                  min-width="100px"
                  :resizable="false"
                  align="center"
                >
                  <template slot-scope="scope">
                    {{ scope.row.degreeOfDifficulty }}
                  </template></el-table-column
                >
                <el-table-column
                  label="指导教师"
                  width="150px"
                  :resizable="false"
                  align="center"
                >
                  <template slot-scope="scope">
                    <a
                      @click="
                        showDetailInfoDialog(
                          teacherDetailInfo,
                          myChoiceTopicData[scope.$index].teacher,
                          teacherDetailInfoDialogVisible
                        )
                      "
                    >
                      {{ scope.row.teacher.name }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  width="150px"
                  :resizable="false"
                  align="center"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.state == "待处理"
                        ? "待处理"
                        : scope.row.state == "已确定"
                        ? "已确定"
                        : "未通过"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="remove(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      style="color: #f56c6c"
                      :disabled="!canOperate"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="任务书下载" name="任务书下载"> </el-tab-pane>
          <el-tab-pane label="开题报告" name="开题报告">
            <common-pane></common-pane>
          </el-tab-pane>
          <el-tab-pane label="中期检查" name="中期检查"
            ><common-pane></common-pane
          ></el-tab-pane>
          <el-tab-pane label="毕业设计" name="毕业设计"
            ><common-pane></common-pane
          ></el-tab-pane>
          <el-tab-pane label="毕业论文" name="毕业论文"
            ><common-pane></common-pane
          ></el-tab-pane>
          <el-tab-pane label="成绩查询" name="成绩查询">
            <table class="customize-table student-score-table">
              <thead>
                <tr>
                  <td>评委</td>
                  <td>评语</td>
                  <td>成绩占比</td>
                  <td>成绩</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    指导教师:
                    <a
                      @click="
                        showDetailInfoDialog(
                          teacherDetailInfo,
                          gradeTable.mentor,
                          teacherDetailInfoDialogVisible
                        )
                      "
                      >{{ gradeTable.mentor.name }}</a
                    >
                  </td>
                  <td>
                    <el-input
                      class="textarea-border-none student-score-table-remark"
                      type="textarea"
                      v-model="gradeTable.mentor.remark"
                      resize="none"
                      :readonly="true"
                    ></el-input>
                  </td>
                  <td>{{ gradeTable.mentor.gradePercentage + "%" }}</td>
                  <td>{{ gradeTable.mentor.score }}</td>
                </tr>
                <tr>
                  <td>
                    答辩教师:
                    <a
                      @click="
                        showDetailInfoDialog(
                          teacherDetailInfo,
                          gradeTable.replyTeacher,
                          teacherDetailInfoDialogVisible
                        )
                      "
                      >{{ gradeTable.replyTeacher.name }}</a
                    >
                  </td>
                  <td>
                    <el-input
                      class="textarea-border-none student-score-table-remark"
                      type="textarea"
                      v-model="gradeTable.replyTeacher.remark"
                      resize="none"
                      :readonly="true"
                    ></el-input>
                  </td>
                  <td>{{ gradeTable.replyTeacher.gradePercentage + "%" }}</td>
                  <td>{{ gradeTable.replyTeacher.score }}</td>
                </tr>
                <tr>
                  <td>
                    评审教师:
                    <a
                      @click="
                        showDetailInfoDialog(
                          teacherDetailInfo,
                          gradeTable.reviewTeacher,
                          teacherDetailInfoDialogVisible
                        )
                      "
                      >{{ gradeTable.reviewTeacher.name }}</a
                    >
                  </td>
                  <td>
                    <el-input
                      class="textarea-border-none student-score-table-remark"
                      type="textarea"
                      v-model="gradeTable.reviewTeacher.remark"
                      resize="none"
                      :readonly="true"
                    ></el-input>
                  </td>
                  <td>{{ gradeTable.reviewTeacher.gradePercentage + "%" }}</td>
                  <td>{{ gradeTable.reviewTeacher.score }}</td>
                </tr>
              </tbody>
            </table>
            <table class="customize-table student-totalgrade-tabel">
              <tr>
                <td>总成绩</td>
                <td>
                  {{
                    (gradeTable.reviewTeacher.gradePercentage *
                      gradeTable.reviewTeacher.score +
                      gradeTable.replyTeacher.score *
                        gradeTable.replyTeacher.gradePercentage +
                      gradeTable.mentor.gradePercentage *
                        gradeTable.mentor.score) /
                    100
                  }}
                </td>
                <td>等级评定</td>
                <td>{{ gradeTable.isExcellent }}</td>
                <td>是否优秀毕业设计</td>
                <td>{{ gradeTable.isExcellent }}</td>
              </tr>
            </table>
          </el-tab-pane>
        </el-tabs>
      </div>
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
import CommonHeader from "./CommonHeader.vue";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import Vue from "vue";
import StudentCommonPane from "./StudentCommonPane.vue";
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import { showDetailInfoDialog } from "../assets/js/utils.js";
import { alterPage } from "../assets/js/utils.js";
import { deepCopy } from "../assets/js/utils.js";
import { querySearchAsync } from "../assets/js/utils.js";
import { createStateFilter } from "../assets/js/utils.js";
import { request } from "../network/request";
import Qs from "qs";

Vue.component(CollapseTransition.name, CollapseTransition);

export default {
  components: {
    "common-header": CommonHeader,
    "common-pane": StudentCommonPane,
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
      processStatus: "finish",
      steps: [
        "选题",
        "开题报告",
        "中期检查",
        "毕业设计",
        "毕业论文",
        "成绩查询",
      ],
      tabNames: [
        "topicselect",
        "taskbook",
        "openreport",
        "midterminspection",
        "graduationproject",
        "graduationthesis",
        "resultinquiry",
      ],
      stepActive: -1,
      activeName: "选题",
      states: ["未满", "已满", "已确定"],
      topicData: [
        // 这里的topic是没有选过的
        {
          id: "",
          name: "",
          declaredYear: "",
          type: "",
          pattern: "",
          degreeOfDifficulty: "",
          content: "",
          require: "",
          selectNum: "",
          totalNum: 2,
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
          state: "",
        },
      ],
      myChoiceTopicData: [
        {
          id: "",
          name: "",
          declaredYear: "",
          type: "",
          pattern: "",
          degreeOfDifficulty: "",
          content: "",
          require: "",
          finalNumber: 1,
          selectNum: 0,
          totalNum: 0,
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
          state: "",
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
      searchInfo: {
        topic: "",
        teacher: "",
        state: "",
      },
      selectCurrentPage: 1,
      selectPageSize: 7,
      topicShow: false,
      canChoice: true,
      canOperate: true,
      gradeTable: {
        mentor: {
          id: "",
          name: "王强",
          faculty: "计算机科学与工程",
          jobTitle: "副教授",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
          remark:
            "城市交通污染物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计物扩散速度自动检测软件设计研究城市交通污染物扩散速度自动检测软件设计检测软件设计研究城市交通污染物扩散速度自动检测软件设计研究",
          gradePercentage: 20,
          score: 80,
        },
        replyTeacher: {
          id: "",
          name: "李刚",
          faculty: "",
          jobTitle: "",
          educationLevel: "本科",
          academicDegree: "学士学位",
          tel: "",
          email: "",
          remark: "",
          gradePercentage: 30,
          score: 85,
        },
        reviewTeacher: {
          id: "",
          name: "李中冰",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "13678945612",
          email: "",
          remark: "",
          gradePercentage: 50,
          score: 80,
        },
        isExcellent: "否",
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
      this.selectPageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.selectCurrentPage = currentPage;
    },
    leaveTab(activeName, oldActiveName) {
      if (activeName == "任务书下载") {
        request(
          "/QueryTaskbookStateServlet",
          Qs.stringify({
            studentId: this.$store.state.user.id,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            if (res.data.studentStatus == "不合格") {
              this.$message({
                showClose: true,
                message: "你的毕业设计被判定为不合格无法继续完成！",
                type: "error",
              });
            } else if (
              res.data.endTime == null ||
              new Date(res.data.endTime) > new Date().getTime()
            ) {
              this.$message({
                showClose: true,
                message: "选题阶段尚未结束！",
                type: "warning",
              });
            } else if (res.data.path == null) {
              this.$message({
                showClose: true,
                message: "指导教师尚未下发任务书！",
                type: "warning",
              });
            } else {
              const tabTaskbook = document.getElementById("download");
              const a = document.createElement("a");
              // a.style.display = "none";
              a.href = "testapis/TestServlet?path=" + encodeURI(res.data.path);
              tabTaskbook.appendChild(a);
              a.onclick = function (e) {
                e.stopPropagation();
              };
              a.click(); //点击下载
              tabTaskbook.removeChild(a);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return false;
      } else if (activeName == "成绩查询") {
        return request(
          "/QueryGradequiryStateServlet",
          Qs.stringify({
            studentId: this.$store.state.user.id,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        ).then((res) => {
          if (res.data.studentStatus == "不合格") {
            this.$message({
              showClose: true,
              message: "你的毕业设计被判定为不合格无法继续完成！",
              type: "error",
            });
            return Promise.reject("");
          } else if (res.data.studentStatus == "未完成") {
            this.$message({
              showClose: true,
              message: "请先完成" + res.data.studentSchedule + "模块！",
              type: "warning",
            });
            return Promise.reject("");
          } else if (
            res.data.endTime == null ||
            new Date(res.data.endTime) > new Date().getTime()
          ) {
            this.$message({
              showClose: true,
              message: activeName + "模块暂未开放！",
              type: "warning",
            });
            return Promise.reject("");
          } else {
            // 获取信息
          }
        });
      } else if (activeName == "选题") {
      } else {
        return request(
          "/QueryCurrentModuleOpenStateServlet",
          Qs.stringify({
            studentId: this.$store.state.user.id,
            moduleName: activeName,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        ).then((res) => {
          if (res.data.studentStatus == "不合格") {
            this.$message({
              showClose: true,
              message: "你的毕业设计被判定为不合格无法继续完成！",
              type: "error",
            });
            return Promise.reject("");
          } else if (
            this.steps.indexOf(activeName) >
              this.steps.indexOf(res.data.studentSchedule) &&
            res.data.studentStatus == "未完成"
          ) {
            this.$message({
              showClose: true,
              message: "请先完成" + res.data.studentSchedule + "模块！",
              type: "warning",
            });
            return Promise.reject("");
          } else if (
            res.data.startTime == null ||
            new Date(res.data.startTime) > new Date().getTime()
          ) {
            this.$message({
              showClose: true,
              message: activeName + "模块暂未开放！",
              type: "warning",
            });
            return Promise.reject("");
          } else {
            // 获取信息
            console.log("获取信息！");
              this.$store.commit({
                type: "updateActiveModule",
                activeModule: activeName,
              });
            
          }
        });
      }
    },
    tabClick(tab) {
      // 数据库查询开始时间，结束时间 直接赋值给activeModule
    },
    searchTopic() {
      request(
        "/QueryTopicMyChoiceTopicDataServlet",
        Qs.stringify({
          studentId: this.$store.state.user.id,
          topicName: this.searchInfo.topic,
          teacherName: this.searchInfo.teacher,
          state: this.searchInfo.state,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.topicData = res.data.topicData;
          this.myChoiceTopicData = res.data.myChoiceTopicData;
          if (res.data.studentState == "已确定") {
            this.canChoice = false;
            this.canOperate = false;
          } else if (res.data.studentState == "不可选") {
            this.canChoice = false;
          } else if (res.data.studentState == "可选") {
            this.canChoice = true;
            this.canOperate = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    select(index, row) {
      console.log(row);
      request(
        "/UpdateChooseTopicServlet",
        Qs.stringify({
          topicId: row.id,
          studentId: this.$store.state.user.id,
          topicName: this.searchInfo.topic,
          teacherName: this.searchInfo.teacher,
          state: this.searchInfo.state,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.topicData = res.data.topicData;
          this.myChoiceTopicData = res.data.myChoiceTopicData;
          if (res.data.studentState == "已确定") {
            this.canChoice = false;
            this.canOperate = false;
            this.$message({
              showClose: true,
              message: "选题已确定无法继续选题",
              type: "warning",
            });
          } else if (res.data.studentState == "不可选") {
            this.canChoice = false;
          } else if (res.data.studentState == "可选") {
            this.canChoice = true;
            this.canOperate = true;
          }
          if (res.data.chooseTopicState == "已满") {
            this.$message({
              showClose: true,
              message: "该题目所选人数已达上限！",
              type: "warning",
            });
          } else if (res.data.chooseTopicState == "已被选") {
            this.$message({
              showClose: true,
              message: "该题目已确定无法进行选题",
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // 查找数据库看是否满人
      // if( 满人 ) {
      // this.topicData=数据库查询
      //       return ;
      // }
      // else {
      // 数据库向选题表插入 this.topicData[index],   .state = "未审核";
      // 数据修改 selectNum
      // 数据库返回我未选的所有题目和所有我选的题目
      // if (this.myChoiceTopicData.length >= stuMaxSelectNum) {
      //   this.canChoice = false;
      // }
      // }
    },
    remove(index, row) {
      // 数据库删除我的已选题目
      // 数据库返回我未选的所有题目和所有我选的题目
      request(
        "/DeleteChooseTopicServlet",
        Qs.stringify({
          topicId: row.id,
          studentId: this.$store.state.user.id,
          topicName: this.searchInfo.topic,
          teacherName: this.searchInfo.teacher,
          state: this.searchInfo.state,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.topicData = res.data.topicData;
          this.myChoiceTopicData = res.data.myChoiceTopicData;
          if (res.data.studentState == "已确定") {
            this.canChoice = false;
            this.canOperate = false;
            this.$message({
              showClose: true,
              message: "你的选题已确定无法进行删除操作！",
              type: "warning",
            });
          } else if (res.data.studentState == "不可选") {
            this.canChoice = false;
          } else if (res.data.studentState == "可选") {
            this.canChoice = true;
            this.canOperate = true;
          }
          if (
            res.data.topicState == "已确定" ||
            res.data.topicState == "未通过"
          ) {
            this.canChoice = false;
            this.canOperate = false;
            this.$message({
              showClose: true,
              message: "选题" + res.data.topicState + "无法进行删除操作！",
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    request(
      "/StudentInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id"),
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        this.topicData = res.data.topicData;
        this.myChoiceTopicData = res.data.myChoiceTopicData;
        this.stepActive = this.steps.indexOf(res.data.studentSchedule); 
        this.processStatus = res.data.studentStatus == '不合格' ? "error" : "finish"
        this.activeName = res.data.studentSchedule == null ? '选题' : res.data.studentSchedule;
        if (res.data.studentState == "已确定") {
          this.canChoice = false;
          this.canOperate = false;
        } else if (res.data.studentState == "不可选") {
          this.canChoice = false;
        } else if (res.data.studentState == "可选") {
          this.canChoice = true;
          this.canOperate = true;
        }
        if (
          res.data.startTime == null ||
          new Date(res.data.startTime) > new Date().getTime()
        ) {
          this.canChoice = false;
        } else if (
          res.data.endTime == null ||
          new Date(res.data.endTime) < new Date().getTime()
        ) {
          this.canChoice = false;
          this.canOperate = false;
        }
        this.teachers = res.data.teachers;
        this.$store.commit({
          type: "updateUserName",
          newName: res.data.information.name,
        });
        this.$store.commit({
          type: "updateUser",
          newUser: {
            id: res.data.information.id,
            password: res.data.information.password,
            role: "student",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // 这里是数据库不用担心引用问题
    // this.$store.commit({
    //   type: "updateMyTopic",
    //   newMyTopic: {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     finalNumber: 1,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       jobTitle: "副教授",
    //       faculty: "",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    // });
    // this.teachers = [
    //   {
    //     id: "1",
    //     name: "李明",
    //   },
    //   {
    //     id: "2",
    //     name: "李刚",
    //   },
    //   {
    //     id: "3",
    //     name: "小红",
    //   },
    //   {
    //     id: "4",
    //     name: "王强",
    //   },
    //   {
    //     id: "5",
    //     name: "李刚",
    //   },
    // ];
    // this.topicData = [
    //   {
    //     id: "1",
    //     name: "基于PVDF压电薄膜的动态称重系统的研发",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "1",
    //       name: "林玟书",
    //       jobTitle: "讲师",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "本科",
    //       academicDegree: "学士学位",
    //       tel: "12345678960",
    //       email: "12345678960@qq.com",
    //     },
    //   },
    //   {
    //     id: "2",
    //     name: "智能快递分拣系统设计",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "2",
    //       name: "林国瑞",
    //       jobTitle: "副教授",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "博士",
    //       academicDegree: "博士学位",
    //       tel: "",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "3",
    //     name: "城市交通污染物扩散速度自动检测软件设计研究",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "较难 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 2,
    //     totalNum: 2,
    //     teacher: {
    //       id: "3",
    //       name: "张吉惟",
    //       jobTitle: "教授",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "",
    //       email: "12345678@qq.com",
    //     },
    //   },
    //   {
    //     id: "4",
    //     name: "风光互补路灯控制器的设计",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "4",
    //       name: "黎明",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "教授",
    //       educationLevel: "博士",
    //       academicDegree: "博士学位",
    //       tel: "15864793250",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "5",
    //     name: "基于数据挖掘技术的电力调度系统设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "5",
    //       name: "王明",
    //       jobTitle: "讲师",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "13645879123",
    //       email: "wm123@163.com",
    //     },
    //   },
    //   {
    //     id: "6",
    //     name: "基于移动互联网的办公自动化系统设计",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 2,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       jobTitle: "副教授",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //     state: "已确定",
    //   },
    //   {
    //     id: "7",
    //     name: "基于云计算的酒店信息化管理系统建设",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "7",
    //       name: "黄文隆",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "教授",
    //       educationLevel: "博士",
    //       academicDegree: "博士学位",
    //       tel: "15678941230",
    //       email: "hwl15678941230@163.com",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    // ];
    // this.$store.commit({
    //   type: "updateMyTopic",
    //   newTopic: {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    // });
    // this.$store.commit({
    //   type: "updateMyTeacher",
    //   newTeacher: {
    //     id: "6",
    //     name: "李中冰",
    //     faculty: "计算机科学与工程学院",
    //     jobTitle: "副教授",
    //     educationLevel: "硕士",
    //     academicDegree: "硕士学位",
    //     tel: "18845796321",
    //     email: "",
    //   },
    // });
  },
};
</script>

<style>
.student-top {
  width: 100%;
  height: 50px;
}
.el-tabs__content {
  padding-left: 10px;
}

.student-bottom {
  height: 450px;
}
.student-select {
  height: 450px;
  /* overflow: auto; */
}
.student-select::-webkit-scrollbar {
  width: 1px !important;
}
.student-select-pagination {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}
.student-select-pagination h3:hover {
  cursor: pointer;
}
.student-score-table thead td {
  font-weight: 700;
}

.student-score-table thead td:nth-child(2) {
  text-align: center;
}
.student-score-table td:first-child {
  width: 200px;
}
.student-score-table td:nth-child(2) {
  width: 480px;
  padding: 0;
}

.student-score-table td:nth-child(3),
.student-score-table td:nth-child(4) {
  width: 150px;
  text-align: center;
}
.student-score-table-remark textarea {
  height: 90px !important;
}
.student-totalgrade-tabel {
  margin-top: 50px;
}
.student-totalgrade-tabel td {
  width: 163px;
}
.student-totalgrade-tabel td:nth-child(even) {
  text-align: center;
}
</style>






























































































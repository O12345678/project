<template>
  <div class="select-topic-info-root">
    <div
      class="flex-column-center"
      style="height: 500px"
      v-if="isUndefined || (info.newTopic != null && info.newTopic)"
    >
      <img src="../assets/img/noinformation.png" alt="" />
      <h4>暂无题目信息</h4>
    </div>
    <div v-else class="flex-row-between">
      <table class="customize-table select-top-info-table">
        <thead>
          <th colspan="4" style="height: 45px">
            <section class="flex-row-between">
              <el-input
                class="select-top-info-table-edit-input"
                v-model="info.name"
                v-if="canEdit"
                style="width: 450px"
                size="small"
              ></el-input>
              <!-- -->
              <span v-else>{{ "课题:" + info.name + "详细信息" }}</span>
              <el-button-group v-if="canEdit">
                <!---->
                <el-button
                  class="select-top-info-table-button"
                  type="success"
                  plain
                  size="mini"
                  @click="submitEdit"
                  icon="iconfont el-icon-queren"
                  >确认</el-button
                >
                <el-button
                  class="select-top-info-table-button"
                  type="danger"
                  plain
                  size="mini"
                  @click="quitEdit"
                  icon="iconfont el-icon-quxiao"
                  >取消</el-button
                ></el-button-group
              >
            </section>
          </th>
        </thead>
        <tr>
          <td class="width150">申报学年:</td>
          <td class="width160">
            <el-select
              v-if="canEdit"
              size="mini"
              v-model="info.declaredYear"
              placeholder="请选择类型"
            >
              <el-option
                v-for="(item, index) in declaredYears"
                :key="index"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else>{{ info.declaredYear }}</span>
          </td>
          <td class="width150">指导教师:</td>
          <td class="width160">
            {{ $store.state.teacherMyInfo.name }}
          </td>
        </tr>
        <tr>
          <td class="width150">可带学生数:</td>
          <td class="width160">{{ info.finalNumber }}</td>
          <td class="width150">选题模式:</td>
          <td class="width160">
            <el-select
              v-if="canEdit"
              size="mini"
              v-model="info.pattern"
              placeholder="请选择模式"
            >
              <el-option
                v-for="(item, index) in patterns"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else>{{ info.pattern }}</span>
          </td>
        </tr>
        <tr>
          <td class="width150">课题类型:</td>
          <td class="width160">
            <el-select
              v-if="canEdit"
              size="mini"
              v-model="info.type"
              placeholder="请选择类型"
            >
              <el-option
                v-for="(item, index) in types"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else>{{ info.type }}</span>
          </td>
          <td class="width150">难度:</td>
          <td class="width160">
            <el-select
              v-if="canEdit"
              size="mini"
              v-model="info.degreeOfDifficulty"
              placeholder="请选择难度"
            >
              <el-option
                v-for="(item, index) in degreeOfDifficulties"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else>{{ info.degreeOfDifficulty }}</span>
          </td>
        </tr>
        <tr>
          <td class="width150">课题内容介绍</td>
          <td colspan="3" style="width: 480px; height: 180px; padding: 0">
            <el-input
              class="select-topic-info-table-textarea"
              :class="{ 'textarea-border-none': !canEdit }"
              type="textarea"
              v-model="info.content"
              resize="none"
              :readonly="!canEdit"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td class="width150">毕业设计论文要求:</td>
          <td colspan="3" style="width: 480px; height: 180px; padding: 0">
            <el-input
              class="select-topic-info-table-textarea"
              :class="{ 'textarea-border-none': !canEdit }"
              type="textarea"
              v-model="info.require"
              resize="none"
              :readonly="!canEdit"
            ></el-input>
          </td>
        </tr>
      </table>
      <aside class="select-topic-info-right-aside">
        <fieldset class="common-fieldset" key="checkInfo">
          <legend class="common-lengend">审核信息</legend>
          <div class="select-topic-info-fieldset-body" style="height: 190px">
            <span
              >审核状态:
              {{ info.reviewer == null ? "暂无" : info.approvalStatus }}</span
            >
            <span
              >审核人:{{ info.reviewer == null ? "暂无" : info.reviewer }}</span
            >
            <span>评语:</span>
            <el-input
              class="select-topic-info-fieldset-textarea"
              type="textarea"
              v-model="info.remark"
              resize="none"
              :readonly="true"
            ></el-input>
          </div>
        </fieldset>
        <fieldset
          class="common-fieldset select-topic-info-select-student"
          key="selectStudentInfo"
        >
          <legend class="common-lengend">已选学生</legend>
          <div class="select-topic-info-fieldset-body" style="height: 210px">
            <el-table
              :data="selectStudents"
              height="160"
              border
              style="width: 194px"
              size="medium"
            >
              <el-table-column
                min-width="80px"
                :resizable="false"
                label="学生姓名"
                prop="studentName"
              >
              </el-table-column>
              <el-table-column
                width="80px"
                :resizable="false"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.state == '已确定'">已确定</div>
                  <div v-else-if="scope.row.state == '未通过'">未通过</div>
                  <div v-else-if="scope.row.state == '已被其他教师选择'">
                    已被其他教师选择
                  </div>
                  <div
                    v-else-if="scope.row.state == '待处理'"
                    class="flex-row-around"
                  >
                    <el-button
                      type="text"
                      style="color: #67c23a; font-size: 10px"
                      @click="deal(scope.row, 'state', '已确定')"
                      >通过</el-button
                    >
                    <el-button
                      type="text"
                      style="color: #f56c6c; font-size: 10px"
                      @click="deal(scope.row, 'state', '未通过')"
                      >退回</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </fieldset>
      </aside>
    </div>
  </div>
</template>

<script>
import { deepCopy } from "../assets/js/utils";
import { request } from "../network/request";
import Qs from "qs";

export default {
  data() {
    return {
      selectStudents: [],
      info: {
        id: "",
        name: "",
        declaredYear: "",
        type: "",
        pattern: "",
        degreeOfDifficulty: "",
        content: "",
        require: "",
        finalNumber: 1,
        teacher: "",
        approvalStatus: "",
        remark: "",
        reviewer: null,
        newTopic: true,
      },
      isUndefined: false,
      degreeOfDifficulties: ["简单", "适中", "难"],
      types: ["设计"],
      patterns: ["学生自选"],
      declaredYears: [
        new Date().getFullYear() - 1 + "-" + new Date().getFullYear(),
        new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      ],
    };
  },
  props: {
    selectTopicInfo: Object,
    canEdit: Boolean,
    canDealTopic: Boolean
  },
  methods: {
    deepCopy,
    submitEdit() {
      this.$emit("update:canEdit", false);
      request(
        "/UpdateSelectTopicServlet",
        encodeURI(
          Qs.stringify({
            id: this.$store.state.user.id,
            topic: JSON.stringify(this.info),
          }),
          "utf-8"
        ),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          if( res.data.state == "已结束") {
            this.$message({
              message: "选题阶段已结束！",
              type: "warning",
            });
            this.$emit("update:canDealTopic", false);
          }
          else if (res.data.state == "已通过") {
            this.$message({
              message: "题目已通过无法进行修改！",
              type: "warning",
            });
          }
          this.$emit("update:selectTopicInfo", res.data.selectTopic);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    quitEdit() {
      this.$emit("update:canEdit", false);
      deepCopy(this.info, this.selectTopicInfo);
    },
    deal(selectStudent, state, value) {
      request(
        "/UpdateSelectStudentServlet",
        Qs.stringify({
          studentId: selectStudent.studentId,
          topicId: this.info.id,
          state: value,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          if( res.data.moduleState != null && res.data.moduleState == '已结束') {
            this.$message({
              message: "选题阶段已结束！",
              type: "warning",
            });
            this.$emit("update:canDealTopic", false);
          }
          else if(res.data.topicState != null && res.data.topicState == "已删除") {
            this.$message({
              showClose: true,
              message: "该课题已被学生取消选择无法执行操作！",
              type: "warning",
            });
          }
          else if(res.data.studentState != null && res.data.studentState == "已确定") {
            this.$message({
              showClose: true,
              message: "该学生已被其他教师确定无法执行操作！",
              type: "warning",
            });
          }

          this.selectStudents = res.data.selectStudents
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    selectTopicInfo: {
      handler(val, oldVal) {
        if (val == undefined) {
          console.log("--undefined--");
          this.isUndefined = true;
        } else {
          this.isUndefined = false;
          deepCopy(this.info, val);
          request(
            "/QuerySelectStudentServlet",
            Qs.stringify({
              topicId: val.id,
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
              this.selectStudents = res.data.selectStudents;
              if( res.data.flag ) {
                this.$emit("update:canDealTopic", false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("--noundefined--");
        }
      },
      deep: true,
    },
    canEdit: {
      handler(val, oldVal) {
        if (val == false) {
          deepCopy(this.info, this.selectTopicInfo);
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
.select-topic-info-root {
  width: 865px;
}
.select-topic-info-right-aside {
  width: 220px;
  height: 510px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: bisque; */
}
.select-topic-info-table-textarea textarea {
  height: 180px !important;
}
.select-top-info-table-edit-input input {
  padding: 0 5px 0;
}
.select-top-info-table-button {
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.select-topic-info-fieldset-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.select-topic-info-select-student .el-table__header tr,
.select-topic-info-select-student .el-table__header th {
  height: 30px !important;
}

.select-topic-info-select-student .el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0px;
}

.select-topic-info-fieldset-textarea textarea {
  height: 130px !important;
}
</style>
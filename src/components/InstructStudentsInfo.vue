<template>
  <el-tabs
    v-model="activeTab"
    type="border-card"
    class="instruct-students-info-root"
    @tab-click="handleTabClick"
    :before-leave="leaveTab"
  >
    <el-tab-pane
      name="taskbook"
      style="height: 400px"
      class="flex-column-center"
    >
      <span slot="label"
        ><i class="iconfont el-icon-renwushuxiazai"></i> 下发任务书</span
      >
      <div class="flex-row-around" style="height: 300px">
        <el-upload drag action="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将任务书文件拖到此处，或<em>点击上传</em>
            <section style="color: #f56c6c; margin-top: 5px">
              仅可上传一次且不可修改
            </section>
          </div>
        </el-upload>
      </div>
    </el-tab-pane>
    <el-tab-pane name="openreport"
      ><span slot="label"
        ><i class="iconfont el-icon-kaitibaogao"></i> 开题报告</span
      >
      <instruct-students-info-report-record></instruct-students-info-report-record>
    </el-tab-pane>
    <el-tab-pane name="midterminspection"
      ><span slot="label"
        ><i class="iconfont el-icon-zhongqijiancha"></i> 中期检查</span
      >
      <instruct-students-info-report-record></instruct-students-info-report-record>
    </el-tab-pane>
    <el-tab-pane label="毕业设计" name="graduation project"
      ><span slot="label"
        ><i class="iconfont el-icon-biyesheji"></i> 毕业设计</span
      >
      <instruct-students-info-report-record></instruct-students-info-report-record>
    </el-tab-pane>
    <el-tab-pane label="毕业论文" name="graduationthesis"
      ><span slot="label"
        ><i class="iconfont el-icon-lunwen"></i> 毕业论文</span
      >
      <instruct-students-info-report-record></instruct-students-info-report-record>
    </el-tab-pane>
    <el-tab-pane label="评审" name="review"
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
          <el-button type="primary" plain size="small">提交</el-button>
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
export default {
  components: {
    "instruct-students-info-report-record": InstructStudentsInfoReportRecord,
  },
  data() {
    return {
      activeTab: "taskbook",
      grade: -1,
      remark: "",
    };
  },
  methods: {
    test() {},
    leaveTab(activeName, oldActiveName) {},
    handleTabClick(currentTab) {
      console.log(currentTab.name);
    },
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
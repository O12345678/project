<template>
  <el-dialog
    :title="'课题: ' + topicDetailInfo.name + '的详细信息'"
    :visible.sync="isShow.value"
    custom-class="topic-detail-info"
    @close="close"
  >
    <table class="customize-table dialog-topic-table">
      <tr>
        <td class="width150">申报学年:</td>
        <td class="width180">{{ topicDetailInfo.declaredYear }}</td>
        <td class="width150">指导教师:</td>
        <td class="width180">
          <a @click="teacherDetailInfoDialogVisible.value = true">{{
            topicDetailInfo.teacher.name
          }}</a>
        </td>
      </tr>
      <tr>
        <td class="width150">可带学生数:</td>
        <td class="width180">{{ topicDetailInfo.finalNumber }}</td>
        <td class="width150">选题模式:</td>
        <td class="width180">{{ topicDetailInfo.pattern }}</td>
      </tr>
      <tr>
        <td class="width150">课题类型:</td>
        <td class="width180">{{ topicDetailInfo.type }}</td>
        <td class="width150">难度:</td>
        <td class="width180">{{ topicDetailInfo.degreeOfDifficulty }}</td>
      </tr>
      <tr>
        <td class="width150">课题内容介绍</td>
        <td colspan="3" style="width: 480px; height: 180px; padding: 0">
          <el-input
            class="textarea-border-none"
            type="textarea"
            v-model="topicDetailInfo.content"
            resize="none"
            :readonly="true"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td class="width150">毕业设计论文要求:</td>
        <td colspan="3" style="width: 480px; height: 180px; padding: 0">
          <el-input
            class="textarea-border-none"
            type="textarea"
            v-model="topicDetailInfo.require"
            resize="none"
            :readonly="true"
          ></el-input>
        </td>
      </tr>
    </table>
    <teacher-detail-dialog
      :appendToBody="true"
      :teacherDetailInfo.sync="topicDetailInfo.teacher"
      :teacherDetailInfoDialogVisible.sync="teacherDetailInfoDialogVisible"
    ></teacher-detail-dialog>
  </el-dialog>
</template>

<script>
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import { deepCopy } from "../assets/js/utils.js";
export default {
  components: {
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      tempShow: {
        value: false
      },
      isShow: {
        value: false,
      },
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
      teacherDetailInfoDialogVisible: {
        value: false,
      },
    };
  },
  props: {
    topicDetailInfo: Object,
    topicDetailInfoDialogVisible: Object,
  },
  methods: {
    close() {
      deepCopy(this.tempShow, this.isShow)
      this.$emit("update:topicDetailInfoDialogVisible", this.tempShow);
    },
  },
  watch: {
    topicDetailInfoDialogVisible: {
      handler(val, oldVal) {
        deepCopy(this.isShow, val);
      },
      deep: true,
    }
  },
};
</script>

<style>
.topic-detail-info {
  height: 560px;
  width: 680px;
  margin-top: 20px !important;
}
.dialog-topic-table textarea {
  height: 180px !important;
}
.width150 {
  width: 150px;
}
.width180 {
  width: 180px;
}
.topic-detail-info .el-dialog__body {
  padding-top: 10px;
}
</style>
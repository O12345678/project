<template>
  <el-dialog
    :title="'课题: ' + info.name + '的详细信息'"
    :visible.sync="isShow.value"
    custom-class="topic-detail-info"
    @close="close"
  >
    <table class="customize-table dialog-topic-table">
      <tr>
        <td class="width150">申报学年:</td>
        <td class="width180">{{ info.declaredYear }}</td>
        <td class="width150">指导教师:</td>
        <td class="width180">
          <a @click="teacherDetailInfoDialogVisible.value = true">{{ info.teacher.name }}</a>
        </td>
      </tr>
      <tr>
        <td class="width150">可带学生数:</td>
        <td class="width180">{{ info.finalNumber }}</td>
        <td class="width150">选题模式:</td>
        <td class="width180">{{ info.pattern }}</td>
      </tr>
      <tr>
        <td class="width150">课题类型:</td>
        <td class="width180">{{ info.type }}</td>
        <td class="width150">难度:</td>
        <td class="width180">{{ info.degreeOfDifficulty }}</td>
      </tr>
      <tr>
        <td class="width150">课题内容介绍</td>
        <td colspan="3" style="width: 480px; height: 180px; padding: 0">
          <el-input
          class="textarea-border-none"
            type="textarea"
            v-model="info.content"
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
            v-model="info.require"
            resize="none"
            :readonly="true"
          ></el-input>
        </td>
      </tr>
    </table>
    <teacher-detail-dialog
      :appendToBody="true"
      :teacherDetailInfo.sync="info.teacher"
      :teacherDetailInfoDialogVisible.sync="teacherDetailInfoDialogVisible"
    ></teacher-detail-dialog>
  </el-dialog>
</template>

<script>
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
export default {
  components: {
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      isShow: this.topicDetailInfoDialogVisible,
      info: this.topicDetailInfo,
      teacherDetailInfoDialogVisible: {
        value: false
      }
    };
  },
  props: {
    topicDetailInfo: Object,
    topicDetailInfoDialogVisible: Object,
  },
  methods: {
    close() {
      this.$emit("update:topicDetailInfoDialogVisible", this.isShow);
    },
  },
  watch: {
    topicDetailInfoDialogVisible: {
      handler(val, oldVal) {
        this.isShow = val;
      },
      deep: true,
    },
    topicDetailInfo: {
      handler(val, oldVal) {
        this.info = val;
      },
      deep: true,
    },
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
.el-dialog__body {
  padding-top: 10px;
}
</style>
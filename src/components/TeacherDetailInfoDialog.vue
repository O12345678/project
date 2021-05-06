<template>
  <el-dialog
    :append-to-body="appendToBody"
    :title="'教师' + teacherDetailInfo.name + '的详细信息'"
    :visible.sync="isShow.value"
    custom-class="teacher-detail-info"
    @close="close"
  >
    <table class="customize-table dialog-teacher-table">
      <tr>
        <td>所属院系:</td>
        <td>{{ teacherDetailInfo.faculty }}</td>
        <td>职称:</td>
        <td>{{ teacherDetailInfo.jobTitle }}</td>
      </tr>
      <tr>
        <td>文化程度:</td>
        <td>{{ teacherDetailInfo.educationLevel }}</td>
        <td>学位:</td>
        <td>{{ teacherDetailInfo.academicDegree }}</td>
      </tr>
      <tr>
        <td>联系方式:</td>
        <td>{{ teacherDetailInfo.tel }}</td>
        <td>邮箱:</td>
        <td>{{ teacherDetailInfo.email }}</td>
      </tr>
    </table>
  </el-dialog>
</template>

<script>
import { deepCopy } from "../assets/js/utils.js";
export default {
  data() {
    return {
      tempShow: {
        value: false,
      },
      isShow: {
        value: false,
      },
      info: {
        id: "",
        name: "",
        faculty: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      },
    };
  },
  props: {
    appendToBody: Boolean,
    teacherDetailInfo: Object,
    teacherDetailInfoDialogVisible: Object,
  },
  methods: {
    deepCopy,
    close() {
      deepCopy(this.tempShow, this.isShow)
      this.$emit("update:teacherDetailInfoDialogVisible", this.isShow);
    },
  },
  watch: {
    teacherDetailInfoDialogVisible: {
      handler(val, oldVal) {
        deepCopy(this.isShow, val);
      },
      deep: true,
    }
  },
};
</script>

<style>
.teacher-detail-info {
  width: 800px;
  margin-top: 150px !important;
}
.dialog-teacher-table td:nth-child(even) {
  width: 260px;
}
.dialog-teacher-table td:nth-child(odd) {
  width: 120px;
}
.teacher-detail-info .el-dialog__body {
  padding-top: 10px;
}
</style>
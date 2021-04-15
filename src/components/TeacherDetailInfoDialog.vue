<template>
  <el-dialog
    :append-to-body="appendToBody"
    :title="'教师' + info.name + '的详细信息'"
    :visible.sync="isShow.value"
    custom-class="teacher-detail-info"
    @close="close"
  >
    <table class="customize-table dialog-teacher-table">
      <tr>
        <td>所属院系:</td>
        <td>{{ info.faculty }}</td>
        <td>职称:</td>
        <td>{{ info.jobTitle }}</td>
      </tr>
      <tr>
        <td>文化程度:</td>
        <td>{{ info.educationLevel }}</td>
        <td>学位:</td>
        <td>{{ info.academicDegree }}</td>
      </tr>
      <tr>
        <td>联系方式:</td>
        <td>{{ info.tel }}</td>
        <td>邮箱:</td>
        <td>{{ info.email }}</td>
      </tr>
    </table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isShow: {},
      info: {},
    };
  },
  props: {
    appendToBody: Boolean,
    teacherDetailInfo: Object,
    teacherDetailInfoDialogVisible: Object,
  },
  methods: {
    close() {
      this.$emit("update:teacherDetailInfoDialogVisible", this.isShow);
    },
  },
  watch: {
    teacherDetailInfoDialogVisible: {
      handler(val, oldVal) {
        this.isShow = val;
      },
      deep: true,
    },
    teacherDetailInfo: {
      handler(val, oldVal) {
        console.log("person changed", val);
        this.info = val;
      },
      deep: true,
    },
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
</style>
<template>
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
        <td class="width160">{{ $store.state.activeModule + "结束时间:" }}</td>
        <td class="width320">{{ moduleInfo.endTime }}</td>
        <td class="width160">{{ $store.state.activeModule + "状态:" }}</td>
        <td class="width320">{{ moduleInfo.state }}</td>
      </tr>
      <tr>
        <td class="width160">{{ $store.state.activeModule + "模板:" }}</td>
        <td class="width320">
          <a>{{ moduleInfo.file }}</a>
        </td>
        <td class="width160">{{ "我的" + $store.state.activeModule + ":" }}</td>
        <td class="width320">
          <a v-if="moduleInfo.myReport != '未定稿'"></a>
          <span v-if="moduleInfo.myReport == '未定稿'">{{
            moduleInfo.myReport
          }}</span>
        </td>
      </tr>
    </table>
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
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
export default {
  components: {
    "topic-detail-dialog": TopicDetailInfoDialog,
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      topicDetailInfoDialogVisible: {
        value: false,
      },
      teacherDetailInfoDialogVisible: {
        value: false,
      },
      moduleInfo: {
        endTime: "",
        state: "",
        file: "",
        myReport: "",
      },
    };
  },
  methods: {},
};
// module信息获取
</script>

<style>
.width160 {
  width: 160px;
}
.width320 {
  width: 320px;
}
</style>
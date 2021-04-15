<template>
  <div class="root">
    <common-header :isAddSelectTopic.sync="isAddSelectTopic"></common-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- {{ $route.params.topicIndex }} -->
  </div>
</template>

<script>
import CommonHeader from "./CommonHeader.vue";
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import { request } from "../network/request";
import Qs from "qs";

export default {
  components: {
    "common-header": CommonHeader,
    "topic-detail-dialog": TopicDetailInfoDialog,
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },

  data() {
    return {
      isAddSelectTopic: true,
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
    };
  },
  watch: {
    isAddSelectTopic(val, oldVal) {
      if (this.$route.path == "/teacher/addselecttopic" ) {
        this.$router.push("/teacher/instructstudents");
      } else if(this.$route.path == "/teacher/instructstudents") {
        this.$router.push("/teacher/addselecttopic");
      }
    },
  },

  created() {
    request(
      "/TeacherInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id"),
        role: sessionStorage.getItem("role"),
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        this.$store.commit({
          type: "updateTeacherMyInfo",
          newInfo: res.data.teacherMyInfo,
        });
        this.$store.commit({
          type: "updateUser",
          newUser: {
            id: res.data.teacherMyInfo.id,
            password: res.data.teacherMyInfo.password,
            role: 'teacher',
          }
        })
        this.$store.commit({
          type: "updateUserName",
          newName: res.data.teacherMyInfo.name,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
.teacher-aside-list {
  border-right: 1px solid #e6e6e6;
  background-color: #fff;
}
.section-is-active {
  color: #409eff;
}

.teacher-menu-item,
.teacher-menu-item .topic-input input {
  /* border-left: #fff solid 6px !important; */
  padding: 0 5px 0 !important;
}

.teacher-menu-item:hover {
  background-color: #ecf5ff;
}
.teacher-menu-item:hover,
.section-is-active {
  border-left: #33a2ef solid 6px !important;
}
.teacher-menu-item:hover .topic-input input {
  cursor: default;
  background-color: #ecf5ff;
}
</style>
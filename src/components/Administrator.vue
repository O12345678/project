<template>
  <div class="root">
    <common-header></common-header>
    <div class="common-body-row">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/administrator/studentinfomanage">
          <i class="iconfont el-icon-xueshengxinxiguanli"></i>
          <span>学生信息管理</span>
        </el-menu-item>
        <el-menu-item index="/administrator/teacherinfomanage">
          <i class="iconfont el-icon-jiaoshixinxiguanli"></i>
          <span>教师信息管理</span>
        </el-menu-item>
        <el-menu-item index="/administrator/selecttopicsummary">
          <i class="iconfont el-icon-xuantihuizong"></i>
          <span>毕业设计选题汇总</span>
        </el-menu-item>
        <el-menu-item index="/administrator/replyarrangegather">
          <i class="iconfont el-icon-dabianpingshenanpaihuizong"></i>
          <span>答辩评审安排汇总</span>
        </el-menu-item>

        <el-menu-item index="/administrator/reviewsummary">
          <i class="iconfont el-icon-pingshenhuizong"></i>
          <span>毕业设计评审汇总</span>
        </el-menu-item>
        <el-menu-item index="/administrator/uploaddocument">
          <i class="iconfont el-icon-fabuwendang"></i>
          <span>发布文档</span>
        </el-menu-item>
      </el-menu>
      <main style="margin-top: 10px"><router-view></router-view></main>
    </div>
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
      
    };
  },
  created() {
    request(
      "/AdministratorInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id")
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        this.$store.commit({
          type: "updateUserName",
          newName: res.data.information.name,
        });
        this.$store.commit({
          type: "updateUser",
          newUser: {
            id: res.data.information.id,
            password: res.data.information.password,
            role: "administrator",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
</script>

<style>
.el-menu {
  background-color: rgb(253, 253, 253);
  width: 180px;
}
.el-menu i {
  margin-right: 5px;
}
</style>
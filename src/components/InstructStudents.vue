<template>
  <div class="common-body-row">
    <el-card
      style="overflow: auto; width: 220px"
      class="instruct-student-aside"
    >
      <div style="padding: 0 10px 0">
        <section
          class="instruct-student-menu-title flex-row-between"
          style="height: 55px"
        >
          <strong style="font-size: 16px">指导学生列表</strong>
        </section>
      </div>
      <section
        class="instruct-student-menu-item"
        :class="{
          'link-is-active': index == currentIndex,
        }"
        @click="itemSelect(index)"
        v-for="(item, index) in instructStudents"
        :key="item.id"
      >
        <el-divider content-position="left">{{ item.studentName }}</el-divider>
        <div class="flex-row-between" style="height: 35px">
          课题<el-input
            size="small"
            class="input-border-none"
            v-model="item.name"
            :readonly="true"
          ></el-input>
        </div>
      </section>

      <div
        class="flex-column-center"
        v-if="instructStudents <= 0"
        style="margin-top: 150px"
      >
        <img src="../assets/img/notitle1.png" alt="" />
        <h5>暂无学生</h5>
      </div>
    </el-card>
    <el-card
      v-if="instructStudents.length <= 0"
      style="width: 865px"
      class="flex-column-center"
    >
      <div class="flex-column-center">
        <img src="../assets/img/noinformation.png" alt="" />
        <h4>暂无信息</h4>
      </div>
    </el-card>
    <instruct-students-info v-else></instruct-students-info>
  </div>
</template>

<script>
import preventBack from "vue-prevent-browser-back"; //组件内单独引入
import InstructStudentsInfo from "./InstructStudentsInfo.vue";
import { request } from "../network/request";
import Qs from "qs";
export default {
  components: { "instruct-students-info": InstructStudentsInfo },
  mixins: [preventBack], //注入
  data() {
    return {
      instructStudents: [
        {
          id: "",
          name: "",
          studentId: "",
          studentName: "",
        },
      ],
      currentIndex: 0,
    };
  },
  methods: {
    itemSelect(index) {
      this.currentIndex = index;
      this.$store.commit({
        type: "updateInstructStudentInfo",
        newInstructStudentInfo: this.instructStudents[index],
      });
    },
  },
  created() {
    request(
      "/InstructStudentsInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id"),
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        this.instructStudents = res.data.instructStudents;
        if (res.data.instructStudents.length > 0) {
          this.$store.commit({
            type: "updateInstructStudentInfo",
            newInstructStudentInfo: res.data.instructStudents[0],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
.instruct-student-aside .el-card__body {
  padding: 0;
}
.el-menu {
  border: none !important;
}
.el-menu-item {
  line-height: 0 !important;
}
.instruct-student-menu-title {
  cursor: default;
  border-bottom: 1px dotted #e6e6e6;
}
.instruct-student-menu-item {
  height: 70px;
  display: flex;
  flex-direction: column;
  color: black !important;
  padding: 5px 10px 5px 5px !important;
  border-left: #fff solid 5px;
}
.instruct-student-menu-item .el-divider {
  margin: 15px 0;
  padding: 0 5px 0;
  width: 190px;
  line-height: 30px !important;
}
.instruct-student-menu-item .el-input__inner {
  width: 170px;
  padding: 0px 5px;
}
.link-is-active,
.link-is-active .el-input__inner,
.link-is-active .el-divider__text {
  background-color: #ecf5ff;
}
.link-is-active {
  border-left: #33a2ef solid 5px !important;
}

.instruct-student-menu-item:hover,
.instruct-student-menu-item:hover .el-input__inner,
.instruct-student-menu-item:hover .el-divider__text {
  cursor: default;
  background-color: #ecf5ff;
}
.instruct-student-menu-item:hover {
  border-left: #ecf5ff solid 5px;
}
</style>
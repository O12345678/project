<template>
  <div class="common-body-row instruct-students-root">
    <el-card
      style="overflow: auto; width: 220px"
      class="teacher-aside-list instruct-student-aside"
    >
      <div style="padding: 0 10px 0">
        <section
          class="instruct-student-menu-title flex-row-between"
          style="height: 55px"
        >
          <strong style="font-size: 16px"> 指导学生列表</strong>
        </section>
      </div>

      <section
        class="teacher-menu-item instruct-student-menu-item"
        v-for="(item, index) in instructStudents"
        :key="index"
        :class="{
          'section-is-active': index == currentIndex,
        }"
        @click="itemSelect(index)"
      >
        <el-divider content-position="left">{{ item.name }}</el-divider>
        <div>
          课题:<el-input
            style="width: 170px"
            size="small"
            class="input-border-none topic-input"
            v-model="item.topic"
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
    <instruct-students-info></instruct-students-info>
  </div>
</template>

<script>
import preventBack from "vue-prevent-browser-back"; //组件内单独引入
import InstructStudentsInfo from "./InstructStudentsInfo.vue";
export default {
  components: { InstructStudentsInfo },
  mixins: [preventBack], //注入
  data() {
    return {
      instructStudents: [
        {
          id: "1",
          name: "张三",
          profession: "计算机科学与技术",
          classNumber: 1,
          topic: "无人机任务管理系统的设计与实现",
        },
        {
          id: "2",
          name: "李四",
          profession: "计算机科学与技术",
          classNumber: 3,
          topic: "风光互补路灯控制器的设计",
        },
        {
          id: "3",
          name: "王二",
          profession: "信息安全",
          classNumber: 1,
          topic: "基于数据挖掘技术的电力调度系统设计与实现",
        },
        {
          id: "4",
          name: "马六",
          profession: "物联网",
          classNumber: 1,
          topic: "基于移动互联网的办公自动化系统设计",
        },
        {
          id: "5",
          name: "李四",
          profession: "信息安全",
          classNumber: 2,
          topic: "基于云计算的酒店信息化管理系统建设",
        },
      ],
      currentIndex: -1,
    };
  },
  methods: {
    itemSelect(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style>
.instruct-student-aside .el-card__body {
  padding: 0;
}
.instruct-student-menu-title {
  cursor: default;
  border-bottom: 1px dotted #e6e6e6;
}
.instruct-student-menu-item {
  display: flex;
  flex-direction: column;
  color: black !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
.instruct-student-menu-item .el-divider {
  margin: 15px 0;
  padding: 0 5px 0;
  width: 195px
}
.teacher-menu-item:hover .el-divider__text {
  background-color: #ecf5ff
}
</style>
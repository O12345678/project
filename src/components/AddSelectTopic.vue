<template>
  <div class="common-body-row">
    <aside style="overflow: auto; width: 220px" class="teacher-aside-list">
      <div style="padding: 0 10px 0">
        <section
          class="select-topic-menu-title flex-row-between"
          style="height: 55px"
        >
          <strong style="font-size: 16px"> 毕业设计题目表</strong>
          <i
            class="iconfont el-icon-tianjia"
            :class="{'ban-click': !canDealTopic}"
            style="cursor: pointer"
            @click="addSelectTopic"
          ></i>
        </section>
      </div>

      <section
        class="teacher-menu-item"
        v-for="(item, index) in topicData"
        :key="index"
        :class="{
          'select-topic-menu-item-change': topicData[index].newTopic,
          'section-is-active': index == currentIndex,
        }"
        @click="itemSelect(index)"
      >
        <div class="flex-row-between" style="height: 55px">
          <!-- 注意表单验证放在循环里有坑，$ref[topicData]获取到的是数组需要加下标 -->

          <el-input
            @blur.native.capture="topicInputBlur"
            :ref="'elInput' + index"
            size="small"
            v-model="topicData[index].name"
            placeholder="请输入题目"
            class="topic-input"
            :class="{
              'input-border-none': !topicData[index].newTopic,
              'topic-input-cursor-text': topicData[index].newTopic,
            }"
            :readonly="!topicData[index].newTopic"
          ></el-input>

          <el-popover
            :ref="'elPopover' + index"
            placement="right"
            trigger="click"
            popper-class="select-topic-menu-item-popover"
            v-if="
              !topicData[index].newTopic &&
              topicData[index].approvalStatus != '已通过'
              && canDealTopic
            "
          >
            <div>
              <i
                class="iconfont el-icon-xiugai"
                style="cursor: pointer"
                @click="editSelectTopic(index)"
              ></i>
              <i class="iconfont el-icon-hengxian"></i>
              <i
                class="iconfont el-icon-delete"
                style="cursor: pointer"
                @click="deleteSelectTopic(index)"
              ></i>
            </div>

            <i
              slot="reference"
              class="iconfont el-icon-sandian"
              style="margin-right: 10px"
            ></i>
          </el-popover>
        </div>
        <div
          class="flex-row-around"
          v-if="topicData[index].newTopic"
          @click="test"
        >
          <el-button
            size="mini"
            @click.stop="submit(topicData[index])"
            @mousedown.native="preventBlur"
            >确认</el-button
          >
          <el-button
            size="mini"
            @click.stop="quit(index)"
            @mousedown.native="preventBlur"
            >取消</el-button
          >
        </div>
      </section>

      <div
        class="flex-column-center"
        v-if="topicData.length <= 0"
        style="margin-top: 150px"
      >
        <img src="../assets/img/notitle1.png" alt="" />
        <h5>暂无题目</h5>
      </div>
    </aside>

    <div
      class="flex-column-center"
      style="height: 500px; width: 865px"
      v-if="topicData.length <= 0"
    >
      <img src="../assets/img/noinformation.png" alt="" />
      <h4>暂无题目信息</h4>
    </div>
    <select-topic-info
      v-else
      :selectTopicInfo.sync="topicData[currentIndex]"
      :canEdit.sync="canEdit"
      :canDealTopic.sync="canDealTopic"
    ></select-topic-info>
  </div>
</template>

<script>
import preventBack from "vue-prevent-browser-back"; //组件内单独引入
import { deepCopy } from "../assets/js/utils";
import SelectTopicInfo from "../components/SelectTopicInfo.vue";
import { request } from "../network/request";
import Qs from "qs";
export default {
  components: {
    "select-topic-info": SelectTopicInfo,
  },
  mixins: [preventBack], //注入
  data() {
    return {
      currentIndex: -1,
      teacherInfo: {},
      isAdding: false,
      canEdit: false,
      canDealTopic: true,
      topicData: [
        // {
        //         id: "",
        //         name: "",
        //         declaredYear: "",
        //         type: "",
        //         pattern: "",
        //         degreeOfDifficulty: " ",
        //         content: "",
        //         require: "",
        //         finalNumber: 1,
        //         teacher: this.$store.state.teacherMyInfo.name,
        //         approvalStatus: "",
        //         remark: "",
        //         reviewer: null,
        //         newTopic: true
        // },
      ],
    };
  },

  methods: {
    test() {},
    deepCopy,
    topicInputBlur(event) {
      if (event.target.value.trim() == "") {
        this.$message({
          showClose: true,
          message: "请填写毕业设计名",
          type: "warning",
          duration: 1500,
        });
      }
    },
    preventBlur(event) {
      event.preventDefault();
    },
    itemSelect(index) {
      this.canEdit = false;
      this.currentIndex = index;
    },
    addSelectTopic() {
      if (this.isAdding) {
        this.$message({
          showClose: true,
          message: "当前正在添加题目无法继续添加！",
          type: "warning",
          duration: 1500,
        });
        return;
      }
      this.topicData.unshift({
        id: new Date().getTime() + this.$store.state.user.id,
        name: "",
        declaredYear:
          (new Date().getMonth() + 1 >= 9
            ? new Date().getFullYear()
            : new Date().getFullYear() - 1) +
          "-" +
          (new Date().getMonth() + 1 >= 9
            ? new Date().getFullYear() + 1
            : new Date().getFullYear()),
        type: "设计",
        pattern: "学生自选",
        degreeOfDifficulty: "适中",
        content: "",
        require: "",
        finalNumber: 1,
        teacher: this.$store.state.teacherMyInfo.name,
        approvalStatus: "",
        remark: "",
        reviewer: null,
        newTopic: true,
      });
      this.currentIndex = 0;
      this.$nextTick(function () {
        //DOM 更新了  注意这里要加[0]
        // console.log(this.$refs.elInput0[0]);
        this.$refs.elInput0[0].focus();
      });
      this.isAdding = true;
    },
    submit(topic) {
      if (topic.name.trim() == "") {
        this.$message({
          showClose: true,
          message: "毕业设计名不能为空",
          type: "error",
          duration: 1500,
        });
        return;
      }
      this.isAdding = false;
      topic.newTopic = false;
      this.canEdit = true;
    },
    quit(index) {
      this.topicData.splice(index, 1);
      this.currentIndex = -1;
      this.isAdding = false;
    },
    editSelectTopic(index) {
      this.$refs["elPopover" + index][0].doClose();
      this.canEdit = true;
    },
    deleteSelectTopic(index) {
      request(
        "/DeleteSelectTopicServlet",
        Qs.stringify({
          id: this.topicData[index].id,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          if( res.data.flag == "已结束") {
            this.$message({
              message: "选题阶段已结束！",
              type: "warning",
            });
            this.$refs["elPopover" + index][0].doClose();
            this.canDealTopic = false;
          }
          else if (res.data.flag == "已通过") {
            this.$message({
              message: "课题已通过无法进行删除操作！",
              type: "warning",
            });
            this.$refs["elPopover" + index][0].doClose();
          } else {
            this.topicData.splice(index, 1);
            this.currentIndex = -1;
            this.$refs["elPopover" + index][0].doClose();
            this.canEdit = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  //监听执行
  watch: {
    "$store.state.teacherMyInfo": {
      deep: true, //深度监听设置为 true
      handler: function (val, oldVal) {
        // deepCopy(this.teacherInfo, teacherInfo);
      },
    },
  },
  created() {
    request(
      "/SelectTopicInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id")
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        if( res.data.flag) {
          this.canDealTopic = false;
        }
        this.topicData = res.data.topicData;
      })
      .catch((err) => {
        console.log(err); 
      });
  },
};
</script>

<style>
.select-topic-menu-title {
  cursor: default;
  border-bottom: 1px dotted #e6e6e6;
}
.select-topic-menu-item-change {
  height: 95px;
}
.topic-input-cursor-text input {
  cursor: text !important;
}

.select-topic-menu-item-popover {
  width: 20px !important;
  min-width: 0;
}
</style>
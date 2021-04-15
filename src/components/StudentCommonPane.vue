<template>
  <div>
    <div v-if="false" class="flex-column-center" style="height: 400px">
      <img src="../assets/img/notOpen.png" alt="" />
      <h3 style="margin-top: 50px">暂未开放</h3>
    </div>
    <div>
      <el-collapse-transition>
        <div v-if="topShow">
          <div>
            <common-top></common-top>
            <div class="flex-row-around" style="height: 300px">
              <el-upload
                drag
                action="/testapis/TestServlet"
                :data="extraData"
                :before-upload="handleBeforeUpload"
                :on-progress="handleUploadProgress"
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :show-file-list="showFileList"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
            </div>
          </div>
          <h3 style="margin: 0; cursor: pointer" @click="topShow = false">
            提交记录
          </h3>
        </div>
      </el-collapse-transition>

      <div v-if="!topShow">
        <div class="flex-row-between">
          <h3 style="margin: 0" @click="topShow = false">提交记录</h3>
          <el-button
            type="primary"
            size="small"
            @click.native.prevent="topShow = true"
            >back
          </el-button>
        </div>
        <el-table :data="submitRecord" style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column label="报告文件" width="250px" :resizable="false">
            <template slot-scope="scope">
              <a>{{ scope.row.file.name }}</a>
            </template></el-table-column
          >
          <el-table-column
            label="提交时间"
            width="200px"
            prop="dateTime"
            :resizable="false"
          ></el-table-column>
          <el-table-column
            label="评语"
            min-width="250px"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                type="textarea"
                v-model="scope.row.remark"
                resize="none"
                class="textarea-border-none"
                :readonly="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="state"
            width="150px"
            :resizable="false"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import StudentCommonTop from "./StudentCommonTop.vue";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import Vue from "vue";
Vue.component(CollapseTransition.name, CollapseTransition);

export default {
  components: {
    "common-top": StudentCommonTop,
  },
  data() {
    return {
      topShow: true,
      submitRecord: [
        {
          file: {
            name: "",
            path: "",
          },
          dateTime: "",
          remark: "",
          state: "",
        },
      ],
      showFileList: false,
      extraData: {
        id: this.$store.state.user.id,
      },
    };
  },
  methods: {
    handleBeforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if( extension != "doc" && extension != "docx") {
        this.$message({
          showClose: true,
          message: '仅支持.doc或.docx文件！',
          type: 'warning'
        });
        return false;
      }
    },
    handleUploadProgress(event, file, fileList) {
      this.showFileList = true;
    },
    handleUploadError(err, file, fileList) {
      this.showFileList = false;
      this.$message({
        showClose: true,
        message: "上传失败！",
        type: "error",
      });
    },
    handleUploadSuccess(response, file, fileList) {
      console.log("chenggong");
      console.log(response);
      this.$message({
        showClose: true,
        message: "上传成功！",
        type: "success",
      });
      this.showFileList = false;
    },
  },
  props: {},
  watch: {
    "$store.state.activeModule": function (val, oldVal) {
      console.log(val, oldVal);
      // 数据库查询提交记录
    },
  },
  mounted() {
    // 通过activeModule，$store.state.myTopic.id
  },
};

// 上传，增加提交记录
// 点击修改
// 提交记录获取
</script>

<style>
</style>




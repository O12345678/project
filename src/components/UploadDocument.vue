<template>
  <div style="width: 900px; height: 500px; overflow: auto; margin-top: -10px">
    <div v-for="(item, index) in module" :key="index">
      <el-divider content-position="left">{{
        item + (item == "毕业设计" ? "说明" : "模板")
      }}</el-divider>
      <div
        class="flex-row-between"
        style="background-color: #f5f7fa; padding: 0 10px"
      >
        <section
          v-show="template[index].id == null"
          style="
            height: 40px;
            color: #1296db;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
        >
          {{ "暂无" + item + (item == "毕业设计" ? "说明" : "模板") }}
        </section>
        <a
          v-show="template[index].id != null"
          style="
            height: 40px;
            color: #1296db;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
          :href="
            '/apis/FileDownloadServlet?path=' +
            encodeURI(template[index].path, 'utf-8') +
            '&fileName=' +
            encodeURI(template[index].name, 'utf-8')
          "
          ><i class="el-icon-document" style="margin-right: 5px;"></i>{{ template[index].name }}</a
        >
        <el-upload
          action="/apis/UploadTemplateServlet"
          :show-file-list="false"
          :before-upload="
            (file) => {
              handleBeforeUpload(file, item);
            }
          "
          :on-success="
            (response, file, fileList) => {
              handleUploadSuccess(response, file, fileList, index);
            }
          "
          accept=".doc, .docx"
          :data="extraData"
        >
          <el-button type="primary" size="mini">选择文件</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from "../network/request";
import Qs from "qs";
export default {
  data() {
    return {
      module: ["任务书", "开题报告", "中期检查", "毕业设计", "毕业论文"],
      template: [
        {
          id: null,
          path: "",
          name: "",
        },
        {
          id: null,
          path: "",
          name: "",
        },
        {
          id: null,
          path: "",
          name: "",
        },
        {
          id: null,
          path: "",
          name: "",
        },
        {
          id: null,
          path: "",
          name: "",
        },
      ],
      extraData: {
        module: "",
        userId: "",
      },
    };
  },
  methods: {
    handleBeforeUpload(file, module) {
      console.log(module);
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      this.extraData.module = module;
      this.extraData.userId = this.$store.state.user.id;
      if (extension != "doc" && extension != "docx") {
        this.$message({
          showClose: true,
          message: "仅支持.doc或.docx文件！",
          type: "warning",
        });
        return false;
      }
    },
    handleUploadSuccess(response, file, fileList, index) {
      console.log(response);
      this.template[index].id = response.template.id;
      this.template[index].name = response.template.name;
      this.template[index].path = response.template.path;
      this.$message({
        showClose: true,
        message: "上传成功",
        type: "success",
      });
    },
  },
  created() {
    request(
        "/UploadDocumentInitServlet",
        Qs.stringify({
          userId: sessionStorage.getItem("id"),
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.template = res.data.template;
        })
        .catch((err) => {
          console.log(err);
        });
  }
};
</script>

<style>
</style>
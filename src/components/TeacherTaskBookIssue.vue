<template>
  <div
    style="
      height: 220px;
      width: 360px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    "
  >
    <el-upload
      drag
      action="/apis/UploadTaskBookServlet"
      :data="extraData"
      :before-upload="handleBeforeUpload"
      :on-progress="handleUploadProgress"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :disabled="taskBook.id != null"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将任务书文件拖到此处，或<em>点击上传</em>
        <section style="color: #f56c6c; margin-top: 5px">
          仅可上传一次且不可修改
        </section>
      </div>
    </el-upload>

    <a
      v-show="taskBook.id != null"
      style="
        height: 25px;
        color: #1296db;
        background-color: #f5f7fa;
        padding: 0 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
      "
      :href="
        '/apis/FileDownloadServlet?path=' +
        encodeURI(taskBook.path, 'utf-8') +
        '&fileName=' +
        encodeURI('任务书.doc', 'utf-8')
      "
      ><i class="el-icon-document" style="padding-right: 5px"></i>任务书</a
    >
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
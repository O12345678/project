<template>
  <div>
    <div style="height: 35px" class="flex-row-between">
      <div style="width: 120px">
        成绩:
        <el-input-number
          :controls="false"
          v-model="grade"
          @input.native="onInput0_100"
          :min="0"
          :max="100"
          size="small"
          style="width: 80px"
        ></el-input-number>
      </div>
      <el-button type="primary" plain size="small">提交</el-button>
    </div>
    <div style="margin: 15px 0 10px">评语:</div>
    <el-input
      type="textarea"
      v-model="remark"
      resize="none"
      class="instruct-students-info-remark"
    ></el-input>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
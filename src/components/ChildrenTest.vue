<template>
  <div>
    {{ test.value }}
    <el-button @click="change">change</el-button>
  </div>
</template>

<script>
export default {
  date() {
    return {
      number: {},
    };
  },
  props: {
    test: Object,
  },
  methods: {
    change() {
      this.number.value = new Date().getSeconds();
    },
  },
  watch: {
    test: {
      handler(val, oldVal) {
        console.log("person changed", val);
        this.number = val;
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>
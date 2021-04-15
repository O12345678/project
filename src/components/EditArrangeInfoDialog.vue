<template>
  <el-dialog
    title="编辑答辩安排信息"
    :visible.sync="isShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    custom-class="edit-arrange-info"
  >
    <el-form ref="info" :model="info" label-position="left" label-width="90px">
      <div class="flex-row-between">
        <el-form-item
          label="学生姓名:"
          prop="student.name"
          :rules="{
            required: true,
            message: '学生不能为空',
            trigger: 'change',
          }"
        >
          <el-input
            style="width: 150px"
            size="small"
            v-model="info.student.name"
            placeholder="请输入内容"
            v-if="!canEditArrangeStudent"
            :disabled="!canEditArrangeStudent"
          ></el-input>
          <el-select
            clearable
            v-model="info.student"
            value-key="id"
            placeholder="请输入学生姓名"
            size="small"
            style="width: 150px"
            filterable
            key="arrangeDialogStu"
            v-else
          >
            <el-option
              v-for="(item, index) in withoutArrangeStudents"
              :key="index"
              :value="item"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="答辩地点:"
          prop="place"
          :rules="{
            required: true,
            message: '答辩地点不能为空',
            trigger: 'change',
          }"
        >
          <el-select
            clearable
            v-model="info.place"
            placeholder="请选择地点"
            size="small"
            style="width: 150px"
            key="arrangeDialogPlace"
          >
            <el-option
              v-for="(item, index) in places"
              :key="index"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="flex-row-between" style="margin: 15px 0 15px">
        <el-form-item
          label="答辩老师:"
          prop="teacher1.name"
          :rules="{
            required: true,
            message: '答辩老师不能为空',
            trigger: 'change',
          }"
        >
          <el-select
            clearable
            v-model="info.teacher1"
            value-key="id"
            placeholder="请输入教师"
            size="small"
            style="width: 150px"
            filterable
            key="arrangeDialogTeacher1"
          >
            <el-option
              v-for="(item, index) in teachers"
              :key="index"
              :value="item"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="评审老师:"
          prop="teacher2.name"
          :rules="{
            required: true,
            message: '评审老师不能为空',
            trigger: 'change',
          }"
        >
          <el-select
            clearable
            v-model="info.teacher2"
            value-key="id"
            placeholder="请输入教师"
            size="small"
            style="width: 150px"
            filterable
            key="arrangeDialogTeacher2"
          >
            <el-option
              v-for="(item, index) in teachers"
              :key="index"
              :value="item"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        label="答辩时间:"
        prop="replyTime[0]"
        :rules="{
          required: true,
          message: '答辩时间不能为空',
          trigger: 'change',
        }"
      >
        <el-date-picker
          v-model="info.replyTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width: 360px"
          value-format="yyyy-MM-dd HH:mm:ss"
          key="arrangeDialogDate"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="quitEditArrange">取 消</el-button>
      <el-button type="primary" @click="submitEditArrange">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      info: this.arrangeInfo,
      isShow: this.editArrangeDialogVisible,
      teachers: [
        {
          id: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
        },
      ],
      places: ["28-A205"],
      withoutArrangeStudents: [
        {
          id: "",
          name: "",
          profession: "",
          classNumber: "",
        },
      ],
    };
  },
  props: {
    arrangeInfo: Object,
    editArrangeDialogVisible: Boolean,
    canEditArrangeStudent: Boolean,
    arrangeCurrentIndex: Number,
    refreshOperation: Number,
  },
  methods: {
    submitEditArrange() {
      console.log("go");
      this.$refs["info"].validate((valid) => {
        if (valid) {
          console.log("submit");
          this.isShow = false;
          this.$emit("update:editArrangeDialogVisible", this.isShow);
          if (this.arrangeCurrentIndex >= 0) {
            // 修改数据库 this.info-----------------------------------------------------------
            this.$emit("update:refreshOperation", 0);
          } else {
            console.log(this.info);
            // 添加数据库 this.info-----------------------------------------------------------
            this.$emit("update:refreshOperation", 1);
          }
          console.log( "info", this.info );
        } else {
          console.log("error");
          return false;
        }
      });
    },
    quitEditArrange() {
      this.isShow = false;
      this.$emit("update:editArrangeDialogVisible", this.isShow);
      console.log("quit");
    },
  },
  watch: {
    editArrangeDialogVisible: {
      handler(val, oldVal) {
        this.isShow = val;
      },
      deep: true,
    },
    arrangeInfo: {
      handler(val, oldVal) {
        console.log("new--", val);
        this.info = val;
      },
      deep: true,
    },
  },
  mounted() {
    this.teachers = [
      {
        id: "1",
        name: "李明",
      },
      {
        id: "2",
        name: "李刚",
      },
      {
        id: "3",
        name: "小红",
      },
      {
        id: "4",
        name: "王强",
      },
      {
        id: "5",
        name: "李刚",
      },
    ];
    this.withoutArrangeStudents = [
      {
        id: "1",
        name: "张三",
        profession: "计算机科学与技术",
        classNumber: 1,
      },
      {
        id: "2",
        name: "李四",
        profession: "计算机科学与技术",
        classNumber: 3,
      },
      {
        id: "3",
        name: "王二麻子",
        profession: "信息安全",
        classNumber: 1,
      },
      {
        id: "4",
        name: "马六",
        profession: "物联网",
        classNumber: 1,
      },
      {
        id: "5",
        name: "李四",
        profession: "信息安全",
        classNumber: 2,
      },
    ];
  },
};
</script>

<style>
</style>
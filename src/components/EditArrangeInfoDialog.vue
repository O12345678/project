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
      <el-form-item
        label="答辩时间:"
        prop="dateTime"
        :rules="{
          required: true,
          message: '答辩时间不能为空',
          trigger: 'change',
        }"
      >
        <el-date-picker
          v-model="info.dateTime"
          type="datetime"
          size="small"
          style="width: 200px"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期时间"
          key="arrangeDialogDate"
        >
        </el-date-picker>
      </el-form-item>
      <div class="flex-row-between" style="margin: 15px 0 15px">
        <el-form-item
          label="答辩老师:"
          prop="replyTeacher.name"
          :rules="{
            required: true,
            message: '答辩老师不能为空',
            trigger: 'change',
          }"
        >
          <el-select
            clearable
            v-model="info.replyTeacher"
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
          prop="reviewTeacher.name"
          :rules="{
            required: true,
            message: '评审老师不能为空',
            trigger: 'change',
          }"
        >
          <el-select
            clearable
            v-model="info.reviewTeacher"
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="quitEditArrange">取 消</el-button>
      <el-button type="primary" @click="submitEditArrange">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deepCopy } from "../assets/js/utils";
import { request } from "../network/request";
import Qs from "qs";
export default {
  data() {
    return {
      info: {
        student: {
          id: "",
          name: "",
          profession: "",
          classNumber: "",
        },
        replyTeacher: {
          id: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
        },
        reviewTeacher: {
          id: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
        },
        place: "",
        dateTime: "",
      },
      isShow: false,
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
      places: ["6-101", "6-102", "6-103", "6-104", "6-105", "6-106", "6-107"],
      withoutArrangeStudents: [
        {
          id: "",
          name: "",
          profession: "",
          classNumber: "",
        },
      ],
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
    };
  },
  props: {
    arrangeInfo: Object,
    editArrangeDialogVisible: Boolean,
    canEditArrangeStudent: Boolean,
    refreshOperation: Number,
  },
  methods: {
    submitEditArrange() {
      this.$refs["info"].validate((valid) => {
        if (valid) {
          request(
            "/UpdateReplyArrangeServlet",
            Qs.stringify({
              info: encodeURI(JSON.stringify(this.info), "utf-8"),
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              this.checkData = res.data.checkData;
              this.$emit("update:refreshOperation", 1);
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
          this.$emit("update:editArrangeDialogVisible", false);
        } else {
          console.log("error");
          return false;
        }
      });
    },
    quitEditArrange() {
      this.isShow = false;
      this.$emit("update:editArrangeDialogVisible", this.isShow);
    },
  },
  watch: {
    editArrangeDialogVisible: {
      handler(val, oldVal) {
        this.isShow = val;
        if( val == true ) {
          request(
            "/EditArrangeInfoDialogInitServlet",
            Qs.stringify({
              id: this.$store.state.user.id,
              role: "leader",
              grade: this.currentAcademicYear - 3
            }),
            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
              this.withoutArrangeStudents = res.data.withoutArrangeStudents;
              this.teachers = res.data.teachers;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      deep: true,
    },
    arrangeInfo: {
      handler(val, oldVal) {
        deepCopy(this.info, val);
      },
      deep: true,
    },
  },
};
</script>

<style>
.edit-arrange-info {
  width: 550px;
}
.edit-arrange-info .el-dialog__body {
  padding-bottom: 0;
}
</style>
<template>
  <div style="width: 900px">
    <div class="flex-row-between" style="margin-bottom: 15px">
      <div style="width: 700px" class="flex-row-between">
        教师编号:
        <el-select
          clearable
          v-model="searchTeacher.id"
          value-key="id"
          placeholder="请输入教师编号"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teacherIds"
            :key="index"
            :value="item"
            :label="item"
          >
          </el-option>
        </el-select>
        教师姓名:
        <el-select
          clearable
          v-model="searchTeacher.name"
          value-key="id"
          placeholder="请输入教师姓名"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teacherNames"
            :key="index"
            :value="item"
            :label="item"
          >
          </el-option>
        </el-select>
        职称:
        <el-select
          v-model="searchTeacher.jobTitle"
          placeholder="请选择职称"
          size="small"
          style="width: 150px"
          clearable
        >
          <el-option v-for="item in jobTitles" :key="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="flex-row-between" style="width: 150px">
        <el-button type="primary" size="small" @click="addTeacher()"
          >添加</el-button
        >
        <el-button type="primary" size="small" @click="teacherQuery()"
          >查询</el-button
        >
      </div>
    </div>
    <el-table
      :data="
        teacherInfos.slice(
          (teacherInfoCurrentPage - 1) * teacherInfoPageSize,
          teacherInfoCurrentPage * teacherInfoPageSize
        )
      "
      :height="423"
      style="width: 100%"
      size="medium"
    >
      <el-table-column
        label="教师编号"
        prop="id"
        width="120px"
        :resizable="false"
        align="center"
        fixed
      >
      </el-table-column>
      <el-table-column
        label="教师姓名"
        prop="name"
        width="150px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="职称"
        prop="jobTitle"
        width="120px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="教育水平"
        prop="educationLevel"
        width="120px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="学位"
        prop="academicDegree"
        width="120px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="联系方式"
        prop="tel"
        width="150px"
        :resizable="false"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="邮箱"
        prop="email"
        min-width="200px"
        :resizable="false"
      >
      </el-table-column>
      <el-table-column label="密码" min-width="160px" :resizable="false">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.password"
            :readonly="true"
            :type="scope.row.showType"
            size="small"
            class="teacher-info-table-password input-border-none"
          >
            <i
              slot="suffix"
              class="el-input__icon iconfont"
              :class="{
                'el-icon-yincang': scope.row.showType == 'text',
                'el-icon-xianshi': scope.row.showType == 'password',
              }"
              @click="showPassword(scope.row)"
            ></i>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button
            @click="
              teacherInfoEdit(
                alterPage(
                  teacherInfoCurrentPage,
                  teacherInfoPageSize,
                  scope.$index
                )
              )
            "
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="text"
            style="color: #f56c6c"
            size="small"
            @click="teacherInfoDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="teacherInfoCurrentPage"
        :page-size="8"
        :page-sizes="[8, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="teacherInfos.length"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
    <edit-teacher-info-dialog
      :teacherInfo.sync="teacherInfo"
      :dialogShow.sync="dialogShow"
      :operate.sync="operate"
      :refreshOperation.sync="refreshOperation"
      :entrance="entrance"
    ></edit-teacher-info-dialog>
  </div>
</template>

<script>
import { showTeacherDetailDialog } from "../assets/js/utils.js";
import { alterPage } from "../assets/js/utils.js";
import { deepCopy } from "../assets/js/utils.js";
import { querySearchAsync } from "../assets/js/utils.js";
import { createStateFilter } from "../assets/js/utils.js";
import EditTeacherInfoDialog from "./EditTeacherInfoDialog.vue";
import { request } from "../network/request";
import Qs from "qs";
export default {
  components: {
    "edit-teacher-info-dialog": EditTeacherInfoDialog,
  },
  data() {
    return {
      teacherInfo: {
        id: "",
        password: "",
        name: "",
        faculty: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      },
      dialogShow: false,
      operate: "edit",
      searchTeacher: {
        id: "",
        name: "",
        jobTitle: "",
      },
      jobTitles: ["讲师", "副教授", "教授"],
      teacherNames: [],
      teacherIds: [],
      teacherInfos: [
        {
          id: "",
          password: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
          showType: "password",
        },
      ],
      teacherInfoCurrentPage: 1,
      teacherInfoPageSize: 8,
      refreshOperation: false,
      entrance: "manage",
    };
  },
  methods: {
    showTeacherDetailDialog,
    alterPage,
    deepCopy,
    querySearchAsync,
    createStateFilter,
    handleSizeChange(size) {
      this.teacherInfoPageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.teacherInfoCurrentPage = currentPage;
    },
    teacherInfoEdit(index) {
      this.teacherInfo = {
        id: "",
        password: "",
        faculty: "",
        name: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      };
      deepCopy(this.teacherInfo, this.teacherInfos[index]);
      this.operate = "edit";
      this.dialogShow = true;
    },
    teacherInfoDelete(id) {
      request(
        "/DeleteTeacherServlet",
        Qs.stringify({
          id: id,
          userId: this.$store.state.user.id,
          role: "administrator",
          teacherId: this.searchTeacher.id,
          teacherName: this.searchTeacher.name,
          jobTitle: this.searchTeacher.jobTitle,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.teacherInfos = res.data.teachers;
          this.teacherNames = res.data.teacherNames;
          this.teacherIds = res.data.teacherIds;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    teacherQuery() {
      request(
        "/QueryTeacherServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          role: "administrator",
          teacherId: this.searchTeacher.id,
          teacherName: this.searchTeacher.name,
          jobTitle: this.searchTeacher.jobTitle,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.teacherInfos = res.data.teachers;
          this.teacherInfoCurrentPage = 1;
          this.teacherNames = res.data.teacherNames;
          this.teacherIds = res.data.teacherIds;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTeacher() {
      this.operate = "add";
      this.teacherInfo = {
        id: "",
        password: "",
        name: "",
        faculty: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      };
      this.dialogShow = true;
    },
    showPassword(row) {
      if (row.showType == "password") {
        row.showType = "text";
      } else if (row.showType == "text") {
        row.showType = "password";
      }
    },
  },
  created() {
    request(
      "/TeacherInfoManageInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id"),
        role: "administrator",
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        this.teacherInfos = res.data.teachers;
        this.teacherNames = res.data.teacherNames;
        this.teacherIds = res.data.teacherIds;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
    refreshOperation(val, oldVal) {
      if (val == true) {
        request(
          "/QueryTeacherServlet",
          Qs.stringify({
            id: this.$store.state.user.id,
            role: "administrator",
            teacherId: this.searchTeacher.id,
            teacherName: this.searchTeacher.name,
            jobTitle: this.searchTeacher.jobTitle,
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            this.teacherInfos = res.data.teachers;
            this.teacherNames = res.data.teacherNames;
            this.teacherIds = res.data.teacherIds;
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        this.refreshOperation = false;
      }
    },
  },
};
</script>

<style>
.teacher-info-table-password input {
  padding-left: 5px;
}
</style>
<template>
  <div style="width: 900px">
    <div>
      <div class="flex-row-between">
        学生姓名:
        <el-select
          clearable
          v-model="searchReview.student"
          placeholder="请输入学生姓名"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in students"
            :key="index"
            :value="item.name"
          >
          </el-option>
        </el-select>

        毕业设计题目:
        <el-input
          v-model="searchReview.topic"
          placeholder="请输入题目"
          size="small"
          style="width: 200px"
        ></el-input>

        总成绩:
        <el-input-number
          style="width: 60px"
          placeholder="请输入成绩下限"
          v-model="searchReview.totalGrade[0]"
          :controls="false"
          :min="0"
          :max="100"
          size="small"
        ></el-input-number
        >-
        <el-input-number
          style="width: 60px"
          placeholder="请输入成绩上限"
          v-model="searchReview.totalGrade[1]"
          :controls="false"
          :min="0"
          :max="100"
          size="small"
        ></el-input-number>
        <el-button
          type="primary"
          size="small"
          @click="reviewAdd()"
          style="margin-left: 20px"
          >添加</el-button
        >
      </div>
      <div class="flex-row-between" style="margin: 10px 0">
        答辩老师:
        <el-select
          clearable
          v-model="searchReview.teacher1"
          placeholder="请输入教师"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teachers"
            :key="index"
            :value="item.name"
          >
          </el-option>
        </el-select>

        评审老师:
        <el-select
          clearable
          v-model="searchReview.teacher2"
          placeholder="请输入教师"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teachers"
            :key="index"
            :value="item.name"
          >
          </el-option>
        </el-select>

        指导老师:
        <el-select
          clearable
          v-model="searchReview.teacher"
          placeholder="请输入教师"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teachers"
            :key="index"
            :value="item.name"
          >
          </el-option>
        </el-select>

        <el-button
          type="primary"
          size="small"
          @click="reviewQuery()"
          style="margin-left: 20px"
          >查询</el-button
        >
      </div>
    </div>
    <div class="review-summary-table">
      <el-table
        :data="
          reviewInfos.slice(
            (reviewInfoCurrentPage - 1) * reviewInfoPageSize,
            reviewInfoCurrentPage * reviewInfoPageSize
          )
        "
        style="width: 900px"
        :height="380"
      >
        <el-table-column
          prop="student.name"
          label="学生姓名"
          width="100"
          align="center"
          fixed
        >
        </el-table-column>
        <el-table-column label="毕业设计题目" width="200" align="center">
          <template slot-scope="scope">
            <a
              @click="
                showDetailInfoDialog(
                  topicDetailInfo,
                  reviewInfos[
                    alterPage(
                      reviewInfoCurrentPage,
                      reviewInfoPageSize,
                      scope.$index
                    )
                  ],
                  topicDetailInfoDialogVisible
                )
              "
              >{{ scope.row.name }}</a
            >
          </template>
        </el-table-column>
        <el-table-column label="评审信息" width="350" align="center">
          <el-table-column label="答辩教师评审信息" width="150" align="center">
            <el-table-column label="答辩教师" width="100" align="center">
              <template slot-scope="scope">
                <a
                  @click="
                    showDetailInfoDialog(
                      teacherDetailInfo,
                      reviewInfos[
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        )
                      ].teacher1,
                      teacherDetailInfoDialogVisible
                    )
                  "
                  >{{ scope.row.teacher1.name }}</a
                >
              </template>
            </el-table-column>
            <el-table-column label="评语" width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  v-if="
                    scope.row.teacher1.remark.trim() != '' || scope.row.isEdit
                  "
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="scope.row.teacher1.remark"
                  resize="none"
                  :class="{ 'textarea-border-none': !scope.row.isEdit }"
                  :readonly="scope.row.isEdit ? false : true"
                >
                </el-input>
                <span v-else>暂无评语</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="teacher1.gradeScale"
              label="成绩占比"
              width="70"
              align="center"
            ></el-table-column>
            <el-table-column label="成绩" width="70" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="
                    scope.row.teacher1.grade != undefined || scope.row.isEdit
                  "
                  style="width: 60px"
                  class="review-summary-table-grade"
                  :class="{ 'input-border-none': !scope.row.isEdit }"
                  :disabled="!scope.row.isEdit"
                  v-model="scope.row.teacher1.grade"
                  :min="0"
                  :max="100"
                  :controls="false"
                ></el-input-number>
                <span v-else>暂无成绩</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="评审教师评审信息" width="350" align="center">
            <el-table-column label="评审教师" width="100" align="center">
              <template slot-scope="scope">
                <a
                  @click="
                    showDetailInfoDialog(
                      teacherDetailInfo,
                      reviewInfos[
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        )
                      ].teacher2,
                      teacherDetailInfoDialogVisible
                    )
                  "
                  >{{ scope.row.teacher2.name }}</a
                >
              </template>
            </el-table-column>
            <el-table-column label="评语" min-width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="scope.row.teacher2.remark"
                  resize="none"
                  :class="{ 'textarea-border-none': !scope.row.isEdit }"
                  :readonly="scope.row.isEdit ? false : true"
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="teacher2.gradeScale"
              label="成绩占比"
              width="70"
              align="center"
            ></el-table-column>
            <el-table-column label="成绩" width="70" align="center">
              <template slot-scope="scope">
                <el-input-number
                  style="width: 60px"
                  class="review-summary-table-grade"
                  :class="{ 'input-border-none': !scope.row.isEdit }"
                  :disabled="!scope.row.isEdit"
                  v-model="scope.row.teacher2.grade"
                  :min="0"
                  :max="100"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="指导教师评审信息" width="350" align="center">
            <el-table-column label="指导教师" width="100" align="center">
              <template slot-scope="scope">
                <a
                  @click="
                    showDetailInfoDialog(
                      teacherDetailInfo,
                      reviewInfos[
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        )
                      ].teacher,
                      teacherDetailInfoDialogVisible
                    )
                  "
                  >{{ scope.row.teacher.name }}</a
                >
              </template>
            </el-table-column>
            <el-table-column label="评语" min-width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="scope.row.teacher.remark"
                  resize="none"
                  :class="{ 'textarea-border-none': !scope.row.isEdit }"
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="teacher.gradeScale"
              label="成绩占比"
              width="70"
              align="center"
            >
            </el-table-column>
            <el-table-column label="成绩" width="70" align="center">
              <template slot-scope="scope">
                <el-input-number
                  style="width: 60px"
                  class="review-summary-table-grade"
                  :class="{ 'input-border-none': !scope.row.isEdit }"
                  :disabled="!scope.row.isEdit"
                  v-model="scope.row.teacher.grade"
                  :min="0"
                  :max="100"
                  :controls="false"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总成绩" width="70" align="center">
          <template slot-scope="scope">
            {{ scope.row.teacher1.grade }}
          </template>
        </el-table-column>
        <el-table-column
          prop="teacher.grade"
          label="是否是优秀毕业设计"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="120px"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                reviewInfoEdit(
                  alterPage(
                    reviewInfoCurrentPage,
                    reviewInfoPageSize,
                    scope.$index
                  )
                )
              "
              type="text"
              size="small"
              >{{ scope.row.isEdit ? "确认" : "编辑" }}</el-button
            >
            <el-button
              v-if="scope.row.isEdit"
              type="text"
              style="color: #aaa"
              size="small"
              @click="reviewInfoCancel()"
              >取消</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              size="small"
              @click="
                reviewInfoDelete(
                  alterPage(
                    reviewInfoCurrentPage,
                    reviewInfoPageSize,
                    scope.$index
                  )
                )
              "
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="reviewInfoCurrentPage"
        :page-size="6"
        :page-sizes="[6, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="reviewInfos.length"
        prev-text="上一页"
        next-text="下一页"
      >
      </el-pagination>
    </div>
    <topic-detail-dialog
      :topicDetailInfo.sync="topicDetailInfo"
      :topicDetailInfoDialogVisible.sync="topicDetailInfoDialogVisible"
    ></topic-detail-dialog>
    <teacher-detail-dialog
      :appendToBody="false"
      :teacherDetailInfo.sync="teacherDetailInfo"
      :teacherDetailInfoDialogVisible.sync="teacherDetailInfoDialogVisible"
    ></teacher-detail-dialog>
  </div>
</template>

<script>
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import { showDetailInfoDialog } from "../assets/js/utils.js";
import { alterPage } from "../assets/js/utils.js";
import { deepCopy } from "../assets/js/utils.js";
import { querySearchAsync } from "../assets/js/utils.js";
import { createStateFilter } from "../assets/js/utils.js";
export default {
  components: {
    "topic-detail-dialog": TopicDetailInfoDialog,
    "teacher-detail-dialog": TeacherDetailInfoDialog,
  },
  data() {
    return {
      topicDetailInfo: {
        id: "",
        name: "",
        declaredYear: "",
        type: "",
        pattern: "",
        degreeOfDifficulty: "",
        content: "",
        require: "",
        finalNumber: 1,
        teacher: {
          id: "",
          name: "",
          faculty: "",
          jobTitle: "",
          educationLevel: "",
          academicDegree: "",
          tel: "",
          email: "",
        },
      },
      topicDetailInfoDialogVisible: {
        value: false,
      },
      teacherDetailInfo: {
        id: "",
        name: "",
        faculty: "",
        jobTitle: "",
        educationLevel: "",
        academicDegree: "",
        tel: "",
        email: "",
      },
      teacherDetailInfoDialogVisible: {
        value: false,
      },
      reviewInfoCurrentPage: 1,
      reviewInfoPageSize: 6,
      reviewInfos: [
        {
          id: "1",
          name: "高校毕业设计管理系统",
          declaredYear: "2020-2021学年",
          type: "设计",
          pattern: "学生自选",
          degreeOfDifficulty: "适中",
          content: "xxxxxxxxxxxxxxxxx",
          require: "000000000000000000000",
          finalNumber: 1,
          student: {
            id: "20175308",
            name: "张凤强",
            profession: "计算机科学与技术",
            classNumber: "4",
          },
          teacher1: {
            id: "1",
            name: "张三",
            faculty: "计算机科学与工程",
            jobTitle: "讲师",
            educationLevel: "",
            academicDegree: "",
            tel: "15678941235",
            email: "",
            remark: "",
            gradeScale: "",
            grade: undefined,
          },
          teacher2: {
            id: "2",
            name: "李四",
            faculty: "计算机科学与工程",
            jobTitle: "副教授",
            educationLevel: "硕士",
            academicDegree: "硕士学位",
            tel: "",
            email: "123456@163.com",
            remark: "还行",
            gradeScale: "",
            grade: 90,
          },
          teacher: {
            id: "3",
            name: "王五",
            faculty: "计算机科学与工程",
            jobTitle: "教授",
            educationLevel: "",
            academicDegree: "",
            tel: "13678945612",
            email: "ww13678945612@163.com",
            remark: "",
            gradeScale: "",
            grade: 10,
          },
          isEdit: false,
        },
      ],
      reviewCurrentEditIndex: -1,
      searchReview: {
        topic: "",
        student: "",
        teacher1: "",
        teacher2: "",
        teacher: "",
        totalGrade: [0, 100],
      },
      students: [
        {
          id: "",
          name: "",
          class: "",
        },
      ],
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
    };
  },
  methods: {
    showDetailInfoDialog,
    alterPage,
    deepCopy,
    querySearchAsync,
    createStateFilter,
    handleSizeChange(size) {
      this.reviewInfoPageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.reviewInfoCurrentPage = currentPage;
    },
    reviewQuery() {
      if (
        this.searchReview.totalGrade[0] == undefined ||
        this.searchReview.totalGrade[1] == undefined
      ) {
        this.$message({
          showClose: true,
          message: "请输入正确格式的成绩！",
          type: "error",
        });
        return;
      } else if (
        this.searchReview.totalGrade[0] > this.searchReview.totalGrade[1]
      ) {
        this.$message({
          showClose: true,
          message: "成绩下限不能大于成绩上限",
          type: "error",
        });
        return;
      }
      // 数据库查询------------------------------------------------------
    },
    reviewInfoCancel() {
      console.log("数据库获取数据");
      // 数据库请求所有数据 this.indicators--------------------------------------------------------
      this.indicatorCurrentEditIndex = -1;
    },
    reviewInfoEdit(index) {
      console.log(index, this.reviewCurrentEditIndex);
      if (index == this.reviewCurrentEditIndex) {
        if (
          this.reviewInfos[index].teacher1.grade == undefined ||
          this.reviewInfos[index].teacher2.grade == undefined ||
          this.reviewInfos[index].teacher.grade == undefined
        ) {
          this.$message({
            showClose: true,
            message: "存在成绩为空！",
          });
        }
        console.log("数据库修改");
        // 数据库修改  reviewInfos[index]------------------------------------------
        this.reviewInfoCancel();
      } else {
        if (this.reviewCurrentEditIndex != -1) {
          this.reviewInfoCancel();
        }
        this.reviewCurrentEditIndex = index;
        this.reviewInfos[index].isEdit = true;
        console.log(index, this.reviewCurrentEditIndex);
      }
    },
    reviewInfoDelete(index) {
      // 数据库 this.reviewInfos[index]-----------------------------------------------------------
      this.reviewInfoCancel();
    },
  },

};
</script>

<style>
.review-summary-table .el-table__header tr,
.review-summary-table .el-table__header th {
  padding: 0 !important;
  height: 30px !important;
}
.review-summary-table .el-table .cell {
  padding: 0 !important;
}


.review-summary-table-grade input {
  background-color: #fff !important;
  color: #000 !important;
}
</style>

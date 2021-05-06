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
            v-for="(item, index) in studentNames"
            :key="index"
            :value="item"
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
          v-model="searchReview.totalGrade[0]"
          :controls="false"
          :min="0"
          :max="100"
          size="small"
        ></el-input-number
        >-
        <el-input-number
          style="width: 60px"
          v-model="searchReview.totalGrade[1]"
          :controls="false"
          :min="0"
          :max="100"
          size="small"
        ></el-input-number>
      </div>
      <div class="flex-row-between" style="margin: 10px 0">
        答辩老师:
        <el-select
          clearable
          v-model="searchReview.replyTeacher"
          placeholder="请输入教师"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teacherNames"
            :key="index"
            :value="item"
          >
          </el-option>
        </el-select>
        评审老师:
        <el-select
          clearable
          v-model="searchReview.reviewTeacher"
          placeholder="请输入教师"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teacherNames"
            :key="index"
            :value="item"
          >
          </el-option>
        </el-select>

        指导老师:
        <el-select
          clearable
          v-model="searchReview.instructor"
          placeholder="请输入教师"
          size="small"
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="(item, index) in teacherNames"
            :key="index"
            :value="item"
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
          width="120"
          align="center"
          fixed
        >
        </el-table-column>
        <el-table-column label="毕业设计题目" width="250" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.id == null">暂无</span>
            <a
              v-else
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
                  v-if="scope.row.replyTeacher.id != null"
                  @click="
                    showDetailInfoDialog(
                      teacherDetailInfo,
                      reviewInfos[
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        )
                      ].replyTeacher,
                      teacherDetailInfoDialogVisible
                    )
                  "
                  >{{ scope.row.replyTeacher.name }}</a
                >
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="评语" width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  v-if="
                    scope.row.replyTeacher.id != null &&
                    ((scope.row.remark1 != null &&
                      scope.row.remark1.trim() != '') ||
                      reviewCurrentEditIndex ==
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ))
                  "
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="scope.row.remark1"
                  resize="none"
                  :class="{
                    'textarea-border-none':
                      scope.row.replyTeacher.id == null ||
                      reviewCurrentEditIndex !=
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ),
                  }"
                  :readonly="
                    scope.row.replyTeacher.id == null ||
                    reviewCurrentEditIndex !=
                      alterPage(
                        reviewInfoCurrentPage,
                        reviewInfoPageSize,
                        scope.$index
                      )
                  "
                >
                </el-input>
                <span v-else>暂无评语</span>
              </template>
            </el-table-column>
            <el-table-column label="成绩占比" width="70" align="center">
              <template slot-scope="scope">
                {{ scope.row.reply == null ? "暂无" : scope.row.reply + "%" }}
              </template>
            </el-table-column>
            <el-table-column label="成绩" width="70" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="
                    scope.row.replyTeacher.id != null &&
                    (scope.row.grade1 != null ||
                      reviewCurrentEditIndex ==
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ))
                  "
                  style="width: 60px"
                  class="review-summary-table-grade"
                  :class="{
                    'input-border-none':
                      scope.row.replyTeacher.id == null ||
                      reviewCurrentEditIndex !=
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ),
                  }"
                  :disabled="
                    scope.row.replyTeacher.id == null ||
                    reviewCurrentEditIndex !=
                      alterPage(
                        reviewInfoCurrentPage,
                        reviewInfoPageSize,
                        scope.$index
                      )
                  "
                  v-model="scope.row.grade1"
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
                  v-if="scope.row.reviewTeacher.id != null"
                  @click="
                    showDetailInfoDialog(
                      teacherDetailInfo,
                      reviewInfos[
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        )
                      ].reviewTeacher,
                      teacherDetailInfoDialogVisible
                    )
                  "
                  >{{ scope.row.reviewTeacher.name }}</a
                >
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="评语" min-width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  v-if="
                    scope.row.reviewTeacher.id != null &&
                    ((scope.row.remark2 != null &&
                      scope.row.remark2.trim() != '') ||
                      reviewCurrentEditIndex ==
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ))
                  "
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="scope.row.remark2"
                  resize="none"
                  :class="{
                    'textarea-border-none':
                      scope.row.reviewTeacher.id == null ||
                      reviewCurrentEditIndex !=
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ),
                  }"
                  :readonly="
                    scope.row.reviewTeacher.id == null ||
                    reviewCurrentEditIndex !=
                      alterPage(
                        reviewInfoCurrentPage,
                        reviewInfoPageSize,
                        scope.$index
                      )
                  "
                >
                </el-input>
                <span v-else>暂无评语</span>
              </template>
            </el-table-column>
            <el-table-column label="成绩占比" width="70" align="center">
              <template slot-scope="scope">
                {{ scope.row.review == null ? "暂无" : scope.row.review + "%" }}
              </template>
            </el-table-column>
            <el-table-column label="成绩" width="70" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="
                    scope.row.reviewTeacher.id != null &&
                    (scope.row.grade2 != null ||
                      reviewCurrentEditIndex ==
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ))
                  "
                  style="width: 60px"
                  class="review-summary-table-grade"
                  :class="{
                    'input-border-none':
                      scope.row.reviewTeacher.id == null ||
                      reviewCurrentEditIndex !=
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ),
                  }"
                  :disabled="
                    scope.row.reviewTeacher.id == null ||
                    reviewCurrentEditIndex !=
                      alterPage(
                        reviewInfoCurrentPage,
                        reviewInfoPageSize,
                        scope.$index
                      )
                  "
                  v-model="scope.row.grade2"
                  :min="0"
                  :max="100"
                  :controls="false"
                ></el-input-number>
                <span v-else>暂无成绩</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="指导教师评审信息" width="350" align="center">
            <el-table-column label="指导教师" width="100" align="center">
              <template slot-scope="scope">
                <a
                  v-if="scope.row.teacher.id != null"
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
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="评语" min-width="250" align="center">
              <template slot-scope="scope">
                <el-input
                  v-if="
                    scope.row.teacher.id != null &&
                    ((scope.row.remark != null &&
                      scope.row.remark.trim() != '') ||
                      reviewCurrentEditIndex ==
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ))
                  "
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="scope.row.remark"
                  resize="none"
                  :class="{
                    'textarea-border-none':
                      scope.row.teacher.id == null ||
                      reviewCurrentEditIndex !=
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ),
                  }"
                  :readonly="
                    scope.row.teacher.id == null ||
                    reviewCurrentEditIndex !=
                      alterPage(
                        reviewInfoCurrentPage,
                        reviewInfoPageSize,
                        scope.$index
                      )
                  "
                >
                </el-input>
                <span v-else>暂无评语</span>
              </template>
            </el-table-column>
            <el-table-column label="成绩占比" width="70" align="center">
              <template slot-scope="scope">
                {{ scope.row.mentor == null ? "暂无" : scope.row.mentor + "%" }}
              </template>
            </el-table-column>
            <el-table-column label="成绩" width="70" align="center">
              <template slot-scope="scope">
                <el-input-number
                  v-if="
                    scope.row.teacher.id != null &&
                    (scope.row.grade != null ||
                      reviewCurrentEditIndex ==
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ))
                  "
                  style="width: 60px"
                  class="review-summary-table-grade"
                  :class="{
                    'input-border-none':
                      scope.row.teacher.id == null ||
                      reviewCurrentEditIndex !=
                        alterPage(
                          reviewInfoCurrentPage,
                          reviewInfoPageSize,
                          scope.$index
                        ),
                  }"
                  :disabled="
                    scope.row.teacher.id == null ||
                    reviewCurrentEditIndex !=
                      alterPage(
                        reviewInfoCurrentPage,
                        reviewInfoPageSize,
                        scope.$index
                      )
                  "
                  v-model="scope.row.grade"
                  :min="0"
                  :max="100"
                  :controls="false"
                ></el-input-number>
                <span v-else>暂无成绩</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总成绩" width="70" align="center">
          <template slot-scope="scope">
            {{
              computGrade(scope.row) == null ? "暂无" : computGrade(scope.row)
            }}
          </template>
        </el-table-column>
        <el-table-column label="是否是优秀毕业设计" width="80" align="center">
          <template slot-scope="scope">
            {{
              computGrade(scope.row) == null
                ? "暂无"
                : computGrade(scope.row) > 90
                ? "是"
                : "否"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="100px"
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
              >{{
                alterPage(
                  reviewInfoCurrentPage,
                  reviewInfoPageSize,
                  scope.$index
                ) == reviewCurrentEditIndex
                  ? "确认"
                  : "编辑"
              }}</el-button
            >
            <el-button
              v-if="
                alterPage(
                  reviewInfoCurrentPage,
                  reviewInfoPageSize,
                  scope.$index
                ) == reviewCurrentEditIndex
              "
              type="text"
              style="color: #aaa"
              size="small"
              @click="reviewInfoCancel()"
              >取消</el-button
            >
            <!-- <el-button
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
            > -->
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
import { request } from "../network/request";
import Qs from "qs";
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
          id: "",
          name: "",
          declaredYear: "",
          type: "",
          pattern: "",
          degreeOfDifficulty: "",
          content: "",
          require: "",
          finalNumber: 1,
          student: {
            id: null,
            name: null,
          },
          status: "",
          teacher: {
            id: null,
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
          grade: null,
          remark: null,
          mentor: null,
          replyTeacher: {
            id: null,
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
          grade1: null,
          remark1: null,
          reply: null,
          reviewTeacher: {
            id: null,
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
          },
          grade2: null,
          remark2: null,
          review: null,
        },
      ],
      reviewCurrentEditIndex: -1,
      searchReview: {
        topic: "",
        student: "",
        replyTeacher: "",
        reviewTeacher: "",
        instructor: "",
        totalGrade: [0, 100],
      },
      studentNames: [],
      teacherNames: [],
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
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
      this.reviewCurrentEditIndex = -1;
      if (
        this.searchReview.totalGrade[0] == undefined ||
        this.searchReview.totalGrade[1] == undefined ||
        this.searchReview.totalGrade[0] == null ||
        this.searchReview.totalGrade[1] == null
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
      request(
        "/QueryReviewInfoServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          topic: this.searchReview.topic,
          student: this.searchReview.student,
          replyTeacher: this.searchReview.replyTeacher,
          reviewTeacher: this.searchReview.reviewTeacher,
          instructor: this.searchReview.instructor,
          lowGrade: this.searchReview.totalGrade[0],
          highGrade: this.searchReview.totalGrade[1],
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.reviewInfos = res.data.reviewInfos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reviewInfoCancel() {
      this.reviewCurrentEditIndex = -1;
      request(
        "/ReviewSummaryInitServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          grade: this.currentAcademicYear - 3,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.studentNames = res.data.studentNames;
          this.teacherNames = res.data.teacherNames;
          this.reviewInfos = res.data.reviewInfos;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reviewInfoEdit(index) {
      if (index == this.reviewCurrentEditIndex) {
        if (
          this.reviewInfos[index].replyTeacher.grade == undefined ||
          this.reviewInfos[index].reviewTeacher.grade == undefined ||
          this.reviewInfos[index].teacher.grade == undefined
        ) {
          this.$message({
            showClose: true,
            message: "存在信息为空！",
            type: "warning",
          });
        }
        this.reviewCurrentEditIndex = -1;
        request(
          "/UpdateReviewSummaryServlet",
          Qs.stringify({
            id: this.$store.state.user.id,
            reviewInfo: encodeURI(
              JSON.stringify(this.reviewInfos[index]),
              "utf-8"
            ),
          }),
          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.reviewInfos = res.data.reviewInfos;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (this.reviewCurrentEditIndex != -1) {
          this.reviewInfoCancel();
        }
        this.reviewCurrentEditIndex = index;
      }
    },
    reviewInfoDelete(index) {
      // 数据库 this.reviewInfos[index]-----------------------------------------------------------
      this.reviewInfoCancel();
    },
    computGrade(reviewInfo) {
      if (
        reviewInfo.reply != null &&
        reviewInfo.review != null &&
        reviewInfo.mentor != null &&
        reviewInfo.grade != null &&
        reviewInfo.grade1 != null &&
        reviewInfo.grade2 != null
      ) {
        return (
          (reviewInfo.reply * reviewInfo.grade1 +
            reviewInfo.review * reviewInfo.grade1 +
            reviewInfo.mentor * reviewInfo.grade) /
          100
        );
      } else {
        return null;
      }
    },
  },
  created() {
    request(
      "/ReviewSummaryInitServlet",
      Qs.stringify({
        id: sessionStorage.getItem("id"),
        grade: this.currentAcademicYear - 3,
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
      .then((res) => {
        console.log(res);
        this.studentNames = res.data.studentNames;
        this.teacherNames = res.data.teacherNames;
        this.reviewInfos = res.data.reviewInfos;
      })
      .catch((err) => {
        console.log(err);
      });
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

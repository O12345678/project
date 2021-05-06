<template>
  <div class="root">
    <common-header></common-header>
    <div class="common-body-row">
      <aside class="leader-left-aside">
        <el-card
          class="box-card leader-information"
          :body-style="{ padding: '10px' }"
        >
          <fieldset class="common-fieldset" key="userInfo">
            <legend class="common-lengend">用户信息</legend>
            <div class="leader-edit" @click="edit">
              <img src="../assets/img/edit.png" alt="" />
            </div>
            <section class="leader-avatar">
              <el-avatar
                icon="el-icon-user-solid"
                class="leader-user-avatar"
              ></el-avatar>
              <span>{{ $store.state.userName }}</span>
            </section>
            <div v-for="(value, key) in title" :key="key">
              <div>
                {{ value + ":" }}
                <input
                  :ref="'input' + key"
                  type="text"
                  v-model="information[key]"
                  :readonly="key == 'tel' ? readonly : 'readonly'"
                  :class="{ 'border-none': key == 'tel' ? readonly : true }"
                  class="leader-info-input"
                  @blur="blur"
                />
              </div>
            </div>
          </fieldset>
        </el-card>
        <el-card class="box-card leader-date" :body-style="{ padding: '10px' }">
          <fieldset class="common-fieldset" key="arrange">
            <legend class="common-lengend">计划安排</legend>
            <div class="leader-date-body">
              <div v-for="(value, index) in dateItems" :key="index">
                <div class="plan-divider">
                  <div
                    style="height: 1px; width: 100%; background-color: #dcdfe6"
                  ></div>
                  <span class="plan-divider-word">{{ value.name }}</span>

                  <el-tooltip
                    v-if="value.state == '待开始' && value.canEdit == 'true'"
                    effect="light"
                    :content="
                      (value.id == 1 ||
                        dateItems[(index + 4) % 5].state != '待开始') &&
                      value.canEdit == 'true'
                        ? '点击提交参数设置'
                        : '前一模块尚未开始，不可编辑'
                    "
                    placement="right-start"
                    class="plan-divider-state"
                  >
                    <el-popconfirm
                      confirm-button-text="确认"
                      cancel-button-text="取消"
                      icon="el-icon-info"
                      icon-color="red"
                      @confirm="startModule(value)"
                      title="确认后无法修改，是否确认？"
                    >
                      <section
                        slot="reference"
                        class="plan-divider-flex-row"
                        :class="{
                          'ban-click': !(
                            (value.id == 1 ||
                              dateItems[(index + 4) % 5].state != '待开始') &&
                            value.canEdit == 'true'
                          ),
                        }"
                      >
                        {{ value.state }}
                      </section>
                    </el-popconfirm>
                  </el-tooltip>
                  <section
                    v-else
                    class="plan-divider-state plan-divider-flex-row"
                  >
                    {{ value.state }}
                  </section>
                </div>
                <div
                  class="leader-max-number-body"
                  v-if="value.id == 1"
                  style="margin-bottom: 10px"
                >
                  <label
                    >题目限选数：<el-input-number
                      class="leader-max-number"
                      style="width: 80px"
                      v-model="topicMaxSelectNum"
                      :min="1"
                      :max="10"
                      :controls="false"
                      size="small"
                      :disabled="
                        !(
                          (value.id == 1 ||
                            dateItems[(index + 4) % 5].state != '待开始') &&
                          value.canEdit == 'true'
                        )
                      "
                    ></el-input-number></label
                  ><br />

                  <label
                    >学生限选数：<el-input-number
                      class="leader-max-number"
                      style="width: 80px"
                      v-model="stuMaxSelectNum"
                      :min="1"
                      :max="10"
                      :controls="false"
                      size="small"
                      :disabled="
                        !(
                          (value.id == 1 ||
                            dateItems[(index + 4) % 5].state != '待开始') &&
                          value.canEdit == 'true'
                        )
                      "
                    ></el-input-number
                  ></label>
                </div>
                <el-date-picker
                  class="leader-date-item"
                  v-model="value.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  size="mini"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="
                    !(
                      (value.id == 1 ||
                        dateItems[(index + 4) % 5].state != '待开始') &&
                      value.canEdit == 'true'
                    )
                  "
                >
                </el-date-picker>

                <el-date-picker
                  class="leader-date-item"
                  v-model="value.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  size="mini"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="
                    !(
                      (value.id == 1 ||
                        dateItems[(index + 4) % 5].state != '待开始') &&
                      value.canEdit == 'true'
                    )
                  "
                >
                </el-date-picker>
              </div>
            </div>
          </fieldset>
        </el-card>
      </aside>
      <el-card class="box-card leader-right-aside">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="毕业设计审核" name="check" class="leader-check">
            <div class="leader-check-top flex-row-between">
              题目:
              <el-input
                v-model="searchCheck.name"
                placeholder="请输入题目"
                class="leader-check-topic"
                size="small"
                style="width: 200px"
                clearable
              />
              指导教师:
              <el-select
                clearable
                v-model="searchCheck.teacher"
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
              审核状态:
              <el-select
                v-model="searchCheck.approvalStatus"
                placeholder="请选择状态"
                size="small"
                style="width: 150px"
                clearable
              >
                <el-option v-for="item in status" :key="item" :value="item">
                </el-option>
              </el-select>
              <el-button
                type="primary"
                size="small"
                style="margin-left: 50px"
                @click="checkQuery()"
                >查询</el-button
              >
            </div>
            <el-table
              :data="
                checkData.slice(
                  (checkCurrentPage - 1) * checkPageSize,
                  checkCurrentPage * checkPageSize
                )
              "
              :height="316"
              border
              style="width: 100%"
              size="medium"
            >
              <el-table-column
                type="index"
                width="50px"
                :resizable="false"
                align="center"
                label="序号"
                ><template slot-scope="scope">
                  <span>{{
                    (checkCurrentPage - 1) * checkPageSize + scope.$index + 1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="题目"
                min-width="200px"
                :resizable="false"
              >
                <template slot-scope="scope">
                  <a
                    style="font-size: 12px"
                    @click="
                      showDetailInfoDialog(
                        topicDetailInfo,
                        checkData[
                          alterPage(
                            queryCurrentPage,
                            queryPageSize,
                            scope.$index
                          )
                        ],
                        topicDetailInfoDialogVisible
                      )
                    "
                    >{{ scope.row.name }}</a
                  >
                </template></el-table-column
              >
              <el-table-column
                label="指导教师"
                width="120px"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <a
                    @click="
                      showDetailInfoDialog(
                        teacherDetailInfo,
                        checkData[
                          alterPage(
                            queryCurrentPage,
                            queryPageSize,
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
              <el-table-column
                prop="remark"
                label="评语"
                width="200px"
                :resizable="false"
                align="center"
                class-name="leader-check-remark"
              >
                <template slot-scope="scope">
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="scope.row.remark"
                    resize="none"
                    :readonly="scope.row.approvalStatus != '未审核'"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="approvalStatus"
                label="审核状态"
                width="120px"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="leader-check-status">
                    <div v-if="scope.row.approvalStatus == '已通过'">
                      已通过
                    </div>
                    <div v-if="scope.row.approvalStatus == '已退回'">
                      已退回
                    </div>
                    <div v-if="scope.row.approvalStatus == '未审核'">
                      <el-popconfirm
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作无法撤回，是否继续？"
                        @confirm="deal(scope.row, 'approvalStatus', '已通过')"
                      >
                        <el-button
                          slot="reference"
                          type="text"
                          style="color: #67c23a"
                          >通过</el-button
                        >
                      </el-popconfirm>
                      <el-popconfirm
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作无法撤回，是否继续？"
                        @confirm="deal(scope.row, 'approvalStatus', '已退回')"
                      >
                        <el-button
                          slot="reference"
                          type="text"
                          style="color: #f56c6c"
                          >退回</el-button
                        >
                      </el-popconfirm>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="checkCurrentPage"
                :page-size="6"
                :page-sizes="[6, 10]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="checkData.length"
                prev-text="上一页"
                next-text="下一页"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="答辩安排" name="arrange" class="leader-arrange">
            <div class="leader-pane-top">
              学生姓名:
              <el-select
                clearable
                v-model="searchArrange.student"
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
              答辩老师:
              <el-select
                clearable
                v-model="searchArrange.replyTeacher"
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
                v-model="searchArrange.reviewTeacher"
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
              <el-button type="primary" size="small" @click="arrangeQuery()"
                >查询</el-button
              >
            </div>
            <div class="leader-pane-top">
              答辩时间:
              <el-date-picker
                v-model="searchArrange.dateTime"
                type="datetime"
                size="small"
                style="width: 200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期时间"
              >
              </el-date-picker>
              答辩地点:
              <el-select
                clearable
                v-model="searchArrange.place"
                placeholder="请选择地点"
                size="small"
              >
                <el-option
                  v-for="(item, index) in places"
                  :key="index"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-upload
                action="/apis/ImportReplyArrangeServlet"
                style="margin-left: 10px"
                :show-file-list="false"
                :before-upload="handleBeforeImport"
                :on-success="handleImportSuccess"
                accept=".xls, .xlsx"
                :data="extraData"
              >
                <el-button type="primary" size="small">导入答辩安排</el-button>
              </el-upload>

              <el-button type="primary" size="small" @click="arrangeEdit(-1)"
                >添加</el-button
              >
            </div>
            <el-table
              style="width: 100%"
              :height="316"
              :data="
                arrangeData.slice(
                  (arrangeCurrentPage - 1) * arrangePageSize,
                  arrangeCurrentPage * arrangePageSize
                )
              "
            >
              <el-table-column
                type="index"
                width="50px"
                :resizable="false"
                align="center"
                label="序号"
                ><template slot-scope="scope">
                  <span>{{
                    (checkCurrentPage - 1) * checkPageSize + scope.$index + 1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :resizable="false"
                label="学生姓名"
                width="100"
              >
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>专业: {{ scope.row.student.profession }}</p>
                    <p>班级: {{ scope.row.student.classNumber + "班" }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="small">{{ scope.row.student.name }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :resizable="false"
                label="答辩教师"
                width="100"
              >
                <template slot-scope="scope">
                  <a
                    @click="
                      showDetailInfoDialog(
                        teacherDetailInfo,
                        arrangeData[
                          alterPage(
                            queryCurrentPage,
                            queryPageSize,
                            scope.$index
                          )
                        ].replyTeacher,
                        teacherDetailInfoDialogVisible
                      )
                    "
                    >{{ scope.row.replyTeacher.name }}</a
                  >
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :resizable="false"
                label="评审教师"
                width="100"
              >
                <template slot-scope="scope">
                  <a
                    @click="
                      showDetailInfoDialog(
                        teacherDetailInfo,
                        arrangeData[
                          alterPage(
                            queryCurrentPage,
                            queryPageSize,
                            scope.$index
                          )
                        ].reviewTeacher,
                        teacherDetailInfoDialogVisible
                      )
                    "
                    >{{ scope.row.reviewTeacher.name }}</a
                  >
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                label="答辩时间"
                align="center"
                width="200"
              >
                <template slot-scope="scope">
                  {{ scope.row.dateTime }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :resizable="false"
                prop="place"
                label="答辩地点"
                min-width="100"
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="
                      arrangeEdit(
                        alterPage(
                          arrangeCurrentPage,
                          arrangePageSize,
                          scope.$index
                        )
                      )
                    "
                    type="text"
                    size="small"
                    >修改</el-button
                  >
                  <el-button
                    type="text"
                    style="color: #f56c6c"
                    size="small"
                    @click="
                      arrangeDelete(
                        alterPage(
                          arrangeCurrentPage,
                          arrangePageSize,
                          scope.$index
                        )
                      )
                    "
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="arrangeCurrentPage"
                :page-size="6"
                :page-sizes="[6, 10]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="arrangeData.length"
                prev-text="上一页"
                next-text="下一页"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="指标体系" name="indicator">
            <div class="leader-indicator-pane">
              <div class="flex-row-between">
                <div class="leader-indicator-top-left">
                  成绩:
                  <el-input-number
                    class="leader-indicator-grade"
                    v-model="indicator.grades[0]"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    size="small"
                  ></el-input-number>
                  至
                  <el-input-number
                    class="leader-indicator-grade"
                    v-model="indicator.grades[1]"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    size="small"
                  ></el-input-number>
                </div>
                <el-button type="primary" size="small" @click="addIndicator"
                  >添加</el-button
                >
              </div>
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="indicator.content"
                resize="none"
                style="margin: 15px 0"
              >
              </el-input>
            </div>
            <el-table
              :data="indicators"
              height="227"
              border
              style="width: 100%"
              size="medium"
            >
              <el-table-column
                prop="grades"
                label="成绩区间"
                width="230px"
                :resizable="false"
                align="center"
                ><template slot-scope="scope">
                  <div class="flex-row-around">
                    <el-input-number
                      v-if="scope.row.canEdit"
                      class="leader-indicator-grade"
                      v-model="scope.row.grades[0]"
                      controls-position="right"
                      :min="0"
                      :max="100"
                      size="small"
                    ></el-input-number>
                    <span v-else>{{ scope.row.grades[0] }}</span>
                    至
                    <el-input-number
                      v-if="scope.row.canEdit"
                      class="leader-indicator-grade"
                      v-model="scope.row.grades[1]"
                      controls-position="right"
                      :min="0"
                      :max="100"
                      size="small"
                    ></el-input-number>
                    <span v-else>{{ scope.row.grades[1] }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="content"
                label="具体指标内容"
                min-width="200px"
                :resizable="false"
                align="center"
                class-name="leader-indicator-content"
              >
                <template slot-scope="scope">
                  <el-input
                    type="textarea"
                    :rows="1"
                    placeholder="请输入内容"
                    resize="none"
                    v-model="scope.row.content"
                    :readonly="scope.row.canEdit ? false : 'readonly'"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="state"
                label="操作"
                width="150px"
                :resizable="false"
                align="center"
                ><template slot-scope="scope">
                  <div class="flex-row-around">
                    <el-button
                      type="text"
                      size="mini"
                      style="color: #409eff"
                      @click="indicatorEdit(scope.$index)"
                      >{{ scope.row.canEdit ? "确认" : "编辑" }}</el-button
                    >
                    <el-button
                      v-if="scope.row.canEdit"
                      type="text"
                      size="mini"
                      style="color: #aaa"
                      @click="indicatorCancel()"
                      >取消</el-button
                    >
                    <el-button
                      type="text"
                      size="mini"
                      style="color: #f56c6c"
                      @click="indicatorDelete(scope.$index)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <table
              class="customize-table leader-score-proportion-distribution-table"
              style="margin-top: 15px"
            >
              <thead>
                <tr>
                  <th colspan="6" style="position: relative">
                    成绩比例分配表
                    <div style="position: absolute; right: 10px; top: 0px">
                      <el-button
                        v-if="editGradeDistributionTable"
                        type="text"
                        icon="iconfont el-icon-duihao"
                        style="color: green"
                        size="mini"
                        @click="submitEditGradeDistributionTable"
                      ></el-button>
                      <el-button
                        v-if="editGradeDistributionTable"
                        type="text"
                        icon="iconfont el-icon-chahao"
                        style="color: #f56c6c"
                        size="mini"
                        @click="quitEditGradeDistributionTable"
                      ></el-button>
                      <el-button
                        v-if="!editGradeDistributionTable"
                        type="text"
                        icon="iconfont el-icon-bianji"
                        style="color: black"
                        size="mini"
                        @click="editGradeDistributionTable = true"
                      ></el-button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>答辩教师</td>
                  <td v-if="editGradeDistributionTable">
                    <div class="flex-row-around">
                      <el-input-number
                        v-model="gradeDistribution.reply"
                        :min="1"
                        :max="100"
                        :controls="false"
                        size="small"
                        style="width: 80px"
                      ></el-input-number
                      >%
                    </div>
                  </td>
                  <td v-else class="text-align-center">
                    {{
                      gradeDistribution.reply == undefined
                        ? "暂无"
                        : gradeDistribution.reply + " %"
                    }}
                  </td>

                  <td>评审教师</td>
                  <td v-if="editGradeDistributionTable">
                    <div class="flex-row-around">
                      <el-input-number
                        v-model="gradeDistribution.review"
                        :min="1"
                        :max="100"
                        :controls="false"
                        size="small"
                        style="width: 80px"
                      ></el-input-number
                      >%
                    </div>
                  </td>
                  <td v-else class="text-align-center">
                    {{
                      gradeDistribution.review == undefined
                        ? "暂无"
                        : gradeDistribution.review + " %"
                    }}
                  </td>
                  <td>指导教师</td>
                  <td v-if="editGradeDistributionTable">
                    <div class="flex-row-around">
                      <el-input-number
                        v-model="gradeDistribution.mentor"
                        :min="1"
                        :max="100"
                        :controls="false"
                        size="small"
                        style="width: 80px"
                      ></el-input-number
                      >%
                    </div>
                  </td>
                  <td v-else class="text-align-center">
                    {{
                      gradeDistribution.mentor == undefined
                        ? "暂无"
                        : gradeDistribution.mentor + " %"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="查询模块" name="query" class="leader-query">
            <div class="leader-pane-top">
              学生姓名:
              <el-select
                clearable
                v-model="searchInfo.studentName"
                placeholder="请输入学生姓名"
                size="small"
                style="width: 150px"
                filterable
              >
                <el-option
                  v-for="(item, index) in students"
                  :key="index"
                  :value="item.name"
                  :label="item.name"
                >
                </el-option>
              </el-select>
              专业:
              <el-select
                clearable
                v-model="searchInfo.profession"
                value-key="id"
                placeholder="请选择专业"
                size="small"
                style="width: 200px"
                @change="professionChange"
                filterable
              >
                <el-option
                  v-for="(item, index) in professions"
                  :key="index"
                  :value="item"
                >
                </el-option>
              </el-select>
              班级:
              <el-select
                clearable
                v-model="searchInfo.classNumber"
                placeholder="请选择班级"
                size="small"
                style="width: 150px"
              >
                <el-option
                  v-for="(item, index) in classNumbers"
                  :key="index"
                  :value="item"
                  :label="item + '班'"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                size="small"
                @click="query()"
                style="margin-left: 40px"
                >查询</el-button
              >
            </div>
            <div class="leader-pane-top">
              题目:
              <el-input
                placeholder="请输入内容"
                v-model="searchInfo.topic"
                clearable
                size="small"
                style="width: 220px"
              >
              </el-input>
              指导教师:
              <el-select
                clearable
                v-model="searchInfo.teacher"
                placeholder="请输入教师"
                size="small"
                style="width: 120px"
                filterable
              >
                <el-option
                  v-for="(item, index) in teachers"
                  :key="index"
                  :value="item.name"
                >
                </el-option>
              </el-select>
              进度:
              <el-select
                clearable
                v-model="searchInfo.progress"
                placeholder="请选择进度"
                size="small"
                style="width: 120px"
              >
                <el-option
                  v-for="(item, index) in progresses"
                  :key="index"
                  :value="item"
                >
                </el-option>
              </el-select>
              状态:
              <el-select
                clearable
                v-model="searchInfo.status"
                placeholder="请选择状态"
                size="small"
                style="width: 120px"
              >
                <el-option
                  v-for="(item, index) in states"
                  :key="index"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <el-table
              style="width: 100%"
              :height="316"
              :data="
                infos.slice(
                  (queryCurrentPage - 1) * queryPageSize,
                  queryCurrentPage * queryPageSize
                )
              "
            >
              <el-table-column
                type="index"
                width="50px"
                :resizable="false"
                align="center"
                label="序号"
                ><template slot-scope="scope">
                  <span>{{
                    (queryCurrentPage - 1) * queryPageSize + scope.$index + 1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :resizable="false"
                label="学生姓名"
                width="100px"
                prop="student.name"
              >
              </el-table-column>
              <el-table-column label="专业" width="150px" :resizable="false">
                <template slot-scope="scope">
                  <span style="white-space: nowrap">{{
                    scope.row.student.profession
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="班级" width="100px" :resizable="false">
                <template slot-scope="scope">
                  {{ scope.row.student.classNumber + "班" }}
                </template></el-table-column
              >
              <el-table-column
                label="题目"
                min-width="100px"
                :resizable="false"
              >
                <template slot-scope="scope">
                  <a
                    style="white-space: nowrap"
                    v-if="scope.row.name != null"
                    @click="
                      showDetailInfoDialog(
                        topicDetailInfo,
                        infos[
                          alterPage(
                            queryCurrentPage,
                            queryPageSize,
                            scope.$index
                          )
                        ],
                        topicDetailInfoDialogVisible
                      )
                    "
                    >{{ scope.row.name }}</a
                  >
                  <span v-else>暂无</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :resizable="false"
                label="指导教师"
                width="100"
              >
                <template slot-scope="scope">
                  <a
                    v-if="scope.row.teacher.id != null"
                    @click="
                      showDetailInfoDialog(
                        teacherDetailInfo,
                        infos[
                          alterPage(
                            queryCurrentPage,
                            queryPageSize,
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
              <el-table-column
                label="进度"
                width="100px"
                align="center"
                :resizable="false"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.student.progress == null
                      ? "暂无"
                      : scope.row.student.progress
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                width="100px"
                align="center"
                :resizable="false"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.student.status == null
                      ? "暂无"
                      : scope.row.student.status
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryCurrentPage"
                :page-size="5"
                :page-sizes="[6, 10]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="infos.length"
                prev-text="上一页"
                next-text="下一页"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
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
    <edit-arrange-info-dialog
      :arrangeInfo.sync="arrangeInfo"
      :editArrangeDialogVisible.sync="editArrangeDialogVisible"
      :canEditArrangeStudent.sync="canEditArrangeStudent"
      :refreshOperation.sync="refreshOperation"
    ></edit-arrange-info-dialog>
  </div>
</template>

<script>
import CommonHeader from "./CommonHeader.vue";
import TopicDetailInfoDialog from "./TopicDetailInfoDialog.vue";
import TeacherDetailInfoDialog from "./TeacherDetailInfoDialog.vue";
import EditArrangeInfoDialog from "./EditArrangeInfoDialog.vue";
import { showDetailInfoDialog } from "../assets/js/utils.js";
import { alterPage } from "../assets/js/utils.js";
import { deepCopy } from "../assets/js/utils.js";
import { querySearchAsync } from "../assets/js/utils.js";
import { createStateFilter } from "../assets/js/utils.js";
import { request } from "../network/request";
import Qs from "qs";

export default {
  components: {
    "common-header": CommonHeader,
    "topic-detail-dialog": TopicDetailInfoDialog,
    "teacher-detail-dialog": TeacherDetailInfoDialog,
    "edit-arrange-info-dialog": EditArrangeInfoDialog,
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
      checkPageSize: 6,
      checkCurrentPage: 1,
      information: {
        // 用户信息
        // 数据库
        id: "",
        faculty: "",
        tel: "",
        lastLogin: "",
      },

      title: {
        id: "用户编号",
        faculty: "所属院系",
        tel: "联系方式",
        lastLoginTime: "上次登录",
      },
      readonly: "readonly",
      stuMaxSelectNum: undefined,
      topicMaxSelectNum: undefined,
      dateItems: [
        {
          id: "1",
          name: "",
          startTime: "",
          endTime: "",
          state: "",
          canEdit: "",
        },
      ],

      activeName: "check",

      // 审核模块数据
      searchCheck: {
        name: "",
        teacher: "",
        approvalStatus: "未审核",
      },
      status: ["未审核", "已通过", "已退回"],
      checkData: [
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
          approvalStatus: "",
          remark: "",
        },
      ],

      // 答辩安排模块
      students: [
        {
          id: "",
          name: "",
          grade: "",
          profession: "",
          classNumber: "",
        },
      ],
      studentNames: [],
      teacherNames: [],
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
      searchArrange: {
        student: "",
        replyTeacher: "",
        reviewTeacher: "",
        place: "",
        dateTime: "",
      },
      loading: null,
      arrangeData: [
        {
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
      ],
      arrangeInfo: {
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
      extraData: {
        id: "",
        role: "",
      },
      editArrangeDialogVisible: false,
      canEditArrangeStudent: true,
      refreshOperation: -1,
      arrangeCurrentPage: 1,
      arrangePageSize: 6,
      // 指标模块数据
      indicator: {
        id: "",
        grades: [],
        content: "",
        canEdit: false,
      },
      indicators: [
        {
          id: "",
          grades: [],
          content: "",
          canEdit: false,
        },
      ],
      indicatorCurrentEditIndex: -1,
      editGradeDistributionTable: false,
      gradeDistribution: {
        reply: undefined,
        review: undefined,
        mentor: undefined,
      },
      searchInfo: {
        studentName: "",
        profession: "",
        classNumber: "",
        topic: "",
        teacher: "",
        progress: "",
        status: "",
      },
      professions: [],
      classNumbers: [],
      progresses: ["选题", "开题报告", "中期检查", "毕业设计", "毕业论文"],
      states: ["未完成", "已完成", "不合格"],
      queryPageSize: 6,
      queryCurrentPage: 1,
      currentAcademicYear:
        new Date().getMonth() + 1 >= 9
          ? new Date().getFullYear()
          : new Date().getFullYear() - 1,
      infos: [
        {
          id: "",
          name: "",
          declaredYear: "",
          type: "",
          pattern: "",
          degreeOfDifficulty: "",
          content: "",
          require: "",
          progress: "",
          finalNumber: 1,
          student: {
            id: "",
            name: "",
            profession: "",
            classNumber: "",
            progress: "",
            status: "",
          },
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
      if (this.activeName == "check") {
        this.checkPageSize = size;
      } else if (this.activeName == "arrange") {
        this.arrangePageSize = size;
      } else if (this.activeName == "query") {
        this.queryPageSize = size;
      }
    },
    handleCurrentChange(currentPage) {
      if (this.activeName == "check") {
        this.checkCurrentPage = currentPage;
      } else if (this.activeName == "arrange") {
        this.arrangeCurrentPage = currentPage;
      } else if (this.activeName == "query") {
        this.queryCurrentPage = currentPage;
      }
    },
    edit() {
      this.readonly = false;
      this.$refs.inputtel[0].focus();
    },
    blur() {
      this.readonly = "readonly";
      request(
        "/LeaderInfoUpdateServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          tel: this.information.tel,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    judgeTimeRrepeated(id, startTime, endTime) {
      for (let module of this.dateItems) {
        if (
          id != module.id &&
          ((startTime < module.endTime && startTime >= module.startTime) ||
            (endTime <= module.endTime && endTime > module.startTime)) // 空值可以跳过后两个验证
        ) {
          this.$message({
            message: "各模块时间不能交叉！",
            type: "warning",
          });
          return true;
        }
      }
      return false;
    },
    startModule(module) {
      if (
        module.id == 1 &&
        (this.stuMaxSelectNum == undefined ||
          this.stuMaxSelectNum == null ||
          this.topicMaxSelectNum == undefined ||
          this.topicMaxSelectNum == null)
      ) {
        this.$message({
          message: "限选数不能为空！",
          type: "warning",
        });
      } else if (
        module.startTime == null ||
        module.startTime == "" ||
        module.endTime == null ||
        module.endTime == ""
      ) {
        this.$message({
          message: "开始时间或结束时间不能为空！",
          type: "warning",
        });
      } else if (module.startTime >= module.endTime) {
        this.$message({
          message: "开始时间不能大于结束时间！",
          type: "warning",
        });
      } else if (new Date(module.startTime) < new Date().getTime()) {
        this.$message({
          message: "开始或结束时间不能小于当前时间！",
          type: "warning",
        });
      } else if (
        this.judgeTimeRrepeated(module.id, module.startTime, module.endTime)
      ) {
      } else {
        request(
          "/StartModuleServlet",

          Qs.stringify({
            id: this.$store.state.user.id,
            role: "leader",
            planArrange: encodeURI(JSON.stringify(module), "utf-8"),
            stuMaxSelectNum: this.stuMaxSelectNum,
            topicMaxSelectNum: this.topicMaxSelectNum,
            grade: this.currentAcademicYear - 3,
          }),

          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.dateItems = res.data.dateItems;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    //  @blur="
    // (event) => {
    //   maxNumberBlur(event, 'topicMaxSelectNum');
    // }"
    // @blur="
    //   (event) => {
    //    maxNumberBlur(event, 'stuMaxSelectNum');
    // }"
    // maxNumberBlur(event, value) {
    //   this[value] =
    //     event.target.ariaValueNow == null ||
    //     event.target.ariaValueNow == undefined
    //       ? 2
    //       : event.target.ariaValueNow;
    // },

    // dateChange(date) {
    //   console.log(date);
    //   request(
    //     "/UpdatePlanArrangeServlet",
    //     encodeURI(
    //       Qs.stringify({
    //         id: this.$store.state.user.id,
    //         jsonString: JSON.stringify(this.dateItems),
    //       }),
    //       "utf-8"
    //     ),
    //     {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     }
    //   )
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    checkQuery() {
      request(
        "/QueryTopicCheckServlet",
        Qs.stringify({
          leaderId: this.$store.state.user.id,
          topicName: this.searchCheck.name.trim(),
          teacherName: this.searchCheck.teacher,
          searchApprovalStatus: this.searchCheck.approvalStatus,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.checkData = res.data.checkData;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      // checkData = 数据库返回数据-----------------------------------------------------------
    },
    deal(graduationProject, approvalStatus, value) {
      //数据库修改 graduationProject可以获取id...-----------------------------------------------------------
      request(
        "/UpdateTopicCheckServlet",
        Qs.stringify({
          leaderId: this.$store.state.user.id,
          topicName: this.searchCheck.name.trim(),
          teacherName: this.searchCheck.teacher,
          searchApprovalStatus: this.searchCheck.approvalStatus,
          topicId: graduationProject.id,
          remark: graduationProject.remark,
          approvalStatus: value,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.result == "已删除") {
            this.$message({
              showClose: true,
              message: "课题已被教师删除无法执行操作！",
              type: "warning",
            });
          }
          this.checkData = res.data.checkData;
        })
        .catch((err) => {
          console.log(err);
        });
      graduationProject[approvalStatus] = value;
      // 评语
    },
    handleBeforeImport(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (extension != "xls" && extension != "xlsx") {
        this.$message({
          showClose: true,
          message: "仅支持.xls或.xlsx文件！",
          type: "warning",
        });
        return false;
      }
      this.extraData.id = this.$store.state.user.id;
      this.extraData.role = "leader";
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    handleImportSuccess(response, file, fileList) {
      console.log(response);
      this.arrangeData = response.arrangeData;
      this.loading.close();
    },
    arrangeQuery() {
      request(
        "/QueryReplyArrangeServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          role: "leader",
          student: this.searchArrange.student,
          replyTeacher: this.searchArrange.replyTeacher,
          reviewTeacher: this.searchArrange.reviewTeacher,
          place: this.searchArrange.place,
          dateTime: this.searchArrange.dateTime,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.arrangeData = res.data.arrangeData;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    arrangeEdit(index) {
      this.canEditArrangeStudent = true;
      this.refreshOperation = -1;
      if (index >= 0) {
        this.deepCopy(this.arrangeInfo, this.arrangeData[index]);
        this.canEditArrangeStudent = false;
      } else {
        this.arrangeInfo = {
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
        };
      }
      this.editArrangeDialogVisible = true;
    },
    arrangeDelete(index) {
      request(
        "/DeleteReplyArrangeServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
          role: "leader",
          student: this.searchArrange.student,
          replyTeacher: this.searchArrange.replyTeacher,
          reviewTeacher: this.searchArrange.reviewTeacher,
          place: this.searchArrange.place,
          dateTime: this.searchArrange.dateTime,
          studentId: this.arrangeData[index].student.id
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.arrangeData = res.data.arrangeData;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addIndicator() {
      if (this.canAdd(this.indicator, -1)) {
        this.indicator.id = new Date().getTime() + this.$store.state.user.id;
        request(
          "/AddIndicatorServket",

          Qs.stringify({
            id: this.$store.state.user.id,
            indicator: encodeURI(JSON.stringify(this.indicator), "utf-8"),
          }),

          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.indicatorCancel();
          })
          .catch((err) => {
            console.log(err);
          });

        this.indicator = {
          id: "",
          grades: [undefined, undefined],
          content: "",
          canEdit: false,
        };
      }
    },
    canAdd(indicator, index) {
      if (
        indicator.grades[0] == undefined ||
        indicator.grades[1] == undefined
      ) {
        this.$message({
          showClose: true,
          message: "成绩上限或下限不能为空!",
          type: "error",
        });
        return false;
      } else if (indicator.grades[0] >= indicator.grades[1]) {
        this.$message({
          showClose: true,
          message: "成绩下限不能大于成绩上限!",
          type: "error",
        });
        return false;
      } else if (
        this.intervalJudgment(indicator.grades[0], index) ||
        this.intervalJudgment(indicator.grades[1], index)
      ) {
        this.$message({
          showClose: true,
          message: "成绩区间不能重复!",
          type: "error",
        });
        return false;
      }
      return true;
    },
    intervalJudgment(num, index) {
      let i;
      for (i in this.indicators) {
        if (
          this.indicators[i].grades[0] <= num &&
          num <= this.indicators[i].grades[1] &&
          index != i
        ) {
          return true;
        }
      }
      return false;
    },
    indicatorEdit(index) {
      if (index == this.indicatorCurrentEditIndex) {
        if (this.canAdd(this.indicators[index], index)) {
          request(
            "/UpdateIndicatorServlet",

            Qs.stringify({
              indicator: encodeURI(
                JSON.stringify(this.indicators[index]),
                "utf-8"
              ),
            }),

            {
              "Content-Type": "application/x-www-form-urlencoded",
            }
          )
            .then((res) => {
              console.log(res);
              this.indicatorCancel();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        if (this.indicatorCurrentEditIndex != -1) {
          this.indicatorCancel();
        }
        this.indicatorCurrentEditIndex = index;
        this.indicators[index].canEdit = true;
      }
    },
    indicatorCancel() {
      request(
        "/QueryIndicatorServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.indicators = res.data.indicators;
        })
        .catch((err) => {
          console.log(err);
        });
      this.indicatorCurrentEditIndex = -1;
    },
    indicatorDelete(index) {
      request(
        "/DeleteIndicatorServlet",
        Qs.stringify({
          id: this.indicators[index].id,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          this.indicatorCancel();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submitEditGradeDistributionTable() {
      if (
        this.gradeDistribution.reply == undefined ||
        this.gradeDistribution.review == undefined ||
        this.gradeDistribution.mentor == undefined
      ) {
        this.$message({
          showClose: true,
          message: "成绩分配比例不能为空!",
          type: "error",
        });
      } else if (
        this.gradeDistribution.reply +
          this.gradeDistribution.review +
          this.gradeDistribution.mentor !=
        100
      ) {
        this.$message({
          showClose: true,
          message: "成绩分配比例设置不合理（不满足百分制）!",
          type: "error",
        });
      } else {
        request(
          "/UpdateGradeDistributionServlet",

          Qs.stringify({
            id: this.$store.state.user.id,
            gradeDistribution: encodeURI(
              JSON.stringify(this.gradeDistribution),
              "utf-8"
            ),
          }),

          {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        )
          .then((res) => {
            console.log(res);
            this.editGradeDistributionTable = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    quitEditGradeDistributionTable() {
      request(
        "/QueryGradeDistributionServlet",
        Qs.stringify({
          id: this.$store.state.user.id,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          console.log(res);
          if (res.data.gradeDistribution == null) {
            this.editGradeDistributionTable = false;
            this.gradeDistribution = {
              reply: undefined,
              review: undefined,
              mentor: undefined,
            };
          } else {
            this.editGradeDistributionTable = false;
            this.gradeDistribution.reply =
              res.data.gradeDistribution.reply == null
                ? undefined
                : res.data.gradeDistribution.reply;
            this.gradeDistribution.review =
              res.data.gradeDistribution.review == null
                ? undefined
                : res.data.gradeDistribution.review;
            this.gradeDistribution.mentor =
              res.data.gradeDistribution.mentor == null
                ? undefined
                : res.data.gradeDistribution.mentor;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    query() {
      // 查询数据库 传递searchInfo
      request(
        "/QueryProgressServlet",
        Qs.stringify({
          studentName: this.searchInfo.studentName,
          profession: this.searchInfo.profession,
          classNumber: this.searchInfo.classNumber,
          topic: this.searchInfo.topic,
          teacher: this.searchInfo.teacher,
          progress: this.searchInfo.progress,
          status: this.searchInfo.status,
          id: this.$store.state.user.id,
          grade: this.currentAcademicYear - 3,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.infos = res.data.infos;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    professionChange(value) {
      // 联动

      this.searchInfo.classNumber = "";
      this.classNumbers = [];

      request(
        "/QueryClassNumberServlet",
        Qs.stringify({
          profession: value,
          grade: this.currentAcademicYear - 3,
        }),
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
        .then((res) => {
          this.classNumbers = res.data.classNumbers;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      // this.classNumbers = this.classes.filter(
      //   (cclass) => value == cclass.profession
      // )[0]
      //   ? this.classes.filter((cclass) => value == cclass.profession)[0]
      //       .classNumbers
      //   : [];
      // console.log(this.classNumbers);
    },
    // 日期 + 编号验证
    beforeunloadFn(e) {
      // sessionStorage.setItem("test", new Date().getTime());
    },
  },
  destroyed() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },

  created() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    request(
      "/LeaderInitServlet",
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
        this.information = res.data.information;
        this.$store.commit({
          type: "updateUserName",
          newName: res.data.information.name,
        });
        this.$store.commit({
          type: "updateUser",
          newUser: {
            id: res.data.information.id,
            password: res.data.information.password,
            role: "leader",
          },
        });
        this.$store.commit;
        this.dateItems = res.data.dateItems;
        this.checkData = res.data.checkData;
        this.studentNames = res.data.studentNames;
        this.students = res.data.students;
        this.teacherNames = res.data.teacherNames;
        this.teachers = res.data.teachers;
        this.indicators = res.data.indicators;
        this.stuMaxSelectNum =
          res.data.maxOptionalNumber.stuMaxSelectNum == null
            ? undefined
            : res.data.maxOptionalNumber.stuMaxSelectNum;
        this.topicMaxSelectNum =
          res.data.maxOptionalNumber.topicMaxSelectNum == null
            ? undefined
            : res.data.maxOptionalNumber.topicMaxSelectNum;
        if (res.data.gradeDistribution == null) {
          this.gradeDistribution = {
            reply: undefined,
            review: undefined,
            mentor: undefined,
          };
        } else {
          this.gradeDistribution.reply =
            res.data.gradeDistribution.reply == null
              ? undefined
              : res.data.gradeDistribution.reply;
          this.gradeDistribution.review =
            res.data.gradeDistribution.review == null
              ? undefined
              : res.data.gradeDistribution.review;
          this.gradeDistribution.mentor =
            res.data.gradeDistribution.mentor == null
              ? undefined
              : res.data.gradeDistribution.mentor;
        }
        this.arrangeData = res.data.arrangeData;
        this.professions = res.data.professions;
        this.infos = res.data.infos;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
    refreshOperation(val, oldVal) {
      if (val >= 0) {
        this.arrangeQuery();
      }
      if (val != -1) {
        this.refreshOperation = -1;
      }
    },
  },
};
</script>

<style>
/* common样式 */

.leader-pane-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 45px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 45px;
}

/* 头部样式 */
.leader-header {
  line-height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #eee;
}
.leader-header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.leader-logo {
  height: 55px;
  width: 55px;
  border-radius: 50%;
  margin-right: 15px;
}
.leader-title {
  font-size: 28px;
  font-weight: 700;
  color: #1296db;
  text-shadow: 5px 5px 5px rgba(0, 0, 255, 0.5);
}
.leader-username {
  margin-right: 20px;
}
.leader-back {
  background-color: #1296db;
  color: white;
}
/* 左部分样式 */
.leader-left-aside {
  width: 22%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.leader-information {
  height: 210px;
  font-size: 10px;
}
.leader-edit {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.leader-edit img {
  margin-top: -15px;
  margin-right: 0;
  width: 20px;
  height: 20px;
}
.leader-avatar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 5px 0 10px;
}
.leader-user-avatar {
}
.leader-avatar span {
  display: inline-block;
  font-size: 16px;
  margin-left: 10px;
}

.leader-info-input {
  width: 130px;
  margin-top: 5px;
  text-overflow: ellipsis;
}

.leader-date {
  height: 300px;
}
.leader-date-body {
  height: 230px;
  overflow: auto;
}
.plan-divider {
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  color: #000;
  font-weight: 400;
}
.plan-divider-word {
  position: absolute;
  left: 20px;
  padding: 0 20px;
  background-color: #fff;
}
.plan-divider-state {
  height: 18px;
  width: 48px;
  position: absolute;
  right: 0px;
  background: url("../assets/img/planarrangebg.png") no-repeat;
}
.plan-divider-flex-row {
  height: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 10px;
  color: #fff;
  font-weight: 500;
  letter-spacing: 1px;
  padding-left: 2px;
  cursor: default;
}
.leader-date-body::-webkit-scrollbar {
  width: 4px !important;
}
.leader-date-item {
  width: 180px !important;
  margin-bottom: 6px;
}
.leader-max-number .el-input__inner {
  height: 25px;
  line-height: 25px;
}
.leader-max-number-body label {
  font-weight: 400;
  color: #303133 !important;
  font-size: 12px;
}
/* 右部分样式 */
.leader-right-aside {
  width: 77%;
}
/* 审核模块 */
.leader-check-top {
  margin: 5px 0 20px;
}

.leader-check-topic {
  width: 40%;
}
.leader-check-remark .cell,
.leader-indicator-content .cell {
  padding: 0 2px 0 !important;
}

.leader-check-status {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
}
.leader-check .pagination {
  margin-top: 15px;
}
.leader-indicator-pane textarea {
}
/* 安排模块 */

/* 评价指标模块 */
.leader-indicator-pane {
}
.leader-indicator-top-left {
  width: 250px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.leader-indicator-grade {
  width: 90px;
}
.leader-score-proportion-distribution-table th,
.leader-score-proportion-distribution-table td {
  width: 135px;
}
.leader-score-proportion-distribution-table-head {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
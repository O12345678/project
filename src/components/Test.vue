
<template>
  <div>
    <el-input v-model="test"></el-input>
    <div>{{test}}</div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs";
import { testRequest } from "../network/request";
export default {
  data() {
    return {
      test: null,
      name: "zs",
      num: undefined,
      people: [
        {
          name: "zs",
          age: 20,
          sex: "男",
        },
        {
          name: "ls",
          age: 30,
          sex: "女",
        },
      ],
    };
  },
  mounted() {
    console.log(JSON.stringify(this.people));
    // testRequest(
    //   "/TestServlet",
    //   encodeURI(
    //     Qs.stringify({
    //       jsonString: JSON.stringify(this.people),
    //     }),
    //     "utf-8"
    //   ),
    //   {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   }
    // )
    //   .then((result) => {
    //     console.log(result);
    //     console.log(result.data)
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // axios
    //   .post(
    //     "/apis/TestServlet",
    //     encodeURI(
    //       Qs.stringify({
    //         jsonString: JSON.stringify(this.people),
    //       }),
    //       "utf-8"
    //     ),{
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   });
  },
};

// querySearch(queryString, cb) {
//       let students = this.students;
//       let results = queryString
//         ? students.filter(this.createFilter(queryString, students))
//         : students;
//       // 调用 callback 返回建议列表的数据
//       cb(results);
//     },
//     createFilter(queryString, students) {
//       return (students) => {
//         return (
//           students.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
//           0
//         );
//       };
//     },
//     handleSelect(item) {
//       console.log(item);
//     },

// <el-autocomplete
//           class="inline-input"
//           v-model="student"
//           :fetch-suggestions="querySearch"
//           placeholder="请输入内容"
//           @select="handleSelect"
//         ></el-autocomplete>

// <el-select
//                 clearable
//                 v-model="searchArrange.student"
//                 placeholder="请选择学生"
//                 size="small"
//                 style="width: 150px"
//               >
//                 <el-option
//                   class="leader-arrange-input"
//                   v-for="(item, index) in students"
//                   :key="index"
//                   :value="item.name"
//                 >
//                 </el-option>
//               </el-select>

// v-for="(item, index) in classes.filter(
//                     (cclass) =>
//                       searchQuery.class.profession == cclass.profession
//                   ).classNumbers"

// <header class="leader-header">
//       <section class="leader-header-left">
//         <img src="../assets/img/logo.png" class="leader-logo" alt="" />
//         <span class="leader-title">高校毕业设计（论文）管理系统</span>
//       </section>
//       <section>
//         <span class="leader-username">{{
//           information.name + "，您好！"
//         }}</span>

//         <el-button size="small" class="leader-back" @click="back"
//           >退出</el-button
//         >
//       </section>
//     </header>

// <div class="leader-date-div">
//               <div>
//                 <el-divider content-position="left">选题</el-divider>
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 /><br />
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 />
//               </div>

//               <div>
//                 <el-divider content-position="left">开题</el-divider>
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 /><br />
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 />
//               </div>
//               <div>
//                 <el-divider content-position="left">中期</el-divider>
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 /><br />
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 />
//               </div>

//               <div>
//                 <el-divider content-position="left">毕业设计</el-divider>
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 /><br />
//                 <input type="date" class="date" /><input
//                   type="time"
//                   class="time"
//                 />
//               </div>
//           </div>

//       querySearchAsync(queryString, cb, people) {
//   console.log(queryString, cb);
//   let results = queryString
//     ? people.filter(this.createStateFilter(queryString))
//     : people;

//   clearTimeout(this.timeout);
//   this.timeout = setTimeout(() => {
//     cb(results);
//   }, 2000 * Math.random());
// },
// createStateFilter(queryString) {
//   return (state) => {
//     return (
//       state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
//     );
//   };
// },

// this.teachers = [
//       { value: "李明" },
//       { value: "李刚" },
//       { value: "小红" },
//       { value: "王强" },
//     ];
//     this.students = [
//       { value: "张三" },
//       { value: "李四" },
//       { value: "王二麻子" },
//       { value: "马六" },
//     ];

// indictorEdit(index, row) {
//       console.log(index);
//       if (index == this.currentEditIndex) {
//         this.indictors[index].isEdit = false;
//         this.currentEditIndex = -1;
//         //数据库
//       } else {
//         this.currentEditIndex = index;
//         this.currentIndictor = Object.assign({}, this.indictors[index]);
//         this.indictors[index].isEdit = true; // 这里注意顺序
//         console.log(this.indictors[index].isEdit);
//         console.log(this.currentIndictor);
//         console.log(this.indictors[index]);
//         console.log(row.grades)
//         //数据库
//       }
//     },
//     indictorCancel(index, row) {
//       Vue.set(this.indictors, index, Object.assign({}, this.currentIndictor)); // 受上面顺序影响

//       this.currentEditIndex = -1;
//     },

// <template>
//   <div>
//     <div v-for="(value, key) in information" :key="key">
//       {{ information[key] + ":" }}
//       <input
//         v-if="key != 'name'"
//         type="text"
//         v-model="information[key]"

//       />
//     </div>
//   </div>
// </template>

// <script>
// export default {
//   data() {
//     return {
//       information: {
//       id: "20175308",
//       name: '张三',
//       department: "计算机科学与工程学院",
//       tel: "123456789",
//       lastLogin: "2017-02-02",
//     }
//     }
//   }
// }
//
//

//   <el-dialog
//       title="编辑答辩安排信息"
//       :visible.sync="arrangeEditDialogVisible"
//       :show-close="false"
//       :close-on-click-modal="false"
//       custom-class="edit-arrange-info"
//     >
//       <el-form ref="arrangeInfo" :model="arrangeInfo">
//         <div class="flex-row-between">
//           <el-form-item label="学生姓名:">
//             <el-select
//               clearable
//               v-model="arrangeInfo.student"
//               value-key="id"
//               placeholder="请输入学生姓名"
//               size="small"
//               style="width: 150px"
//               filterable
//               key="arrangeDialogStu"
//             >
//               <el-option
//                 v-for="(item, index) in students"
//                 :key="index"
//                 :value="item"
//                 :label="item.name"
//               >
//               </el-option>
//             </el-select>
//           </el-form-item>
//           <el-form-item label="答辩地点:">
//             <el-select
//               clearable
//               v-model="arrangeInfo.place"
//               placeholder="请选择地点"
//               size="small"
//               style="width: 150px"
//               key="arrangeDialogPlace"
//             >
//               <el-option
//                 v-for="(item, index) in places"
//                 :key="index"
//                 :value="item"
//               >
//               </el-option>
//             </el-select>
//           </el-form-item>
//         </div>
//         <div class="flex-row-between" style="margin: 15px 0 15px">
//           <el-form-item label="学生姓名:"> </el-form-item>
//           <el-form-item label="学生姓名:"> </el-form-item>
//         </div>
//       </el-form>

//       <div>
//         <div class="flex-row-between">
//           <!-- 注意label对象 value-key 不理解-->
//           学生姓名: 答辩地点:
//           <el-select
//             clearable
//             v-model="arrangeInfo.place"
//             placeholder="请选择地点"
//             size="small"
//             style="width: 150px"
//             key="arrangeDialogPlace"
//           >
//             <el-option
//               v-for="(item, index) in places"
//               :key="index"
//               :value="item"
//             >
//             </el-option>
//           </el-select>
//         </div>
//         <div class="flex-row-between" style="margin: 15px 0 15px">
//           答辩老师: 评审老师:
//           <el-select
//             clearable
//             v-model="arrangeInfo.teacher2"
//             value-key="id"
//             placeholder="请输入教师"
//             size="small"
//             style="width: 150px"
//             filterable
//             key="arrangeDialogTeacher2"
//           >
//             <el-option
//               v-for="(item, index) in teachers"
//               :key="index"
//               :value="item"
//               :label="item.name"
//             >
//             </el-option>
//           </el-select>
//         </div>

//         答辩时间:
//         <el-date-picker
//           v-model="searchArrange.replyTime"
//           type="datetimerange"
//           range-separator="至"
//           start-placeholder="开始日期"
//           end-placeholder="结束日期"
//           size="small"
//           style="width: 360px; margin-left: 10px"
//           value-format="yyyy-MM-dd HH:mm:ss"
//           key="arrangeDialogDate"
//         >
//         </el-date-picker>
//       </div>

//       <div slot="footer" class="dialog-footer">
//         <el-button @click="quitEditArrange">取 消</el-button>
//         <el-button type="primary" @click="submitEditArrange">确 定</el-button>
//       </div>
//     </el-dialog>

// this.$refs["userInfo"].validate((valid) => {
//   if (valid) {
//     this.arrangeEditDialogVisible = false;
//     if (this.arrangeCurrentIndex >= 0) {
//       this.deepCopy(
//         this.arrangeData[this.arrangeCurrentIndex],
//         this.arrangeInfo
//         // 修改数据库
//       );
//     } else {
//       console.log(this.arrangeInfo);
//       this.arrangeData.push(this.arrangeInfo);
//       // 添加数据库
//     }
//   } else {
//     return false;
//   }
// });


 // this.topicData = [
    //   {
    //     id: "1",
    //     name: "基于PVDF压电薄膜的动态称重系统的研发",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "1",
    //       name: "林玟书",
    //       jobTitle: "讲师",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "本科",
    //       academicDegree: "学士学位",
    //       tel: "12345678960",
    //       email: "12345678960@qq.com",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },

    //   {
    //     id: "2",
    //     name: "智能快递分拣系统设计",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "2",
    //       name: "林国瑞",
    //       jobTitle: "副教授",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "博士",
    //       academicDegree: "博士学位",
    //       tel: "",
    //       email: "",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },
    //   {
    //     id: "3",
    //     name: "城市交通污染物扩散速度自动检测软件设计研究",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "较难 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 2,
    //     totalNum: 2,
    //     teacher: {
    //       id: "3",
    //       name: "张吉惟",
    //       jobTitle: "教授",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "",
    //       email: "12345678@qq.com",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },
    //   {
    //     id: "4",
    //     name: "风光互补路灯控制器的设计",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "4",
    //       name: "黎明",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "教授",
    //       educationLevel: "博士",
    //       academicDegree: "博士学位",
    //       tel: "15864793250",
    //       email: "",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },
    //   {
    //     id: "5",
    //     name: "基于数据挖掘技术的电力调度系统设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "5",
    //       name: "王明",
    //       jobTitle: "讲师",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "13645879123",
    //       email: "wm123@163.com",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },
    //   {
    //     id: "6",
    //     name: "基于移动互联网的办公自动化系统设计",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 2,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       jobTitle: "副教授",
    //       faculty: "计算机科学与工程学院",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },

    //   {
    //     id: "7",
    //     name: "基于云计算的酒店信息化管理系统建设",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 0,
    //     totalNum: 2,
    //     teacher: {
    //       id: "7",
    //       name: "黄文隆",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "教授",
    //       educationLevel: "博士",
    //       academicDegree: "博士学位",
    //       tel: "15678941230",
    //       email: "hwl15678941230@163.com",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //     isNew: false,
    //     canEdit: false,
    //   },
    // ];
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    //   {
    //     id: "8",
    //     name: "无人机任务管理系统的设计与实现",
    //     declaredYear: "2020-2021学年",
    //     type: "设计",
    //     pattern: "学生自选",
    //     degreeOfDifficulty: "简单 ",
    //     content: "...",
    //     require: "...",
    //     selectNum: 1,
    //     totalNum: 2,
    //     teacher: {
    //       id: "6",
    //       name: "李中冰",
    //       faculty: "计算机科学与工程学院",
    //       jobTitle: "副教授",
    //       educationLevel: "硕士",
    //       academicDegree: "硕士学位",
    //       tel: "18845796321",
    //       email: "",
    //     },
    //   },
    // ];
</script>

<style>
</style>

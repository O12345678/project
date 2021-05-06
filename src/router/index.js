import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Test from '../components/Test.vue'
import Leader from '../components/Leader.vue'
import Student from '../components/Student.vue'
import Administrator from '../components/Administrator.vue'
import ReplyArrangeGather from '../components/ReplyArrangeGather.vue'
import ReviewSummary from "../components/ReviewSummary.vue"
import SelectTopicSummary from "../components/SelectTopicSummary.vue"
import TeacherInfoManage from "../components/TeacherInfoManage.vue"
import StudentInfoManage from "../components/StudentInfoManage.vue"
import Teacher from "../components/Teacher.vue"
import SelectTopicInfo from "../components/SelectTopicInfo.vue"
import AddSelectTopic from "../components/AddSelectTopic.vue";
import InstructStudents from "../components/InstructStudents.vue";
import EmptySelectTopic from '../components/EmptySelectTopic.vue'
import ChildrenTest from "../components/ChildrenTest.vue"
import InstructStudentsInfo from "../components/InstructStudentsInfo.vue"
import InstructStudentsInfoReportRecord from "../components/InstructStudentsInfoReportRecord.vue"
import TeacherTaskBookIssue from "../components/TeacherTaskBookIssue.vue"
import InstructTeacherReview from "../components/InstructTeacherReview.vue"
Vue.use(Router)

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/teacher'
  },
  {
    path: '/test',
    component: Test
  },
  {
    path: '/childrentest',
    component: ChildrenTest
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/leader',
    component: Leader
  },
  {
    path: '/student',
    component: Student
  },
  {
    path: '/administrator',
    component: Administrator,
    children: [{
      path: '/',
      redirect: '/administrator/studentinfomanage'
    }, {
      path: 'replyarrangegather',
      component: ReplyArrangeGather
    }, {
      path: 'reviewsummary',
      component: ReviewSummary
    }, {
      path: 'selecttopicsummary',
      component: SelectTopicSummary
    }, {
      path: 'teacherinfomanage',
      component: TeacherInfoManage
    }, {
      path: 'studentinfomanage',
      component: StudentInfoManage
    }]
  },
  {
    path: '/teacher',
    component: Teacher,
    children: [
      // {
      //   path: '/',
      //   redirect: '/teacher/addselecttopic'
      // },
      {
        path: 'addselecttopic',
        component: AddSelectTopic,
      },
      {
        path: 'instructstudents',
        component: InstructStudents,
        // children: [
        //   {
        //     path: ':studentName',
        //     component: InstructStudentsInfo,
        //     children: [
        //       {
        //         path: '任务书',
        //         component: TeacherTaskBookIssue
        //       },
        //       {
        //         path: ':moduleName',
        //         component: InstructStudentsInfoReportRecord
        //       },
        //       {
        //         path: '评审',
        //         component: InstructTeacherReview
        //       }
        //     ]
        //   }
        // ]
        // children: [{
        //   path: 'topic' + ':topicIndex',
        //   component: SelectTopicInfo
        // }]
      }
    ]

  }
]

export default new Router({
  routes,
  mode: 'history',
})

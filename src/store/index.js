import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: {
            id: "",
            password: "",
            role: '',
        },
        userName: '',
        myTopic: {
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
        myTeacher: {
            id: "",
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
        },
        teacherMyInfo: {
            id: "",
            name: "",
            faculty: "",
            jobTitle: "",
            educationLevel: "",
            academicDegree: "",
            tel: "",
            email: "",
        },
        activeModule: "选题",
        teacherShowPage: '/teacher/addselecttopic',
        instructStudentInfo:
        {
            id: "",
            name: "",
            studentId: "",
            studentName: "",
        },
    },
    mutations: {
        // 设置id
        // 同步异步需要处理
        updateUser(state, payload) {
            state.user = payload.newUser;
        },
        updateUserName(state, payload) {
            state.userName = payload.newName
        },
        updatePassword(state, payload) {
            state.user.password = payload.newPassword;
        },
        updateMyTopic(state, payload) {
            state.myTopic = payload.newTopic;
        },
        updateMyTeacher(state, payload) {
            state.myTeacher = payload.newTeacher;
        },
        updateTeacherMyInfo(state, payload) {
            state.teacherMyInfo = payload.newInfo;
            console.log("vuex gengxin ")
            console.log(payload.newInfo);
        },
        updateActiveModule(state, payload) {
            state.activeModule = payload.activeModule;
        },
        updateInstructStudentInfo(state, payload) {
            state.instructStudentInfo = payload.newInstructStudentInfo;
        },
    }
});

export default store


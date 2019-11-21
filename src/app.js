import Vue from 'vue'
import Vuex from 'vuex'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import app from './app.vue'
import $ from 'jquery'
import Viewer from 'v-viewer'

//引入我们自己的插件
import MyPluginAddConfig from './myPlugin';
//引入vue图片预览插件
import VuePreview from 'vue-preview';
//路由插件
import VueRouter from 'vue-router';
//引入vue-resource插件
import VueResource from 'vue-resource';

//==============================================引入mui中的css
import '../static/render/css/mui.css';

//==============================================引入自己的css
import '../static/css/global.css';

import 'viewerjs/dist/viewer.css'

import Login from './login/login.vue'//登录页
import Home from './home/home.vue'//首页
import Host from './login/host.vue'//域名登录页面
import Repairman from './GIS/repairman.vue'//GIS地图维修人员页面
import RepairmanOrder from './GIS/repairmanOrder.vue'//GIS地图维修人员详情页面
import Community from './GIS/community.vue'//GIS地图小区页面
import CommunityOrder from './GIS/communityOrder.vue'//GIS地图小区工单页面
import WorkLine from './GIS/workline.vue'//GIS地图工作轨迹
import ComponyStatistics from './statistics/componyStatistics.vue'//热力公司工单统计页面
import RepairmanStatistics from './statistics/repairmanStatistics.vue'//维修人员情况统计
import RepairTeamStatistics from './statistics/repairTeamStatistics.vue'//维修队工单统计
import ToAccept from './toAccept/toAccept.vue'//待接收工单页面
import WorkOrderPond from './workOrderPond/workOrderPond.vue'//工单池页面
import TeamOrder from './teamOrder/teamOrder.vue'//维修队工单页面
import MyWorkOrder from './myWorkOrder/myWorkOrder.vue'//我的工单页面
import Delay from './myWorkOrder/delay.vue'//延时申请页面
import Reassignment from './myWorkOrder/reassignment.vue'//工单改派页面
import WorkOrderReply from './myWorkOrder/workOrderReply.vue'//工单回复页面
import workOrderReplyResult from './myWorkOrder/workOrderReplyResult.vue'//工单回复处理结果
import WorkOrderDetails from './myWorkOrder/workOrderDetails.vue'//工单详情页面
import WorkOrderBack from './myWorkOrder/workOrderBack.vue'//工单退回页面
import AllOfWorkorder from './myWorkOrder/allOfWorkorder.vue'//全部工单页面
import WorkOrderStep from './myWorkOrder/workOrderStep.vue'//工单步骤页面
import WorkOrderAssign from './myWorkOrder/workOrderAssign.vue'//工单分派页面
import ChangeInfo from './setting/changeInfo.vue'//修改信息页面
import ChangePassword from './setting/changePassword.vue'//修改密码页面
import Versions from './setting/versions.vue'//版本升级页面
import MyFollow from './myFollow/myfollow.vue'//我的关注页面

//Audit项目
import AuditRecord from './audit/AuditRecord.vue'//稽查记录
import Blacklist from './audit/Blacklist.vue'//黑名单
import PendingAudit from './audit/PendingAudit.vue'//待稽查
import PendingDeal from './audit/PendingDeal.vue'//待处理


//===============================================生命组件
import ScrollTop from './component/scrollTop.vue'//添加返回顶部组件
import Spinner from './component/spinner.vue'


//安装插件
//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})
Vue.use(MintUI);
Vue.use(Vuex);
//安装预览插件
Vue.use(VuePreview);
Vue.use(VueRouter)
Vue.use(VueResource); //此时有this.$http
//安装我们自己的插件挂载config属性
Vue.use(MyPluginAddConfig);
//============================================路由====================================>
var router = new VueRouter({
    //默认使用hash模式
    //mode: 'history',
    routes: [
        { path: '/', redirect: "/login", meta: { keepAlive: false } },
        { path: "/login", component: Login, meta: { keepAlive: false } },
        { path: "/host", component: Host, meta: { keepAlive: true } },
        { path: "/home", component: Home, name: "Home", meta: { keepAlive: true } },
        { path: "/GIS/repairman", name: "Repairman", component: Repairman, meta: { keepAlive: false } },
        { path: "/GIS/repairmanOrder/:id/:RepairUserName", name: "RepairmanOrder", component: RepairmanOrder, meta: { keepAlive: true } },
        { path: "/GIS/community", name: "Community", component: Community, meta: { keepAlive: false } },
        { path: "/GIS/communityOrder/:id/:CommunityName/:lng/:lat", name: "CommunityOrder", component: CommunityOrder, meta: { keepAlive: true } },
        { path: "/GIS/workline/:id", component: WorkLine, meta: { keepAlive: false } },
        { path: "/statistics/repairmanStatistics", name: "RepairmanStatistics", component: RepairmanStatistics, meta: { title: "RepairmanStatistics", keepAlive: false } },
        { path: "/statistics/repairTeamStatistics", name: "RepairTeamStatistics", component: RepairTeamStatistics, meta: { title: "RepairmanStatistics", keepAlive: false } },
        { path: "/statistics/componyStatistics", name: "ComponyStatistics", component: ComponyStatistics, meta: { title: "ComponyStatistics", keepAlive: true } },
        { path: "/myWorkOrder/toAccept", name: "ToAccept", component: ToAccept, meta: { title: "ToAccept", keepAlive: true } },
        { path: "/myWorkOrder/workOrderPond", name: "WorkOrderPond", component: WorkOrderPond, meta: { title: "WorkOrderPond", keepAlive: true } },
        { path: "/myWorkOrder/teamOrder", name: "TeamOrder", component: TeamOrder, meta: { title: "TeamOrder", keepAlive: true } },
        { path: "/myWorkOrder", name: "MyWorkOrder", component: MyWorkOrder, meta: { title: "MyWorkOrder", keepAlive: true } },
        { path: "/myWorkOrder/delay/:WorkBillID/:FlowID/:FlowInstantID/:FlowNodeID/:FlowToDoTS/:latestVersion/:ContactPerson", name: "Delay", component: Delay, meta: { title: "Delay", keepAlive: true }, },
        { path: "/myWorkOrder/reassignment/:WorkBillID/:FlowID/:FlowInstantID/:FlowNodeID/:FlowToDoTS/:latestVersion/:source/:ContactPerson", name: "Reassignment", component: Reassignment, meta: { title: "Reassignment", keepAlive: true }, },
        { path: "/myWorkOrder/workOrderReply/:WorkBillID/:FlowID/:FlowInstantID/:FlowNodeID/:FlowToDoTS/:latestVersion", name: "WorkOrderReply", component: WorkOrderReply, meta: { title: "WorkOrderReply", keepAlive: true }, },
        { path: "/myWorkOrder/workOrderReplyResult", name: "workOrderReplyResult", component: workOrderReplyResult, meta: { title: "workOrderReplyResult", keepAlive: false }, },
        { path: "/myWorkOrder/workOrderDetails/:WorkBillID/:FlowID/:FlowInstantID/:FlowNodeID/:FlowToDoTS/:latestVersion", name: "WorkOrderDetails", component: WorkOrderDetails, meta: { keepAlive: false } },
        { path: "/myWorkOrder/workOrderBack/:WorkBillID/:FlowID/:FlowInstantID/:FlowNodeID/:FlowToDoTS/:latestVersion/:source", name: "WorkOrderBack", component: WorkOrderBack, meta: { keepAlive: true } },
        { path: "/myWorkOrder/workOrderStep/:WorkBillID", component: WorkOrderStep,name:"WorkOrderStep", meta: { keepAlive: false } },
        { path: "/myWorkOrder/allOfWorkorder/:roomid/:workBillID", component: AllOfWorkorder, meta: { keepAlive: true } },
        { path: "/myWorkOrder/workOrderAssign/:WorkBillID/:FlowID/:FlowInstantID/:FlowNodeID/:FlowToDoTS/:latestVersion/:source", component: WorkOrderAssign, meta: { keepAlive: true } },
        { path: "/setting/changeInfo", component: ChangeInfo, meta: { keepAlive: false } },
        { path: "/setting/changePassword", component: ChangePassword, meta: { keepAlive: false } },
        { path: "/setting/versions", component: Versions, meta: { keepAlive: false } },
        { path: "/myFollow/myfollow", component: MyFollow, meta: { keepAlive: false } },
        { path: "/AuditRecord", component: AuditRecord },
        { path: "/Blacklist", component: Blacklist },
        { path: "/PendingAudit", component: PendingAudit },
        { path: "/PendingDeal", component: PendingDeal },

    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop
            }
            return { x: 0, y: to.meta.savedPosition || 0 }
        }
    }
})
// router.addRoutes()


//===================================Vuex管理=====================================>
var store = new Vuex.Store({
    state: {
        communityID:'',
        inspectionID:'',
        UserInfo: {},//登陆用户信息
        Permisions: [],//用户权限
        assign: false,//工单分派权限
        sideBarOpened: false,
        saveWorkBill: "",
        // ========================判断手机平台
        isIOS: false,
        //=========================工单节点操作
        operateType: false,//工单操作状态
        workBillIndex: null,//选中工单号
        AddTime: "",//保存受理时间
        wordOrderReplyResult: null,//工单回复中的处理结果
        valueLength: 0,
        ReplyResultDelete:false,
        //=========================新工单信息
        HouseAddress: "",//客户地址
        toAcceptNew: 0,//待接收
        workOrderPoolNew: 0,//工单池
        //=========================小区位置
        community: false,
        position: false,
        lng: "",
        lat: "",
        // ========================保存版本号
        newVersions: "",
        versions: "",
        //=========================放置公用状态
        count: 1,
        isNewWorkOrder: false,
        isChecked: false,
        //判断是否在登录页面跳转
        isLogin: false,

        //判断工单详情页页面跳转来源
        isMyWorkOrder: "community",
        finishText:'',

    },
    getters: {
        changeState: state => {
            //相当于vue实例中的methods,用于处理公用data
            //自vuex 面向组件的数据处理
        },
        count(state) {
            return state.count += 100
        }
    },
    mutations: {
        //写法与getters相类似
        //组件想要对于vuex 中的数据进行的处理
        //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
        //内部操作必须在此刻完成(同步)
        add(state) {
            state.count += 1;
            console.log(state.count)
        },
        reduce(state) {
            state.count -= 1;
            console.log(state.count)
        },
        //接收到新工单
        acceptNewWorkOrder(state) {
            state.isNewWorkOrder = true
        },
        //新工单已查看
        checked(state) {
            state.isChecked = true
        }
    },
    actions: {
        //使得mutations能够实现异步调用，实现例如延迟调用
        increment({ commit }, payload) {
            commit('突变方法名')
            //payload应该是一个对象，可通过模板方法调用传入对象的方式将数据从组件传入vuex
        },
        asyncIncrement({ commit }) {
            setTimeout(() => {
                commit('increment')
            }, 1000)
        }
    },
    modules: {
        //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
    }
});


//=====================================添加组件=====================================>
Vue.component("my-scrollTop", ScrollTop)
Vue.component("my-spinner", Spinner)

new Vue({
    el: "#app",
    router,//使用路由
    store,//使用stroe
    render: c => c(app),
})

// 自定义指令
import { Toast } from "mint-ui"; //引入mint-ui插件
Vue.directive('lfcous', function (el, pra, a) {
    if ($(".mint-field-core").eq(-1).val()) {
        let valueLength = $(".mint-field-core").eq(-1).val().length
        if (valueLength >= 100) {
            try {
                plus.nativeUI.toast("输入字数不得超过100字");
            } catch (e) {
                Toast("输入字数不得超过100字")
            }
        }
        a.context.$store.ReplyResultDelete = true
        a.context.valueLength = valueLength
    } else {
            a.context.valueLength = 0
    }
    if(a.context.$store.wordOrderReplyResult){
        if(!a.context.$store.ReplyResultDelete){
            $(".mint-field-core").eq(-1).val(a.context.$store.wordOrderReplyResult)
        }
    }

})


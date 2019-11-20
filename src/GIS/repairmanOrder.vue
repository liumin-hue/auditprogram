<template>
  <div id="big-box">
      <mt-header fixed :title="repairmanName" id="GIS_repairman">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goBack()"></mt-button>
        </router-link>
        <mt-button icon="more" slot="right" @click="address()"></mt-button>
      </mt-header>
      <!-- 工单navbar -->
    <div class="nav clearfix">
      <span class="tab_btn">
        <div id="wait_for_reply" size="small" @click="wait_for_reply()" :class="active == 'wait_for_reply' ? 'checked' : '' ">待回复</div>
        <div id="reply_record" size="small" @click="reply_record()" :class="active == 'reply_record' ? 'checked' : '' ">待接收</div>
      </span>
    </div>
      <!-- 工单内容 -->
    <div class="page-tab-container">
      <mt-tab-container class="page-tabbar-tab-container" v-model="active">
        <mt-tab-container-item id="wait_for_reply">
          <!-- 下拉刷新 -->
            <mt-loadmore :top-method="wait_loadTop" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore_wait" :bottom-method="loadMoreWait" :bottom-all-loaded="allLoaded_wait" :auto-fill="false">
              <div slot="top" class="mint-loadmore-top">
                  <span class="mui-icon mui-icon-pulldown" v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }"></span>
                  <mt-spinner color="#26a2ff" type="snake" v-show="topStatus === 'loading'"></mt-spinner>
                  <span v-show="topStatus === 'drop'">释放更新</span>
              </div>
            <!-- cell组件 -->
            <div v-for="(confirm,index) in confirms"  :key="confirm.id" class="workOrder_cell" :ref="confirm.WorkBillID" @click="workBillIndex(index)">
              <router-link :to="{path:'/myWorkOrder/workOrderDetails/' + confirm.WorkBillID + '/' + confirm.FlowID + '/' + confirm.FlowInstantID + '/' + confirm.FlowNodeID + '/' + confirm.FlowToDoTS + '/' + confirm.latestVersion}">
                <div class="address">{{confirm.HouseAddress}}</div>
                <div class="time">{{confirm.AddTime}}<span class="timeout" v-show="confirm.IsOutTime"></span><span class="workOrderType">{{confirm.BillTypeName}}</span></div>
              </router-link>
            </div>
            <!-- 上拉加载 -->
              <div slot="bottom" class="mint-loadmore-bottom" v-show="total == 0 ? false : true">
                  <span class="" v-show="bottomStatus === 'pull' && !allLoaded_wait" :class="{ 'rotate': bottomStatus === 'drop' }">上拉加载</span>
                  <span class="" v-show="bottomStatus === 'pull' && allLoaded_wait" :class="{ 'rotate': bottomStatus === 'drop' }">全部加载</span>
                  <mt-spinner color="#26a2ff" type="fading-circle" v-show="bottomStatus === 'loading'"></mt-spinner>
                  <span v-show="bottomStatus === 'drop'">释放加载</span>
              </div>
          </mt-loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="reply_record">
          <!-- 下拉刷新 -->
          <mt-loadmore :top-method="reply_loadTop" @top-status-change="handleTopChange_reply" @bottom-status-change="handleBottomChange_reply" ref="loadmore_reply" :bottom-method="loadMoreReply" :bottom-all-loaded="allLoaded_reply" :auto-fill="false">
              <!-- 下拉刷新 -->
              <div slot="top" class="mint-loadmore-top">
                  <span class="mui-icon mui-icon-pulldown" v-show="topStatus_reply === 'pull'" :class="{ 'rotate': topStatus_reply === 'drop' }"></span>
                  <mt-spinner color="#26a2ff" type="snake" v-show="topStatus_reply === 'loading'"></mt-spinner>
                  <span v-show="topStatus_reply === 'drop'">释放更新</span>
              </div>
            <!-- cell组件 -->
              <div v-for="(reply,index) in replys"  :key="reply.id" class="workOrder_cell" :ref="reply.WorkBillID">
                <router-link :to="{path:'/myWorkOrder/workOrderDetails/' + reply.WorkBillID + '/' + reply.FlowID + '/' + reply.FlowInstantID + '/' + reply.FlowNodeID + '/' + reply.FlowToDoTS + '/' + reply.latestVersion}">
                  <div class="address">{{reply.HouseAddress}}</div>
                  <div class="time">{{reply.AddTime}}<span class="timeout" v-show="reply.IsOutTime"></span><span class="workOrderType">{{reply.BillTypeName}}</span></div>
                </router-link>
              </div>
              <!-- 上拉加载 -->
              <div slot="bottom" class="mint-loadmore-bottom" v-show="total_reply == 0 ? false : true">
                  <span class="" v-show="bottomStatus_reply === 'pull' && !allLoaded_reply" :class="{ 'rotate': bottomStatus_reply === 'drop' }">上拉加载</span>
                  <span class="" v-show="bottomStatus_reply === 'pull' && allLoaded_reply" :class="{ 'rotate': bottomStatus_reply === 'drop' }">全部加载</span>
                  <mt-spinner color="#26a2ff" type="fading-circle" v-show="bottomStatus_reply === 'loading'"></mt-spinner>
                  <span v-show="bottomStatus_reply === 'drop'">释放加载</span>
              </div>
          </mt-loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <my-scrollTop :total=" active == 'wait_for_reply' ? total : total_reply" :current="active == 'wait_for_reply' ? current : current_reply" ref="scrollTop"></my-scrollTop>
    <my-spinner :showSpinner="isLoading"></my-spinner>
  </div>
</template>
<script>
//引入mint-ui插件
import {
  MessageBox,
  TabContainer,
  TabContainerItem,
  Toast,
  Loadmore,
  Spinner,
  Popup
} from "mint-ui";
//调用vuex插件
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

var choosed = "wait_for_reply";
var fromPath = ""

export default {
  data() {
    return {
      active: "wait_for_reply",
      repairmanName:"",
      repairmanID:null,
      confirms: [], //待回复
      replys: [], //回复记录
      popupVisible: false,
      topStatus: "",
      topStatus_reply:"",
      bottomStatus: "",
      bottomStatus_reply: "",
      allLoaded_wait: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      allLoaded_reply: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      isLoading: true,
      a_topDistance: 0, //滚动条位置
      b_topDistance: 0, //滚动条位置
      pageSize: 20,
      pageNum: 1,
      pageSize_reply: 20,
      pageNum_reply: 1,
      total: 0, //工单总数
      total_reply: 0, //工单总数
      current: 0, //当前工单序列号
      current_reply: 0, //当前工单序列号
      hostPath:"/api/MyWorkBill/GetWaitReplyBillsByDate",//路由路径
    };
  },
  //监听变化
  watch: {
    active: function(val, oldVal) {
      if (val === "reply_record") {
        this.a_topDistance = window.scrollY;
        window.scrollTo(0, this.b_topDistance);
        choosed = "reply_record";
      } else {
        this.b_topDistance = window.scrollY;
        window.scrollTo(0, this.a_topDistance);
        choosed = "wait_for_reply";
      }
    },
  },
  //进入前
  beforeRouteEnter: (to, from, next) => {

    fromPath = from.name
    next();
  },
  //跳转前
  //keep-alive切换钩子
  activated() {
    console.log("进入了");
    console.log(this.$store.state.isNewWorkOrder);
    this.repairmanName = this.$route.params.RepairUserName
    this.repairmanID = this.$route.params.id
    this.active = choosed;
    //获取子组件公用方法
    this.$refs.scrollTop.getIndex();

    //检查是否有节点被操作
    if (this.$store.state.saveWorkBill !== "") {
      let bill = this.$store.state.saveWorkBill;
      this.$refs.bill[0].hidden = true;
    }

    //判断工单节点是否被操作
    if(this.$store.operateType){
      this.isLoading = true
      this.confirms.splice(this.$store.workBillIndex,1)
      this.$store.operateType = !this.$store.operateType
      this.total -= 1
      let _this = this
      setTimeout(function(){
        _this.isLoading = false
      },1000)
    }

    //判断前一页是否为home
    if(fromPath == "Repairman" || fromPath == "Home"){
      // 初始化数据
      this.confirms = []
      this.replys = []
      this.a_topDistance = 0
      this.b_topDistance = 0
      this.total= 0
      this.total_reply= 0
      this.current= 0
      this.current_reply= 0
      this.isLoading = true
      //刷新页面
      this.hostPath = "/api/MyWorkBill/GetWaitReplyBillsByDate";
      this.reply_record()
      this.wait_for_reply();
    }
  },
  //挂载完成钩子
  mounted() {

  },
  //更新完成钩子
  updated() {},
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    moreFunc() {
      this.popupVisible = !this.popupVisible;
    },
    address(){
      this.$router.push({path:"/GIS/workline/" + this.repairmanID});
    },
    //下拉刷新
    wait_loadTop: function() {
      let hostPath = this.hostPath;
      this.$myFun.loadTop(this, "confirms", hostPath, "loadmore_wait");
    },
    reply_loadTop: function() {
      let hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByDate";
      this.$myFun.loadTop_reply(this, "replys", hostPath, "loadmore_reply");
    },
    handleTopChange: function(status) {
      this.current = 1
      this.topStatus = status;
    },
    handleTopChange_reply(status){
      this.current_reply = 1
      this.topStatus_reply = status;
    },
    handleBottomChange(status){
      this.$myFun.getIndex(this, "current");
      if(status == "pull"){
        let _this = this
        setTimeout(function(){
          _this.bottomStatus = status
        },500)
      }else{
        this.bottomStatus = status
      }
    },
    handleBottomChange_reply(status){
      this.$myFun.getIndex(this, "current_reply");
      if(status == "pull"){
        let _this = this
        setTimeout(function(){
          _this.bottomStatus_reply = status
        },500)
      }else{
        this.bottomStatus_reply = status
      }
    },
    //记录工单索引号
    workBillIndex(index){
      this.$store.workBillIndex = index
    },
    //点击待回复
    wait_for_reply() {
      this.pageNum = 1
      this.active = "wait_for_reply";
      let _this = this
      this.isLoading = true
      setTimeout(function(){
        window.scrollTo(0,0)
        _this.wait_loadTop()
      },1000)
    },
    //点击回复记录
    reply_record() {
      this.pageNum_reply = 1
      this.active = "reply_record";
      let _this = this
      this.isLoading = true
      setTimeout(function(){
        window.scrollTo(0,0)
        _this.reply_loadTop()
      },1000)
    },
    //上拉加载
    loadMoreWait() {
      let hostPath = this.hostPath
      //获取当前索引
      this.$myFun.getIndex(this,"current");
      this.$myFun.loadMore(this,"confirms",hostPath,"loadmore_wait")
    },
    loadMoreReply(){
      let hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByDate"
      //获取当前索引
      this.$myFun.getIndex(this,"current_reply");
      this.$myFun.loadMore_reply(this,"replys",hostPath,"loadmore_reply")
    },
  }
};
</script>
<style scoped>
.item {
  display: inline-block;
}

.nav {
  background-color: #efeff4;
  padding: 0.15rem 0 0.13rem 0;
  text-align: center;
  position: fixed;
  top: 0.44rem;
  width: 100%;
  z-index: 9;
}

.link {
  color: inherit;
  padding: 20px;
  display: block;
}

/* 按钮样式 */
.nav .tab_btn > div {
  width: 1.2rem;
  height: 0.3rem;
  line-height: 0.32rem;
  float: left;
  font-size: 0.13rem;
  color: #49a9ea;
  box-shadow: 0 0 0.01rem #49a9ea;
  background-color: #fff;
}

#wait_for_reply {
  border-radius: 0.04rem 0 0 0.04rem;
}

#reply_record {
  border-radius: 0 0.04rem 0.04rem 0;
}

.checked {
  background-color: #49a9ea !important;
  color: #fff !important;
}

.tab_btn {
  margin: 0 auto;
  display: inline-block;
}

.mint-tab-container {
  height: 100%;
  overflow: visible;
}

/* 工单内容文件 */
.page-tab-container {
  height: 100%;
  padding-top: 0.63rem;
}

/* 工单样式 */
.workOrder_cell {
  background-color: #fff;
  padding: 5px 10px;
  margin-bottom: 10px;
  min-height:72px;
}

.workOrder_cell .address {
  font-size: 14px;
  color: #333;
  padding: 5px;
}

.workOrder_cell .time {
  font-size: 12px;
  color: #666;
  padding: 5px;
}

.workOrder_cell .time > span {
  margin: 0 0.1rem;
}

/* popup样式 */
.mint-popup {
  position: fixed;
  background: #fff;
  left: auto;
  top: 0.5rem;
  right: 0.05rem;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: 0.2s ease-out;
  width: 0.86rem;
  background-color: #49a9ea;
  color: #fff;
  font-size: 0.12rem;
  border-radius: 0.04rem;
}


</style>

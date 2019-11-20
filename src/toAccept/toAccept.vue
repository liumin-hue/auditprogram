<template>
  <div id="big-box">
      <mt-header fixed title="待接收">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon="more" slot="right" @click="moreFunc()" v-show="active === 'wait_for_confirm' ? true : false "></mt-button>
      </mt-header>
      <!-- 遮罩层弹窗 -->
      <mt-popup v-model="popupVisible" popup-transition="popup-fade">
          <div class="mui-table-view-cell" @click="accept()">受理时间</div>
          <div class="mui-table-view-cell" @click="_import()">紧急程度</div>
          <div class="mui-table-view-cell" @click="timeRemaining()">剩余时间</div>
          <div class="mui-table-view-cell" @click="urge()">催办次数</div>
      </mt-popup>
      <!-- 工单内容 -->
    <div class="workOrderList">
          <!-- 下拉刷新 -->
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :max-distance="150" @top-status-change="handleTopChange" ref="loadmore">
              <div slot="top" class="mint-loadmore-top">
                  <span class="mui-icon mui-icon-pulldown" v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }"></span>
                  <mt-spinner color="#26a2ff" type="snake" v-show="topStatus === 'loading'"></mt-spinner>
                  <span v-show="topStatus === 'drop'">释放更新</span>
              </div>
            <!-- cell组件 -->
            <div v-for="(confirm,index) in confirms"  :key="confirm.id" class="workOrder_cell" @click="workBillIndex(index)">
              <router-link :to="{path:'/myWorkOrder/workOrderDetails/' + confirm.WorkBillID + '/' + confirm.FlowID + '/' + confirm.FlowInstantID + '/' + confirm.FlowNodeID + '/' + confirm.FlowToDoTS + '/' + confirm.latestVersion}">
                <div class="address">{{confirm.HouseAddress}}</div>
                <div class="time">{{confirm.AddTime}}
                  <span class="timeout" v-show="confirm.IsOutTime"></span>
                  <span class="workOrderType">{{confirm.BillTypeName}}</span>
                  <span class="urgentState" :style="{'color':(confirm.urgencyName == '紧急'? 'red':'black')}">{{confirm.urgencyName}}</span>
                </div>
              </router-link>
            </div>
          </mt-loadmore>
          <mt-tabbar v-model="selected">
                <mt-button class="workOrder_handle" type="primary" size="large" @click="allAccept()">全部接收</mt-button>
          </mt-tabbar>
          <my-scrollTop :total="total" :current="current" ref="scrollTop"></my-scrollTop>
      </div>
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

var fromPath = ""

//调用vuex插件
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      active: "wait_for_confirm",
      confirms: [],
      popupVisible: false,//popup识别
      topStatus: "",
      isLoading:true,//加载动画识别
      total: 0, //工单总数
      current: 0, //当前工单序列号
      hostPath:"/api/ReceptionBills/GetWaitReceptionBillsByDate",//路由路径
    };
  },
  //进入前
  beforeRouteEnter: (to, from, next) => {
    fromPath = from.name
    next();
  },
  //keep-alive切换钩子
  activated() {
    console.log("进入了");
    console.log(this.$store.state.isNewWorkOrder);
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

    //获取子组件公用方法
    this.$refs.scrollTop.getIndex();

    //判断前一页是否为home
    if(fromPath == "Home"){
      this.isLoading = true
      //刷新页面
      this.hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByDate";
      this.loadTop();
    }
  },
  deactivated() {
    console.log("退出了");
  },
  //挂载完成钩子
  mounted() {

  },
  //更新完成钩子
  updated() {},
  methods: {
    moreFunc() {
      this.popupVisible = !this.popupVisible;
    },
    //下拉刷新
    loadTop: function() {
      let hostPath = this.hostPath
      this.$myFun.loadTop(this,"confirms",hostPath,"loadmore")
    },
    handleTopChange: function(status) {
      this.current = 1
      this.topStatus = status;
    },
    //记录工单索引号
    workBillIndex(index){
      this.$store.workBillIndex = index
    },
    //全部接收
    allAccept(){
      if(this.total == 0){
        Toast("当前用户没有待接收工单");
      }else{
          let _this = this
          MessageBox.confirm("确定全部接收工单?").then(action => {
            //全部接收
              this.$http
                .post(
                  this.$myConfig.host + "/api/ReceptionBills/PostWaitReceptionBillsAllAccept",
                  {
                      UserID: this.$store.UserInfo.UserID,
                      OrgCode: this.$store.UserInfo.OrgID
                  },
                  { emulateJSON: true }
                )
                .then(
                  function(res) {
                    var resInfo = $.parseJSON(res.bodyText);
                    if (resInfo.ReturnResult) {
                      //提示信息
                      Toast(resInfo.Message);
                      //刷新页面
                      _this.accept()
                      _this.popupVisible = false
                    } else {
                      Toast(resInfo.Message);
                    }
                  },
                  function(err) {
                    Toast("请检查您的网络");
                  }
                );
          }).catch(()=>{
            console.log("取消")
          })
      }
    },
    //按照受理时间排序
    accept(){
      //滚动条回零
      window.scrollTo(0, 0);
      let _this = this
      this.isLoading = true;
      setTimeout(function(){
        //指定路径指向
        let hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByDate"
        _this.hostPath = hostPath
        //调用数据请求封装方法
        _this.$myFun.loadTop(_this,"confirms",hostPath,"loadmore")
        _this.isLoading = true;
      },1000)
      this.moreFunc();
    },
    //按照紧急程度排序
    _import(){
      //滚动条回零
      window.scrollTo(0, 0);
      let _this = this
      this.isLoading = true;
      setTimeout(function(){
        //指定路径指向
        let hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByImport"
        _this.hostPath = hostPath
        //调用数据请求封装方法
        _this.$myFun.loadTop(_this,"confirms",hostPath,"loadmore")
        _this.isLoading = true;
      },1000)
      this.moreFunc();
    },
    //按照催办次数排序
    urge(){
      //滚动条回零
      window.scrollTo(0, 0);
      let _this = this
      this.isLoading = true;
      setTimeout(function(){
        //指定路径指向
        let hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByUrge"
        _this.hostPath = hostPath
        //调用数据请求封装方法
        _this.$myFun.loadTop(_this,"confirms",hostPath,"loadmore")
        _this.isLoading = true;
      },1000)
      this.moreFunc();
    },
    //按照剩余时间排序
    timeRemaining(){
      //滚动条回零
      window.scrollTo(0, 0);
      let _this = this
      this.isLoading = true;
      setTimeout(function(){
        //指定路径指向
        let hostPath = "/api/ReceptionBills/GetWaitReceptionBillsByTimeRemaining"
        _this.hostPath = hostPath
        //调用数据请求封装方法
        _this.$myFun.loadTop(_this,"confirms",hostPath,"loadmore")
        _this.isLoading = true;
      },1000)
      this.moreFunc();
    },
  }
};
</script>
<style scoped>
/* 工单样式 */
.workOrder_cell {
  background-color: #fff;
  padding: 5px 0.1rem;
  margin-bottom: 10px;
  min-height:72px;
}

.workOrder_cell .address {
  font-size: 0.14rem;
  color: #333;
  padding: 5px;
}

.workOrder_cell .time {
  font-size: 0.12rem;
  color: #666;
  padding: 5px;
  position: relative;
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

/* 工单列表样式 */
.workOrderList{
    padding-bottom: 0.5rem;
}

/*下拉刷新图标*/
.mint-loadmore-top {
  color: #26a2ff;
  font-size: 0.2rem;
}

/* 底部按钮 */
.mint-tabbar{
  position: fixed;
}
.urgentState{position: absolute;right: 20px;display: inline-block;width:5em}
</style>

<template>
  <div id="big-box">
      <mt-header fixed title="工单退回">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
        <div class="back_content">
            <div class="mui-table-view-cell" @click="reason()">
            <div>退回原因</div>
            <span>{{backReason}}<span class="mui-icon mui-icon-arrowdown"></span></span>
          </div>
          <div class="mui-table-view-cell" @click="handleOpinion()">
            <div>备注</div>
            <span class="reply_result_default" v-show="replyResultDefault">点击输入内容</span>
            <span class="reply_result_value" v-show="replyResultValue">{{wordOrderReplyResult}}</span>
          </div>
        </div>
      <mt-tabbar v-model="selected">
          <mt-button class="workOrder_handle" type="primary" size="large" @click="save()">保存</mt-button>
      </mt-tabbar>
      <!-- 工单退回原因 -->
      <mt-popup v-model="backReasonList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
        <div class="pickerTitle">工单退回原因</div>
          <mt-picker :defaultIndex="2" :slots="backReasonItems" @change="onValuesChange" value-key="ReturnReasonText"></mt-picker>
      </mt-popup>
    </div>
</template>
<script>
import { MessageBox, Popup, Toast, Picker } from "mint-ui"; //引入mint-ui插件

var pageSource = "";

export default {
  data() {
    return {
      WorkBillID: "",
      backReason: "",
      backReasonList: false,
      backReasonItems: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      valuesIndex: 1,
      wordOrderReplyResult: "",
      workBillParams: [],
      ReturnReasonDetailValue: "",
      //工单节点
      WorkBillID: "",
      FlowID: "",
      FlowNodeID: "",
      FlowInstantID: "",
      FlowToDoTS: "",
      latestVersion: "",
      source: "",
      replyResultDefault: true, //处理结果无值时，默认显示“点击输入内容”
      replyResultValue: false //处理结果有值时，显示值
    };
  },
  beforeRouteEnter: (to, from, next) => {
    pageSource = from.name;
    next();
  },
  activated() {
    this.wordOrderReplyResult = ""
    this.workBillParams = this.$route.params;
    this.WorkBillID = this.$route.params.WorkBillID;
    this.FlowID = this.$route.params.FlowID;
    this.FlowNodeID = this.$route.params.FlowNodeID;
    this.FlowInstantID = this.$route.params.FlowInstantID;
    this.FlowToDoTS = this.$route.params.FlowToDoTS;
    this.latestVersion = this.$route.params.latestVersion;
    this.source = this.$route.params.source;
    //获取工单信息
    if (pageSource !== "workOrderReplyResult") {
      this.$http
        .get(this.$myConfig.host + "/api/WorkBillReturn/GetReturnDetail", {})
        .then(
          function(res) {
            var resInfo = $.parseJSON(res.bodyText);
            // console.log(resInfo);
            if (resInfo.ReturnResult) {
              this.backReasonItems[0].values = resInfo.ReturnReasonList;
            } else {
              Toast(resInfo.Message);
            }
          },
          function(err) {
            Toast("请检查您的网络");
            this.isLoading = false;
          }
        );
    }
    //判断处理结果是否已输入内容并保存
    if (
      this.$store.wordOrderReplyResult == undefined ||
      this.$store.wordOrderReplyResult == ""
    ) {
      this.replyResultDefault = true;
      this.replyResultValue = false;
    } else {
      this.wordOrderReplyResult = this.$store.wordOrderReplyResult;
      this.replyResultDefault = false;
      this.replyResultValue = true;
    }
  },
  mounted() {},
  methods: {
    //退回
    goback() {
      this.$store.wordOrderReplyResult = "";
      this.$router.go(-1); //返回上一次历史记录
    },
    //延时申请原因
    reason() {
      this.backReasonList = !this.backReasonList;
    },
    //picker监听变化事件
    onValuesChange(picker, values) {
      if (values[0]) {
        this.backReason = values[0].ReturnReasonText;
        this.ReturnReasonDetailValue = values[0].ReturnReasonValue;
      }
    },
    //点击保存按钮
    save() {
      MessageBox.confirm("确定退回工单")
        .then(action => {
          // 判断工单来源 ========== 我的工单
          console.log(this.source)
          if (this.source == "MyWorkOrder" || this.source ==  "community") {
            this.isLoading = true;
            this.$http
              .post(
                this.$myConfig.host +
                  "/api/WorkBillReturn/ReturnWaitReplyWorkBill",
                {
                  WorkBillID: this.WorkBillID,
                  FlowID: this.FlowID,
                  FlowNodeID: this.FlowNodeID,
                  FlowInstantID: this.FlowInstantID,
                  FlowToDoTS: this.FlowToDoTS,
                  UserID: this.$store.UserInfo.UserID,
                  OrgCode: this.$store.UserInfo.OrgID,
                  LatestVersion: this.latestVersion,
                  ReturnReasonDetailValue: this.ReturnReasonDetailValue,
                  ReturnReasonDetailName: this.backReason,
                  Remark: this.wordOrderReplyResult || ""
                },
                { emulateJSON: true }
              )
              .then(
                function(res) {
                  var resInfo = $.parseJSON(res.bodyText);
                  console.log(resInfo);
                  //判断登录信息
                  if (resInfo.ReturnResult) {
                    //改变全局参数
                    this.$store.operateType = true;
                    this.$router.go(-2);
                    Toast(resInfo.Message);
                    this.$store.wordOrderReplyResult = "";
                  } else {
                    Toast(resInfo.Message);
                  }
                  this.isLoading = false;
                },
                function(err) {
                  Toast("请检查您的网络");
                  this.isLoading = false;
                }
              );
            // 判断工单来源 ========== 工单池
          } else {
            this.$http
              .post(
                this.$myConfig.host + "/api/WorkBillReturn/ReturnWorkOrderPool",
                {
                  WorkBillID: this.WorkBillID,
                  FlowID: this.FlowID,
                  FlowNodeID: this.FlowNodeID,
                  FlowInstantID: this.FlowInstantID,
                  FlowToDoTS: this.FlowToDoTS,
                  UserID: this.$store.UserInfo.UserID,
                  OrgCode: this.$store.UserInfo.OrgID,
                  LatestVersion: this.latestVersion,
                  ReturnReasonDetailValue: this.ReturnReasonDetailValue,
                  ReturnReasonDetailName: this.backReason,
                  Remark: this.wordOrderReplyResult || ""
                },
                { emulateJSON: true }
              )
              .then(
                function(res) {
                  var resInfo = $.parseJSON(res.bodyText);
                  console.log(resInfo);
                  //判断登录信息
                  if (resInfo.ReturnResult) {
                    //改变全局参数
                    this.$store.operateType = true;
                    this.$router.go(-2);
                    this.$store.wordOrderReplyResult = "";
                    Toast(resInfo.Message);
                  } else {
                    Toast(resInfo.Message);
                  }
                  this.isLoading = false;
                },
                function(err) {
                  Toast("请检查您的网络");
                  this.isLoading = false;
                }
              );
          }
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //处理意见
    handleOpinion() {
      this.$router.push({ path: "/myWorkOrder/workOrderReplyResult" });
    }
  }
};
</script>
<style scoped>
.back_content {
  margin-top: 0.15rem;
}

.mui-table-view-cell > .step_title {
  background-color: #49a9ea;
  color: #fff;
  float: left;
  width: 0.8rem;
  height: 0.24rem;
  padding: 0.05rem;
  text-align: center;
  border-radius: 0.04rem;
}

.mui-table-view-cell {
  padding: 0.15rem;
  background-color: #fff;
}

.mui-table-view-cell > div {
  float: left;
  width: 35%;
  color: #666;
}

.mui-table-view-cell > span {
  float: right;
  max-width: 65%;
  color: #333;
}
.mui-icon {
  font-size: 0.17rem;
  margin-left: 0.08rem;
}
</style>

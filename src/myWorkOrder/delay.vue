<template>
  <div id="big-box">
      <mt-header fixed title="延时申请">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
        <div class="delay_content">
            <div class="mui-table-view-cell">
            <div>客户地址</div>
            <span>{{HouseAddress}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>联系人</div>
            <span>{{ContactPerson}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>受理时间</div>
            <span>{{AddTime}}</span>
          </div>
          <div class="mui-table-view-cell" @click="reason()">
            <div>延时申请原因</div>
            <span>{{DelayReasonText}}<span class="mui-icon mui-icon-arrowdown"></span></span>
          </div>
          <div class="mui-table-view-cell delay_time">
            <div>延时期限</div>
            <mt-field label="" placeholder="请输入数字" type="number" v-model="delayTime" class="delay_time_val"></mt-field><span>小时</span>
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
      <!-- 延时申请原因 -->
      <mt-popup v-model="delayReasonList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
        <div class="pickerTitle">请选择延时申请原因</div>
          <mt-picker :slots="delayReasonItems" @change="onValuesChange" value-key="DelayReasonText"></mt-picker>
      </mt-popup>
    </div>
</template>
<script>
import { MessageBox, Popup, Toast, Picker, Field } from "mint-ui"; //引入mint-ui插件
var pageSource = "";
export default {
  data() {
    return {
      HouseAddress: "", //客户地址
      ContactPerson: "", //联系人
      AddTime: "", //受理时间
      delayReasonList: false,
      delayTime: "", //延时期限
      DelayReasonValue: "", //延时申请原因对应值
      DelayReasonText: "", //延时申请原因选项名称
      allDelayReasonItems: [], //全部延时申请原因
      delayReasonItems: [
        {
          flex: 1,
          values: [], //延时申请原因选项
          className: "slot1",
          textAlign: "right"
        }
      ], //延时申请原因
      //工单节点
      WorkBillID: "",
      FlowID: "",
      FlowNodeID: "",
      FlowInstantID: "",
      FlowToDoTS: "",
      latestVersion: "",
      replyResultDefault: true, //处理结果无值时，默认显示“点击输入内容”
      replyResultValue: false //处理结果有值时，显示值
    };
  },
  watch: {
    delayTime: function(val, oldVal) {
      if (val - 0 > 720) {
        Toast("延时时间不得超过720小时");
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    pageSource = from.name;
    next();
  },
  activated() {
    this.WorkBillID = this.$route.params.WorkBillID;
    this.FlowID = this.$route.params.FlowID;
    this.FlowInstantID = this.$route.params.FlowInstantID;
    this.FlowNodeID = this.$route.params.FlowNodeID;
    this.FlowToDoTS = this.$route.params.FlowToDoTS;
    this.latestVersion = this.$route.params.latestVersion;
    this.HouseAddress = this.$store.HouseAddress; //获取路由中的客户地址
    this.ContactPerson = this.$route.params.ContactPerson; //获取路由中的联系人
    this.AddTime = this.$store.AddTime; //读取Vuex中的受理时间

    //获取工单信息
    if (pageSource !== "workOrderReplyResult") {
      this.delayTime = "";
      //获取延时申请原因
      this.$http
        .get(
          this.$myConfig.host + "/api/WorkBillDelay/GetWorkBillDelayInfo",
          {}
        )
        .then(
          function(res) {
            let resInfo = $.parseJSON(res.bodyText);
            if (resInfo.ReturnResult) {
              this.delayReasonItems[0].values = resInfo.DelayReasonList; //延时申请原因

              let Arr = [];
              for (let i = 0; i < resInfo.DelayReasonList.length; i++) {
                Arr.push(resInfo.DelayReasonList[i]);
              }
              this.delayReasonItems[0].values = Arr;
              this.allDelayReasonItems = resInfo.DelayReasonList;
            } else {
              Toast(resInfo.Message);
            }
          },
          function(err) {
            Toast("请检查您的网络");
          }
        );
    }
    //判断备注是否已输入内容并保存
    if (
      this.$store.wordOrderReplyResult == undefined ||
      this.$store.wordOrderReplyResult == ""
    ) {
      this.replyResultDefault = true;
      this.replyResultValue = false;
      this.wordOrderReplyResult = "";
    } else {
      this.wordOrderReplyResult = this.$store.wordOrderReplyResult;
      this.replyResultDefault = false;
      this.replyResultValue = true;
    }
  },
  methods: {
    goback: function() {
      this.$store.wordOrderReplyResult = "";
      this.$router.go(-1); //返回上一次历史记录
    },
    //延时申请原因
    reason() {
      this.delayReasonList = !this.delayReasonList;
    },
    //picker监听变化事件
    onValuesChange(picker, values) {
      if (values[0]) {
        this.DelayReasonText = values[0].DelayReasonText;
        this.DelayReasonValue = values[0].DelayReasonValue;

        //修改匹配的具体情况
        let arr = [];
        for (let i = 0; i < this.allDelayReasonItems.length; i++) {
          if (
            this.allDelayReasonItems[i].DelayReasonValue ==
            values[0].DelayReasonValue
          ) {
            arr.push(this.allDelayReasonItems[i]);
          }
        }
        this.allDelayReasonItems[0].values = arr;
      }
    },
    //点击保存按钮
    save() {
      if (this.delayTime) {
        if (this.delayTime - 0 > 720) {
          Toast("延时申请时间不得超过720小时")
        } else {
          MessageBox.confirm("确定延时申请")
            .then(action => {
              console.log("确定");
              this.isLoading = true;
              this.$http
                .post(
                  this.$myConfig.host +
                    "/api/WorkBillDelay/WaitReplyWorkBillDelay",
                  {
                    UserID: this.$store.UserInfo.UserID,
                    OrgCode: this.$store.UserInfo.OrgID,
                    WorkBillID: this.WorkBillID,
                    FlowID: this.FlowID,
                    FlowInstantID: this.FlowInstantID,
                    FlowNodeID: this.FlowNodeID,
                    FlowToDoTS: this.FlowToDoTS,
                    LatestVersion: this.latestVersion,
                    DelayReasonValue: this.DelayReasonValue,
                    DelayReasonText: this.DelayReasonText,
                    DelayTime: this.delayTime,
                    Remark: this.$store.wordOrderReplyResult || ""
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
                      this.$store.wordOrderReplyResult = "";
                      this.$store.operateType = true;
                      this.$router.go(-2);
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
            })
            .catch(() => {
              console.log("取消");
            });
        }
      } else {
        Toast("请添加延时期限");
      }
    },
    //备注
    handleOpinion() {
      this.$router.push({ path: "/myWorkOrder/workOrderReplyResult" });
    }
  }
};
</script>
<style scoped>
.delay_content {
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

.mint-cell {
  background: none;
}

.mint-cell-wrapper {
  background: none;
  min-height: initial;
}

.delay_time {
  position: relative;
}

.delay_time div {
  width: 40%;
}

.delay_time_val {
  position: absolute;
  top: -0.2rem;
  border: none;
  outline: 0;
  margin-right: 0.1rem;
  height: 0.4rem;
  margin-top: 0.5rem;
  padding-right: 0.01rem;
  width: 2rem;
  float: left;
}

.mint-cell {
  min-height: 0.48rem;
}
</style>

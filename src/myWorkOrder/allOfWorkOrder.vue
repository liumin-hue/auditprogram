<template>
  <div id="big-box" class="clearfix">
      <mt-header fixed title="全部工单">
        <span slot="left" @click="goback()">
            <mt-button icon="back"></mt-button>
        </span>
      </mt-header>
      <!-- 工单 -->
          <div class="workOrderTitle clearfix">
                <span>{{workBillID}}</span>
                <span>{{billCategoryName}}</span>
                <mt-button size="small" type="primary" @click="check_btn(workBillID)">查看步骤</mt-button>
          </div>
      <mt-swipe :defaultIndex="billIndex" :prevent="true" ref="mtSwipe" :show-indicators="false" :auto="0" @change="handleChange" :continuous="false" :speed="400">
        <mt-swipe-item v-for="workOrder in workOrders" :key="workOrder.id">
          <div class="workOrder_box">
            <!-- 工单内容 -->          
              <div class="workOrder">
                <div class="mui-table-view-cell"><div>客户地址</div>
                  <span>{{workOrder.houseAddress}}</span>
                </div>
                <div class="mui-table-view-cell"><div>联系人</div>   
                  <span>{{workOrder.contactPerson}}</span>           
                </div>
                <div class="mui-table-view-cell"><div>联系方式</div>
                  <span>{{workOrder.contactPhone}}</span>
                </div>
                <div class="mui-table-view-cell"><div>受理时间</div>
                  <span>{{workOrder.addTime}}</span>
                </div>
                <div class="mui-table-view-cell"><div>预约时间</div>
                  <span>{{workOrder.beginTime}}</span>
                </div>
                <div class="mui-table-view-cell"><div>剩余时间</div>
                  <span>{{workOrder.restTime}}</span>
                </div>
                <div class="mui-table-view-cell"><div>受理部门</div>
                  <span>{{workOrder.shlSelectedOrgName}}</span>
                </div>
                <div class="mui-table-view-cell"><div>受理人</div>
                  <span>{{workOrder.shlUserName}}</span>
                </div>
                <div class="mui-table-view-cell"><div>当前环节</div>
                  <span>{{workOrder.billStatusText}}</span>
                </div>
                <div class="mui-table-view-cell"><div>工单描述</div>
                  <span>{{workOrder.description}}</span>
                </div>
              </div>        
          </div>  
        </mt-swipe-item>
      </mt-swipe>
      <div class="workOrder_turn">
          <i class="mui-icon mui-icon-arrowleft" @click="front()" v-show="showFront"></i>
          <i class="mui-icon mui-icon-arrowright" @click="next()" v-show="showNext"></i>
      </div>
      <my-spinner :showSpinner="isLoading"></my-spinner>
    </div>
</template>
<script>
//引入mint-ui插件
import { MessageBox, Swipe, SwipeItem, Toast } from "mint-ui";
var pageSource = "";
export default {
  data() {
    return {
      workOrders: [],
      showFront: true,
      showNext: true,
      itemsLength: 0,
      isLoading: true,
      billIndex: 0, //当前所选工单号索引
      workBillID: "",
      billCategoryName: ""
    };
  },
  beforeRouteEnter: (to, from, next) => {
    pageSource = from.name;
    next();
  },
  activated() {
    if (pageSource != "WorkOrderStep") {
      this.workBillParams = this.$route.params;
      //获取工单信息
      this.$http
        .get(this.$myConfig.host + "/api/RoomWorkBills/GetWorkBillsByRoomID", {
          params: {
            roomID: this.workBillParams.roomid
          }
        })
        .then(
          function(res) {
            let resInfo = $.parseJSON(res.bodyText);
            let billArr = [];
            //判断登录信息
            if (resInfo.ReturnResult) {
              for (let i = 0; i < resInfo.WorkBillDetail.length; i++) {
                billArr.push(resInfo.WorkBillDetail[i].workBillID);
              }
              //获取所选工单号索引
              this.billIndex = billArr.indexOf(this.workBillParams.workBillID);
              this.workBillID =
                resInfo.WorkBillDetail[this.billIndex].workBillID;
              this.billCategoryName =
                resInfo.WorkBillDetail[this.billIndex].billCategoryName;
              //赋值
              this.workOrders = resInfo.WorkBillDetail;
              this.itemsLength = resInfo.WorkBillDetail.length;
              //根据工单个数或者工单索引判断按钮
              if (this.itemsLength == 1) {
                this.showFront = false;
                this.showNext = false;
              } else if (this.billIndex == 0) {
                this.showFront = false;
              } else if (this.billIndex == resInfo.WorkBillDetail.length - 1) {
                this.showNext = false;
              }
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
  },
  methods: {
    //回退
    goback() {
      this.$router.go(-1);
    },
    //上一单
    front() {
      this.$refs.mtSwipe.prev();
    },
    //下一单
    next() {
      this.$refs.mtSwipe.next();
    },
    //滑动屏幕事件
    handleChange(index) {
      this.workBillID = this.workOrders[index].workBillID;
      this.billCategoryName = this.workOrders[index].billCategoryName;
      this.billIndex = index;
      //滑动屏幕判断页面位置
      if (index == 0) {
        this.showFront = false;
        this.showNext = true;
      } else if (index == this.itemsLength - 1) {
        this.showNext = false;
        this.showFront = true;
      } else {
        this.showFront = true;
        this.showNext = true;
      }
    },
    //拨打电话
    tel(contactPhone) {
      plus.device.dial(contactPhone, true);
    },
    //查看步骤
    check_btn() {
      this.$router.push({
        path:
          "/myWorkOrder/workOrderStep/" +
          this.workOrders[this.billIndex].workBillID
      });
    }
  }
};
</script>
<style scoped>
#big-box {
  position: relative;
  z-index: 1;
}

.workOrder_turn {
  position: fixed;
  width: 100%;
  top: 50%;
  margin-top: -0.3rem;
}

.workOrder_turn > i {
  font-size: 0.25rem;
  width: 0.3rem;
  height: 0.6rem;
  line-height: 0.55rem;
  color: #fff;
  background-color: #000;
  opacity: 0.3;
  text-align: center;
}

.workOrder_turn > .mui-icon-arrowright {
  float: right;
}

/* 轮播图 */
.mint-swipe {
  width: 100%;
}
/* 工单详情-标题 */
.workOrderTitle {
  height: 0.45rem;
  padding: 0.1rem 0.15rem;
  width: 100%;
  background-color: #efeff4;
}

.workOrderTitle > span {
  float: left;
  margin-right: 0.2rem;
  display: block;
  height: 0.2rem;
  line-height: 0.3rem;
}

.workOrderTitle > .mint-button {
  float: right;
  height: 0.24rem;
  font-size: 0.14rem;
  padding: 0.04rem 0.12rem;
  border-radius: 0.15rem;
}

/* 工单内容 */
.workOrder_box {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 0.5rem;
}

.workOrder {
  background-color: #fff;
}

.workOrder > div {
  line-height: 0.25rem;
  padding: 0.1rem 0.15rem;
  margin: 0;
}

.workOrder > div > div {
  text-align: left;
  width: 25%;
  float: left;
  font-size: 0.14rem;
  color: #666;
}

.workOrder > div > span {
  max-width: 70%;
  float: right;
  font-size: 0.14rem;
}

/* 媒体查询 */
/* 图标样式 */
@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  /* 图片删除按钮 */
  .tel_btn {
    background: url("../../static/images/客服移动端切图/首页/tel.png") no-repeat center
      right;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  /* 电话按钮 */
  .tel_btn {
    background: url("../../static/images/客服移动端切图/首页/tel@1.5x.png") no-repeat
      center right;
  }
}
/* 电话按钮图标 */
.tel_btn {
  display: block;
  float: right;
  width: 0.2rem;
  height: 0.2rem;
  background-size: 0.2rem;
  margin-left: 0.1rem;
}
</style>

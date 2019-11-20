<template>
  <div id="big-box">
      <mt-header fixed title="维修人员情况统计">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <!-- 工单navbar -->
    <div class="nav clearfix">
      <span class="tab_btn">
        <div id="yesterday" @click="yesterday()" :class="active == 'yesterday' ? 'checked' : '' ">昨日</div>
        <div id="today" @click="today()" :class="active == 'today' ? 'checked' : '' ">今日</div>
        <div id="month" @click="month()" :class="active == 'month' ? 'checked' : '' ">近30日</div>
      </span>
    </div>
      <!-- 工单内容 -->
    <div class="page-tab-container">
        <!-- 昨天 -->
      <mt-tab-container class="page-tabbar-tab-container" v-model="active" swipeable>
        <mt-tab-container-item id="yesterday">
            <!-- cell组件 -->
            <div v-for="repairman_yesterday in repairman_yesterdays"  :key="repairman_yesterday.id" class="workOrder_cell">
              <router-link to="">
                <div class="clearfix">
                    <div class="RealName">{{repairman_yesterday.RealName}}</div>
                    <div>不满意:{{repairman_yesterday.NotSatisfiedCount}}</div>
                    <div>满意率:{{repairman_yesterday.SatisfiedRate}}%</div>
                </div>
                <div class="clearfix">
                    <div>总数:{{repairman_yesterday.WorkOrderAllCount}}</div>
                    <div>已完成:{{repairman_yesterday.WorkOrderFinishCount}}</div>
                    <div>完成率:{{repairman_yesterday.CompletionRate}}%</div>
                </div>
                <div class="clearfix">
                    <div>超时:{{repairman_yesterday.OverTimeCount}}</div>
                    <div>及时完成:{{repairman_yesterday.WorkOrderFinishCount}}</div>
                    <div>再次派单:{{repairman_yesterday.SendOrderAgainCount}}</div>
                </div>
              </router-link>
            </div>
          </mt-loadmore>
        </mt-tab-container-item>
        <!-- 今天 -->
        <mt-tab-container-item id="today">
            <!-- cell组件 -->
          <div v-for="repairman_today in repairman_todays"  :key="repairman_today.id" class="workOrder_cell">
            <router-link to="">
              <div class="clearfix">
                    <div class="RealName">{{repairman_today.RealName}}</div>
                    <div>不满意:{{repairman_today.NotSatisfiedCount}}</div>
                    <div>满意率:{{repairman_today.SatisfiedRate}}%</div>
                </div>
                <div class="clearfix">
                    <div>总数:{{repairman_today.WorkOrderAllCount}}</div>
                    <div>已完成:{{repairman_today.WorkOrderFinishCount}}</div>
                    <div>完成率:{{repairman_today.CompletionRate}}%</div>
                </div>
                <div class="clearfix">
                    <div>超时:{{repairman_today.OverTimeCount}}</div>
                    <div>及时完成:{{repairman_today.WorkOrderFinishCount}}</div>
                    <div>再次派单:{{repairman_today.SendOrderAgainCount}}</div>
                </div>
            </router-link>
          </div>
        </mt-tab-container-item>
        <!-- 近30天 -->
        <mt-tab-container-item id="month">
            <!-- cell组件 -->
          <div v-for="repairman_month in repairman_months"  :key="repairman_month.id" class="workOrder_cell">
            <router-link to="">
              <div class="clearfix">
                    <div class="RealName">{{repairman_month.RealName}}</div>
                    <div>不满意:{{repairman_month.NotSatisfiedCount}}</div>
                    <div>满意率:{{repairman_month.SatisfiedRate}}%</div>
                </div>
                <div class="clearfix">
                    <div>总数:{{repairman_month.WorkOrderAllCount}}</div>
                    <div>已完成:{{repairman_month.WorkOrderFinishCount}}</div>
                    <div>完成率:{{repairman_month.CompletionRate}}%</div>
                </div>
                <div class="clearfix">
                    <div>超时:{{repairman_month.OverTimeCount}}</div>
                    <div>及时完成:{{repairman_month.WorkOrderFinishCount}}</div>
                    <div>再次派单:{{repairman_month.SendOrderAgainCount}}</div>
                </div>
            </router-link>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
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
  Spinner
} from "mint-ui";
//调用vuex插件
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      active: "today",
      repairman_yesterdays: [],
      repairman_todays: [],
      repairman_months: [],
      allLoaded: false,
      topStatus: "",
      isLoading:true
    };
  },
  //keep-alive切换钩子
  activated() {
    console.log("进入了");
    console.log(this.$store.state.isNewWorkOrder);
  },
  deactivated() {
    console.log("退出了");
  },
  //挂载完成钩子
  mounted() {
    //获取昨日列表
    this.$http
      .get(
        this.$myConfig.host +
          "/api/RepairUserStatistics/GetYesterdayRepairAnalysis",
        {
          params: {
            orgCode: this.$store.UserInfo.OrgID
          }
        }
      )
      .then(
        function(res) {
          let resInfo = $.parseJSON(res.bodyText);
          //判断登录信息
          if (resInfo.ReturnResult) {
            this.repairman_yesterdays = resInfo.AnalysisList;
          } else {
            Toast(resInfo.Message);
          }
        },
        function(err) {
          Toast("请检查您的网络");
        }
      );

    //获取今日列表
    this.$http
      .get(
        this.$myConfig.host +
          "/api/RepairUserStatistics/GetTodayRepairAnalysis",
        {
          params: {
            orgCode: this.$store.UserInfo.OrgID
          }
        }
      )
      .then(
        function(res) {
          let resInfo = $.parseJSON(res.bodyText);
          //判断登录信息
          if (resInfo.ReturnResult) {
            this.repairman_todays = resInfo.AnalysisList;
          } else {
            Toast(resInfo.Message);
          }
          this.isLoading = false
        },
        function(err) {
          Toast("请检查您的网络");
          this.isLoading = false
        }
      );

    //获取30日列表
    this.$http
      .get(
        this.$myConfig.host +
          "/api/RepairUserStatistics/GetThirtyDaysRepairAnalysis",
        {
          params: {
            orgCode: this.$store.UserInfo.OrgID
          }
        }
      )
      .then(
        function(res) {
          let resInfo = $.parseJSON(res.bodyText);
          //判断登录信息
          if (resInfo.ReturnResult) {
            this.repairman_months = resInfo.AnalysisList;
          } else {
            Toast(resInfo.Message);
          }
        },
        function(err) {
          Toast("请检查您的网络");
        }
      );
  },
  //更新完成钩子
  updated() {},
  methods: {
    //点击yesterday
    yesterday() {
      this.active = "yesterday";
    },
    //点击today
    today() {
      this.active = "today";
    },
    //点击month
    month() {
      this.active = "month";
    }
  }
};
</script>
<style scoped>
.item {
  display: inline-block;
}

.nav {
  background-color: #efeff4;
  padding: 0.1rem 0 0.05rem 0;
  text-align: center;
  position: fixed;
  top: 0.44rem;
  width: 100%;
  z-index: 9;
}

.nav .tab_btn {
  width: 100%;
}

.link {
  color: inherit;
  padding: 20px;
  display: block;
}

/* 按钮样式 */
.nav .tab_btn > div {
  width: 33.333%;
  height: 0.45rem;
  line-height: 0.45rem;
  float: left;
  font-size: 0.13rem;
  color: #666;
  background-color: #fff;
}

.checked {
  color: #49a9ea !important;
  border-bottom: 0.02rem solid #49a9ea;
  box-sizing: border-box;
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
  padding-top: 0.65rem;
}

/* 工单样式 */
.workOrder_cell {
  background-color: #fff;
  padding: 0.15rem 0;
  margin-bottom: 0.1rem;
  min-height:72px;
}

.workOrder_cell > a > div {
  padding: 0 0.1rem;
}

.workOrder_cell > a > div > div {
  float: left;
  width: 33%;
  display: block;
  font-size: 0.14rem;
  padding-right: 0rem;
  color: #333;
}

/*下拉刷新图标*/
.mint-loadmore-top {
  color: #26a2ff;
  font-size: 0.2rem;
}

/* 维修人员名字 */
.workOrder_cell > a > div > div.RealName{
  color:#49A9EA;
}
</style>

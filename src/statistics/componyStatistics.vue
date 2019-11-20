<template>
  <div id="big-box">
      <mt-header fixed title="热力公司工单">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <!-- 遮罩层弹窗 -->
      <mt-popup v-model="popupVisible" popup-transition="popup-fade">
          <div class="mui-table-view-cell">紧急程度</div>
          <div class="mui-table-view-cell">剩余时间</div>
          <div class="mui-table-view-cell">催办次数</div>
      </mt-popup>
      <!-- 工单内容 -->
    <div class="workOrderList">
          <!-- 下拉刷新 -->
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :max-distance="150" @top-status-change="handleTopChange" ref="loadmore">
              <div slot="top" class="mint-loadmore-top">
                  <span class="mui-icon mui-icon-pulldown" v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }"></span>
                  <mt-spinner color="#26a2ff" type="snake" v-show="topStatus === 'loading'"></mt-spinner>
                  <span v-show="topStatus === 'drop'">释放更新</span>
              </div>
            <!-- cell组件 -->
            <div v-for="confirm in confirms"  :key="confirm.id" class="workOrder_cell">
              <router-link to="">
                <div class="compony">{{confirm.compony}}</div>
                <div class="clearfix">
                    <div class="workOrderNum">{{confirm.num}}</div>
                    <div class="finished">{{confirm.finished}}</div>
                </div>
              </router-link>
            </div>
          </mt-loadmore>
    </div>
</mt-tab-container>
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

export default {
  data() {
    return {
      active: "wait_for_reply",
      confirms: [],
      replys: [],
      popupVisible: false,
      allLoaded: false,
      topStatus: ""
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
    this.confirms = [
      { compony: "东北", num: "13:00:00", finished: "建议", id: 1 },
      { compony: "西北", num: "13:00:00", finished: "紧急", id: 2 },
      { compony: "华北", num: "13:00:00", finished: "建议", id: 3 },
      { compony: "华南", num: "13:00:00", finished: "建议", id: 4 },
      { compony: "西南", num: "13:00:00", finished: "建议", id: 5 },
      { compony: "中原", num: "13:00:00", finished: "建议", id: 6 },
      { compony: "西藏", num: "13:00:00", finished: "抢修", id: 7 },
      { compony: "乌克兰", num: "13:00:00", finished: "报修", id: 8 }
    ];

    this.replys = [
      { compony: "北京", num: "13:00:00", finished: "建议", id: 1 },
      { compony: "上海", num: "13:00:00", finished: "紧急", id: 2 },
      { compony: "广州", num: "13:00:00", finished: "建议", id: 3 }
    ];
  },
  //更新完成钩子
  updated() {},
  methods: {
    moreFunc() {
      this.popupVisible = !this.popupVisible;
    },
    //上拉刷新
    loadTop: function() {
      // 刷新数据的操作
      var self = this;
      setTimeout(function() {
        self.confirms = [
          { compony: "北京", num: "13:00:00", finished: "建议", id: 1 },
          { compony: "上海", num: "13:00:00", finished: "紧急", id: 2 },
          { compony: "广州", num: "13:00:00", finished: "建议", id: 3 }
        ];
        self.$refs.loadmore.onTopLoaded();
      }, 2000);
    },
    handleTopChange: function(status) {
      this.topStatus = status;
    },
    //全部接收
    allAccept(){

    }
  }
};
</script>
<style scoped>
/* 工单样式 */
.workOrder_cell {
  background-color: #fff;
  padding: 0.05rem 0.1rem;
  margin-bottom: 0.1rem;
  min-height:72px;
}

.workOrder_cell .compony {
  font-size: 0.14rem;
  color: #333;
  padding: 0.05rem;
}

.workOrder_cell .workOrderNum,
.workOrder_cell .finished {
  font-size: 0.14rem;
  color: #666;
  padding: 0.05rem;
  float: left;
}

.workOrder_cell .finished{
    float: right;
    color: #30BD79 ;
}

/*下拉刷新图标*/
.mint-loadmore-top {
  color: #26a2ff;
  font-size: 0.2rem;
}
</style>

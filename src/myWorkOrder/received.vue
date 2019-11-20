<template>
  <div id="big-box">
      <mt-header fixed title="我的工单">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
         <div class="page-tabbar">  
    <div class="page-wrap">  
            
    <!-- tabcontainer -->  
      <mt-tab-container class="page-tabbar-container" v-model="selected">  
        <mt-tab-container-item id="1">  
            <mt-navbar v-model="selected_toReceive" class="nav_tab">
                <mt-tab-item id="1">分配给我</mt-tab-item>
                <mt-tab-item id="2">工单池</mt-tab-item>
            </mt-navbar>
        <!-- tab-container -->
            <mt-tab-container v-model="selected_toReceive">
                <mt-tab-container-item id="1" class="assignedToMe">
                    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :max-distance="150" @top-status-change="handleTopChange" ref="loadmore">
                        <div slot="top" class="mint-loadmore-top">
                            <span class="mui-icon mui-icon-pulldown" v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }"></span>
                            <mt-spinner color="#26a2ff" type="snake" v-show="topStatus === 'loading'"></mt-spinner>
                            <span v-show="topStatus === 'drop'">释放更新</span>
                        </div>
                        
                        <ul class="mui-table-view">
                            <li class="mui-table-view-cell"  v-for="item in items" :key="item.id">
                                <router-link :to="'/myWorkOrder/workOrderDetails/'+ item.workOrderID +'?workOrderID=' + item.workOrderID " class="mui-navigate-right">{{item.workOrderID}}.{{item.contents}}</router-link>
                            </li>  
                        </ul>
                    </mt-loadmore>
                    <!-- 全部接受按钮 -->
                    <div id="all_accept">
                        <mt-button type="primary" size="small" id="acceptBtn" @click="accept()">全部接收</mt-button>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="2" class="workOrderPond">
                    <ul class="mui-table-view">
                        <li class="mui-table-view-cell"  v-for="item in items" :key="item.id">
                            <router-link :to="'/myWorkOrder/workOrderDetails/'+ item.workOrderID +'?workOrderID=' + item.workOrderID " class="mui-navigate-right">{{item.contents}}</router-link>
                        </li>                        
                    </ul>
                </mt-tab-container-item>                
            </mt-tab-container>
        </mt-tab-container-item>  
        <mt-tab-container-item id="2">  
            <mt-navbar v-model="selected_toReply">
                <mt-tab-item id="1">我的工单</mt-tab-item>
                <mt-tab-item id="2">维修队工单</mt-tab-item>
            </mt-navbar>
        <!-- tab-container -->
            <mt-tab-container v-model="selected_toReply">
                <mt-tab-container-item id="1">
                    1
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    2
                </mt-tab-container-item>
            </mt-tab-container>
        </mt-tab-container-item>  
        <mt-tab-container-item id="3">  
            <mt-navbar v-model="selected_replyToRecord">
                <mt-tab-item id="1">我的工单</mt-tab-item>
                <mt-tab-item id="2">维修队工单</mt-tab-item>
            </mt-navbar>
        <!-- tab-container -->
            <mt-tab-container v-model="selected_replyToRecord">
                <mt-tab-container-item id="1">
                    1
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    2
                </mt-tab-container-item>
            </mt-tab-container>
        </mt-tab-container-item>
      </mt-tab-container>  
    </div>  

   
  <!-- 底部菜单 -->
    <mt-tabbar v-model="selected" fixed>  
      <mt-tab-item id="1">
        <img slot="icon" src="../../static/images/Group3.png">          
        待接收  
      </mt-tab-item>  
      <mt-tab-item id="2">
        <img slot="icon" src="../../static/images/Group3_15x.png">          
        待回复  
      </mt-tab-item>  
      <mt-tab-item id="3">
        <img slot="icon" src="../../static/images/Group3_2x.png">
        回复记录  
      </mt-tab-item>  
    </mt-tabbar>  
  </div>  
  </div>
</template>
<script>
//引入mint-ui插件
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import { Tabbar, TabItem } from "mint-ui";
import { Loadmore } from "mint-ui";
import { Spinner } from "mint-ui";
//调用vuex插件
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      selected: "1",
      selected_toReceive: "1",
      selected_toReply: "1",
      selected_replyToRecord: "1",
      items: [],
      allLoaded: false,
      topStatus: ""
    };
  },
  beforeCreate() {},
  //创建完成钩子
  created() {
    this.items = [
      { workOrderID: 1, contents: "工单测试" },
      { workOrderID: 2, contents: "工单测试" },
      { workOrderID: 3, contents: "工单测试" },
      { workOrderID: 4, contents: "工单测试" },
      { workOrderID: 5, contents: "工单测试" },
      { workOrderID: 6, contents: "工单测试" },
      { workOrderID: 7, contents: "工单测试" },
      { workOrderID: 8, contents: "工单测试" },
      { workOrderID: 9, contents: "工单测试" },
      { workOrderID: 10, contents: "工单测试" },
      { workOrderID: 11, contents: "工单测试" },
      { workOrderID: 12, contents: "工单测试" },
      { workOrderID: 13, contents: "工单测试" },
      { workOrderID: 14, contents: "工单测试" },
      { workOrderID: 15, contents: "工单测试" },
      { workOrderID: 16, contents: "工单测试" },
      { workOrderID: 17, contents: "工单测试" },
      { workOrderID: 18, contents: "工单测试12333" }
    ];
  },
  //挂载完成钩子
  mounted() {
    console.log(this.$store.state.isNewWorkOrder + "1111111111");
  },
  deactivated() {},
  //keep-alive切换钩子
  activated() {
    console.log(this.$store.state.isNewWorkOrder);
  },
  //更新完成钩子
  updated() {
    console.log("DOM更新");
  },
  methods: {
    accept: function() {
      MessageBox.confirm("是否全部接收?").then(action => {
        Toast({
          message: "接收成功",
          position: "bottom",
          duration: 2000
        });
      });
    },
    //上拉刷新
    loadTop: function() {
      // 刷新数据的操作
      var self = this;
      setTimeout(function() {
        self.items = [
          { workOrderID: 14, contents: "工单测试" },
          { workOrderID: 15, contents: "工单测试" },
          { workOrderID: 16, contents: "工单测试" },
          { workOrderID: 17, contents: "工单测试" },
          { workOrderID: 18, contents: "工单测试333" },
          { workOrderID: 19, contents: "工单测试22" },
          { workOrderID: 20, contents: "工单测试1" },
          { workOrderID: 21, contents: "工单测试12333" }
        ];
        self.$refs.loadmore.onTopLoaded();
      }, 2000);
    },
    handleTopChange: function(status) {
      this.topStatus = status;
    }
  }
};
</script>
<style scoped>
/* 全部接收 */
#all_accept {
  height: 0.2rem;
  background-color: #e9eaea;
  position: fixed;
  bottom: 0.5rem;
  width: 100%;
  height: 0.5rem;
  padding: 0.09rem 0;
}

#acceptBtn {
  float: right;
  margin-right: 0.1rem;
  height: 0.35rem;
}

/* 分配给我 */
.assignedToMe {
  padding-top: 0.4rem;
  padding-bottom: 1rem;
}

.workOrderPond {
  padding-top: 0.4rem;
  padding-bottom: 0.5rem;
}

/* iphone5 */
@media screen and (max-width: 320px) {
  .assignedToMe {
    padding-top: 0.49rem;
  }
  .workOrderPond {
    padding-top: 0.49rem;
  }
}
/* 小米。 */
@media (min-device-width: 320px) and (max-device-width: 375px) {
  .assignedToMe {
    padding-top: 0.45rem;
  }
  .workOrderPond {
    padding-top: 0.45rem;
  }
}
/* iphone 6 */
@media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  .assignedToMe {
    padding-top: 0.43rem;
  }
  .workOrderPond {
    padding-top: 0.43rem;
  }
}
/* iphone6 plus */
@media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
  .assignedToMe {
    padding-top: 0.4rem;
  }
  .workOrderPond {
    padding-top: 0.4rem;
  }
}
/* 顶部菜单tab */
.nav_tab {
  position: fixed;
  width: 100%;
  top: 0.44rem;
  z-index: 9;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 0.03rem solid #26a2ff;
  color: #26a2ff;
  margin-bottom: -0.03rem;
}
/*下拉刷新图标*/
.mint-loadmore-top {
  color: #26a2ff;
  font-size: 0.2rem;
}
</style>

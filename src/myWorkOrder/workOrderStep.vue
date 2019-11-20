<template>
  <div id="big-box">
      <div>
      <mt-header fixed title="工单步骤">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
        <div v-for="workOrderStep in workOrderSteps" :key="workOrderStep.BillID" class="step">
          <div class="mui-table-view-cell">
            <div class="step_title">{{workOrderStep.FlowLineName}}</div>
          </div>
          <div class="mui-table-view-cell">
            <div>处理部门</div>
            <span>{{workOrderStep.OrgName}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>处理人员</div>
            <span>{{workOrderStep.OperatorRealName}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>处理内容</div>
            <span>{{workOrderStep.OperateOption}}</span>
          </div>
          <div class="mui-table-view-cell">
            <div>处理时间</div>
            <span>{{workOrderStep.OperateTime}}</span>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      workOrderSteps:[],
    };
  },
  mounted(){
    //获取工单步骤
    this.$http
    .get(this.$myConfig.host + "/api/WorkBillFlows/GetBillFlowsInformation",{
         params: {
          WorkBillID: this.$route.params.WorkBillID
        }
    })
    .then(
        function(res) {
            let resInfo = $.parseJSON(res.bodyText);
            if (resInfo.ReturnResult) {
                console.log(resInfo);
                this.workOrderSteps = resInfo.FlowModelList;
            } else {
                Toast(resInfo.Message);
            }
        },
        function(err) {
        Toast("请检查您的网络");
        }
    );
  },
  methods:{
      goback:function(){
          this.$router.go(-1); //返回上一次历史记录
      }
  }
};
</script>
<style scoped>
.step{
  margin-top: 0.15rem;
}

.mui-table-view-cell > .step_title{
  background-color: #49A9EA;
  color:#fff;
  float: left;
  width:auto;
  height:0.24rem;
  padding: 0.07rem 0.1rem;
  text-align: center;
  border-radius: 0.04rem;
  font-size: 0.14rem;
  line-height: 0.14rem;
}

.mui-table-view-cell{
  padding:0.15rem;
  background-color: #fff;
}

.mui-table-view-cell > div{
  float: left;
  width:25%;
  color:#666;
}

.mui-table-view-cell > span{
  float: right;
  max-width: 75%;
  color:#333;
}
</style>

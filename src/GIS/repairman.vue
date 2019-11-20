<template>
  <div id="big-box">
      <mt-header fixed title="维修人员">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
        <div class="repairman_content" v-for="repairman in repairmans" :key="repairman.RepairUserID">
            <router-link :to="'/GIS/repairmanOrder/'+ repairman.RepairUserID +'/' + repairman.RepairUserName " class="mui-table-view-cell">
                <div class="clearfix">
                    <div class="repairman_name">{{repairman.RepairUserName}}</div>
                    <div class="status">
                        <div>状态</div>
                        <div :class="repairman.RepairUserStatus == '在线' ? 'blue' : 'gray'">{{repairman.RepairUserStatus}}</div>
                    </div>
                    <div class="pond">
                        <div>待接收</div>
                        <div>{{repairman.WaitReceptionBillsCount}}</div>
                    </div>
                    <div class="reply">
                        <div>待回复</div>
                        <div>{{repairman.WaitReplyBillsCount}}</div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      repairmans:[],
    };
  },
  mounted(){

    //获取维修人员信息
    this.$http
    .get(this.$myConfig.host + "/api/RepairUserTrajectory/GetGISRepairUserStatusList",{
        params: {
          userID: this.$store.UserInfo.UserID
        }
    })
    .then(
        function(res) {
            let resInfo = $.parseJSON(res.bodyText);
            if (resInfo.ReturnResult) {
                console.log(resInfo);
                this.repairmans = resInfo.GisRepairUserStatusList;//维修人员列表
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
.repairman_content{
  height:0.61rem;
}

.repairman_content > .mui-table-view-cell > div > div{
    float: left;
    color:#333;
    line-height: 0.6rem;
}

.repairman_content > .mui-table-view-cell > div > div > div{
    line-height: 0.3rem;
}

.repairman_name{
    width:40%;
    text-align: left;
    font-size: 0.14rem;
}

.status,.pond,.reply{
    width:20%;
    text-align: center;
    font-size: 0.12rem;
}

.mui-table-view-cell{
  padding:0 0.2rem;
  background-color: #fff;
  display: inline-block;
  width: 100%;
  height:0.6rem;
}

.blue{
    color:#49A9EA !important;
}

.gray{
    color:#9B9B9B !important;
}
</style>

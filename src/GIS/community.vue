<template>
  <div id="big-box">
      <mt-header fixed title="小区">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
        <div class="community_content" v-for="community in communitys" :key="community.CommunityID">
            <router-link :to="'/GIS/communityOrder/'+ community.CommunityID + '/'+ community.CommunityName + '/'+ community.CommunityLng + '/'+ community.CommunityLat" class="mui-table-view-cell">
                <div class="clearfix">
                    <div class="community_name">{{community.CommunityName}}</div>
                    <div class="pond">
                        <div>工单池</div>
                        <div>{{community.WorkBillPoolCount}}</div>
                    </div>
                    <div class="reply">
                        <div>待回复</div>
                        <div>{{community.WaitReplyCount}}</div>
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
      communitys:[],
    };
  },
  mounted(){
    //获取小区列表信息
    this.$http
    .get(this.$myConfig.host + "/api/RepairUserTrajectory/GetGISCommunityList")
    .then(
        function(res) {
            let resInfo = $.parseJSON(res.bodyText);
            if (resInfo.ReturnResult) {
                console.log(resInfo);
                this.communitys = resInfo.CommunityList;//小区列表
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
.community_content{
  height:0.61rem;
}

.community_content > .mui-table-view-cell > div > div{
    float: left;
    color:#333;
    line-height: 0.6rem;
}

.community_content > .mui-table-view-cell > div > div > div{
    line-height: 0.3rem;
}

.community_name{
    width:60%;
    text-align: left;
    font-size: 0.14rem;
}

.pond,.reply{
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
</style>

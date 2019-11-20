<template>
    <div id="big-box">
        <div id="noMyFollow" :hidden="myfollowShow">
            <mt-header fixed title="我的关注">
                <router-link to="/home" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
            </mt-header>
            <div id="info_body">
                <div class="no_info" @click="goFollowPage()">
                    <p>
                        您还未关注维修队 >
                    </p>
                </div>
                <div class="img_info">
                    <img src="../../static/images/客服移动端切图/设置/app_img.png" alt="">
                </div>
            </div>
        </div>
        <div id="haveMyfollow" :hidden="!myfollowShow">
            <div class="head row">
                <router-link to="/home" slot="left">
                    <mt-button class="backIcon" icon="back"></mt-button>
                </router-link>
                <div class="search row">
                    <i class="mint-toast-icon mintui mintui-search"></i>
                    <input v-model="searchName" type="text" placeholder="请输入查询内容">
                </div>
                <span @click="searchTeam()" style="margin-left: 6.5vw;font-size: 0.18rem">搜索</span>
            </div>
            <div class="followTeam" style="margin-top: 2vw">
                <div class="followTeamList row" v-for="(item,index) in followMsg">
                    <div>{{item.RepairTeamName}}</div>
                    <div>
                        <div :hidden="item.IsFollowing">
                            <div class="goFollow" @click="goFollow(index)">关注</div>
                        </div>
                        <div :hidden="!item.IsFollowing">
                            <div class="cancelFollow" @click="cancelFollow(index)">已关注</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast } from "mint-ui";
    export default {
        name: "myfollow",
        data() {
            return {
                myfollowShow: false,
                followMsg: [],
                searchName:"",
                searchArr:[],
                allMsg:[]
            }
        },
        mounted() {
            this.loadFollowInfo()
        },
        methods: {
            loadFollowInfo() {
                this.$http
                    .get(this.$myConfig.host + "/api/OrganizationsFollowConfig/GetAllRepairTeam", {
                        params: {
                            UserID: this.$store.UserInfo.UserID,
                            repairTeamOrgCode: this.$store.UserInfo.OrgID
                        }
                    }).then(
                    function (res) {
                        this.followMsg = JSON.parse(res.data).Message
                        this.allMsg = JSON.parse(res.data).Message
                        for(let i = 0;i < this.followMsg.length;i++){
                            if(this.followMsg[i].IsFollowing){
                                this.myfollowShow = true
                                break;
                            }
                        }

                    },
                    function (err) {
                        console.log(err)
                    }
                )
            },
            goFollowPage(){
                this.myfollowShow = true
            },
            // 关注
            goFollow(id) {
                this.$http.post(this.$myConfig.host + "/api/OrganizationsFollowConfig/FollowRepairTeam?UserID="+this.$store.UserInfo.UserID+"&repairTeamOrgCode="+this.followMsg[id].RepairTeamOrgCode).then(
                    function (res) {
                        if(JSON.parse(res.data).ReturnResult){
                            this.followMsg[id].IsFollowing = !this.followMsg[id].IsFollowing
                        }
                        Toast(JSON.parse(res.data).Message);
                    },
                    function (err) {
                        console.log(err)
                    }
                )
            },
            // 取消关注
            cancelFollow(id){
                if(localStorage.getItem("selectRepairTeamId") == this.followMsg[id].RepairTeamOrgCode){
                    localStorage.removeItem('selectRepairTeamId');
                }
                this.$http
                    .post(this.$myConfig.host + "/api/OrganizationsFollowConfig/UnFollowRepairTeam?UserID="+this.$store.UserInfo.UserID+"&repairTeamOrgCode="+this.followMsg[id].RepairTeamOrgCode).then(
                    function (res) {
                        if(JSON.parse(res.data).ReturnResult){
                            this.followMsg[id].IsFollowing = !this.followMsg[id].IsFollowing
                        }
                        Toast(JSON.parse(res.data).Message);
                    },
                    function (err) {
                        console.log(err)
                    }
                )
            },
            //搜索
            searchTeam(){
                this.searchArr = []
                if(!this.searchName){
                    Toast("请输入维修队");
                }else{
                    for(var i=0;i<this.allMsg.length;i++){
                        if(this.allMsg[i].RepairTeamName.indexOf(this.searchName)>=0){
                            this.searchArr.push(this.allMsg[i]);
                        }
                    }
                    this.followMsg = this.searchArr
                }
            }
        }
    }

</script>

<style scoped>
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #big-box {
        width: 100%;
        height: 100%;
        background-color: white;
    }

    .no_info p {
        width: 100vw;
        padding: 4vw 10px;
        color: #666;
        background-color: #fff;
        text-align: center;
        border-bottom: 1px solid #979797;
        font-size: 0.14rem;
    }

    .img_info {
        display: flex;
        justify-content: center;
        margin-top: 20vh;
    }

    .img_info img {
        width: 40vw;
        height: 40vw;
    }

    .head {
        width: 100vw;
        height: 12.5vw;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #49A9EA;
        overflow: hidden;
        color: #fff;
    }

    .backIcon {
        background-color: #49A9EA;
        color: #fff;
    }

    .search {
        background-color: #7FC2F0;
        color: #fff;
        margin: 2vw 0;
        padding: 0 2vw;
        width: 66vw;
        height: 8.5vw;
        overflow: hidden;
        border-radius: 4vw;
    }

    .search input {
        background-color: #7FC2F0;
        color: #fff;
    }

    input::-webkit-input-placeholder {
        font-size: 16px;
        color: #fff;
    }

    .followTeamList {
        justify-content: space-between;
        width: 95vw;
        margin-left: 5vw;
        padding: 2.5vw 0vw 2.5vw 0;
        border-bottom: 1px solid #979797;
    }
    .goFollow{
        width: 20vw;
        height: 7vw;
        padding-right: 2vw;
        background:  url("../../static/images/客服移动端切图/设置/appIcon_btn2.png") no-repeat;
        background-size: 20vw 7vw;
        text-align: right;
        line-height: 7.5vw;
        font-size: 1em;
        margin-right: 2vw;
        color: #49A9EA;
    }
    .cancelFollow{
        font-size: 1em;
        width: 20vw;
        height: 7vw;
        background:  url("../../static/images/客服移动端切图/设置/appIcon_btn1.png") no-repeat;
        background-size: 20vw 7vw;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 2vw;
    }
</style>

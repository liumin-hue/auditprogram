<template>
    <div class="pending">
        <mt-header title="待稽查"></mt-header>
        <div>
            <ul class="pending_plan">
                <li v-for="(item,index) in planlist"><button @click="changecolor(index)" :class="{liBackground:planButton == index}"><div @click="communityList(index)">{{item.PlanName }}</div></button></li>
            </ul>
        </div>
        <div class="pending_auditnews">
            <ul  v-for="item in datas">
                <li v-for="(item,index) in datas" :key="index"
                    class="audit_argument">
                    <div class="model_bottom">
                        <div class="name"><span><span class="texttitle">开始日期：</span>{{item.startime}}</span></div>
                        <div class="phone"><span class="texttitle">结束日期：</span>{{item.endtime}}</div>
                    </div>
                    <div class="model_bottom">
                        <div class="name"><span class=""><span class="texttitle">稽查进度：</span>{{item.ImplementerTime}}</span></div>
                        <div class="phone"><span class="texttitle">未稽查：</span>{{item.IsOutTime}}</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="plan_content">
            <div class="plan_list">
                <ul>
                    <li v-for="(item,index) in communityList" class="pendinglist" >
                        <div @click="ContentList(index)" :class="{planlistBackground:planlistButton == index}" ><div class="pending_listname" @click="FamilyList(index)">{{item.CommunityName }}</div></div>
                    </li>
                </ul>
            </div>
            <div class="eachplan_content">
                <ul>
                    <li v-for="item in familyList" class="content_list">
                        <div class="address">
                            <div class="addressleft">地址：</div>
                            <div class="addressright">{{item.Address}}</div>
                        </div>
                        <div class="phone"><span class="texttitle">姓名：</span>{{item.CusName}}</div>
                    </li>
                </ul>
            </div>
        </div>
<!--        底部tab-->
        <mt-tabbar v-model="selected" style="position: fixed;bottom: 0">
            <div class="foo">
                <router-link to="/home">
                    <mt-tab-item id="首页">
                        <img slot="icon" src="../../static/images/audit/record/home.png">
                        首页
                    </mt-tab-item>
                </router-link>
            </div>
            <div class="foo">
                <router-link to="/setting/changeInfo">
                    <mt-tab-item id="设置">
                        <img slot="icon" src="../../static/images/audit/record/set.png">
                        设置
                    </mt-tab-item>
                </router-link>
            </div>
        </mt-tabbar>
    </div>
</template>
<script>
export default {
    data(){
        return{
            datas:[
                {
                    startime:'2019-11-13 18:21',
                    endtime:'2019-11-13 18:21',
                    ImplementerTime:'2314',
                    IsOutTime:"有问题",

                }
            ],
            planButton:0,      //初始选中index=0的稽查计划 被选择计划的index，来改变被选计划的背景颜色
            planlistButton:0, //小区列表index 被选择小区的index，来改变被选小区的背景颜色
            planlist: [],    //稽查计划列表
            communityList:[], //稽查计划里面的每个小区列表
            familyList:[],    //稽查计划里面的小区里面对应的每户列表
        }
    },
    activated(){
        this.communityList[this.planlistButton].CommunityID
    },
    mounted(){
        //稽查计划列表，小区列表
        // var _this = this

        this.$http
            .get('http://192.168.11.129:8088/Api/InspectionApp/GetInpectionPlans',{
                params:{
                    status:0,
                    chargeYear:'2019-2020',
                },
                headers:{
                    auth:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaWJpbiIsImV4cCI6MTU3NTY4MTk3OCwiaWF0IjoiMjAxOS8xMS83IDk6MjY6MTgiLCJkYXRhIjp7IlVzZXJJZCI6NDIwNywiVXNlck5hbWUiOiLmnY7lvawiLCJEYXRhTGltaXQiOm51bGwsIklzSW5zcGVjdGlvbkdyb3VwIjoxLCJXb3JrTGltaXRzIjpudWxsfX0.Z2cJNvEMiIxHPVecpiRLwrDBU6kt0b6tg101dCfaGgM'
                }
            })
            .then(res=> {
                console.log(res.body.Data)
                //稽查计划 列表(最上面）
                this.planlist = res.body.Data
                //稽查计划  小区列表
                this.changecolor()
            })

    },
    methods:{

        searchPlan(index){
            // $("button").addClass("bian");
        },
        changecolor(index) {
            this.planButton = index;
            //点击获取小区 的  列表
            this.communityList = this.planlist[index].InspectionCommunitys
            this.FamilyList(index)
            // console.log(this.planlist[index].InspectionCommunitys)
        },
        ContentList(index) {
            this.planlistButton = index;
            this.$store.state.communityID = this.communityList[index].CommunityID
            this.$store.state.inspectionID = this.communityList[index].InspectionID
            console.log(this.$store.state.communityID + ' ' + this.$store.state.inspectionID)
        },
        FamilyList(index){
            this.$http
                .get('http://192.168.11.129:8088/Api/InspectionApp/GetSendJob',{
                    params:{
                        status:0,
                        chargeYear:'2019-2020',
                        InspectionID:this.$store.state.inspectionID,
                        CommunityID:this.$store.state.communityID,
                        page:'1',
                        pageSize:'7',
                    },
                    headers:{
                        auth:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaWJpbiIsImV4cCI6MTU3NTY4MTk3OCwiaWF0IjoiMjAxOS8xMS83IDk6MjY6MTgiLCJkYXRhIjp7IlVzZXJJZCI6NDIwNywiVXNlck5hbWUiOiLmnY7lvawiLCJEYXRhTGltaXQiOm51bGwsIklzSW5zcGVjdGlvbkdyb3VwIjoxLCJXb3JrTGltaXRzIjpudWxsfX0.Z2cJNvEMiIxHPVecpiRLwrDBU6kt0b6tg101dCfaGgM'
                    }
                })
                .then(res=>{
                    this.familyList = res.body.Data
                    console.log('family')
                    console.log(this.familyList)
                })
        },
        communityList(index){
            this.$http
                .get('http://192.168.11.129:8088/Api/InspectionApp/GetInpectionPlans',{
                    params:{
                        status:0,
                        chargeYear:'2019-2020',
                    },
                    headers:{
                        auth:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaWJpbiIsImV4cCI6MTU3NTY4MTk3OCwiaWF0IjoiMjAxOS8xMS83IDk6MjY6MTgiLCJkYXRhIjp7IlVzZXJJZCI6NDIwNywiVXNlck5hbWUiOiLmnY7lvawiLCJEYXRhTGltaXQiOm51bGwsIklzSW5zcGVjdGlvbkdyb3VwIjoxLCJXb3JrTGltaXRzIjpudWxsfX0.Z2cJNvEMiIxHPVecpiRLwrDBU6kt0b6tg101dCfaGgM'
                    }
                })
                .then(res=>{
                    console.log(res.body.Data)
                    //稽查计划列表
                    this.planlist = res.body.Data
                    //稽查计划  小区列表
                    // this.communityList = this.planlist[this.planButton].InspectionCommunitys
                    // console.log(this.communityList)
                    // console.log(this.$store.state.communityID)
                    this.$store.state.communityID = this.communityList[index].CommunityID
                    this.$store.state.inspectionID= this.communityList[index].InspectionID
                });
        }

    }
}
</script>
<style scoped>
    .pending{
        height: 100%;
        background-color: #fff;
    }
    .pending_plan{
        width: 100%;
        white-space: nowrap;
        overflow: auto;
        margin-bottom:0;
        background-color: #FFF;

    }
    .pending_plan >li {
        /*width: 26%;*/
        font-size: 15px;
        padding: 10px;
        display: inline-block;
        text-align: center;

    }
    .pending_plan >li >button{
        padding:8px 12px;
        box-shadow:0 2px 4px 0 rgba(44,44,44,0.50);
    }
    .liBackground
    {
        color: #fff;
        background: #45AFFF;
        border: none;
        box-shadow:  0 2px 4px 0 rgba(8,57,147,0.50);
    }
    .planlistBackground{
        background: #fff;
    }
    .pendinglist {
        font-size: 10px;
        color: #727272;
        background-color: #F0F0F0;
        text-align: left;

    }
    .pending_listname{
        padding:13px 10px;
    }
    .pending_auditnews{
        border-bottom: 1px solid #EFEFEF;
        border-top: 1px solid #EFEFEF;
    }
    .plan_content{
        display: flex;
        flex-wrap: nowrap;
        background-color: #fff;
    }
    .eachplan_content{
        width: 77.8%;
        font-size: 12px;
        color: #333333;
    }
    .plan_list{
        width:22.2%;
    }
    .audit_argument{
        margin:0;
    }
    .content_list{
        border-bottom: 1px solid #E0E0E0;
        padding: 10px;
    }
</style>
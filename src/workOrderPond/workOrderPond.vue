<template>
    <div id="big-box">
        <!--      <mt-header fixed title="工单池">-->
        <!--        <router-link to="/home" slot="left">-->
        <!--            <mt-button icon="back"></mt-button>-->
        <!--        </router-link>-->
        <!--        <mt-button icon="more" slot="right" @click="moreFunc()" v-show="active === 'wait_for_reply' ? true : false "></mt-button>-->
        <!--      </mt-header>-->
        <!-- 遮罩层弹窗 -->
        <mt-popup v-model="popupVisible" popup-transition="popup-fade">
            <div class="mui-table-view-cell" @click="accept(1)">受理时间</div>
            <div class="mui-table-view-cell" @click="_import(2)">紧急程度</div>
            <div class="mui-table-view-cell" @click="timeRemaining(4)">剩余时间</div>
            <div class="mui-table-view-cell" @click="urge(3)">催办次数</div>
        </mt-popup>
        <!-- 已关注维修队层-->
        <div class="popupShowModel" v-show="popupShow">
            <div class="followTearList">
                <div v-for="item in followTear" class="row" @click="clickRepairTeam(item.RepairTeamOrgCode)">
                    <div>
                        {{item.RepairTeamName}}
                    </div>
                    <img style="width: 25px;height: 25px;margin-right: 10px" src="./../../static/images/客服移动端切图/首页/selected.png" v-if="selectRepairTeamId == item.RepairTeamOrgCode">
                </div>
            </div>
            <div style="height: 40vh" @click="popupShow=false"></div>
        </div>
        <div class="head row" style="z-index: 999;">
            <router-link to="/home" slot="left">
                <mt-button class="backIcon" icon="back"></mt-button>
            </router-link>
            <div class="search row">
                <div class="row" @click="clickFollow()">
                    <span style="margin-right: 1vw;white-space: nowrap">关注</span>
                    <img v-if="popupShow" style="width: 3.5vw;height: 3.5vw"
                         src="../../static/images/客服移动端切图/首页/appIcon_down.png" alt="">
                    <img v-else style="width: 3.5vw;height: 3.5vw" src="../../static/images/客服移动端切图/首页/appIcon_up.png"
                         alt="">
                </div>
                <div style="color:#085284;">工单池</div>
            </div>
            <span style="font-size: 0.2rem;font-weight: 600;padding-right: 2vw;margin-bottom: 2vw" @click="moreFunc()">...</span>
        </div>
        <!-- 工单内容 -->
        <div class="workOrderList" style="margin-top: 10px">
            <!-- 下拉刷新 -->
            <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"
                         @bottom-status-change="handleBottomChange" ref="loadmore" :bottom-method="loadMore"
                         :bottom-all-loaded="allLoaded_wait" :auto-fill="false">
                <div slot="top" class="mint-loadmore-top">
                    <span class="mui-icon mui-icon-pulldown" v-show="topStatus === 'pull'"
                          :class="{ 'rotate': topStatus === 'drop' }"></span>
                    <mt-spinner color="#26a2ff" type="snake" v-show="topStatus === 'loading'"></mt-spinner>
                    <span v-show="topStatus === 'drop'">释放更新</span>
                </div>
                <!-- cell组件 -->
                <div v-for="(confirm,index) in confirms" :key="confirm.id" class="workOrder_cell"
                     @click="workBillIndex(index)">
                    <router-link
                            :to="{path:'/myWorkOrder/workOrderDetails/' + confirm.WorkBillID + '/' + confirm.FlowID + '/' + confirm.FlowInstantID + '/' + confirm.FlowNodeID + '/' + confirm.FlowToDoTS + '/' + confirm.latestVersion}">
                        <div class="address">{{confirm.HouseAddress}}</div>
                        <div class="time">
                            {{confirm.AddTime}}
                            <span class="timeout" v-show="confirm.IsOutTime"></span>
                            <span class="workOrderType">{{confirm.BillTypeName}}</span>
                            <span class="urgentState" :style="{'color':(confirm.urgencyName == '紧急'? 'red':'black')}">{{confirm.urgencyName}}</span>
                        </div>
                    </router-link>
                </div>
                <!-- 上拉加载 -->
                <div slot="bottom" class="mint-loadmore-bottom" v-show="total == 0 ? false : true">
                    <span class="" v-show="bottomStatus === 'pull' && !allLoaded_wait"
                          :class="{ 'rotate': bottomStatus === 'drop' }">上拉加载</span>
                    <span class="" v-show="bottomStatus === 'pull' && allLoaded_wait"
                          :class="{ 'rotate': bottomStatus === 'drop' }">全部加载</span>
                    <mt-spinner color="#26a2ff" type="fading-circle" v-show="bottomStatus === 'loading'"></mt-spinner>
                    <span v-show="bottomStatus === 'drop'">释放加载</span>
                </div>
            </mt-loadmore>
            <!-- 添加组件 -->
            <my-scrollTop :total="total" :current="current" ref="scrollTop"></my-scrollTop>
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
        Spinner,
        Popup
    } from "mint-ui";

    var fromPath = ""

    //调用vuex插件
    import {mapState, mapMutations, mapActions, mapGetters} from "vuex";
    // import axios from 'axios'
    export default {
        data() {
            return {
                followTeamLiseSort: 1,//关注维修队工单列表排序
                selectRepairTeamId: '',//选择关注维修队的id
                active: "wait_for_reply",
                confirms: [],
                popupVisible: false,
                popupShow: false,
                topStatus: "",
                bottomStatus: "",
                allLoaded_wait: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
                isLoading: true,
                pageSize: 20,
                pageNum: 1,
                total: 0, //工单总数
                current: 0, //当前工单序列号
                hostPath: "/api/WorkOrderPool/GetWorkOrderPoolListByArriveDate",//当前路径
                followTear: [],//已关注维修队
            };
        },
        //进入前
        beforeRouteEnter: (to, from, next) => {
            fromPath = from.name
            next(vm => {
                // vm.$http.get(vm.$myConfig.host + "/api/WorkOrderPool/GetAllFollowingRepairTeam?UserID=" + vm.$store.UserInfo.UserID + "&repairTeamOrgCode=" + vm.$store.UserInfo.OrgID).then(
                //     function (res) {
                //         // vm.followTear = JSON.parse(res.data).Message
                //         console.log("vm.followTear.length:"+JSON.parse(res.data).Message.length)
                //         vm.selectRepairTeamId = ""
                //     },
                //     function (err) {
                //
                //     }
                // )
            });
        },
        //keep-alive切换钩子
        activated() {
            // 加载已关注队伍
            this.getFollowTeam();
            console.log("进入了");
            // console.log(this.$store.state.isNewWorkOrder);

            this.popupShow = false
            //判断工单节点是否被操作
            if (this.$store.operateType) {
                this.isLoading = true
                this.confirms.splice(this.$store.workBillIndex, 1)
                this.$store.operateType = !this.$store.operateType
                this.total -= 1
                let _this = this
                setTimeout(function () {
                    _this.isLoading = false
                }, 1000)
            }
            //获取子组件公用方法
            this.$refs.scrollTop.getIndex();

            //判断前一页是否为home
            if (fromPath == "Home") {
                this.isLoading = true
                //刷新页面
                this.hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByArriveDate";
                if(!localStorage.getItem("selectRepairTeamId")){
                    this.selectRepairTeamId = ""
                    this.loadTop();
                }
                else{
                    this.loadTop();
                }

            }
        },
        deactivated() {
            console.log("退出了");
            // this.selectRepairTeamId = ""
        },
        //挂载完成钩子
        created() {
            // console.log("created")
        },
        mounted() {
            // console.log("mounted")
        },
        //更新完成钩子
        updated() {
        },
        computed: {
            params() {
                return {
                    //这里先定义要传递给后台的数据
                    //然后将每次请求20条的参数一起提交给后台
                    pageSize: this.pageSize
                };
            }
        },
        methods: {
            moreFunc() {
                this.popupVisible = !this.popupVisible;
            },
            // 加载已关注队伍
            getFollowTeam() {
                this.$http.get(this.$myConfig.host + "/api/WorkOrderPool/GetAllFollowingRepairTeam?UserID=" + this.$store.UserInfo.UserID + "&repairTeamOrgCode=" + this.$store.UserInfo.OrgID).then(
                    function (res) {
                        this.followTear = JSON.parse(res.data).Message
                        // console.log(this.followTear.length)
                    },
                    function (err) {

                    }
                )
            },
            // 点击关注
            clickFollow() {
                if (this.followTear.length) {
                    this.popupShow = !this.popupShow
                } else {
                    Toast("您还没有关注其他维修队");
                }
            },
            // 选择维修队
            clickRepairTeam(id) {
                //获取点击维修队 机构ID
                localStorage.setItem('selectRepairTeamId', id);
                this.selectRepairTeamId = id
                this.pageNum = 1
                this.getFollowTeamList()
            },
            //获取关注维修队工单
            getFollowTeamList() {
                this.popupShow = false;
                this.isLoading = true;
                this.hostPath = "/api/WorkOrderPool/GetWorkOrderPoolFollowingRepairTeam"
                let UserID = ""
                var _this = this
                if (this.repairmanID) {
                    UserID = this.repairmanID
                } else {
                    UserID = this.$store.UserInfo.UserID
                }
                setTimeout(function () {
                    //获取工单列表
                    _this.$http
                        .get(_this.$myConfig.host + _this.hostPath, {
                            params: {
                                UserID: UserID,
                                repairTeamOrgCode: _this.selectRepairTeamId,
                                PageSize: 20,
                                PageCount: _this.pageNum,
                                sortTypeNo: _this.followTeamLiseSort
                            }
                        })
                        .then(
                            function (res) {
                                _this.confirms = res.data.WorkBillList
                                _this.isLoading = false;
                                _this.total = res.data.Total
                            },
                            function (err) {
                                Toast("请检查您的网络");
                                _this.isLoading = false;
                            }
                        );
                }, 1000);
                //初始化数据
                _this.allLoaded_wait = false;
                _this.topStatus = "";
            },
            //上拉加载
            loadMore() {
                if (this.selectRepairTeamId) {
                    let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolFollowingRepairTeam"
                    this.$myFun.loadMoreR(this, "confirms", hostPath, "loadmore")
                } else {
                let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByArriveDate"
                //获取当前索引
                this.$myFun.getIndex(this);
                this.$myFun.loadMore(this, "confirms", hostPath, "loadmore")
                }
            },
            //下拉刷新
            loadTop: function () {
                if (this.selectRepairTeamId) {
                    let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolFollowingRepairTeam"
                    this.$myFun.loadTopR(this, "confirms", hostPath, "loadmore")
                } else {
                    let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByArriveDate"
                    this.$myFun.loadTop(this, "confirms", hostPath, "loadmore")
                }
                // this.isLoading = false;
            },
            //下拉刷新状态改变
            handleTopChange: function (status) {
                this.current = 1
                this.topStatus = status;
            },
            handleBottomChange(status) {
                this.$myFun.getIndex(this, "current");
                if (status == "pull") {
                    let _this = this
                    setTimeout(function () {
                        _this.bottomStatus = status
                    }, 500)
                } else {
                    this.bottomStatus = status
                }
            },
            //记录工单索引号
            workBillIndex(index) {
                this.$store.workBillIndex = index
            },
            //按照受理时间排序
            accept(id) {
                //滚动条回零
                window.scrollTo(0, 0);
                if (this.selectRepairTeamId) {
                    this.followTeamLiseSort = id
                    this.getFollowTeamList()
                } else {
                    let _this = this
                    this.isLoading = true;
                    setTimeout(function () {
                        //指定路径指向
                        let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByArriveDate"
                        _this.hostPath = hostPath
                        //调用数据请求封装方法
                        _this.$myFun.loadTop(_this, "confirms", hostPath, "loadmore")
                        _this.isLoading = true;
                    }, 1000)
                }
                this.moreFunc();
            },
            //按照紧急程度排序
            _import(id) {
                //滚动条回零
                window.scrollTo(0, 0);
                if (this.selectRepairTeamId) {
                    this.followTeamLiseSort = id
                    this.getFollowTeamList()
                } else {
                    let _this = this
                    this.isLoading = true;
                    setTimeout(function () {
                        //指定路径指向
                        let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByImport"
                        _this.hostPath = hostPath
                        //调用数据请求封装方法
                        _this.$myFun.loadTop(_this, "confirms", hostPath, "loadmore")
                        _this.isLoading = true;
                    }, 1000)
                }
                this.moreFunc();
            },
            //按照催办次数排序
            urge(id) {
                //滚动条回零
                window.scrollTo(0, 0);
                if (this.selectRepairTeamId) {
                // != this.$store.UserInfo.OrgID
                    this.followTeamLiseSort = id
                    this.getFollowTeamList()
                } else {
                    let _this = this
                    this.isLoading = true;
                    setTimeout(function () {
                        //指定路径指向
                        let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByUrge"
                        _this.hostPath = hostPath
                        //调用数据请求封装方法
                        _this.$myFun.loadTop(_this, "confirms", hostPath, "loadmore")
                        _this.isLoading = true;
                    }, 1000)
                }
                this.moreFunc();
            },
            //按照剩余时间排序
            timeRemaining(id) {
                //滚动条回零
                window.scrollTo(0, 0);
                if (this.selectRepairTeamId) {
                    this.followTeamLiseSort = id
                    this.getFollowTeamList()
                } else {
                    let _this = this
                    this.isLoading = true;
                    setTimeout(function () {
                        //指定路径指向
                        let hostPath = "/api/WorkOrderPool/GetWorkOrderPoolListByTimeRemaining"
                        _this.hostPath = hostPath
                        //调用数据请求封装方法
                        _this.$myFun.loadTop(_this, "confirms", hostPath, "loadmore")
                        _this.isLoading = true;
                    }, 1000)
                }
                this.moreFunc();
            }
        }
    };
</script>
<style scoped>
    /*头部样式*/
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .head {
        width: 100vw;
        height: 6.6vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #49A9EA;
        overflow: hidden;
        color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .search {
        margin-right: 5vw;
        width: 30vw;
        justify-content: space-between;
    }

    .backIcon {
        background-color: #49A9EA;
        color: #fff;
    }

    .popupShowModel {
        width: 100vw;
        height: 100%;
        position: fixed;
        top: 6.6vh;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 99999;
        overflow: hidden;
    }

    .followTearList {
        width: 100vw;
        height: 60vh;
        padding-bottom: 5vh;
        background-color: #fff;
        padding-top: 2vw;
        overflow: scroll;
    }
    .row{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .followTearList > div {
        width: 94vw;
        margin-left: 3vw;
        border-bottom: 1px solid #979797;
        padding: 3vw 0;
    }

    /* 工单样式 */
    .workOrder_cell {
        background-color: #fff;
        padding: 5px 0.1rem;
        margin-bottom: 10px;
        min-height:72px;
    }

    .workOrder_cell .address {
        font-size: 14px;
        color: #333;
        padding: 5px;
    }

    .workOrder_cell .time {
        font-size: 12px;
        color: #666;
        padding: 5px;
        position: relative
    }

    .workOrder_cell .time > span {
        margin: 0 0.1rem;
    }

    /* popup样式 */
    .mint-popup {
        position: fixed;
        background: #fff;
        left: auto;
        top: 0.5rem;
        right: 0.05rem;
        transform: translate3d(0, 0, 0);
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transition: 0.2s ease-out;
        width: 0.86rem;
        background-color: #49a9ea;
        color: #fff;
        font-size: 0.12rem;
        border-radius: 0.04rem;
    }

    /*下拉刷新图标*/
    .mint-loadmore-top {
        color: #26a2ff;
        font-size: 0.2rem;
    }
.urgentState{position: absolute;right: 20px;display: inline-block;width:5em}

</style>

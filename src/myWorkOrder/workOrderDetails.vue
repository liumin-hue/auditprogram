<template>
    <div id="big-box" style="height: 100%;">
        <mt-header fixed title="工单详情">
        <span slot="left" @click="goback()">
            <mt-button icon="back"></mt-button>
        </span>
            <mt-button icon="more" slot="right" @click="moreFun()" class="mui-action-menu"></mt-button>
        </mt-header>
        <!-- 遮罩层弹窗 -->
        <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="moreHandle">
            <div class="mui-table-view-cell" v-if="source === 'MyWorkOrder' ? true : false" @click="delay()">延时申请</div>
            <div class="mui-table-view-cell" v-if="source === 'MyWorkOrder' ? true : false" @click="reassignment()">
                工单改派
            </div>
            <div class="mui-table-view-cell" v-if="source === 'TeamOrder' ? false : true" @click="workOrderBack()">
                工单退回
            </div>
            <div class="mui-table-view-cell" @click="allOfWorkOrder()">全部工单</div>
        </mt-popup>
        <!-- 工单 -->
        <div class="workOrderTitle clearfix">
            <span>{{workOrderNum}}</span>
            <span>{{BillCategoryName}}</span>
            <mt-button size="small" type="primary" @click="check()">查看步骤</mt-button>
        </div>
        <div class="workOrder_box">
            <!-- 工单内容 -->
            <div class="workOrder">
                <div class="mui-table-view-cell">
                    <div>客户地址</div>
                    <span>{{HouseAddress}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>联系人</div>
                    <span>{{ContactPerson}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>联系方式</div>
                    <span>{{ContactPhone}}<span @click="tel()" class="tel_btn"
                                                v-if="ContactPhone == ''?false:true"></span></span>
                </div>
                <div class="mui-table-view-cell">
                    <div>受理时间</div>
                    <span>{{AddTime}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>预约时间</div>
                    <span>{{OrderTime}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>剩余时间</div>
                    <span style="color: #FF4B47;">{{RestTime}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>处理部门</div>
                    <span>{{ShlSelectedOrgName}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>处理人</div>
                    <span>{{repairUserName}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>当前环节</div>
                    <span>{{BillStatusTest}}</span>
                </div>
                <div class="mui-table-view-cell">
                    <div>工单描述</div>
                    <span>{{description}}</span>
                </div>
                <!--测温-->
                <div class="mui-table-view-cell" v-show="isQualified">
                    <div>测温</div>
                </div>
                <div class="switchValue" v-show="isQualified">
                    <div>是否合格</div>
                    <span>{{isQualified}}</span>
                </div>
                <div class="mui-table-view-cell" style="width: 100vw;" v-show="thermometricTime">
                    <div>测温时间</div>
                    <span>{{thermometricTime}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="outdoorTemp">
                    <div>室外温度</div>
                    <span>{{outdoorTemp}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="bedroomTemp1">
                    <div>居室1温度</div>
                    <span>{{bedroomTemp1}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="bedroomTemp2">
                    <div>居室2温度</div>
                    <span>{{bedroomTemp2}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="bedroomTemp3">
                    <div>居室3温度</div>
                    <span>{{bedroomTemp3}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="bedroomTemp4">
                    <div>居室4温度</div>
                    <span>{{bedroomTemp4}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="hallTemp1">
                    <div>客厅1温度</div>
                    <span>{{hallTemp1}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="hallTemp2">
                    <div>客厅2温度</div>
                    <span>{{hallTemp2}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="hallTemp3">
                    <div>客厅3温度</div>
                    <span>{{hallTemp3}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="hallTemp4">
                    <div>客厅4温度</div>
                    <span>{{hallTemp4}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="restroomTemp1">
                    <div>卫生间1温度</div>
                    <span>{{restroomTemp1}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="restroomTemp2">
                    <div>卫生间2温度</div>
                    <span>{{restroomTemp2}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="restroomTemp3">
                    <div>卫生间3温度</div>
                    <span>{{restroomTemp3}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="restroomTemp4">
                    <div>卫生间4温度</div>
                    <span>{{restroomTemp4}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="kitchenTemp1">
                    <div>厨房1温度</div>
                    <span>{{kitchenTemp1}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="kitchenTemp2">
                    <div>厨房2温度</div>
                    <span>{{kitchenTemp2}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="kitchenTemp3">
                    <div>厨房3温度</div>
                    <span>{{kitchenTemp3}}</span>
                </div>
                `
                <div class="mui-table-view-cell" v-show="kitchenTemp4">
                    <div>厨房4温度</div>
                    <span>{{kitchenTemp4}}</span>
                </div>
                <div class="mui-table-view-cell" v-show="note">
                    <div>备注</div>
                    <span>{{note}}</span>
                </div>
            </div>
            <!-- 附件-->
            <div class="mainShowAnnex">
                <div class="row mui-table-view-cell">
                    <span>附件</span>
                    <mt-switch v-model="switchValue"></mt-switch>
                </div>
                <div class="showAnnex" v-show="switchValue">
                    <div v-for="item in fujianList">
                        <viewer style="margin: 0;padding: 0;">
                            <img style="width: 15vw;height: 15vw;" :src="item.AttachmentAddress" alt="">
                        </viewer>
                    </div>
                    <br style='clear:both'/>
                </div>
                <div id="pointBottom"></div>
            </div>

            <mt-tabbar v-model="selected" v-if="source === 'TeamOrder' ? false : true">
                <mt-button class="workOrder_handle" v-if="source === 'MyWorkOrder' ? true : false" type="primary"
                           size="large" @click="handle()">工单处理
                </mt-button>
                <mt-button class="workOrder_grap" v-if="source === 'WorkOrderPond' ? true : false" type="primary"
                           size="large" @click="grap()">抢单
                </mt-button>
                <mt-button class="workOrder_assign" v-if="(source === 'WorkOrderPond') && storeAssign? true : false"
                           type="primary" size="large" @click="assign()">工单分派
                </mt-button>
                <mt-button class="workOrder_accept" v-if="source === 'community' ? true : false" type="primary"
                           size="large" @click="accept()">接收工单
                </mt-button>
            </mt-tabbar>
        </div>
        <my-spinner :showSpinner="isLoading"></my-spinner>
    </div>
</template>
<script>
    //引入mint-ui插件
    import {MessageBox, Popup, Toast, Picker} from "mint-ui";

    var pageSource = "";

    export default {
        data() {
            return {
                fujianList:"",
                HouseAddress: "", //客户地址
                ContactPerson: "", //联系人
                ContactPhone: "", //联系方式
                AddTime: "", //受理时间
                OrderTime: "", //预约时间
                RestTime: "", //剩余时间
                ShlSelectedOrgName: "", //受理部门
                ShlUserID: "", //受理人
                ShlUserName: "",
                BillStatusTest: "", //当前环节
                chooseUserID: "", //选择分派人
                chooseUserName: "", //选择人姓名
                description: "", //工单描述
                roomid: "",
                popupVisible: false,
                workOrderNum: "", //工单号
                BillCategoryName: "", //工单类别
                handleOpinion: false, //处理意见
                valueLength: 0, //处理意见字数
                wordOrderReplyResult: "",
                source: "",
                storeAssign: true,
                assignList: false,
                switchValue: false,//附件开关
                WorkBillAttachmentList:[],
                assignItems: [
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                workBillParams: [],
                //工单节点
                WorkBillID: "",
                FlowID: "",
                FlowNodeID: "",
                FlowInstantID: "",
                FlowToDoTS: "",
                latestVersion: "",
                isLoading: true,
                repairUserName: ''
            };
        },
        // created(){
        //   console.log("created")
        // },
        // watch:{
        //   wordOrderReplyResult(val,oldVal){
        //     if(val.length >= 90){
        //       plus.nativeUI.toast("输入字数不得超过90字")
        //       console.log(val)
        //     }
        //   }
        // },
        mounted() {
            this.storeAssign = this.$store.assign;
            //判断处理意见是否存在
            if (this.$store.wordOrderReplyResult != undefined) {
                this.wordOrderReplyResult = this.$store.wordOrderReplyResult;
            }
            console.log("pageSource:"+pageSource)
            // 赋值
            this.source = pageSource;

            this.workBillParams = this.$route.params;
            this.WorkBillID = this.$route.params.WorkBillID;
            this.FlowID = this.$route.params.FlowID;
            this.FlowNodeID = this.$route.params.FlowNodeID;
            this.FlowInstantID = this.$route.params.FlowInstantID;
            this.FlowToDoTS = this.$route.params.FlowToDoTS;
            this.latestVersion = this.$route.params.latestVersion;

            //获取工单信息
            this.$http
                .get(this.$myConfig.host + "/api/WorkBillDetail/GetWorkBillByID", {
                    params: {
                        WorkBillID: this.workBillParams.WorkBillID
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            //赋值
                            this.repairUserName = resInfo.repairUserName
                            this.workOrderNum = resInfo.workBillID;
                            this.BillCategoryName = resInfo.billCategoryName;
                            this.HouseAddress = resInfo.houseAddress;
                            this.ContactPerson = resInfo.contactPerson;
                            this.ContactPhone = resInfo.contactPhone;
                            this.AddTime = resInfo.addTime;
                            this.OrderTime = resInfo.orderTime;
                            this.RestTime = resInfo.restTime;
                            this.ShlSelectedOrgName = resInfo.shlSelectedOrgName;
                            this.ShlUserName = resInfo.shlUserName;
                            this.BillStatusTest = resInfo.billStatusText;
                            this.roomid = resInfo.roomID;
                            this.description = resInfo.description;
                            // 测温
                            this.isQualified = resInfo.isQualified;
                            this.thermometricTime = resInfo.thermometricTime;
                            this.outdoorTemp = resInfo.outdoorTemp;
                            this.bedroomTemp1 = resInfo.bedroomTemp1;
                            this.bedroomTemp2 = resInfo.bedroomTemp2;
                            this.bedroomTemp3 = resInfo.bedroomTemp3;
                            this.bedroomTemp4 = resInfo.bedroomTemp4;
                            this.hallTemp1 = resInfo.hallTemp1;
                            this.hallTemp2 = resInfo.hallTemp2;
                            this.hallTemp3 = resInfo.hallTemp3;
                            this.hallTemp4 = resInfo.hallTemp4;
                            this.restroomTemp1 = resInfo.restroomTemp1;
                            this.restroomTemp2 = resInfo.restroomTemp2;
                            this.restroomTemp3 = resInfo.restroomTemp3;
                            this.restroomTemp4 = resInfo.restroomTemp4;
                            this.kitchenTemp1 = resInfo.kitchenTemp1;
                            this.kitchenTemp2 = resInfo.kitchenTemp2;
                            this.kitchenTemp3 = resInfo.kitchenTemp3;
                            this.kitchenTemp4 = resInfo.kitchenTemp4;
                            this.note = resInfo.note;
                            this.WorkBillAttachmentList = resInfo.WorkBillAttachmentList
                            for(let i = 0;i<this.WorkBillAttachmentList.length;i++){
                                this.WorkBillAttachmentList[i].AttachmentAddress = this.$myConfig.host +"/" + this.WorkBillAttachmentList[i].AttachmentAddress
                            }
                        } else {
                            Toast(resInfo.Message);
                        }
                        this.isLoading = false;
                    },
                    function (err) {
                        Toast("请检查您的网络");
                        this.isLoading = false;
                    }
                );
        },
        //跳转前
        beforeRouteEnter: (to, from, next) => {
            console.log(from.name)
            //判断跳转路径
            if (from.matched[0].instances.default.active == "reply_record") {
                pageSource = "TeamOrder";
            } else if (from.name == "MyWorkOrder") {
                // this.$store.state.isMyWorkOrder = "MyWorkOrder"
                pageSource = "MyWorkOrder";
            } else if (from.name == "WorkOrderPond") {
                // to.source = "community"
                pageSource = "WorkOrderPond";
            } else if (from.name == "TeamOrder") {
                pageSource = "TeamOrder";
            } else if (from.name == "ToAccept") {
                pageSource = "community";
            } else if (from.name == "CommunityOrder") {
                pageSource = "TeamOrder";
            } else if (from.name == "RepairmanOrder") {
                pageSource = "TeamOrder";
            }
            next();
        },
        methods: {
            //回退
            goback() {
                this.$store.wordOrderReplyResult = "";
                this.$router.go(-1);
            },
            //工单处理
            handle() {
                //跳转工单回复页面
                this.$router.push({
                    path:
                        "/myWorkOrder/workOrderReply/" +
                        this.WorkBillID +
                        "/" +
                        this.FlowID +
                        "/" +
                        this.FlowInstantID +
                        "/" +
                        this.FlowNodeID +
                        "/" +
                        this.FlowToDoTS +
                        "/" +
                        this.latestVersion
                });
            },
            //加载更多
            moreFun() {
                this.popupVisible = !this.popupVisible;
            },
            // 查看步骤
            check() {
                this.$router.push({
                    path: "/myWorkOrder/workOrderStep/" + this.WorkBillID
                });
            },
            //延时申请
            delay() {
                this.$store.AddTime = this.AddTime;
                this.$store.HouseAddress = this.HouseAddress;
                //清空样式，路由跳转
                this.popupVisible = !this.popupVisible;
                this.$router.push({
                    path:
                        "/myWorkOrder/delay/" +
                        this.WorkBillID +
                        "/" +
                        this.FlowID +
                        "/" +
                        this.FlowInstantID +
                        "/" +
                        this.FlowNodeID +
                        "/" +
                        this.FlowToDoTS +
                        "/" +
                        this.latestVersion +
                        "/" +
                        this.ContactPerson
                });
            },
            //工单改派
            reassignment() {
                this.$store.AddTime = this.AddTime;
                this.$store.HouseAddress = this.HouseAddress;
                //清空样式，路由跳转
                this.popupVisible = !this.popupVisible;
                this.$router.push({
                    path:
                        "/myWorkOrder/reassignment/" +
                        this.workOrderNum +
                        "/" +
                        this.FlowID +
                        "/" +
                        this.FlowInstantID +
                        "/" +
                        this.FlowNodeID +
                        "/" +
                        this.FlowToDoTS +
                        "/" +
                        this.latestVersion +
                        "/" +
                        this.source +
                        "/" +
                        this.ContactPerson
                });
            },
            //工单退回
            workOrderBack() {
                //清空样式，路由跳转
                this.popupVisible = !this.popupVisible;
                this.$router.push({
                    path:
                        "/myWorkOrder/workOrderBack/" +
                        this.workOrderNum +
                        "/" +
                        this.FlowID +
                        "/" +
                        this.FlowInstantID +
                        "/" +
                        this.FlowNodeID +
                        "/" +
                        this.FlowToDoTS +
                        "/" +
                        this.latestVersion +
                        "/" +
                        this.source
                });
            },
            //全部工单
            allOfWorkOrder() {
                if (this.roomid) {
                    //清空样式，路由跳转
                    this.popupVisible = !this.popupVisible;
                    this.$router.push({
                        path:
                            "/myWorkOrder/allOfWorkOrder/" +
                            this.roomid +
                            "/" +
                            this.workOrderNum
                    });
                } else {
                    Toast("当前工单无住户信息")
                    this.popupVisible = !this.popupVisible;
                }
            },
            //抢单
            grap() {
                this.workBillParams.UserID = this.$store.UserInfo.UserID;
                MessageBox.confirm("是否确认抢单？")
                    .then(action => {
                        //加载动画
                        this.isLoading = true;
                        //数据请求
                        this.$http
                            .post(
                                this.$myConfig.host + "/api/WorkOrderPool/PostPullWorkBill",
                                {
                                    WorkBillID: this.workOrderNum,
                                    FlowID: this.FlowID,
                                    FlowNodeID: this.FlowNodeID,
                                    FlowInstantID: this.FlowInstantID,
                                    FlowToDoTS: this.FlowToDoTS,
                                    UserID: this.$store.UserInfo.UserID,
                                    OrgCode: this.$store.UserInfo.OrgID,
                                    latestVersion: this.latestVersion
                                },
                                {emulateJSON: true}
                            )
                            .then(
                                function (res) {
                                    var resInfo = $.parseJSON(res.bodyText);
                                    //判断登录信息
                                    if (resInfo.ReturnResult) {
                                        if (resInfo.ResultType == 0) {
                                            //改变全局参数
                                            this.$store.operateType = true;
                                            this.$router.go(-1);
                                        }
                                        this.assignList = false;
                                        Toast(resInfo.Message);
                                    } else {
                                        Toast(resInfo.Message);
                                    }
                                    this.isLoading = false;
                                },
                                function (err) {
                                    Toast("请检查您的网络");
                                    this.isLoading = false;
                                }
                            );
                    })
                    .catch(() => {
                        this.isLoading = false;
                        console.log("取消");
                    });
            },
            //工单分派
            assign() {
                console.log(this.source,this.ContactPerson)
                this.$store.AddTime = this.AddTime;
                this.$store.HouseAddress = this.HouseAddress;
                // this.$store.ContactPerson = this.ContactPerson
                this.$router.push({
                    path:
                        "/myWorkOrder/workOrderAssign/" +
                        this.workOrderNum +
                        "/" +
                        this.FlowID +
                        "/" +
                        this.FlowInstantID +
                        "/" +
                        this.FlowNodeID +
                        "/" +
                        this.FlowToDoTS +
                        "/" +
                        this.latestVersion +
                        "/" +
                        this.source
                        // +
                        // "/" +
                        // this.ContactPerson
                });
            },
            //监听工单分派变化
            onValuesChange(picker, values) {
                if (values[0]) {
                    this.chooseUserID = values[0].UserID;
                    this.chooseUserName = values[0].RealName;
                }
            },
            // 处理意见
            clickOpinion() {
                this.handleOpinion = true;
            },
            //接收工单
            accept() {
                MessageBox.confirm("是否确认接收工单？")
                    .then(action => {
                        //调用加载动画
                        this.isLoading = true;
                        //调用数据接口
                        this.$http
                            .post(
                                this.$myConfig.host +
                                "/api/ReceptionBills/PostWaitReceptionBillAccept",
                                {
                                    UserID: this.$store.UserInfo.UserID,
                                    WorkBillID: this.workBillParams.WorkBillID
                                },
                                {emulateJSON: true}
                            )
                            .then(
                                function (res) {
                                    var resInfo = $.parseJSON(res.bodyText);
                                    if (resInfo.ReturnResult) {
                                        //改变全局参数
                                        this.$store.operateType = true;
                                        //提示信息
                                        Toast(resInfo.Message);
                                        this.$router.go(-1);
                                    } else {
                                        Toast(resInfo.Message);
                                    }
                                    //停止加载动画
                                    this.isLoading = false;
                                },
                                function (err) {
                                    //停止加载动画
                                    this.isLoading = false;
                                    Toast("请检查您的网络");
                                }
                            );
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
            //拨打电话
            tel() {
                plus.device.dial(this.ContactPhone, true);
            },
            // 取消处理意见
            cancelOpinion() {
                this.handleOpinion = false;
            }
            // 保存处理意见
        },
        watch: {
            'switchValue': function () {
                this.fujianList = this.WorkBillAttachmentList
                if (this.switchValue) {
                    let h = $(window).scrollTop(); //获取当前滚动条距离顶部的位置
                    $("html,body").animate({scrollTop: h + 150}, 800);
                }
            }
        }
    };
</script>
<style scoped>
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.15rem;
    }

    .mainShowAnnex {
        margin: 0.05rem 0 0.5rem 0;
        background-color: #fff;
    }

    .showAnnex {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .showAnnex div {
        margin-left: 1.5vw;
        margin-bottom: 0.1rem;
    }

    .btn_box {
        padding: 0.1rem 0 0.1rem 0.1rem;
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #fff;
    }

    /* popup样式 */
    .moreHandle.mint-popup {
        position: fixed;
        background: #fff;
        left: auto;
        top: 0.5rem;
        right: 0.1rem;
        transform: translate3d(0%, 0%, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transition: 0.2s ease-out;
        width: 0.86rem;
        background-color: #49a9ea;
        color: #fff;
        font-size: 0.12rem;
        border-radius: 0.04rem;
    }

    .moreHandle.mint-popup .mui-table-view-cell {
        padding: 0.05rem 0.15rem;
    }

    /* 工单详情-标题 */
    .workOrderTitle {
        height: 0.45rem;
        padding: 0.1rem 0.15rem;
        position: fixed;
        width: 100%;
        z-index: 9;
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
        padding-top: 0.45rem;
    }

    .workOrder {
        background-color: #fff;
        /*padding-bottom: 0.5rem;*/
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

    /* 工单处理按钮 */
    .mint-tabbar {
        position: fixed;
        padding: 0.05rem 0;
        background-color: #26a2ff;
    }

    .mint-button {
        height: 0.4rem;
        border-radius: 0;
    }

    .workOrder_grap {
        border-right: 0.015rem solid #fefefe;
    }

    .workOrder_assign {
        border-left: 0.015rem solid #fefefe;
    }

    /* 媒体查询 */
    /* 图标样式 */
    @media only screen and (max-device-width: 413px) {
        /*iPhone 6 Portrait*/
        /* 图片删除按钮 */
        .tel_btn {
            background: url("../../static/images/客服移动端切图/首页/tel.png") no-repeat center right;
        }
    }

    @media only screen and (min-device-width: 414px) {
        /*iPhone 6+ Portrait*/
        /* 电话按钮 */
        .tel_btn {
            background: url("../../static/images/客服移动端切图/首页/tel@1.5x.png") no-repeat center right;
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

    /* 处理意见按钮 */
    .workOrder_save {
        border-left: 0.01rem solid #fefefe;
    }

    .workOrder_cancel {
        border-right: 0.01rem solid #fefefe;
    }

    /* 字数展示 */
    .valueLength {
        text-align: right;
    }
</style>

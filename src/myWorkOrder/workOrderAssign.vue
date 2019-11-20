<template>
    <div id="big-box">
        <mt-header fixed title="工单分派">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="goback()"></mt-button>
            </router-link>
        </mt-header>
        <div class="reassign_content">
            <div class="mui-table-view-cell">
                <div>客户地址</div>
                <span>{{HouseAddress}}</span>
            </div>
            <div class="mui-table-view-cell">
                <div>客户姓名</div>
                <span>{{ContactPerson}}</span>
            </div>
            <div class="mui-table-view-cell">
                <div>受理时间</div>
                <span>{{AddTime}}</span>
            </div>
            <div class="mui-table-view-cell" @click="choosePerson()">
                <div>处理人</div>
                <span>{{chooseUserName}}<span class="mui-icon mui-icon-arrowdown"></span></span>
            </div>
            <div class="mui-table-view-cell" @click="handleOpinion()">
                <div>处理意见</div>
                <span class="reply_result_default" v-show="replyResultDefault">点击输入内容</span>
                <span class="reply_result_value" v-show="replyResultValue">{{wordOrderReplyResult}}</span>
            </div>
        </div>
        <mt-tabbar v-model="selected">
            <mt-button class="workOrder_handle" type="primary" size="large" @click="save()">保存</mt-button>
        </mt-tabbar>
        <!-- 处理人 -->
        <mt-popup v-model="reassignReasonList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
            <div class="pickerTitle">请选择处理人</div>
            <mt-picker :slots="reassignReasonItems" @change="onValuesChange" value-key="RealName"></mt-picker>
        </mt-popup>
        <my-spinner :showSpinner="isLoading"></my-spinner>
    </div>
</template>
<script>
    import {MessageBox, Popup, Toast, Picker} from "mint-ui"; //引入mint-ui插件

    var pageSource = "";

    export default {
        data() {
            return {
                disposeReason: "",
                chooseUserName: "",
                reassignReasonList: false,
                reassignReasonItems: [
                    {
                        flex: 1,
                        values: [],
                        className: "slot1",
                        textAlign: "center"
                    }
                ],
                source: "",
                dealUserId: "",
                workBillParams: [],
                //工单节点
                WorkBillID: "",
                FlowID: "",
                FlowNodeID: "",
                FlowInstantID: "",
                FlowToDoTS: "",
                latestVersion: "",
                source: "",
                wordOrderReplyResult: "",
                ContactPerson: "",
                HouseAddress: "",
                AddTime: "",
                replyResultDefault: true, //处理结果无值时，默认显示“点击输入内容”
                replyResultValue: false //处理结果有值时，显示值
            };
        },
        beforeRouteEnter: (to, from, next) => {
            pageSource = from.name;
            // console.log(pageSource)
            next();
        },
        activated() {
            this.workBillParams = this.$route.params;
            this.WorkBillID = this.$route.params.WorkBillID;
            this.FlowID = this.$route.params.FlowID;
            this.FlowNodeID = this.$route.params.FlowNodeID;
            this.FlowInstantID = this.$route.params.FlowInstantID;
            this.FlowToDoTS = this.$route.params.FlowToDoTS;
            this.latestVersion = this.$route.params.latestVersion;
            this.source = this.$route.params.source;
            // this.ContactPerson = this.$route.params.ContactPerson;
            this.ContactPerson = this.$store.ContactPerson
            this.HouseAddress = this.$store.HouseAddress;
            this.AddTime = this.$store.AddTime;
            //获取工单信息
            if (pageSource !== "workOrderReplyResult") {
                this.$http
                    .get(
                        this.$myConfig.host +
                        "/api/WorkOrderPool/GetWorkBillDealUsers",
                        {
                            params: {
                                OrgCode: this.$store.UserInfo.OrgID
                            }
                        }
                    )
                    .then(
                        function (res) {
                            var resInfo = $.parseJSON(res.bodyText);
                            if (resInfo.ReturnResult) {
                                this.reassignReasonItems[0].values = resInfo.UserList;
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
            }
            //判断处理结果是否已输入内容并保存
            if (
                this.$store.wordOrderReplyResult == undefined ||
                this.$store.wordOrderReplyResult == ""
            ) {
                this.replyResultDefault = true;
                this.replyResultValue = false;
                this.wordOrderReplyResult = ""
            } else {
                this.wordOrderReplyResult = this.$store.wordOrderReplyResult;
                this.replyResultDefault = false;
                this.replyResultValue = true;
            }
        },
        mounted() {
        },
        methods: {
            goback: function () {
                this.$store.wordOrderReplyResult = "";
                this.$router.go(-1); //返回上一次历史记录
            },
            //选择处理人
            choosePerson() {
                this.reassignReasonList = !this.reassignReasonList;
            },
            //picker监听变化事件
            onValuesChange(picker, values) {
                if (values[0]) {
                    this.chooseUserID = values[0].UserID;
                    this.chooseUserName = values[0].RealName;
                }
            },
            //点击保存按钮
            save() {
                //数据赋值
                this.workBillParams.UserID = this.$store.UserInfo.UserID;
                this.workBillParams.repairUserID = this.chooseUserID;
                this.workBillParams.OrgCode = this.$store.UserInfo.OrgID;
                this.workBillParams.Opinion = this.wordOrderReplyResult
                MessageBox.confirm("是否确认分派?")
                    .then(action => {
                        //调用加载动画
                        this.isLoading = true;
                        //工单确认分派
                        this.$http
                            .post(
                                this.$myConfig.host + "/api/WorkOrderPool/PostWorkBillDispatch",
                                this.workBillParams,
                                {emulateJSON: true}
                            )
                            .then(
                                function (res) {
                                    var resInfo = $.parseJSON(res.bodyText);
                                    if (resInfo.ReturnResult) {
                                        //改变全局参数
                                        this.$store.wordOrderReplyResult = "";
                                        this.$store.operateType = true;
                                        this.$router.go(-2);
                                        //提示信息
                                        try {
                                            plus.nativeUI.toast(resInfo.Message);
                                        } catch (e) {

                                        }
                                        //刷新页面
                                        this.popupVisible = false;
                                    } else {
                                        try {
                                            plus.nativeUI.toast(resInfo.Message);
                                        } catch (e) {
                                            Toast(resInfo.Message)
                                        }
                                    }
                                    this.isLoading = false;
                                },
                                function (err) {
                                    try {
                                        plus.nativeUI.toast(resInfo.Message);
                                    } catch (e) {
                                        Toast(resInfo.Message)
                                    }
                                    this.isLoading = false;
                                }
                            );
                        this.assignList = false;
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
            //处理意见
            handleOpinion() {
                this.$router.push({path: "/myWorkOrder/workOrderReplyResult"});
            }
        }
    };
</script>
<style scoped>
    .reassign_content {
        margin-top: 0.15rem;
    }

    .mui-table-view-cell > .step_title {
        background-color: #49a9ea;
        color: #fff;
        float: left;
        width: 0.8rem;
        height: 0.24rem;
        padding: 0.05rem;
        text-align: center;
        border-radius: 0.04rem;
    }

    .mui-table-view-cell {
        padding: 0.15rem;
        background-color: #fff;
    }

    .mui-table-view-cell > div {
        float: left;
        width: 35%;
        color: #666;
    }

    .mui-table-view-cell > span {
        float: right;
        max-width: 65%;
        color: #333;
    }

    .mui-icon {
        font-size: 0.17rem;
        margin-left: 0.08rem;
    }

    .mint-popup.opinion {
        width: 2.5rem;
    }

    .mint-popup.opinion textarea {
        padding: 0;
    }
</style>

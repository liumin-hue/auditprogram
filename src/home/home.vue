<template>
    <div id="big-box">
        <mt-header fixed :title="tab_selected"></mt-header>
        <!-- 首页主体框架 -->
        <div class="page-wrap">
            <!-- tabcontainer -->
            <mt-tab-container class="page-tabbar-container" v-model="tab_selected">
                <!-- 首页 -->
                <mt-tab-container-item id="首页">
                    <div id="content" class="mui-content">
                        <!-- 轮播图 -->
                        <mt-swipe :show-indicators="false" :auto="4000">
                            <mt-swipe-item></mt-swipe-item>
                        </mt-swipe>
                        <!-- 内面内容 -->
                        <div id="siderbar">
                            <ul class="mui-table-view mui-grid-view mui-grid-9">
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/PendingAudit">
                                        <span class="mui-icon myWorkOrder_icon"></span>
                                        <div class="mui-media-body">我的工单</div>
                                    </router-link>
                                </li>
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/PendingDeal">
                                        <span class="mui-icon repairTeam_icon"></span>
                                        <div class="mui-media-body">维修队工单</div>
                                    </router-link>
                                </li>
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/auditRecord">
                                        <mt-badge size="small" type="error" v-show="toAccept == 0 ? false : true">
                                            {{toAccept}}
                                        </mt-badge>
                                        <span class="mui-icon accepted_icon"></span>
                                        <div class="mui-media-body">待接收</div>
                                    </router-link>
                                </li>
                                <li class="mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3">
                                    <router-link to="/Blacklist">
                                        <mt-badge size="small" type="error"
                                                  v-show="workOrderPoolNew == 0 ? false : true">{{workOrderPoolNew}}
                                        </mt-badge>
                                        <span class="mui-icon workOrderPond_icon"></span>
                                        <div class="mui-media-body">工单池</div>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </mt-tab-container-item>
                <!-- 统计 -->
                <mt-tab-container-item id="统计">
                    <div id="statistics_info" style="vertical-align: middle">
                        <mt-cell class="mui-table-view-cell" to="/" title="维修人员情况统计">
                            <span class="right-icon"></span>
                        </mt-cell>
                        <mt-cell class="mui-table-view-cell" to="/" title="维修队工单统计">
                          <span class="right-icon"></span>
                        </mt-cell>
                        <div style="display: none;"></div>
                    </div>
                </mt-tab-container-item>
                <!-- GIS -->
                <mt-tab-container-item id="GIS">
                    <div class="GIS_title_box">
                        <div class="GIS_title clearfix" v-show="GIS_title_all">
                            <div @click="community()" class="GIS_title_community"><span id="GIS_community"></span>小区：{{CommunityCount}}
                            </div>
                            <div @click="repairman()" class="GIS_title_repairman"><span id="GIS_repairman"></span>维修人员：{{RepairUserCount}}({{RepairUserOnlineCount}}在线)
                            </div>
                        </div>

                        <mt-cell :title="CommunityDetail.CommunityName"
                                 :label="'工单池：'+CommunityDetail.WorkBillPoolCount+'　　待回复：'+CommunityDetail.WaitReplyCount"
                                 is-link to="/"
                                 class="GIS_title_cell clearfix" v-show="GIS_title_community">
                            <span>查看详情</span>
                        </mt-cell>

                        <mt-cell :title="RepairUserDetail.RepairUserName+'　'+RepairUserDetail.RepairUserLoginTime+'　上线'"
                                 :label="'待接收：'+RepairUserDetail.WaitReceptionBillsCount+'　　待回复：'+RepairUserDetail.WaitReplyBillsCount"
                                 is-link
                                 :to="'/GIS/repairmanOrder/' + RepairUserDetail.RepairUserID + '/' + RepairUserDetail.RepairUserName"
                                 class="GIS_title_cell clearfix" v-show="GIS_title_repairman">
                            <span>查看详情</span>
                        </mt-cell>
                    </div>
                    <div id="container" class="mymap" v-show="GIS_container"></div>
                    <my-spinner :showSpinner="isLoading"></my-spinner>
                </mt-tab-container-item>
                <!-- 设置 -->
                <mt-tab-container-item id="设置">
                    <div id="setting_info">
                        <mt-cell class="mui-table-view-cell setting_follow setting_icon" to="/myFollow/myFollow"
                                 title="我的关注"><span class="right-icon"></span></mt-cell>
                        <mt-cell class="mui-table-view-cell setting_changeInfo setting_icon" to="/setting/changeInfo"
                                 title="修改信息"><span class="right-icon"></span></mt-cell>
                        <mt-cell class="mui-table-view-cell setting_changePassage setting_icon"
                                 to="/setting/changePassword" title="密码修改"><span class="right-icon"></span></mt-cell>
                        <mt-cell style="padding-right:0.2rem" v-show="!versions"
                                 class="mui-table-view-cell setting_vision setting_icon" title="系统升级"
                                 :value="'当前版本：' + oldVersions"></mt-cell>
                        <mt-cell style="padding-right:0.2rem" v-show="versions" to="/setting/versions"
                                 class="mui-table-view-cell setting_vision setting_icon versions" title="系统升级"
                                 value="发现新版本"></mt-cell>
                        <!-- 退出按钮 -->
                        <mt-button class="workOrder_handle" type="default" size="large" @click="quit()">安全退出</mt-button>
                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <!-- 底部tab切换 -->
        <mt-tabbar style="position: fixed;bottom: 0" v-model="tab_selected">
            <mt-tab-item id="首页" :class="tab_selected == '设置' ? 'choosed' : ''">
                <div :class="tab_selected == '首页' ? 'choosed' : ''">
                    <span class="home_icon icons"></span>
                    <mt-badge size="small" type="error" v-show="toAccept + workOrderPoolNew == 0 ? false : true">
                        {{toAccept + workOrderPoolNew}}
                    </mt-badge>
                </div>
                首页
            </mt-tab-item>
            <mt-tab-item id="统计" :class="tab_selected == '设置' ? 'choosed' : ''">
                <div :class="tab_selected == '统计' ? 'choosed' : ''">
                    <span class="statistic_icon icons"></span>
                </div>
                统计
            </mt-tab-item>
            <mt-tab-item id="GIS" :class="tab_selected == '设置' ? 'choosed' : ''">
                <div :class="tab_selected == 'GIS' ? 'choosed' : ''">
                    <span class="GIS_icon icons"></span>
                </div>
                GIS
            </mt-tab-item>
            <mt-tab-item id="设置" :class="tab_selected == '设置' ? 'choosed' : ''">
                <div :class="tab_selected == '设置' ? 'choosed' : ''">
                    <span class="setting_icon icons"></span>
                    <span class="tip" v-show="versions?true:false"></span>
                </div>
                设置
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    //引入mint-ui插件
    import {MessageBox, Tabbar, TabItem, Toast, Badge} from "mint-ui";
    import BMap from "BMap"; //在页面中引入百度地图

    //声明图片支持webpack打包
    const img1 = require("../../static/images/客服移动端切图/GIS/Group 5 Copy 4.png");
    const img2 = require("../../static/images/客服移动端切图/GIS/人员 copy 3.png");
    const img_box = [img1, img2];

    var source = "";

    export default {
        data() {
            return {
                tab_selected: "首页",
                toAccept: 0,
                workOrderPoolNew: 0,
                CommunityCount: "", //小区数量
                RepairUserCount: "", //维修人员数量
                RepairUserOnlineCount: "", //维修人员在线人数
                GIS_container: false, //显示地图是否显示
                GIS_title_all: true,
                GIS_title_community: false,
                GIS_title_repairman: false,
                CommunityCoordinateList: [], //小区列表
                CommunityDetail: [], //小区顶部信息
                RepairUserDetail: [], //维修员顶部信息
                RepairUserCoordinateList: [], //维修员列表
                isLoading: false,
                versions: false,
                oldVersions: "1.0.0"
            };
        },
        props: {},
        watch: {
            tab_selected: function (val, oldVal) {
                // console.log(val);
                if (val === "GIS") {
                    this.isLoading = true;
                    let _this = this;
                    setTimeout(function () {
                        _this.isLoading = false;
                    }, 1000);
                    this.loadmap(); //加载地图和相关组件
                }
            }
        },
        mounted() {
        },
        //判断跳转路径
        beforeRouteEnter: (to, from, next) => {
            //获取当前页面
            var thisPage = to.matched[0].instances.default;
            //根据跳转前路径清空新工单
            if (from.name == "ToAccept") {
                // console.log("from.name")
                thisPage.toAccept = 0;
                try {
                    plus.storage.setItem(
                        "gdky_myWorkOrderTime",
                        thisPage.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                    ); //我的工单退出时间注册
                } catch (e) {
                }
            } else if (from.name == "WorkOrderPond") {
                thisPage.workOrderPoolNew = 0;
                try {
                    plus.storage.setItem(
                        "gdky_workOrderPoolTime",
                        thisPage.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                    ); //工单池退出时间注册
                } catch (e) {
                }
            }
            source = from.name;
            // console.log(source);
            next();
        },
        activated() {
            // 切换GIS展示
            var _this = this;
            // 保存手机版本号
            this.$store.versions = this.oldVersions;
            if (source != "CommunityOrder") {
                this.GIS_title_all = true;
                this.GIS_title_community = false;
                this.GIS_title_repairman = false;
            } else {
                if (this.$store.position) {
                    this.isLoading = true
                    setTimeout(function () {
                        map.setViewport([{lat: _this.$store.lat, lng: _this.$store.lng}])
                        _this.isLoading = false
                    }, 1000)
                    this.loadmap()
                    this.$store.position = false
                }
            }
            this.$store.community = false
            //获取手机cid
            try {
                var info = plus.push.getClientInfo();
                //计时器获取cid
                var timer = setInterval(function () {
                    if (info.clientid == "") {
                        info = plus.push.getClientInfo();
                        // console.log("获取cid失败");
                        return false;
                    } else {
                        plus.storage.setItem("gdkykf_clientid", info.clientid); //注册手机cid
                        //更新cid
                        _this.$http
                            .post(
                                _this.$myConfig.host +
                                "/api/UserLogin/PostUpdateClientIDByUserID",
                                {
                                    UserID: _this.$store.UserInfo.UserID,
                                    ClientID: info.clientid
                                },
                                {emulateJSON: true}
                            )
                            .then(
                                function (res) {
                                    let resInfo = $.parseJSON(res.bodyText);
                                    //判断登录信息
                                    if (resInfo.ReturnResult) {
                                        // Toast("获取cid成功");
                                        // console.log(info.clientid);
                                    } else {
                                        Toast(resInfo.Message);
                                    }
                                },
                                function (err) {
                                    Toast("请检查您的网络");
                                }
                            );
                        clearInterval(timer);
                        // console.log("获取cid成功");
                    }
                }, 50);
            } catch (e) {
            }
            //挂载首页时查看新工单
            try {
                var MyWorkOrderTime = plus.storage.getItem("gdky_myWorkOrderTime");
                var WorkOrderPoolTime = plus.storage.getItem("gdky_workOrderPoolTime");
            } catch (e) {
                var MyWorkOrderTime = "";
                var WorkOrderPoolTime = "";
            }
            //获取用户工单信息
            this.$http
                .get(this.$myConfig.host + "/api/UserLogin/GetMountPrepareConditions", {
                    params: {
                        UserID: this.$store.UserInfo.UserID,
                        MyWorkOrderTime: MyWorkOrderTime, // plus.storage.getItem(gdky_myWorkOrderTime)====>获取点击我的工单退出时间
                        WorkOrderPoolTime: WorkOrderPoolTime // plus.storage.getItem(gdky_workOrderPoolTime)====>获取点击我的工单退出时间
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        // console.log(resInfo);
                        if (resInfo.ReturnResult) {
                            // console.log(resInfo.AppVersionName.split('.').join('') , resInfo.AppVersionName.split('.').join(''))
                            // 判断版本号
                            if (resInfo.AppVersionName.split('.').join('') > this.$store.versions.split('.').join('')) {
                                this.versions = true
                                this.$store.newVersions = resInfo.AppVersionName
                            } else {
                                this.versions = false
                            }
                            _this.$store.toAcceptNew = resInfo.WaitReceptionBillsCounts;
                            _this.$store.workOrderPoolNew = resInfo.WorkOrderPoolPrompCounts;
                            //新工单赋值
                            this.toAccept = this.$store.toAcceptNew;
                            this.workOrderPoolNew = this.$store.workOrderPoolNew;
                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );
            //判断路由跳转
            if (this.$store.isLogin) {
                //this.loadmap(); //加载地图和相关组件
                this.tab_selected = "首页";
                this.$store.isLogin = false;
                this.GIS_title_all = true;
                this.GIS_title_community = false;
                this.GIS_title_repairman = false;
            }
            // console.log(this.$store.state.isNewWorkOrder);

            //获取用户权限
            this.$http
                .get(this.$myConfig.host + "/api/UserLogin/GetPrepareConditions", {
                    params: {
                        UserID: this.$store.UserInfo.UserID
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            // console.log(resInfo.Permisions);
                            for (let i = 0; i < resInfo.Permisions.length; i++) {
                                if (resInfo.Permisions[i] == "gdqrfp") {
                                    this.$store.assign = true;
                                    break;
                                } else {
                                    this.$store.assign = false;
                                    continue;
                                }
                            }
                            //保存用户权限
                            _this.$store.Permisions = resInfo.Permisions;
                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );
        },
        deactivated() {
        },
        methods: {
            //加载地图
            loadmap() {
                this.GIS_container = true;
                var _this = this;
                //获取GIS地图标注信息
                _this.$http
                    .get(
                        _this.$myConfig.host + "/api/RepairUserTrajectory/GetGISHomePage",
                        {
                            params: {
                                UserID: _this.$store.UserInfo.UserID
                            }
                        }
                    )
                    .then(
                        function (res) {
                            let resInfo = $.parseJSON(res.bodyText);
                            //console.log(resInfo);
                            //判断登录信息
                            if (resInfo.ReturnResult) {
                                //console.log(resInfo);
                                _this.CommunityCount = resInfo.CommunityCount; //小区数量
                                _this.RepairUserCount = resInfo.RepairUserCount; //维修人员数量
                                _this.RepairUserOnlineCount = resInfo.RepairUserOnlineCount; //维修人员在线人数
                                _this.CommunityCoordinateList = resInfo.CommunityCoordinateList; //小区标注信息
                                _this.RepairUserCoordinateList = resInfo.RepairUserCoordinateList; //维修人员标注信息

                                var pt = "";
                                var mark_icon = img_box;
                                var points_community = []; //存放小区标注点的数组
                                var points_repairman = []; //存放维修人员标注点的数组
                                var points_all = [];
                                var map = new BMap.Map("container");
                                window.map = map; //将map变量存储为全局变量

                                //初始化地图
                                _this.initMap = function () {
                                    _this.createMap(
                                        resInfo.CommunityCoordinateList,
                                        mark_icon[0],
                                        1
                                    ); //小区标注
                                    _this.createMap(
                                        resInfo.RepairUserCoordinateList,
                                        mark_icon[1],
                                        2
                                    ); //维修人员标注
                                    _this.setMapEvent();
                                    _this.addMapControl();
                                    points_all = points_community.concat(points_repairman); //数组合并
                                    //_this.setZoom(points_all);//中心坐标
                                    map.setViewport(points_all); //让标注显示在最佳视野内
                                    //  console.log(points_all);
                                };

                                //创建地图
                                _this.createMap = function (mark_data, mark_icon, icon_type) {
                                    for (var i = 0; i < mark_data.length; i++) {
                                        if (
                                            icon_type == 1 &&
                                            (mark_data[i].CommunityLng != "" ||
                                                mark_data[i].CommunityLat != "")
                                        ) {
                                            //将坐标为空值排除
                                            //小区标注
                                            var p0 = mark_data[i].CommunityLng;
                                            var p1 = mark_data[i].CommunityLat;
                                            pt = new window.BMap.Point(p0, p1);
                                            points_community.push(pt);
                                        } else if (
                                            icon_type == 2 &&
                                            (mark_data[i].RepairUserLng != "" ||
                                                mark_data[i].RepairUserLat != "")
                                        ) {
                                            //将坐标为空值排除
                                            //维修人员标注
                                            var p0 = mark_data[i].RepairUserLng;
                                            var p1 = mark_data[i].RepairUserLat;
                                            pt = new window.BMap.Point(p0, p1);
                                            points_repairman.push(pt);
                                        }
                                        var maker = _this.addMarker(
                                            pt,
                                            mark_data[i],
                                            mark_icon,
                                            icon_type
                                        );
                                    }
                                };

                                //添加覆盖物标注
                                _this.addMarker = function (point, pro, mark_icon, icon_type) {
                                    var myIcon = new BMap.Icon(mark_icon, new BMap.Size(40, 40), {
                                        offset: new BMap.Size(10, 25)
                                    });
                                    var marker = new BMap.Marker(point, {
                                        icon: myIcon
                                    });
                                    map.addOverlay(marker);

                                    //监听非标注，即地图空白区域
                                    map.addEventListener("click", function (e) {
                                        if (!e.overlay) {
                                            _this.GIS_title_all = true;
                                            _this.GIS_title_community = false;
                                            _this.GIS_title_repairman = false;
                                        }
                                    });

                                    //监听标注
                                    marker.addEventListener("click", function (e) {
                                        if (icon_type == 1) {
                                            //小区
                                            _this.$http
                                                .get(
                                                    _this.$myConfig.host +
                                                    "/api/RepairUserTrajectory/GetGisCommunityDetail",
                                                    {
                                                        params: {
                                                            communityID: pro.CommunityID
                                                        }
                                                    }
                                                )
                                                .then(
                                                    function (res) {
                                                        let resInfo = $.parseJSON(res.bodyText);
                                                        // console.log(resInfo)
                                                        if (resInfo.ReturnResult) {
                                                            _this.CommunityDetail = resInfo;
                                                            _this.GIS_title_all = false;
                                                            _this.GIS_title_community = true;
                                                            _this.GIS_title_repairman = false;
                                                        } else {
                                                            Toast(resInfo.Message);
                                                        }
                                                    },
                                                    function (err) {
                                                        Toast("请检查您的网络");
                                                    }
                                                );
                                        } else if (icon_type == 2) {
                                            //维修人员
                                            _this.$http
                                                .get(
                                                    _this.$myConfig.host +
                                                    "/api/RepairUserTrajectory/GetGisRepairUserIDDetail",
                                                    {
                                                        params: {
                                                            userID: pro.RepairUserID
                                                        }
                                                    }
                                                )
                                                .then(
                                                    function (res) {
                                                        let resInfo = $.parseJSON(res.bodyText);
                                                        if (resInfo.ReturnResult) {
                                                            _this.RepairUserDetail = resInfo;
                                                            _this.GIS_title_all = false;
                                                            _this.GIS_title_community = false;
                                                            _this.GIS_title_repairman = true;
                                                        } else {
                                                            Toast(resInfo.Message);
                                                        }
                                                    },
                                                    function (err) {
                                                        Toast("请检查您的网络");
                                                    }
                                                );
                                        }
                                    });
                                };

                                _this.setZoom = function (points) {
                                    if (points.length > 0) {
                                        var maxLng = points[0].lng;
                                        var minLng = points[0].lng;
                                        var maxLat = points[0].lat;
                                        var minLat = points[0].lat;
                                        var res;
                                        for (var i = points.length - 1; i >= 0; i--) {
                                            res = points[i];
                                            if (res.lng > maxLng) maxLng = res.lng;
                                            if (res.lng < minLng) minLng = res.lng;
                                            if (res.lat > maxLat) maxLat = res.lat;
                                            if (res.lat < minLat) minLat = res.lat;
                                        }
                                        var cenLng = ((parseFloat(maxLng) + parseFloat(minLng)) /
                                            2
                                        ).toFixed(6);
                                        var cenLat = ((parseFloat(maxLat) + parseFloat(minLat)) /
                                            2
                                        ).toFixed(6);
                                        var zoom = _this.getZoom(maxLng, minLng, maxLat, minLat);
                                        // console.log(cenLng + "," + cenLat + "," + zoom);
                                        map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
                                    } else {
                                        //没有坐标，显示全中国
                                        map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5);
                                    }
                                };

                                //根据经纬极值计算地图显示级别
                                _this.getZoom = function (maxLng, minLng, maxLat, minLat) {
                                    var zoom = [
                                        "50",
                                        "100",
                                        "200",
                                        "500",
                                        "1000",
                                        "2000",
                                        "5000",
                                        "10000",
                                        "20000",
                                        "25000",
                                        "50000",
                                        "100000",
                                        "200000",
                                        "500000",
                                        "1000000",
                                        "2000000"
                                    ]; //级别18到3
                                    var pointA = new BMap.Point(maxLng, maxLat); // 创建点坐标A
                                    var pointB = new BMap.Point(minLng, minLat); // 创建点坐标B
                                    var distance = map.getDistance(pointA, pointB).toFixed(1); //获取两点距离,保留小数点后两位
                                    //console.log(distance);
                                    for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
                                        if (zoom[i] - distance > 0) {
                                            return 18 - i + 3; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3
                                        } else {
                                            return 12;
                                        }
                                    }
                                };

                                //设置地图事件
                                _this.setMapEvent = function () {
                                    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
                                    map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
                                    map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
                                    //map.enableKeyboard(); //启用键盘上下左右键移动地图
                                };

                                //向地图添加控件
                                _this.addMapControl = function () {
                                    //向地图中添加缩放控件
                                    var ctrl_nav = new BMap.NavigationControl({
                                        anchor: BMAP_ANCHOR_TOP_RIGHT,
                                        type: BMAP_NAVIGATION_CONTROL_LARGE
                                    });
                                    map.addControl(ctrl_nav);
                                    //向地图中添加缩略图控件
                                    var ctrl_ove = new BMap.OverviewMapControl({
                                        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                                        isOpen: 1
                                    });
                                    map.addControl(ctrl_ove);
                                    //向地图中添加比例尺控件
                                    //var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
                                    //map.addControl(ctrl_sca);
                                };

                                _this.initMap();
                            } else {
                                Toast(resInfo.Message);
                            }
                        },
                        function (err) {
                            Toast("请检查您的网络");
                        }
                    );
            },
            //点击GIS中的小区
            community() {
                this.$store.community = true
                this.$router.push({path: "/GIS/community"});
            },
            //点击GIS中的维修人员
            repairman() {
                this.$router.push({path: "/GIS/repairman"});
            },
            //退出按钮
            quit() {
                MessageBox.confirm("是否退出当前登录")
                    .then(action => {
                        try {
                            // console.log(plus);
                            let UserID = this.$store.UserInfo.UserID + "";
                            //注销请求ajax
                            this.$http
                                .post(
                                    this.$myConfig.host + "/api/UserLogin/RemoveMobileUserLogin",
                                    {
                                        "": UserID
                                    },
                                    {emulateJSON: true}
                                )
                                .then(
                                    function (res) {
                                        var resInfo = $.parseJSON(res.bodyText);
                                        //判断登录信息
                                        if (resInfo.ReturnResult) {
                                            //清空用户数据
                                            plus.storage.removeItem("gdky_myWorkOrderTime");
                                            plus.storage.removeItem("gdky_workOrderPoolTime");
                                            //提示信息
                                            Toast("用户注销成功");
                                            //跳转登录页面
                                            this.$router.push({path: "/"});
                                        } else {
                                            Toast(resInfo.Message);
                                        }
                                    },
                                    function (err) {
                                        Toast("请检查您的网络");
                                    }
                                );
                        } catch (e) {
                            //提示信息
                            Toast("用户注销成功");
                            //跳转登录页面
                            this.$router.push({path: "/"});
                        }
                    })
                    .catch(() => {
                        console.log("取消");
                    });
            },
            //格式化日期
            formatDate(date, format) {
                var paddNum = function (num) {
                    num += "";
                    return num.replace(/^(\d)$/, "0$1");
                };
                //指定格式字符
                var cfg = {
                    yyyy: date.getFullYear(), //年 : 4位
                    yy: date
                        .getFullYear()
                        .toString()
                        .substring(2), //年 : 2位
                    M: date.getMonth() + 1, //月 : 如果1位的时候不补0
                    MM: paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
                    d: date.getDate(), //日 : 如果1位的时候不补0
                    dd: paddNum(date.getDate()), //日 : 如果1位的时候补0
                    hh: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
                    mm:
                        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(), //分
                    ss: date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds() //秒
                };
                format || (format = "yyyy-MM-dd hh:mm:ss");
                return format.replace(/([a-z])(\1)*/gi, function (m) {
                    return cfg[m];
                });
            }
        }
    };
</script>
<style scoped>
    .user_info {
        height: 1.5rem;
        background-color: #3562b3;
        padding: 0.2rem 0;
    }

    .user_info > div {
        float: left;
        height: 100%;
        color: #ffffff;
        text-align: center;
    }

    .user_image {
        padding: 0.1rem 0;
    }

    .sever_info {
        padding: 0.3rem 0;
    }

    .user_info > div > div.mui-icon {
        font-size: 0.6rem;
    }

    #content {
        color: #565656;
    }

    /* 媒体查询 */
    /* 图标样式 */
    @media only screen and (max-device-width: 413px) {
        /*iPhone 6 Portrait*/
        .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Fill 1 Copy 3.png") no-repeat center;
        }

        .choosed > .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 8 Copy.png") no-repeat center;
        }

        .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1.png") no-repeat center;
        }

        .choosed > .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1 Copy 3.png") no-repeat center;
        }

        .GIS_icon {
            background: url("../../static/images/客服移动端切图/首页/地图模式.png") no-repeat center;
        }

        .choosed > .GIS_icon {
            background: url("../../static/images/客服移动端切图/首页/GIS选中.png") no-repeat center;
        }

        .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (2) copy.png") no-repeat center;
        }

        .choosed > .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (3) copy.png") no-repeat center;
        }

        /* 九宫格图标样式 */
        .repairTeam_icon {
            background: url("../../static/images/客服移动端切图/首页/维修队工单.png") no-repeat center;
        }

        .myWorkOrder_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 6.png") no-repeat center;
        }

        .accepted_icon {
            background: url("../../static/images/客服移动端切图/首页/待接收.png") no-repeat center;
        }

        .workOrderPond_icon {
            background: url("../../static/images/客服移动端切图/首页/工单池.png") no-repeat center;
        }

        /* 设置界面样式 */
        .setting_follow {
            background: url("../../static/images/客服移动端切图/设置/appIcon_follow.png") no-repeat center;
        }

        .setting_changeInfo {
            background: url("../../static/images/客服移动端切图/设置/Page 1 Copy 2.png") no-repeat center;
        }

        .setting_changePassage {
            background: url("../../static/images/客服移动端切图/设置/密码 (4) copy.png") no-repeat center;
        }

        .setting_vision {
            background: url("../../static/images/客服移动端切图/设置/升级 copy.png") no-repeat center;
        }

        /* GIS_图标 */
        #GIS_community {
            background: url("../../static/images/客服移动端切图/GIS/Group 5 Copy 4.png") no-repeat center;
        }

        #GIS_repairman {
            background: url("../../static/images/客服移动端切图/GIS/人员 copy 3.png") no-repeat center;
        }

        .right-icon {
            background: url("../../static/images/客服移动端切图/首页/right.png") no-repeat center;
        }
    }

    @media only screen and (min-device-width: 414px) {
        /*iPhone 6+ Portrait*/
        .icons {
            margin-bottom: 0.05rem;
        }

        .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Fill 1 Copy 3@1.5x.png") no-repeat center;
        }

        .choosed > .home_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 8 Copy@1.5x.png") no-repeat center;
        }

        .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1@1.5x.png") no-repeat center;
        }

        .choosed > .statistic_icon {
            background: url("../../static/images/客服移动端切图/首页/Page 1 Copy 3@1.5x.png") no-repeat center;
        }

        .GIS_icon {
            background: url("../../static/images/客服移动端切图/首页/地图模式@1.5x.png") no-repeat center;
        }

        .choosed > .GIS_icon {
            background: url("../../static/images/客服移动端切图/首页/GIS选中@1.5x.png") no-repeat center;
        }

        .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (2) copy@1.5x.png") no-repeat center;
        }

        .choosed > .setting_icon {
            background: url("../../static/images/客服移动端切图/首页/设置 (3) copy@1.5x.png") no-repeat center;
        }

        /* 九宫格图标样式 */
        .repairTeam_icon {
            background: url("../../static/images/客服移动端切图/首页/维修队工单@1.5x.png") no-repeat center;
        }

        .myWorkOrder_icon {
            background: url("../../static/images/客服移动端切图/首页/Group 6@1.5x.png") no-repeat center;
        }

        .accepted_icon {
            background: url("../../static/images/客服移动端切图/首页/待接收@1.5x.png") no-repeat center;
        }

        .workOrderPond_icon {
            background: url("../../static/images/客服移动端切图/首页/工单池@1.5x.png") no-repeat center;
        }

        /* 设置界面样式 */
        .setting_changeInfo {
            background: url("../../static/images/客服移动端切图/设置/Page 1 Copy 2@1.5x.png") no-repeat center;
        }

        .setting_changePassage {
            background: url("../../static/images/客服移动端切图/设置/密码 (4) copy@1.5x.png") no-repeat center;
        }

        .setting_vision {
            background: url("../../static/images/客服移动端切图/设置/升级 copy@1.5x.png") no-repeat center;
        }

        /* GIS图标 */
        #GIS_community {
            background: url("../../static/images/客服移动端切图/GIS/Group 5 Copy 4@1.5x.png") no-repeat center;
        }

        #GIS_repairman {
            background: url("../../static/images/客服移动端切图/GIS/人员 copy 3@1.5x.png") no-repeat center;
        }

        .right-icon {
            background: url("../../static/images/客服移动端切图/首页/right@1.5x.png") no-repeat center;
        }
    }

    /* GIS图片样式 */
    #GIS_repairman,
    #GIS_community {
        display: inline-block;
        width: 0.4rem;
        height: 0.5rem;
        background-size: 0.15rem 0.18rem;
        vertical-align: bottom;
    }

    /* 图标图片样式 */
    span.mui-icon {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background-size: 0.38rem;
    }

    .mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body {
        font-size: 0.11rem;
    }

    .mui-grid-view.mui-grid-9 .mui-table-view-cell {
        padding: 0.05rem;
    }

    .choosed > .icons,
    .icons {
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        background-size: 0.18rem;
    }

    .mint-tab-item .is-selected {
        color: #49a9ea;
    }

    .mint-tab-item {
        color: #666;
    }

    /* 设置界面图标样式 */
    #statistics_info .mui-table-view-cell,
    #setting_info .mui-table-view-cell.setting_icon {
        background-size: 0.18rem;
        background-color: #fff;
        background-position: 0.15rem;
        padding-left: 0.45rem;
    }
    .right-icon {
        display: inline-block;
        width: 0.45rem;
        height: 0.16rem;
        background-size: 0.1rem;
    }

    /* 修改cell样式 */
    .mint-cell {
        height: 0.5rem;
    }

    /* GIS地图样式 */
    .GIS_title_box {
        height: 0.5rem;
    }

    .GIS_title {
        background-color: #fff;
        height: 0.49rem;
        box-shadow: 0px 1px 5px #888888;
    }

    .GIS_title > div {
        float: left;
        width: 50%;
        text-align: center;
        line-height: 0.5rem;
        font-size: 0.17rem;
    }

    .GIS_title .GIS_title_community {
        width: 40%;
    }

    .GIS_title .GIS_title_repairman {
        width: 60%;
    }

    .mymap {
        width: 100%;
        height: 100%;
        padding: 2.8rem 0;
    }

    /* 设置cell样式 */
    #statistics_info .mui-table-view-cell,
    #setting_info .mui-table-view-cell {
        padding: 0rem 0;
    }

    /* GIS样式 */
    .page-wrap,
    .page-wrap > .mint-tab-container.page-tabbar-container {
        height: 100% !important;
    }

    /* 退出按钮 */
    .mint-button--default {
        margin-top: 0.1rem;
        box-shadow: none;
        font-size: 0.14rem;
    }

    /* 新工单提示图标 */
    .mint-badge {
        position: absolute;
    }

    .mui-media {
        position: relative;
    }

    .mui-media .mint-badge {
        top: 0.5rem;
        right: 0rem;
        line-height: 0.14rem;
    }

    /*分别点击小区和维修人员标注，顶部标题显示的信息*/
    .mint-cell-wrapper span,
    .mint-cell-title,
    .mint-cell-title span,
    .mint-cell-text,
    .mint-cell-label,
    .mint-cell-value span,
    .GIS_title_cell,
    .GIS_title_cell span {
        font-size: 0.1rem;
        color: #666;
    }

    /* 轮播图效果 */
    .mint-swipe {
        height: 1.5rem;
        background: url("../../static/images/客服移动端切图/首页/banner图.jpg");
        background-size: cover;
    }

    /* 版本提示图标 */
    .tip {
        background-color: #f44336;
        display: block;
        position: absolute;
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        top: 0.05rem;
        right: 0.2rem;
    }
</style>

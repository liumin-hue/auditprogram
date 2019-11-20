<template>
    <div id="big-box">
        <mt-header fixed title="工作轨迹">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="goBack()"></mt-button>
            </router-link>
        </mt-header>
        <div id="container" class="mymap"></div>
        <mt-tabbar class="btn_bottom">
            <mt-button @click="play()" class="play_icon icons"></mt-button>
            <mt-button @click="pause()" class="pause_icon icons"></mt-button>
            <mt-button @click="reset()" class="reset_icon icons"></mt-button>
        </mt-tabbar>

    </div>
</template>

<script>
    //引入mint-ui插件
    import {MessageBox, Tabbar, TabItem, Toast, Badge} from "mint-ui";
    import BMap from "BMap"; //在页面中引入百度地图
    //声明图片支持webpack打包
    const mark_icon = require("../../static/images/客服移动端切图/GIS/人员 copy 3.png");

    export default {
        data() {
            return {
                mapData: []
            };
        },
        mounted() {
            this.loadMap(); //加载地图和相关组件
        },
        activated() {
            //this.loadMap(); //加载地图和相关组件
        },
        methods: {
            goBack() {
                let _this = this;
                window.clearInterval(_this.timer);
                this.$router.go(-1); //返回上一次历史记录
            },
            loadMap() {
                var _this = this;

                //获取小区列表信息
                _this.$http
                    .get(
                        _this.$myConfig.host +
                        "/api/RepairUserTrajectory/GetRepairUserTrajectory",
                        {
                            params: {
                                UserID: this.$route.params.id
                            }
                        }
                    )
                    .then(
                        function (res) {
                            let resInfo = $.parseJSON(res.bodyText);
                            if (resInfo.ReturnResult) {
                                //console.log(resInfo);
                                _this.mapData = resInfo.UserTrajectory; //维修员经纬度坐标

                                var map;
                                var repairman; //维修人员图标
                                var centerPoint;
                                var timer = null; //定时器
                                var points_all = [];
                                var points = [];
                                var index = 0; //记录播放到第几个point
                                window.map = map; //将map变量存储为全局变量

                                for (var i in _this.mapData) {
                                    points[i] = eval(
                                        "new BMap.Point(" +
                                        _this.mapData[i].UserLng +
                                        "," +
                                        _this.mapData[i].UserLat +
                                        ")"
                                    );
                                    points_all.push(points[i]);
                                }

                                //初始化地图,选取第一个点为起始点
                                map = new BMap.Map("container");
                                // centerPoint = new BMap.Point((points[0].Lng + points[points.length - 1].Lng) / 2, (points[0].Lat + points[points.length - 1].Lat) / 2);
                                // console.log(centerPoint);
                                // var gc = new BMap.Geocoder();
                                // gc.getLocation(centerPoint, function(rs){
                                //     var addComp = rs.addressComponents;
                                //     map.centerAndZoom(addComp.city,13);
                                // });

                                //向地图中添加缩放控件
                                var ctrl_nav = new BMap.NavigationControl({
                                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                                    type: BMAP_NAVIGATION_CONTROL_LARGE
                                });
                                map.addControl(ctrl_nav);
                                map.enableScrollWheelZoom();

                                var driving = new BMap.DrivingRoute(map); //通过DrivingRoute获取一条路线的point
                                driving.search(points[0], points[points.length - 1]); //驾车搜索
                                //console.log(points[0]);
                                //console.log(points[points.length - 1]);

                                driving.setSearchCompleteCallback(function () {
                                    //得到路线上的所有point
                                    //points = driving.getResults().getPlan(0).getRoute(0).getPath();
                                    //console.log(points);
                                    //画面移动到起点和终点的中间
                                    //centerPoint = new BMap.Point((points[0].Lng + points[points.length - 1].Lng) / 2, (points[0].Lat + points[points.length - 1].Lat) / 2);
                                    //map.panTo(centerPoint);
                                    map.clearOverlays();
                                    //连接所有点
                                    map.addOverlay(
                                        new BMap.Polyline(points, {
                                            strokeColor: "red",
                                            strokeWeight: 5,
                                            strokeOpacity: 1
                                        })
                                    );
                                    //自定义icon
                                    var myIcon = new BMap.Icon(mark_icon, new BMap.Size(40, 40), {
                                        offset: new BMap.Size(10, 25)
                                    });
                                    repairman = new BMap.Marker(points[0], {
                                        icon: myIcon
                                    });

                                    map.addOverlay(repairman);
                                });
                                map.setViewport(points_all); //让标注显示在最佳视野内
                                //console.log(points_all);

                                //播放
                                this.play = function () {
                                    // console.log(1)
                                    let point = points[index];
                                    window.clearInterval(this.timer);
                                    repairman.setPosition(point);
                                    index++;
                                    //console.log(points);
                                    if (index < points.length) {
                                        this.timer = window.setInterval(this.play, 200);
                                    } else {
                                        _this.pause()
                                        map.panTo(point); //让地图平滑移动至该点
                                        //map.clearOverlays();//清空原来的标注
                                    }
                                };

                                //暂停
                                this.pause = function () {
                                    // console.log(2)
                                    if (this.timer) {
                                        window.clearInterval(this.timer);
                                    }
                                };

                                //停止
                                this.reset = function () {
                                    // console.log(3)
                                    if (this.timer) {
                                        window.clearInterval(this.timer);
                                    }
                                    index = 0;
                                    repairman.setPosition(points[0]);
                                    //map.panTo(centerPoint);
                                };
                                if (resInfo.Message) {
                                    Toast(resInfo.Message);
                                }
                            } else {
                                Toast(resInfo.Message);
                            }
                        },
                        function (err) {
                            Toast("请检查您的网络");
                        }
                    );
            }
        }
    };
</script>
<style scoped>
    .mymap {
        width: 100%;
        height: 100%;
        padding: 0.5rem 0;
    }

    .btn_bottom {
        height: 0.625rem;
        display: flex;
        justify-content: center;
        box-shadow: 0px -1px  #999999;
    }

    .icons {
        width: 0.3rem;
        height: 0.3rem;
        margin: 0.16rem 0.45rem;
    }

    .mint-button--default {
        box-shadow: none;
    }

    /* 图标样式 */
    @media only screen and (max-device-width: 413px) {
        /*iPhone 6 Portrait*/
        .play_icon {
            background: url("../../static/images/客服移动端切图/GIS/播放 copy 3.png") no-repeat 0 0;
            background-size: 0.3rem 0.3rem;
        }

        .pause_icon {
            background: url("../../static/images/客服移动端切图/GIS/播放 copy 4.png") no-repeat 0 0;
            background-size: 0.3rem 0.3rem;
        }

        .reset_icon {
            background: url("../../static/images/客服移动端切图/GIS/播放 copy 5.png") no-repeat 0 0;
            background-size: 0.3rem 0.3rem;
        }
    }

    @media only screen and (min-device-width: 414px) {
        /*iPhone 6+ Portrait*/
        .play_icon {
            background: url("../../static/images/客服移动端切图/GIS/播放 copy 3@1.5x.png") no-repeat 0 0;
            background-size: 0.3rem 0.3rem;
        }

        .pause_icon {
            background: url("../../static/images/客服移动端切图/GIS/播放 copy 4@1.5x.png") no-repeat 0 0;
            background-size: 0.3rem 0.3rem;
        }

        .reset_icon {
            background: url("../../static/images/客服移动端切图/GIS/播放 copy 5@1.5x.png") no-repeat 0 0;
            background-size: 0.3rem 0.3rem;
        }
    }
</style>

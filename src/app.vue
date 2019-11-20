<template>
    <div v-cloak>
      <div id="allmap"></div>
        <!-- <transition id="content" name="bounce"  mode="out-in"> -->
            <transition id="content" name="fade"  mode="out-in">
              <keep-alive>
                <router-view class="router-view" v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
            </transition>
            <transition id="content" name="fade"  mode="out-in">
              <router-view class="router-view" v-if="!$route.meta.keepAlive"></router-view>
            </transition>
            <!-- <router-view></router-view>
        </transition> -->
    </div>
</template>
<script>
//调用vuex插件
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { Toast } from "mint-ui";
import BMap from "BMap"; //在页面中引入百度地图
import AMap from "AMap"; //在页面中引入高德地图

export default {
  data() {
    return {
      includePageNames: []
    };
  },
  created() {
    let _this = this;
    //防止调用手机软键盘扰乱样式
    $("body").height($("body")[0].clientHeight);
    setTimeout(function() {
      // 判断手机平台
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        console.log("This is iOS'browser."); //这是iOS平台下浏览器
        _this.$store.isIOS = true;
        // _this.$router.push({ path: "/host" });
          try {
              if (!plus.storage.getItem("gdkykf_host")) {
                  _this.$router.push({ path: "/host" });
              }
          } catch (e) {
              _this.$router.push({ path: "/host" });
          }
      } else {
          console.log("This is android'browser.");
        _this.$store.isIOS = false;
        _this.$router.push({ path: "/" });
      }
    }, 20);
    //初始化用户位置坐标
    var UserLng = null;
    var UserLat = null;
    document.addEventListener(
      "pause",
      function() {
        console.log("应用从前台切换到后台");
      },
      false
    );
    document.addEventListener(
      "resume",
      function() {
        console.log("应用从后台切换到前台");
        var map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map("allmap", {
          resizeEnable: true
        });
        map.plugin("AMap.Geolocation", function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: "RB"
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
          AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
          console.log(data);
          console.log("经度：" + data.position.getLng());
          console.log("纬度：" + data.position.getLat());
          UserLng = data.position.getLng();
          UserLat = data.position.getLat();
          var ggPoint = new BMap.Point(UserLng, UserLat);
          console.log(UserLng, UserLat);

          //地图初始化
          var bm = new BMap.Map("allmap");
          bm.centerAndZoom(ggPoint, 15);
          bm.addControl(new BMap.NavigationControl());

          //坐标转换完之后的回调函数
          var translateCallback = function(data) {
            console.log(data);
            if (data.status === 0) {
              UserLng = data.points[0].lng;
              UserLat = data.points[0].lat;

              //发送请求
              _this.$http
                .post(
                  _this.$myConfig.host +
                    "/api/RepairUserTrajectory/InsertRepairUserTrajectory",
                  {
                    UserID: _this.$store.UserInfo.UserID,
                    UserLng: UserLng, //用户位置经度
                    UserLat: UserLat //用户位置纬度
                  },
                  { emulateJSON: true }
                )
                .then(
                  function(res) {
                    let resInfo = $.parseJSON(res.bodyText);
                    //判断登录信息
                    if (resInfo.ReturnResult) {
                      // Toast(UserLng + "," + UserLat)
                    } else {
                      Toast(resInfo.Message);
                    }
                  },
                  function(err) {
                    Toast("请检查您的网络");
                  }
                );
            }
          };

          setTimeout(function() {
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 3, 5, translateCallback);
          }, 20);
          if (data.accuracy) {
            console.log("精度：" + data.accuracy + " 米");
          } //如为IP精确定位结果则没有精度信息
          console.log("是否经过偏移：" + (data.isConverted ? "是" : "否"));
        }
        //解析定位错误信息
        function onError(data) {
          Toast("定位失败");
        }
      },
      false
    );

    this.$store.commit("acceptNewWorkOrder");

    //登录成功发送位置信息
    setInterval(function() {
      if (_this.$store.UserInfo != undefined) {
        var map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map("allmap", {
          resizeEnable: true
        });
        map.plugin("AMap.Geolocation", function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: "RB"
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
          AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
          console.log(data);
          console.log("经度：" + data.position.getLng());
          console.log("纬度：" + data.position.getLat());
          UserLng = data.position.getLng();
          UserLat = data.position.getLat();
          var ggPoint = new BMap.Point(UserLng, UserLat);
          console.log(UserLng, UserLat);

          //地图初始化
          var bm = new BMap.Map("allmap");
          bm.centerAndZoom(ggPoint, 15);
          bm.addControl(new BMap.NavigationControl());

          //坐标转换完之后的回调函数
          var translateCallback = function(data) {
            console.log(data);
            if (data.status === 0) {
              UserLng = data.points[0].lng;
              UserLat = data.points[0].lat;

              //发送请求
              _this.$http
                .post(
                  _this.$myConfig.host +
                    "/api/RepairUserTrajectory/InsertRepairUserTrajectory",
                  {
                    UserID: _this.$store.UserInfo.UserID,
                    UserLng: UserLng, //用户位置经度
                    UserLat: UserLat //用户位置纬度
                  },
                  { emulateJSON: true }
                )
                .then(
                  function(res) {
                    let resInfo = $.parseJSON(res.bodyText);
                    //判断登录信息
                    if (resInfo.ReturnResult) {
                      // Toast(UserLng + "," + UserLat)
                    } else {
                      Toast(resInfo.Message);
                    }
                  },
                  function(err) {
                    Toast("请检查您的网络");
                  }
                );
            }
          };

          setTimeout(function() {
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 3, 5, translateCallback);
          }, 20);
          if (data.accuracy) {
            console.log("精度：" + data.accuracy + " 米");
          } //如为IP精确定位结果则没有精度信息
          console.log("是否经过偏移：" + (data.isConverted ? "是" : "否"));
        }
        //解析定位错误信息
        function onError(data) {
          Toast("定位失败");
        }

        // 百度地图API功能
        // var map = new BMap.Map("allmap");
        // var point = new BMap.Point(116.331398, 39.897445);
        // map.centerAndZoom(point, 12);
        // //获取地图信息
        // var geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(
        //   function(r) {
        //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //       let mk = new BMap.Marker(r.point);
        //       map.addOverlay(mk);
        //       map.panTo(r.point);
        //       //用户位置信息赋值
        //       UserLng = r.point.lng;
        //       UserLat = r.point.lat;
        //       console.log(UserLng + "," + UserLat);
        //       //发送请求
        //       _this.$http
        //         .post(
        //           _this.$myConfig.host +
        //             "/api/RepairUserTrajectory/InsertRepairUserTrajectory",
        //           {
        //             UserID: _this.$store.UserInfo.UserID,
        //             UserLng: UserLng, //用户位置经度
        //             UserLat: UserLat //用户位置纬度
        //           },
        //           { emulateJSON: true }
        //         )
        //         .then(
        //           function(res) {
        //             let resInfo = $.parseJSON(res.bodyText);
        //             //判断登录信息
        //             if (resInfo.ReturnResult) {
        //               // Toast(UserLng + "," + UserLat)
        //             } else {
        //               Toast(resInfo.Message);
        //             }
        //           },
        //           function(err) {
        //             Toast("请检查您的网络");
        //           }
        //         );
        //     } else {
        //       Toast("错误：" + this.getStatus());
        //     }
        //   },
        //   { enableHighAccuracy: true }
        // );
        // html获取位置信息
        // try {
        //   // html获取位置信息
        //   plus.geolocation.getCurrentPosition(
        //     function(p) {
        //       // 校正位置信息
        //       UserLng = p.coords.longitude + 0.012998;
        //       UserLat = p.coords.latitude + 0.0068596;
        //       console.log(UserLng + "," + UserLat);
        //       // Toast(UserLng + "," + UserLat)
        //       //发送请求
        //       _this.$http
        //         .post(
        //           _this.$myConfig.host +
        //             "/api/RepairUserTrajectory/InsertRepairUserTrajectory",
        //           {
        //             UserID: _this.$store.UserInfo.UserID,
        //             UserLng: UserLng, //用户位置经度
        //             UserLat: UserLat //用户位置纬度
        //           },
        //           { emulateJSON: true }
        //         )
        //         .then(
        //           function(res) {
        //             let resInfo = $.parseJSON(res.bodyText);
        //             //判断登录信息
        //             if (resInfo.ReturnResult) {
        //               // Toast(UserLng + "," + UserLat)
        //             } else {
        //               Toast(resInfo.Message);
        //             }
        //           },
        //           function(err) {
        //             Toast("请检查您的网络");
        //           }
        //         );
        //     },
        //     function(e) {
        //       console.log("Geolocation error: " + e.message);
        //     }
        //   );
        // } catch (e) {}
      }
    }, 300000); //每隔五分钟记录一次用户信息
  },
  mounted() {},
  computed: {
    count() {
      return this.$store.state.count;
    },
    getcount() {
      return this.$store.getters.count;
    }
  },

  props: {},
  methods: {}
};
</script>
<style scoped>
html,
body {
  width: 100%;
  padding-top:constant(safe-area-inset-top);
}

body > div {
  width: 100%;
  height: 100%;
}

#title {
  width: 100%;
  text-align: center;
  background-color: hotpink;
  color: greenyellow;
  font-size: 20px;
  font-weight: 700;
  height: 50px;
  line-height: 50px;
}

#content {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/*router-view使用的*/
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
</style>

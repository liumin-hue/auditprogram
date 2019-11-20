<template>
  <div id="big-box">
      <div id="login_title"></div>
      <div id="login_from">
          <div class="input_test">
            <mt-field label=" " placeholder="用户名" v-model="username" value="username"></mt-field>
            <mt-field label=" " placeholder="密码" type="password" v-model="password" value="password"></mt-field>
          </div>
          <router-link to=''>
            <mt-button type="primary"  size="large" @click="goHome()">登&nbsp;&nbsp;&nbsp;&nbsp;录</mt-button>
           </router-link>
           <router-link to='/host' v-if="isIOS">
            <mt-button type="default"  size="large">返&nbsp;&nbsp;&nbsp;&nbsp;回</mt-button>
           </router-link>
      </div>
      <span id="compony">河北工大科雅能源科技股份有限公司&nbsp;&nbsp;版权所有</span>
  </div>
</template>
<script>
import { Field, Toast } from "mint-ui";

export default {
  data() {
    return {
      username: "",
      password: "",
      isIOS: false
    };
  },
  mounted() {
  // 判断手机平台
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        console.log("This is iOS'browse111r."); //这是iOS平台下浏览器
        this.isIOS = true;
        if(plus.storage.getItem("gdkykf_host")){
            this.$myConfig.host = plus.storage.getItem("gdkykf_host")
        } else {
            this.$myConfig.host = ""
            this.$router.push({ path: "/host" })
        }

    } else {
        console.log("This is android'browser.");
        this.isIOS = false;
    }
    //获取本地用户名密码
    try {
      this.username = plus.storage.getItem("gdkykf_userName");
      this.password = plus.storage.getItem("gdkykf_password");
    } catch (e) {
      this.username = "";
      this.password = "";
    }

    //加载html5+
    var _this = this;
    // 扩展API加载完毕后调用onPlusReady回调函数
    document.addEventListener("plusready", onPlusReady, false);
    // 扩展API加载完毕，现在可以正常调用扩展API
    function onPlusReady() {
      // 在本地获取账号密码
      _this.username = plus.storage.getItem("gdkykf_userName")
        ? plus.storage.getItem("gdkykf_userName")
        : "";
      _this.password = plus.storage.getItem("gdkykf_password")
        ? plus.storage.getItem("gdkykf_password")
        : "";

      //首页返回键处理
          //处理逻辑：1秒内，连续两次按返回键，则退出应用；
      var first = null;
      plus.key.addEventListener(
        "backbutton",
        function() {
          //首次按键，提示‘再按一次退出应用’
          console.log("触发返回按钮");
          //判断首页不能返回
          if (_this.$route.path === "/home" || _this.$route.path === "/login") {
            if (!first) {
              first = new Date().getTime();
              Toast("再按一次退出应用");
              setTimeout(function() {
                first = null;
              }, 1000);
            } else {
              if (new Date().getTime() - first < 1000) {
                plus.runtime.quit();
              }
            }
          } else {
            if (
              _this.$route.name == "Reassignment" ||
              _this.$route.name == "WorkOrderBack" ||
              _this.$route.name == "WorkOrderReply" ||
              _this.$route.name == "Delay"
            ) {
              _this.$store.wordOrderReplyResult = "";
            }
            _this.$router.go(-1);
          }
        },
        false
      );
      // 监听点击消息事件
      plus.push.addEventListener(
        "click",
        function(msg) {
          if (msg["payload"].BillStatus == "CSN01") {
            plus.nativeUI.toast("工单池有新工单，请查看");
            // plus.device.vibrate(3000);
              // plus.device.beep(5);
            //新工单来源是工单池
            if (_this.$route.name == "Home") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.workOrderPoolNew += 1;
              }
            } else if (_this.$route.name == "WorkOrderPond") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.confirms.unshift(
                  msg["payload"]
                );
                _this.$route.matched[0].instances.default.total += 1;
              }
            }
          } else if (msg["payload"].BillStatus == "CSN02") {
            plus.nativeUI.toast("有新工单待确认，请查看");
            // plus.device.vibrate(3000);
              // plus.device.beep(5);
            //判断新工单来源是待接收
            if (_this.$route.name == "Home") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.toAccept += 1;
              }
            } else if (_this.$route.name == "ToAccept") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.confirms.unshift(
                  msg["payload"]
                );
                _this.$route.matched[0].instances.default.total += 1;
              }
            }
          }
        },
        false
      );
      // 监听在线消息事件
      plus.push.addEventListener(
        "receive",
        function(msg) {
          if (msg["payload"].BillStatus == "CSN01") {
            plus.nativeUI.toast("工单池有新工单，请查看");
            // plus.device.vibrate(3000);
            // plus.device.beep(5);
            //新工单来源是工单池
            if (_this.$route.name == "Home") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.workOrderPoolNew += 1;
              }
            } else if (_this.$route.name == "WorkOrderPond") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.confirms.unshift(
                  msg["payload"]
                );
                _this.$route.matched[0].instances.default.total += 1;
              }
            }
          } else if (msg["payload"].BillStatus == "CSN02") {
            plus.nativeUI.toast("有新工单待确认，请查看");
            // plus.device.vibrate(3000);
              // plus.device.beep(5);
            //判断新工单来源是待接收
            if (_this.$route.name == "Home") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.toAccept += 1;
              }
            } else if (_this.$route.name == "ToAccept") {
              if (_this.$route.matched[0].instances.default) {
                _this.$route.matched[0].instances.default.confirms.unshift(
                  msg["payload"]
                );
                _this.$route.matched[0].instances.default.total += 1;
              }
            }
          }
        },
        false
      );
    }
  },
  methods: {
    goHome() {
      if (this.username == "" || this.password == "") {
        Toast("用户名和密码不能为空");
      } else {
        try {
          // plus.nativeUI.alert(plus.storage.getItem("gdkykf_clientid"));//弹出cid
          var ClientID = plus.storage.getItem("gdkykf_clientid") || "";
        } catch (e) {}
        var _this = this;
        this.$store.isLogin = true;
        //验证登录信息
        this.$http
          .post(
            this.$myConfig.host + "/api/UserLogin/PostMobileUserLogin",
            {
              LoginName: this.username,
              Pasword: this.password,
              ClientID: ClientID || ""
            },
            { emulateJSON: true }
          )
          .then(
            function(res) {
              let resInfo = $.parseJSON(res.bodyText);
              //判断登录信息
              if (resInfo.ReturnResult) {
                _this.$store.UserInfo = resInfo;
                _this.$router.push({ path: "/home" });
                //保存账号密码
                plus.storage.setItem("gdkykf_userName", _this.username);
                plus.storage.setItem("gdkykf_password", _this.password);
              } else {
                Toast(resInfo.Message);
              }
            },
            function(err) {
              if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                console.log("This is iOS'browser."); //这是iOS平台下浏览器
                Toast("请检查您的网络或重新填写服务器地址");
                this.isIOS = true
              } else {
                Toast("请检查您的网络");
              }
            }
          );
      }
    }
  }
};
</script>
<style scoped>
#big-box {
  padding: 0;
  background: url("../../static/images/客服移动端切图/登录页/bg.png") no-repeat 0 0;
  background-size: cover;
  overflow: hidden;
}

#login_from {
  padding: 0.3rem;
}

#login_from > div,
#login_from > div input {
  font-size: 0.18rem;
}

#login_from > div input {
  outline: none;
  border: none;
}

.input_test {
  margin-bottom: 0.6rem;
}

.mint-button {
  height: 0.5rem;
  width: 3.05rem;
  border-radius: 0.25rem;
  margin: 0.2rem auto;
}

/* 媒体查询 */
/* 图标样式 */
@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  #login_title {
    background: url("../../static/images/客服移动端切图/登录页/title.png") no-repeat
      center;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  #login_title {
    background: url("../../static/images/客服移动端切图/登录页/title@1.5x.png") no-repeat
      center;
  }
}

#login_title {
  width: 100%;
  height: 0.4rem;
  background-size: 2.44rem 0.38rem;
  margin-top: 1.54rem;
}

#compony {
  display: block;
  font-size: 0.12rem;
  margin: 0.1rem auto;
  color: #fff;
  text-align: center;
}
</style>

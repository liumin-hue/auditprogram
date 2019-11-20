<template>
  <div id="big-box">
      <mt-header fixed title="修改信息">
        <router-link to="/home" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>

      </mt-header>
      <div id="info_body">
        <div class="input_test">
          <mt-field class="mui-table-view-cell" label="用户姓名" v-on:input ="inputFunc" placeholder="请输入用户姓名" v-model="username" :attr="{ maxlength: 10 }"></mt-field>
          <mt-field class="mui-table-view-cell" label="手机号码" placeholder="请输入手机号码" type="tel" v-model="telephone"></mt-field>
        </div>
      </div>
      <mt-tabbar v-model="selected">
          <mt-button type="primary" size="large" @click="confirm()">保存修改</mt-button>
      </mt-tabbar>
  </div>
</template>
<script>
//引入mint-ui插件
import { MessageBox, Field } from "mint-ui";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      username: "",
      telephone: "",
      isInput: false
    };
  },
  watch: {
    username(val, oldVal) {
      if (this.isInput) {
        if (val.length - 0 >= 10) {
          Toast("用户姓名最多输入10个字符");
        }
      }
    }
  },
  mounted() {
    //获取用户权限
    this.$http
      .get(this.$myConfig.host + "/api/UserLogin/GetUserInfoByUserID", {
        params: {
          UserID: this.$store.UserInfo.UserID
        }
      })
      .then(
        function(res) {
          let resInfo = $.parseJSON(res.bodyText);
          //判断登录信息
          if (resInfo.ReturnResult) {
            this.username = resInfo.UserName;
            this.telephone = resInfo.Telephone;
          } else {
            Toast(resInfo.Message);
          }
        },
        function(err) {
          Toast("请检查您的网络");
        }
      );
  },
  methods: {
    confirm: function() {
      var _this = this;
      // console.log(_this.$store.UserInfo);
      //判断密码输入
      if (this.username == "" || this.username == undefined) {
        Toast("请输入用户名");
      } else if (this.telephone == "" || this.telephone == undefined) {
        Toast("手机号码不能为空");
      } else {
        MessageBox.confirm("确定保存设置?").then(action => {
          //修改密码接口
          this.$http
            .post(
              this.$myConfig.host + "/api/UserLogin/ChangeUserInfo",
              {
                UserID: _this.$store.UserInfo.UserID,
                UserName: this.username,
                UserPhone: this.telephone
              },
              { emulateJSON: true }
            )
            .then(
              function(res) {
                var resInfo = $.parseJSON(res.bodyText);
                if (resInfo.ReturnResult) {
                  //更新用户信息
                  _this.$store.UserInfo.UserName = this.username;
                  _this.$store.UserInfo.Telephone = this.telephone;
                  //提示信息
                  Toast(resInfo.Message);
                } else {
                  Toast(resInfo.Message);
                }
              },
              function(err) {
                Toast("请检查您的网络");
              }
            );
        });
      }
    },
    inputFunc() {
      this.isInput = true
    }
  }
};
</script>
<style scoped>
/* 修改cell尺寸 */
.mint-cell {
  min-height: 0.5rem;
}

.mui-table-view-cell {
  padding: 0;
}

.mint-field .mint-cell-title {
  width: 1.02rem;
}
</style>

<template>
  <div id="big-box">
      <mt-header fixed title="密码修改">
        <router-link to="/home" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>        
      </mt-header>
      <div id="info_body">
        <div class="input_test">
            <mt-field class="mui-table-view-cell" label="原密码" placeholder="请输入原密码" v-model="OldPassword"></mt-field>
            <mt-field class="mui-table-view-cell" label="新密码" placeholder="请输入新密码" type="password" v-model="NewPasword"></mt-field>
            <mt-field class="mui-table-view-cell" label="确认密码" placeholder="请再次输入密码" type="password" v-model="NewPaswordAgain"></mt-field>
          </div>
      </div>   
      <mt-tabbar v-model="selected">
          <mt-button type="primary" size="large" @click="confirm()">保存设置</mt-button>
      </mt-tabbar>
  </div>
</template>
<script>
//引入mint-ui插件
import { Field } from "mint-ui";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      passage: "111111",
    };
  },
  methods: {
    confirm: function() {
      this.isLoading = true
      var _this = this;
      //判断密码输入
      if (this.OldPassword == "" || this.OldPassword == undefined) {
        Toast("请输入原密码");
      } else if (this.NewPasword == "" || this.NewPasword == undefined) {
        Toast("新密码不能为空");
      } else if (this.NewPaswordAgain == "" || this.NewPaswordAgain == undefined) {
        Toast("确认密码不能为空");
      } else if (this.NewPasword !== this.NewPaswordAgain) {
        Toast("两次密码输入不一致");
      } else {
        MessageBox.confirm("确定保存设置?").then(action => {          
          //修改密码接口
          this.$http
            .post(
              this.$myConfig.host + "/api/UserLogin/ChangeUserPassword",
              {
                  UserID: _this.$store.UserInfo.UserID,
                  OldPassword: this.OldPassword,
                  NewPasword: this.NewPasword
              },
              { emulateJSON: true }
            )
            .then(
              function(res) {
                var resInfo = $.parseJSON(res.bodyText);
                if (resInfo.ReturnResult) {
                  //清空用户数据
                  //plus.storage.removeItem("gdkykf_password");
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
    }
  }
};
</script>
<style scoped>
#info_body {
  padding: 0.095rem 0;
}

/* 修改cell尺寸 */
.mint-cell {
  min-height: 0.45rem;
}

.mui-table-view-cell {
  padding: 0;
}
</style>
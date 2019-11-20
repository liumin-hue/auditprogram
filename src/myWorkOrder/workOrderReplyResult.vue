<template>
  <div id="big-box" :class="black">
      <mt-header fixed title="处理意见">
        <router-link to="" slot="left">
            <mt-button icon="back" @click="goback()"></mt-button>
        </router-link>
      </mt-header>
      <div class="reply_content">
        <mt-field placeholder="点击输入内容" v-lfcous type="textarea" rows="8" v-model="wordOrderReplyResult" :attr="{ maxlength: 100 }"></mt-field>
      </div>
      <div class="valueLength">{{valueLength}} 字 / 100字</div>
      <mt-tabbar>
          <mt-button class="workOrder_cancel" type="primary" size="large" @click="cancel()">取消</mt-button>
          <mt-button class="workOrder_save" type="primary" size="large" @click="save()">确定</mt-button>
      </mt-tabbar>
      <my-spinner :showSpinner="isLoading"></my-spinner>
    </div>
</template>
<script>
import { MessageBox, Popup, Toast, Picker, Actionsheet, Cell, Field, Button } from "mint-ui"; //引入mint-ui插件

export default {
  data() {
    return {
      wordOrderReplyResult: "",//处理结果
      isLoading:false,//是否加载动画
      valueLength:'',//统计字数
    };
  },
  mounted(){
    this.$store.ReplyResultDelete = false
    if(this.$store.wordOrderReplyResult!=undefined){
      this.wordOrderReplyResult=this.$store.wordOrderReplyResult
      this.valueLength = this.$store.valueLength
    }
  },
  methods: {
    goback: function() {
      this.$router.go(-1); //返回上一次历史记录
    },
    //取消
    cancel() {
      this.$router.go(-1); //返回上一次历史记录
    },
    //保存
    save() {
      this.$store.wordOrderReplyResult = this.wordOrderReplyResult;//将其值保存到Vuex中
      this.$store.valueLength = this.valueLength
      Toast("保存成功");
      let _this=this
      setTimeout(function(){ 
        _this.$router.go(-1);
      }, 500);
    }
  }
};

</script>
<style scoped>
/* 多行文本框 */
.reply_content{
  margin-top:0.15rem;
  border:none
}

/* 按钮 */
.mint-tabbar{
  position: fixed;
  padding: 0.05rem 0;
  background-color: #26a2ff;
}

.mint-button{
  height: 0.4rem;
  border-radius: 0;
}

.workOrder_save {
  border-left: 0.01rem solid #fefefe;
}

.workOrder_cancel {
  border-right: 0.01rem solid #fefefe;
}

/* 字数展示 */
.valueLength{
  text-align: right;
}
</style>
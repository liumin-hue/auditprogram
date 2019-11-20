<template>
  <div id="big_box">
      <mt-header fixed title="拍照">
        <router-link to="/home" slot="left">
            <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <div class="buttons">
          <mt-button size="large" type="default" @click="camera()">拍照</mt-button>
          <mt-button size="large" type="primary" @click="gallery()">从相册获取</mt-button>
      </div>
  </div>
</template>
<script>
import { Field, Header } from "mint-ui";

export default {
  data() {
    return {
      lfs: null // 保留上次选择图片列表
    };
  },
  methods: {
    //调用手机摄像头
    camera() {
      console.log("获取相机");
      console.log(plus);
      var cmr = plus.camera.getCamera();
      cmr.captureImage(
        function(path) {
          console.log("保存照片到系统相册：");
          plus.gallery.save(
            path,
            function() {
              console.log("保存成功");
            },
            function(e) {
              console.log("保存失败: " + JSON.stringify(e));
            }
          );
        },
        function(e) {
          console.log("取消拍照");
        },
        { filename: "_doc/gallery/", index: 1 }
      );
    },
    gallery() {
      var _this = this;
      // 从相册中选择图片
      console.log("从相册中选择多张图片(限定最多选择3张)：");
      plus.gallery.pick(
          //成功回调
        function(e) {
          _this.lfs = e.files;
          for (var i in e.files) {
            console.log(e.files[i]);
          }
        },
        //失败回调
        function(e) {
          console.log("取消选择图片");
        },
        {
          filter: "image",
          multiple: true,
          maximum: 3,// 最多选择3张图片
          selected: _this.lfs,
          system: false,
          onmaxed: function() {
            plus.nativeUI.alert("最多只能选择3张图片");
          }
        }
      ); 
    }
  }
};
</script>
<style scoped>
.buttons {
  margin-top: 0.8rem;
}
.buttons > button {
  margin: 0.2rem auto;
}
</style>

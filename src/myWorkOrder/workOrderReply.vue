<template>
  <div id="big-box" :class="black">
    <mt-header fixed title="工单回复">
      <router-link to="" slot="left">
        <mt-button icon="back" @click="goback()"></mt-button>
      </router-link>
    </mt-header>
    <div style="background-color: white" class="reply_content">
      <div class="mui-table-view-cell">
        <div>客户地址</div>
        <span>{{address}}</span>
      </div>
      <div class="mui-table-view-cell">
        <div>客户姓名</div>
        <span>{{person}}</span>
      </div>
      <div class="mui-table-view-cell">
        <div>受理时间</div>
        <span>{{startTime}}</span>
      </div>
      <div class="mui-table-view-cell" @click="finishStatus()">
        <div>完成情况</div>
        <span>{{finishText}}<span class="mui-icon mui-icon-arrowdown"></span></span>
      </div>
      <div class="mui-table-view-cell" @click="specificStatus()">
        <div>具体情况</div>
        <span>{{specificText}}<span class="mui-icon mui-icon-arrowdown"></span></span>
      </div>
      <div class="mui-table-view-cell" @click="handleOpinion()">
        <div>处理结果</div>
        <span class="reply_result_default" v-show="replyResultDefault">点击输入内容</span>
        <span class="reply_result_value" v-show="replyResultValue">{{wordOrderReplyResult}}</span>
      </div>
      <div class="mui-table-view-cell">
        <div>上传照片</div>
        <div class="content">
          <input type="hidden" id="ckjl.id" name="ckjl.id" value="429">
          <div class="collapse-content">
            <form>
              <label class="row-label"></label>
              <div id='ImageS' class="row image-list clearfix">
                <span class="uploadImage" id="Image" @click="showActionSheet()"></span>
                <div :id="imgID" class="image-item" v-for="(img,index) in imgs" :key="img.id">
                  <img id="picBig" class="preview-img" @click="$preview.open(index, imgs)" :src="img.src">
                  <span class="del_btn" @click="delImg(img.imgId,img.imgkey,img.id,img.img_index)"></span>
                  <div class="fa fa-times-circle"></div>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
      <!--测温录入-->
      <div>
        <mt-checklist v-model="checklist" :options="['测温数据录入']">
        </mt-checklist>
      </div>
      <!--测温模块-->
      <div  style="padding-left: 0.15rem" class="temp_content" v-show="checklist">
        <div class="mui-table-view-cell" @click="isQualified()">
          <div>是否合格</div>
          <span>{{isQualifiedText}}<span class="mui-icon mui-icon-arrowdown"></span></span>
        </div>
        <div class="mui-table-view-cell" @click="openTimePicker()">
            <div>测温时间</div>
            <span>{{tempTimeText}}</span>
        </div>
        <div>
          <mt-field label="室外温度（℃）" placeholder="请输入室外温度" v-model="outdoorTemp"></mt-field>
          <mt-field label="居室1温度（℃）" placeholder="请输入居室1温度" v-model="bedroomTemp1"></mt-field>
          <mt-field label="居室2温度（℃）" placeholder="请输入居室2温度" v-model="bedroomTemp2"></mt-field>
          <mt-field class="hideDiv hideRoom" label="居室3温度（℃）" placeholder="请输入居室3温度" v-model="bedroomTemp3"></mt-field>
          <mt-field class="hideDiv hideRoom" label="居室4温度（℃）" placeholder="请输入居室4温度" v-model="bedroomTemp4"></mt-field>
          <mt-field label="客厅1温度（℃）" placeholder="请输入客厅1温度" v-model="hallTemp1"></mt-field>
          <mt-field class="hideDiv hideRoom" label="客厅2温度（℃）" placeholder="请输入客厅2温度" v-model="hallTemp2"></mt-field>
          <mt-field class="hideDiv hideRoom" label="客厅3温度（℃）" placeholder="请输入客厅3温度" v-model="hallTemp3"></mt-field>
          <mt-field class="hideDiv hideRoom" label="客厅4温度（℃）" placeholder="请输入客厅4温度" v-model="hallTemp4"></mt-field>
          <mt-field class="hideDiv hideRoom" label="卫生间1温度（℃）" placeholder="请输入卫生间1温度" v-model="restroomTemp1"></mt-field>
          <mt-field class="hideDiv hideRoom" label="卫生间2温度（℃）" placeholder="请输入卫生间2温度" v-model="restroomTemp2"></mt-field>
          <mt-field class="hideDiv hideRoom" label="卫生间3温度（℃）" placeholder="请输入卫生间3温度" v-model="restroomTemp3"></mt-field>
          <mt-field class="hideDiv hideRoom" label="卫生间4温度（℃）" placeholder="请输入卫生间4温度" v-model="restroomTemp4"></mt-field>
          <mt-field class="hideDiv hideRoom" label="厨房1温度（℃）" placeholder="请输入厨房1温度" v-model="kitchenTemp1"></mt-field>
          <mt-field class="hideDiv hideRoom" label="厨房2温度（℃）" placeholder="请输入厨房2温度" v-model="kitchenTemp2"></mt-field>
          <mt-field class="hideDiv hideRoom" label="厨房3温度（℃）" placeholder="请输入厨房3温度" v-model="kitchenTemp3"></mt-field>
          <mt-field class="hideDiv hideRoom" label="厨房4温度（℃）" placeholder="请输入厨房4温度" v-model="kitchenTemp4"></mt-field>
          <mt-field label="备注" placeholder="请输入备注信息" type="textarea" rows="4" v-modal="tempIntroduction"></mt-field>
          <div style="padding:0 20px"><mt-button plain type="primary" size="large" class="tempBtn" @click="addRoom()">添加测温数据</mt-button></div>

        </div>
        </div>
    </div>
    <mt-tabbar v-model="selected">
      <mt-button class="workOrder_handle" type="primary" size="large" @click="save()">保存</mt-button>
    </mt-tabbar>
    <!-- 完成情况 -->
    <mt-popup v-model="replyFinishList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
      <div class="pickerTitle">完成情况</div>
      <mt-picker :slots="replyFinishItems" @change="onValuesChange" value-key="FinishText"></mt-picker>
    </mt-popup>
    <!-- 是否合格 -->
    <mt-popup v-model="isQualifiedList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
      <div class="pickerTitle">是否合格</div>
      <mt-picker :slots="isQualifiedItems" @change="onisQualifiedValuesChange" value-key="isQualifiedText"></mt-picker>
    </mt-popup>
    <!-- 测温时间 -->
    <!--<mt-datetime-picker
      ref="picker"
      @confirm="handleConfirm()"
      v-model="pickerValue">
    </mt-datetime-picker>-->
    <!-- 具体情况 -->
    <mt-popup v-model="replySpecificList" popup-transition="popup-fade" position="bottom" class="bottomPicker">
      <div class="pickerTitle">具体情况</div>
      <mt-picker :slots="replySpecificItems" @change="onSpecificValuesChange" value-key="FinishDetailText"></mt-picker>
    </mt-popup>
    <!-- 处理结果 -->
    <mt-popup v-model="handleOpinionStatus" popup-transition="popup-fade" class="opinion">
      <div class="popupTitle">处理结果</div>
      <mt-field placeholder="处理结果" :value="disposeOpinion" type="textarea" rows="6" v-model="opinionText"></mt-field>
    </mt-popup>
    <!--添加房间-->
    <mt-popup  v-model="addRoomPopup"  popup-transition="popup-fade" class="centerPicker">
      <div class="pickerTitle">添加房间</div>
      <div class="mui-input-row mui-checkbox mui-left">
        <label>居室</label>
        <input name="addbedroom" value="addbedroom" type="checkbox" v-model="checkRoomList" >
      </div>
      <div class="mui-input-row mui-checkbox mui-left">
        <label>客厅</label>
        <input name="addliving" value="addliving" type="checkbox" v-model="checkRoomList" >
      </div>
      <div class="mui-input-row mui-checkbox mui-left">
        <label>卫生间</label>
        <input name="addToilet" value="addToilet" type="checkbox" v-model="checkRoomList" >
      </div>
      <div class="mui-input-row mui-checkbox mui-left">
        <label>厨房</label>
        <input name="addKitchen" value="addKitchen" type="checkbox" v-model="checkRoomList">
      </div>
      <div class="mui-input-row">
        <mt-button plain type="primary" size="large" @click="addRoomCancel()" class="addRoomBtns">取消</mt-button>
        <mt-button plain type="primary" size="large" @click="addRoomSure()" class="addRoomBtns">确定</mt-button>
      </div>
    </mt-popup>
    <!-- 相片选择 -->
    <mt-actionsheet :actions="selectPhoto" v-model="sheetVisible"></mt-actionsheet>
    <my-spinner :showSpinner="isLoading"></my-spinner>
  </div>
</template>
<script>
import { MessageBox, Popup, Toast, Picker, Actionsheet, Cell,DatetimePicker  } from "mint-ui"; //引入mint-ui插件
var index = 1;
var files = [];
var w = null;
var procinstid = 0;
var lfs = null;
var zm = 0;
var img_index = 0;
var pageSource = "";

export default {
  data() {
    return {
      address: "",
      person: "",
      startTime: "",
      finishText: "", //完成情况文字
      isQualifiedText: "", //是否合格文字
      specificText: "", //具体情况文字
      FinishValue: "", //记录完成情况节点信息
      FinishDetailValue: "", //记录具体情况节点信息
      disposeText: "",
      pickerValue:false,
      tempTimeList:true,
      addRoomPopup:false,
      tempTimeText:"",//测温时间
      handleOpinionStatus: false,
      replyFinishList: false,
      isQualifiedList: false,
      isLoading: true, //是否加载动画
      checklist:false,
      checkRoomList:[],
      bedroomTemp1:"",
      bedroomTemp2 : "",
      bedroomTemp3 : "",
      bedroomTemp4 : "",
      hallTemp1 : "",
      hallTemp2 : "",
      hallTemp3 : "",
      hallTemp4 : "",
      restroomTemp1 : "",
      restroomTemp2 : "",
      restroomTemp3 : "",
      restroomTemp4 : "",
      kitchenTemp1 : "",
      kitchenTemp2 : "",
      kitchenTemp3 : "",
      kitchenTemp4 : "",
      outdoorTemp : "",
      tempIntroduction: "",
      note:"",
      bedRoomNum:2,
      livingRoomNum:1,
      toiletNum:0,
      kitchenNum:0,
      replyFinishItems: [
        //完成情况
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      isQualifiedItems: [
        //完成情况
        {
          flex: 1,
          values: ["是","否"],
          className: "slot1",
          textAlign: "center"
        }
      ],
      replySpecificList: false,
      allReplySpecificItems: [], //全部具体情况
      replySpecificItems: [
        //具体情况
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      selectPhoto: [
        {
          name: "拍照",
          method: this.getImage // 调用methods中的函数
        },
        {
          name: "从相册中选择",
          method: this.galleryImg // 调用methods中的函数
        }
      ],
      // action sheet 默认不显示，为false。操作sheetVisible可以控制显示与隐藏
      sheetVisible: false,
      imgs: [],
      replyResultDefault: true, //处理结果无值时，默认显示“点击输入内容”
      replyResultValue: false, //处理结果有值时，显示值
      wordOrderReplyResult: "" //处理结果
    };
  },
  beforeRouteEnter: (to, from, next) => {
    pageSource = from.name;
    next();
  },
  //监听变化
  watch: {
    //控制输入框状态
    handleOpinionStatus(val, oldVal) {
      if (val) {
        this.opinionText = this.disposeText;
      } else {
        this.disposeText = this.opinionText;
      }
    }
  },
  mounted() {

  },
  activated() {
    $(".hideRoom").hide();
    this.checkRoomList = []
    this.tempTimeText = this.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")

    zm = 0;
    img_index = 0;
    this.workBillParams = this.$route.params;
    this.WorkBillID = this.$route.params.WorkBillID;

    if (pageSource !== "workOrderReplyResult") {
      this.imgs = [];
      index = 1;
      files = [];
      w = null;
      procinstid = 0;
      lfs = null;
      zm = 0;
      img_index = 0;
    }

    //获取工单信息
    if (pageSource !== "workOrderReplyResult") {
      this.bedroomTemp1 = ""
      this.bedroomTemp2 = ""
      this.bedroomTemp3 = "";
      this.bedroomTemp4 = "";
      this.hallTemp1 = "";
      this.hallTemp2 = "";
      this.hallTemp3 = "";
      this.hallTemp4 = "";
      this.restroomTemp1 = "";
      this.restroomTemp2 = "";
      this.restroomTemp3 = "";
      this.restroomTemp4 = "";
      this.kitchenTemp1 = "";
      this.kitchenTemp2 = "";
      this.kitchenTemp3 = "";
      this.kitchenTemp4 = "";
      this.outdoorTemp = ""
      this.tempIntroduction = ""
      this.checklist = false
      this.note = ""
      //获取工单信息
      this.$http
        .get(this.$myConfig.host + "/api/MyWorkBill/GetWaitReplyConditions", {
          params: {
            WorkBillID: this.workBillParams.WorkBillID,
            FlowID: this.workBillParams.FlowID,
            FlowNodeID: this.workBillParams.FlowNodeID,
            FlowInstantID: this.workBillParams.FlowInstantID,
            FlowToDoTs: this.workBillParams.FlowToDoTS,
            UserID: this.$store.UserInfo.UserID,
            FinishDetailValue: this.specificText,
            FinishValue: this.FinishText,
            UpLoadImages: this.workBillParams.UpLoadImages
          }
        })
        .then(
        function (res) {
          var resInfo = $.parseJSON(res.bodyText);
          this.person = resInfo.contactPerson;
          this.address = resInfo.HouseAddress;
          this.startTime = resInfo.addTime;
          //具体情况赋值
          this.replyFinishItems[0].values = resInfo.FinishStateList;
          let replySpecificItemsArr = [];
          for (let i = 0; i < resInfo.FinishDetailStateList.length; i++) {
            if (
              resInfo.FinishDetailStateList[i].FinishValue ==
              resInfo.FinishStateList[0].FinishValue
            ) {
              replySpecificItemsArr.push(resInfo.FinishDetailStateList[i]);
            }
          }
          this.replySpecificItems[0].values = replySpecificItemsArr;
          this.allReplySpecificItems = resInfo.FinishDetailStateList;
          this.isLoading = false;
        },
        function (err) {
          Toast("请检查您的网络");
          this.isLoading = false;
        }
        );

    }

    //判断处理结果是否已输入内容并保存
    // console.log(this.$store.wordOrderReplyResult);
    if (
      this.$store.wordOrderReplyResult == undefined ||
      this.$store.wordOrderReplyResult == ""
    ) {
      this.wordOrderReplyResult = ""
      this.replyResultDefault = true;
      this.replyResultValue = false;
    } else {
      this.wordOrderReplyResult = this.$store.wordOrderReplyResult;
      this.replyResultDefault = false;
      this.replyResultValue = true;
    }
  },
  methods: {
    goback: function () {
      this.$store.wordOrderReplyResult = ""; //清空处理结果
      this.$router.go(-1); //返回上一次历史记录
    },
    //选择完成情况
    finishStatus() {
      this.replyFinishList = !this.replyFinishList;
    },
    //是否合格
    isQualified() {
      this.isQualifiedList = !this.isQualifiedList;
    },
    //选择具体情况
    specificStatus() {
      this.replySpecificList = !this.replySpecificList;
    },
    //picker监听变化事件
    onValuesChange(picker, values) {
      if (values[0]) {
        //获取完成情况名称
        this.finishText = values[0].FinishText;
        this.FinishValue = values[0].FinishValue;
        //修改匹配的具体情况
        let arr = [];
        for (let i = 0; i < this.allReplySpecificItems.length; i++) {
          if (
            this.allReplySpecificItems[i].FinishValue == values[0].FinishValue
          ) {
            arr.push(this.allReplySpecificItems[i]);
          }
        }
        this.replySpecificItems[0].values = arr;
      }
    },
    // 是否完成
    onisQualifiedValuesChange(picker, values){
      this.isQualifiedText = values[0];
    },
    // 选择日期
    // openTimePicker() {
    //     this.$refs.picker.open();
    //   },
    //   handleConfirm(){
    //     console.log(this.pickerValue)
    //   },
    //监听具体情况
    onSpecificValuesChange(picker, values) {
      if (values[0]) {
        this.specificText = values[0].FinishDetailText;
        this.FinishDetailValue = values[0].FinishDetailValue
      }
    },
    //处理意见
    handleOpinion() {
      //this.handleOpinionStatus = !this.handleOpinionStatus;
      this.$router.push({ path: "/myWorkOrder/workOrderReplyResult" });
    },
    // 添加房间
    addRoom(){
      this.addRoomPopup = true;
    },
    addRoomCancel(){
      this.addRoomPopup = false;
    },
    addRoomSure(){
      this.addRoomPopup = false;
      let _this = this
      // console.log(this.tempTimeText)
      // console.log(_this.isQualifiedText == "是"?1:0)
      for(let i = 0;i<this.checkRoomList.length;i++){
        if(this.checkRoomList[i] == "addbedroom"){
          if(_this.bedRoomNum < 4){
            console.log(_this.bedRoomNum)
            $(".hideRoom").eq(_this.bedRoomNum - 2).show()
            _this.bedRoomNum++
          }else{
            Toast("最多只能添加四个卧室");
          }
        }else if(this.checkRoomList[i] == "addliving"){
          if(_this.livingRoomNum < 4){
            $(".hideRoom").eq(_this.livingRoomNum + 2 - 1).show()
            _this.livingRoomNum++
          }else{
            Toast("最多只能添加四个客厅");
          }
        }else if(this.checkRoomList[i] == "addToilet"){
          if(_this.toiletNum < 4){
            $(".hideRoom").eq(_this.toiletNum + 6 - 1).show()
            _this.toiletNum++
          }else{
            Toast("最多只能添加四个卫生间");
          }
        }else{
          if(_this.kitchenNum < 4){
            $(".hideRoom").eq(_this.kitchenNum + 10 - 1).show()
            _this.kitchenNum++
          }else{
            Toast("最多只能添加四个厨房");
          }
        }
      }
    },
    //调用原生选项
    showActionSheet(conf) {
      if (zm >= 3) {
        MessageBox("提示", "只能上传三张图片");
      } else {
        var _this = this;
        var divid = $("#Image").attr("id");
        var actionbuttons = [{ title: "拍照" }, { title: "相册选取" }];
        var actionstyle = {
          title: "选择照片",
          cancel: "取消",
          buttons: actionbuttons
        };
        plus.nativeUI.actionSheet(actionstyle, function (e) {
          if (e.index == 1) {
            _this.getImage(divid);
          } else if (e.index == 2) {
            _this.galleryImg(divid);
          }
        });
      }
    },
    //图片加载
    showImgDetail(imgId, imgkey, id, src) {
      img_index += 1;
      // console.log(img_index);
      this.imgs.push({
        imgId: imgId,
        imgkey: imgkey,
        id: id,
        src: src,
        img_index: img_index,
        w: 400,
        h: 550
      });
    },
    //删除图片
    delImg(imgId, imgkey, id, img_index) {
      var _this = this;
      var bts = ["是", "否"];
      plus.nativeUI.confirm(
        "是否删除图片？",
        function (e) {
          var i = e.index;
          if (i == 0) {
            var itemname = id + "img-" + imgkey; //429img-F_ZDDZZ
            var itemvalue = plus.storage.getItem(itemname);
            //{IMG_20160704_112614,_doc/upload/F_ZDDZZ-IMG_20160704_112614.jpg,file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg}
            _this.delImgFromLocal(
              itemname,
              itemvalue,
              imgId,
              imgkey,
              index,
              img_index
            );
          }
        },
        "提示",
        bts
      );
    },
    //删除本地
    delImgFromLocal(itemname, itemvalue, imgId, imgkey, index, imgIndex) {
      var wa = plus.nativeUI.showWaiting();
      this.imgs.splice(imgIndex - 1, 1);
      for (var r = 0; r < this.imgs.length; r++) {
        this.imgs[r].img_index = r + 1;
      }
      zm -= 1;
      img_index -= 1;
      //校正
      if (this.imgs.length == 0) {
        zm = 0;
        img_index = 0;
      }
      wa.close();
    },
    //选取相册图片
    galleryImg(divid) {
      var _this = this;
      var n = 3 - zm;
      var id = document.getElementById("ckjl.id").value;

      plus.gallery.pick(
        function (e) {
          for (var i in e.files) {
            var name = e.files[i].substring(0, e.files[i].indexOf("."));
            _this.showImgDetail(name, divid, id, e.files[i]);
            zm += 1;
          }
          lfs = e.files;
        },
        function (e) {
          console.log("取消选择图片");
        },
        {
          filename: "_doc/camera/",
          filter: "image",
          multiple: true,
          maximum: n, // 最多选择3张图片
          selected: _this.lfs,
          system: false,
          onmaxed: function () {
            plus.nativeUI.alert("最多只能选择3张图片");
          }
        }
      );
    },
    //拍照选取
    getImage(divid) {
      var _this = this;
      var cmr = plus.camera.getCamera();
      var id = document.getElementById("ckjl.id").value;
      cmr.captureImage(
        function (p) {
          plus.io.resolveLocalFileSystemURL(
            p,
            function (entry) {
              plus.gallery.save(
                p,
                function () {
                  Toast("保存成功");
                },
                function (e) {
                  Toast("保存失败: " + JSON.stringify(e));
                }
              );
              _this.showImgDetail(entry.name, divid, id, entry.toLocalURL());
              zm += 1;
            },
            function (e) {
              Toast("读取拍照文件错误：" + e.message);
            }
          );
        },
        function (e) { },
        {
          filename: "_doc/camera/",
          index: 1
        }
      );
    },
    //点击保存按钮上传图片
    save() {
      // console.log(this.FinishDetailValue)
      let _this = this;
      //plus.storage.clear();
      let wa = plus.nativeUI.showWaiting();
      let task = plus.uploader.createUpload(
        this.$myConfig.host + "/api/MyWorkBill/PostWaitReplyWorkBill",
        {
          method: "POST"
        },
        function (t, status) {
          if (status == 200) {
            try {
              let info = $.parseJSON(t.responseText);
              // console.log(JSON.stringify(info));
              // console.log(info);
              //改变全局参数
              _this.$store.operateType = true;
              _this.$router.go(-2);
              _this.$store.wordOrderReplyResult = ""; //清空处理结果
              Toast(info.Message);
            } catch (e) {
              Toast("文件上传失败");
            }
            wa.close();
          } else {
            wa.close();
            Toast("上传失败:" + info.Message);
          }
        }
      );
      task.addData("WorkBillID", _this.workBillParams.WorkBillID);
      task.addData("latestVersion", _this.workBillParams.latestVersion);
      task.addData("FlowID", _this.workBillParams.FlowID);
      task.addData("FlowNodeID", _this.workBillParams.FlowNodeID);
      task.addData("FlowInstantID", _this.workBillParams.FlowInstantID);
      task.addData("FlowToDoTs", _this.workBillParams.FlowToDoTS);
      task.addData("UserID", _this.$store.UserInfo.UserID + "");
      task.addData("OrgCode", _this.$store.UserInfo.OrgID);
      task.addData("FinishDetailValue", _this.FinishDetailValue);
      task.addData("FinishValue", _this.FinishValue);
      task.addData("DealResult", _this.wordOrderReplyResult); //处理结果
      // 测温数据
      var isNeedTempInfo = _this.checklist?"1":"0"
      // console.log(isNeedTempInfo)
      // console.log(JSON.stringify(isNeedTempInfo))
      task.addData("isNeedTempInfo", isNeedTempInfo);
      task.addData("bedroomTemp1", _this.bedroomTemp1);
      task.addData("bedroomTemp2", _this.bedroomTemp2);
      task.addData("bedroomTemp3", _this.bedroomTemp3);
      task.addData("bedroomTemp4", _this.bedroomTemp4);
      task.addData("hallTemp1", _this.hallTemp1);
      task.addData("hallTemp2", _this.hallTemp2);
      task.addData("hallTemp3", _this.hallTemp3);
      task.addData("hallTemp4", _this.hallTemp4);
      task.addData("restroomTemp1", _this.restroomTemp1);
      task.addData("restroomTemp2", _this.restroomTemp2);
      task.addData("restroomTemp3", _this.restroomTemp3);
      task.addData("restroomTemp4", _this.restroomTemp4);
      task.addData("kitchenTemp1", _this.kitchenTemp1);
      task.addData("kitchenTemp2", _this.kitchenTemp2);
      task.addData("kitchenTemp3", _this.kitchenTemp3);
      task.addData("kitchenTemp4", _this.kitchenTemp4);
      var isQualified = _this.isQualifiedText == "是"?"1":"0"
      task.addData("isQualified", isQualified);
      task.addData("outdoorTemp", _this.outdoorTemp);
      task.addData("thermometricTime", _this.tempTimeText);
      task.addData("note", _this.tempIntroduction);
      for (let i = 0; i < _this.imgs.length; i++) {
        //key需要字符串类型
        task.addFile( _this.imgs[i].src, {
          key: Math.floor(Math.random() * 1000 + 1000).toString()
        });
      }
      task.start();
    },
    // 图片压缩
    compress(img) {
      let imgs = JSON.parse(JSON.stringify(img))
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = imgs.src.length;
      let width = imgs.w;
      let height = imgs.h;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
          console.log("大于400万像素")
          ratio = Math.sqrt(ratio);
          width /= ratio;
          height /= ratio;
      } else {
          ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      // if ((count = width * height / 1000000) > 1) {
      //     console.log("超过100W像素");
      //     count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
      //     //            计算每块瓦片的宽和高
      //     let nw = ~~(width / count);
      //     let nh = ~~(height / count);
      //     tCanvas.width = nw;
      //     tCanvas.height = nh;
      //     for (let i = 0; i < count; i++) {
      //         for (let j = 0; j < count; j++) {
      //             tctx.drawImage(imgs, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
      //             ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
      //         }
      //     }
      // } else {
      //     ctx.drawImage(imgs, 0, 0, width, height);
      // }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    //格式化日期
    formatDate(date, format) {
      var paddNum = function(num) {
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
      return format.replace(/([a-z])(\1)*/gi, function(m) {
        return cfg[m];
      });
    }
  }
};
</script>
<style scoped>
.reply_content {
  margin-top: 0.15rem;
  height: 86%;
  overflow: scroll;
}

.mui-table-view-cell>.step_title {
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

.mui-table-view-cell>div {
  float: left;
  width: 25%;
  color: #666;
}

.mui-table-view-cell>span {
  float: right;
  max-width: 75%;
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


/* 上传图片样式 */


/* 媒体查询 */

@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  .uploadImage {
    background: url("../../static/images/客服移动端切图/首页/Group 13.png") no-repeat center;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  .uploadImage {
    background: url("../../static/images/客服移动端切图/首页/Group 13@1.5x.png") no-repeat center;
  }
}

.uploadImage {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-size: 0.6rem;
  border-radius: 10%;
}

.mui-table-view-cell>div.content {
  width: 75%;
}

.mui-table-view-cell>div.content #Image {
  float: right;
}

.photoShow.mint-popup {
  width: 100%;
}

.photoShow.mint-popup>img {
  width: 100%;
}
.tempBtn{
  margin-top: 10px;
  border-radius: 25px;
  background-color: rgba(38,162,255,0.1)
}

.addRoomBtns{
  width:50%;
  float: left;
  text-align: center;
  border: none;
  border-top: 0.01rem solid #999;
  border-radius: 0px;
}
.addRoomBtns:nth-child(1){
  color:#999;
  border-right: 0.01rem solid #999;
}

.hideDiv{
  display: none;
}
</style>

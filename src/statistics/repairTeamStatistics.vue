<template>
  <div id="big-box">
    <mt-header fixed title="维修队工单统计">
      <router-link to="/home" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="searchTime row">
      <div class="startTime row" @click="selectStart()">
        <img src="./../../static/images/image/icon_date.png" alt="">
        <input type="text" placeholder="选择时间" disabled v-model="beginTime" readonly="readonly">
      </div>
      <div style="font-size: 12px">至</div>
      <div class="endTime row" @click="selectEnd()">
        <img src="./../../static/images/image/icon_date.png" alt="">
        <input type="text" placeholder="选择时间" disabled v-model="endTime" readonly="readonly">
      </div>
      <div class="search" @click="getBillList()">搜索</div>
    </div>
    <div id="table">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>维修队名称</th>
            <th>工单总数</th>
            <th>已完成</th>
            <th>未完成</th>
            <th>已超时</th>
            <th>待确认分派</th>
            <th>待回复</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in arrList">
            <td>{{index}}</td>
            <td>{{item.TeamName}}</td>
            <td>{{item.OrderTotal}}</td>
            <td>{{item.Finished}}</td>
            <td>{{item.NoFinish}}</td>
            <td>{{item.OverTime}}</td>
            <td>{{item.WaitOrder}}</td>
            <td>{{item.WaitReply}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <mt-datetime-picker
        v-model="date"
        ref="startPicker"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="startConfirm">
    </mt-datetime-picker>
    <mt-datetime-picker
        v-model="date"
        ref="endPicker"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="endConfirm">
    </mt-datetime-picker>
    <my-spinner :showSpinner="isLoading"></my-spinner>
  </div>
</template>

<script>
    import { DatetimePicker } from 'mint-ui';
    export default {
        name: "repairTeamStatistics",
        data(){
            return{
                date:'',
                value:'',
                beginTime:'',
                endTime:'',
                arrList:[],
                isLoading:true
            }
        },
        mounted(){
            this.getBillList()
        },
        methods:{
            selectStart(){
                this.$refs.startPicker.open()
            },
            selectEnd(){
                this.$refs.endPicker.open()
            },
            startConfirm(value){
                let y = value.getFullYear()
                let m = value.getMonth()+1
                let d = value.getDate()
                this.beginTime =  y+ "-"+ m +"-" + d
            },
            endConfirm(value){
                let y = value.getFullYear()
                let m = value.getMonth()+1
                let d = value.getDate()
                this.endTime =  y+ "-"+ m +"-" + d
            },
            getBillList(){
                this.isLoading = true
                this.$http.get(this.$myConfig.host + "/api/WorkBillRecord/GetWorkBillRecord?beginTime=" + this.beginTime + "&endTime=" + this.endTime).then(
                    function (res) {
                        let _this = this
                        setTimeout(function () {
                            _this.arrList = JSON.parse(res.data)
                            _this.isLoading = false
                        },1000)
                    },
                    function (err) {

                    }
                )
            },
        }
    }
</script>

<style scoped>
#big-box{width:100%;}
.row{display: flex;flex-direction: row;justify-content: space-between;align-items: center}
.searchTime{width:100vw;padding: 5px 3vw;background: #fff;}
.searchTime img{width:20px;height:18px}
.searchTime input{width:28vw;font-size: 10px}
.search{color:#6BABD5;font-size: 14px;cursor: pointer}
.startTime,.endTime{border:1px solid #E6E6E6;border-radius: 5px;padding-left: 5vw;}
#table{width:100vw;overflow-x: scroll;-webkit-overflow-scrolling:touch;}
#table::-webkit-scrollbar{width:0px;height:0}
.table th{background: #EEEFF1;font-size: 12px;color: #333333;letter-spacing: 0;}
th{white-space: nowrap;padding: 5px 10px;border-bottom: 1px solid #D5D5D5;border-top: 1px solid #D5D5D5;}
td{text-align: center;padding:3px 10px;white-space: nowrap;font-size: 12px;color: #333333;background: #FFFFFF;border-bottom: 1px solid #D5D5D5;}
table tr td:nth-child(4) {color: #30BD79;}
table tr td:nth-child(6) {color: #FF504C;}
</style>

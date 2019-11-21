<template>
    <div>
        <mt-header title="黑名单"></mt-header>
        <!--        稽查计划 列表-->
        <div class="searchselect">
            <div class="searchdiv">
                <select class="select"  @click="auditPlan">
                    <option v-for="(item,index) in planlist" >{{item}}</option>
                </select>
                <input type="search" class="search">
            </div>
        </div>

        <ul class="planlist">
            <router-link to="/home">
                <li v-for="(item,index) in datas" :key="index"
                    class="audit_argument">
<!--                    <div class="plan">-->
<!--                        <span class="Pname">客户名称：</span><span>{{item.planName}}</span>-->
<!--                    </div>-->
                    <div class="address">
                        <div >地址：</div>
                        <div class="addressright">{{item.Address}}</div>
                    </div>
                    <div class="phone"><span class="texttitle">姓名：</span>{{item.Mobile}}</div>
                    <div class="model_bottom">
                        <div class="name"><span class="nametext"><span class="texttitle">黑名单性质：</span>{{item.IsOutTime}}</span></div>
                        <div class="auditer"><span class="texttitle">操作人：</span>{{item.WorkBillID}}</div>
                    </div>
                </li>
            </router-link>
        </ul>
        <!--  底部tab      -->
        <mt-tabbar v-model="selected" style="position: fixed;bottom: 0">
            <div class="foo">
                <router-link to="/home">
                    <mt-tab-item id="首页">
                        <img slot="icon" src="../../static/images/audit/record/home.png">
                        首页
                    </mt-tab-item>
                </router-link>
            </div>
            <div class="foo">
                <router-link to="/setting/changeInfo">
                    <mt-tab-item id="设置">
                        <img slot="icon" src="../../static/images/audit/record/set.png">
                        设置
                    </mt-tab-item>
                </router-link>
            </div>
        </mt-tabbar>
    </div>
</template>
<script>
    import $ from 'jquery'
    export default {
        data() {
            return {
                planlist:["客户名称","客户地址","稽查计划3"],
                current: 0,
                select:'',
                datas:[
                    {
                        planName:'A计划',
                        Address:'里光真小区测试小区棉四小区测试小区棉测试小区棉1测四小区10号楼1单元201',
                        CusName:'倒十分',
                        Mobile:'2019-11-13 18:21',
                        ImplementerTime:'2314',
                        IsOutTime:"有问题",
                        WorkBillID:"待处理",
                    },
                    {
                        planName:'B计划',
                        Address:'里光真小区测试小区棉四小区测试小区棉测试小区棉1测四小区10号楼1单元201',
                        CusName:'倒十分',
                        Mobile:'2019-11-13 18:21',
                        ImplementerTime:'2314',
                        IsOutTime:"有问题",
                        WorkBillID:"待处理",
                    },
                    {
                        planName:'C计划',
                        Address:'里光真小区测试',
                        CusName:'倒十分',
                        Mobile:'2019-11-13 18:21',
                        ImplementerTime:'2314',
                        IsOutTime:"有问题",
                        WorkBillID:"待处理",
                    }
                ]
            }
        },
        mounted() {
            this.finishText = this.$store.state.finishText
        },
        methods: {
            backset() {
                this.$router.push('/setting/changeInfo')
            },
            backhome() {
                this.$router.push('/home')
            },
            auditPlan(index, event){
                console.log('稽查计划' + this.planlist[this.current])
            }
        }
    }
</script>
<style scoped>

</style>
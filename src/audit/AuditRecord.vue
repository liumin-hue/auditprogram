<template>
    <div>
        <mt-header title="稽查记录">
            <div slot="right" class="select">
                <details close>
                    <summary><img src="../../static/images/audit/record/select.png"></summary>
                    <div class="tongzhi">
                        <ul class="xiaoxi">
                            <li class="hao1" @click="hao1"><span>全部</span></li>
                            <li class="hao2" @click="hao2"><span>无问题</span></li>
                            <li class="hao3" @click="hao3"><span>有问题</span></li>
                        </ul>
                    </div>
                </details>
            </div>
        </mt-header>
        <!--        稽查计划 列表-->
        <div class="searchselect">
            <div class="searchdiv">
                <select class="select"  @click="auditPlan">
                    <option v-for="(item,index) in planlist" v-model="planlist[index]">{{item}}</option>
                </select>
                <input type="search" class="search">
            </div>
        </div>

        <ul class="planlist">
            <router-link to="/home">
                <li v-for="(item,index) in datas" :key="index"
                    class="bolt_argument">
                    <div class="plan">
                        <span class="Pname">稽查计划：</span><span>{{item.planName}}</span>
                    </div>
                    <div class="address">
                        <div>地址：</div>
                        <div class="addressright">{{item.Address}}</div>
                    </div>
                    <div class="model_bottom">
                        <div class="name"><span class="nametext"><span
                                class="texttitle">姓名：</span>{{item.CusName}}</span></div>
                        <div class="phone"><span class="texttitle">稽查时间：</span>{{item.Mobile}}</div>
                    </div>
                    <div class="model_bottom">
                        <div class="name"><span class="nametext"><span class="texttitle">是否有问题：</span>{{item.IsOutTime}}</span>
                        </div>
                        <div class="phone"><span class="texttitle">处理状态：</span>{{item.WorkBillID}}</div>
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
                replyFinishList: false,
                slots: [{values: ['全部', '无问题', '有问题']}],
                finishText: "",
                planlist: ["稽查计划1", "稽查计划2", "稽查计划3"],
                current: 0,
                select: '',
                datas: [
                    {
                        planName: 'A计划',
                        Address: '里光真小区测试小区棉四小区测试小区棉测试小区棉1测四小区10号楼1单元201',
                        CusName: '倒十分',
                        Mobile: '2019-11-13 18:21',
                        ImplementerTime: '2314',
                        IsOutTime: "有问题",
                        WorkBillID: "待处理",
                    },
                    {
                        planName: 'B计划',
                        Address: '里光真小区测试小区棉四小区测试小区棉测试小区棉1测四小区10号楼1单元201',
                        CusName: '倒十分',
                        Mobile: '2019-11-13 18:21',
                        ImplementerTime: '2314',
                        IsOutTime: "有问题",
                        WorkBillID: "待处理",
                    },
                    {
                        planName: 'C计划',
                        Address: '里光真小区测试',
                        CusName: '倒十分',
                        Mobile: '2019-11-13 18:21',
                        ImplementerTime: '2314',
                        IsOutTime: "有问题",
                        WorkBillID: "待处理",
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
            hao1() {
                $(".hao1").addClass("hao");
                $(".hao2").removeClass("hao");
                $(".hao3").removeClass("hao");

            },
            hao2() {
                $(".hao2").addClass("hao");
                $(".hao1").removeClass("hao");
                $(".hao3").removeClass("hao");
            },
            hao3() {
                $(".hao3").addClass("hao");
                $(".hao1").removeClass("hao");
                $(".hao2").removeClass("hao");
            },
        }
    }
</script>
<style scoped>

</style>
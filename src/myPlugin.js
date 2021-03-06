import {
    MessageBox,
    TabContainer,
    TabContainerItem,
    Toast,
    Loadmore,
    Spinner,
    Popup
} from "mint-ui";

let config = {
    // host: 'http://172.30.10.161:8112'//测试地址
    // host: 'http://192.168.11.22:8081'//测试服务器
    // host: 'http://60.28.142.26:8112'//测试地址
    host: 'http://60.28.142.26:8081'//外网测试端口
}

let myFun = {
    //对象数组去重方法
    arrDistinct: function (arr) {
        let hash = {};
        arr = arr.reduce(function (previousValue, currentValue, index, array) {
            hash[currentValue.WorkBillID] ? false : hash[currentValue.WorkBillID] = true && index;
            previousValue.push(currentValue)
            return previousValue
        }, [])

        return arr
    },
    //上拉加载
    loadMore: function (_this, lists, hostPath, ref) {  //this指向，替换的数组key字符串,路径地址
        let UserID = ""
        if (_this.repairmanID) {
            UserID = _this.repairmanID
        } else {
            UserID = _this.$store.UserInfo.UserID
        }
        _this.pageNum++;
        setTimeout(function () {
            _this.$http
                .get(_this.$myConfig.host + hostPath, {
                    params: {
                        CommunityID: _this.$route.params.id,
                        UserID: UserID,
                        OrgCode: _this.$store.UserInfo.OrgID,
                        PageSize: _this.pageSize,
                        PageCount: _this.pageNum
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            // 判断第一次加载个数是否被后台过滤
                            // if (resInfo.Total >= 20) {
                            //   if (_this[lists].length < 20) {
                            //     if (!resInfo.isBottom) {
                            //       _this.$myFun.loadMore(_this, lists, hostPath, ref)
                            //     }
                            //   }
                            // }else {
                            //   if (_this[lists].length < resInfo.Total) {
                            //     _this.$myFun.loadMore(_this, lists, hostPath, ref)
                            //   }
                            // }
                            //获取当前索引
                                _this.$myFun.getIndex(_this, "current");
                            //保存用户权限
                            let arr = _this[lists].concat(resInfo.WorkBillList)
                            _this[lists] = _this.$myFun.arrDistinct(arr)
                            _this.allLoaded_wait = _this.total <= _this[lists].length;//resInfo.Total
                            _this.total = resInfo.Total;

                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );
            _this.$refs[ref].onBottomLoaded();
        }, 1000);
    },
    loadMoreR: function (_this, lists, hostPath, ref) {  //this指向，替换的数组key字符串,路径地址
        let UserID = ""
        if (_this.repairmanID) {
            UserID = _this.repairmanID
        } else {
            UserID = _this.$store.UserInfo.UserID
        }
        _this.pageNum++;
        setTimeout(function () {
            _this.$http
                .get(_this.$myConfig.host + hostPath, {
                    params: {
                        UserID: UserID,
                        repairTeamOrgCode: _this.selectRepairTeamId,
                        PageSize: 20,
                        PageCount: 1,
                        sortTypeNo: _this.followTeamLiseSort
                    }
                })
                .then(
                    function (res) {
                        let resInfo = res.data
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            //获取当前索引
                            _this.$myFun.getIndex(_this, "current");

                            //保存用户权限
                            let arr = _this[lists].concat(resInfo.WorkBillList)
                            let obj = {}
                            // _this[lists] = _this.$myFun.arrDistinct(arr)
                            _this[lists] = arr.reduce((cur,next) => {
                                obj[next.WorkBillID] ? "" : obj[next.WorkBillID] = true && cur.push(next);
                                return cur;
                            },[])
                            _this.allLoaded_wait = _this.total <= _this[lists].length;//resInfo.Total
                            _this.total = resInfo.Total;

                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );
            _this.$refs[ref].onBottomLoaded();
        }, 1000);
    },
    //上拉加载
    loadMore_reply: function (_this, lists, hostPath, ref) {  //this指向，替换的数组key字符串,路径地址
        let UserID = ""
        if (_this.repairmanID) {
            UserID = _this.repairmanID
        } else {
            UserID = _this.$store.UserInfo.UserID
        }
        _this.pageNum_reply++;
        setTimeout(function () {
            _this.$http
                .get(_this.$myConfig.host + hostPath, {
                    params: {
                        CommunityID: _this.$route.params.id,
                        UserID: UserID,
                        OrgCode: _this.$store.UserInfo.OrgID,
                        PageSize: _this.pageSize_reply,
                        PageCount: _this.pageNum_reply
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            // 判断第一次加载个数是否被后台过滤
                            // if (resInfo.Total >= 20) {
                            //   if (_this[lists].length < 20) {
                            //     if (!resInfo.isBottom) {
                            //       _this.$myFun.loadMore_reply(_this, lists, hostPath, ref)
                            //     }
                            //   }
                            // } else {
                            //   if (_this[lists].length < resInfo.Total) {
                            //     _this.$myFun.loadMore_reply(_this, lists, hostPath, ref)
                            //   }
                            // }
                            //获取当前索引
                            _this.$myFun.getIndex(_this, "current_reply");
                            //保存用户权限
                            let arr = _this[lists].concat(resInfo.WorkBillList)
                            _this[lists] = _this.$myFun.arrDistinct(arr)
                            _this.allLoaded_reply = _this.total_reply <= _this[lists].length;//resInfo.Total
                            _this.total_reply = resInfo.Total;

                            //解决IOS无法上拉加载
                            _this.$nextTick(function () {
                                // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
                                // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
                                // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
                                _this.scrollMode = "touch";
                            });
                        } else {
                            Toast(resInfo.Message);
                        }
                    },
                    function (err) {
                        Toast("请检查您的网络");
                    }
                );
            _this.$refs[ref].onBottomLoaded();
        }, 1000);
    },
    //下拉刷新
    loadTop: function (_this, lists, hostPath, ref) {  //this指向，替换的数组key字符串,路径地址,加载控件名称
        let UserID = ""
        if (_this.repairmanID) {
            UserID = _this.repairmanID
        } else {
            UserID = _this.$store.UserInfo.UserID
        }
        setTimeout(function () {
            //获取工单列表
            _this.$http
                .get(_this.$myConfig.host + hostPath, {
                    params: {
                        CommunityID: _this.$route.params.id,
                        UserID: UserID,
                        OrgCode: _this.$store.UserInfo.OrgID,
                        PageSize: 20,
                        PageCount: 1
                    }
                })
                .then(
                    function (res) {
                        // console.log(res.data)
                        let resInfo = res.data
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            //保存用户权限
                            _this[lists] = resInfo.WorkBillList;
                            //判断工单数量
                            _this[lists].length == 0 ? _this.current = 0 : _this.current = 1;
                            if (resInfo.Total <= 7) {
                                _this.allLoaded_wait = true
                            }
                            _this.total = resInfo.Total;
                        } else {
                            Toast(resInfo.Message);
                        }
                        _this.isLoading = false;
                    },
                    function (err) {
                        Toast("请检查您的网络");
                        _this.isLoading = false;
                    }
                );
            _this.$refs[ref].onTopLoaded();
        }, 1000);
        //初始化数据
        _this.allLoaded_wait = false;
        _this.topStatus = "";
        _this.pageNum = 1
    },
    loadTopR: function (_this, lists, hostPath, ref) {  //this指向，替换的数组key字符串,路径地址,加载控件名称
        let UserID = ""
        if (_this.repairmanID) {
            UserID = _this.repairmanID
        } else {
            UserID = _this.$store.UserInfo.UserID
        }
        setTimeout(function () {
            //获取工单列表
            _this.$http
                .get(_this.$myConfig.host + hostPath, {
                    params: {
                        UserID: UserID,
                        repairTeamOrgCode: _this.selectRepairTeamId,
                        PageSize: 20,
                        PageCount: 1,
                        sortTypeNo: _this.followTeamLiseSort
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            //保存用户权限
                            _this[lists] = resInfo.WorkBillList;
                            //判断工单数量
                            _this[lists].length == 0 ? _this.current = 0 : _this.current = 1;
                            if (resInfo.Total <= 7) {
                                _this.allLoaded_wait = true
                            }
                            _this.total = resInfo.Total;
                        } else {
                            Toast(resInfo.Message);
                        }
                        _this.isLoading = false;
                    },
                    function (err) {
                        Toast("请检查您的网络");
                        _this.isLoading = false;
                    }
                );
            _this.$refs[ref].onTopLoaded();
        }, 1000);
        //初始化数据
        _this.allLoaded_wait = false;
        _this.topStatus = "";
        _this.pageNum = 1
    },
    //下拉刷新
    loadTop_reply: function (_this, lists, hostPath, ref) {  //this指向，替换的数组key字符串,路径地址,加载控件名称
        let UserID = ""
        if (_this.repairmanID) {
            UserID = _this.repairmanID
        } else {
            UserID = _this.$store.UserInfo.UserID
        }
        setTimeout(function () {
            //获取工单列表
            _this.$http
                .get(_this.$myConfig.host + hostPath, {
                    params: {
                        CommunityID: _this.$route.params.id,
                        UserID: UserID,
                        OrgCode: _this.$store.UserInfo.OrgID,
                        PageSize: 20,
                        PageCount: 1
                    }
                })
                .then(
                    function (res) {
                        let resInfo = $.parseJSON(res.bodyText);
                        //判断登录信息
                        if (resInfo.ReturnResult) {
                            // 判断第一次加载个数是否被后台过滤
                            // if (resInfo.Total >= 20) {
                            //   if (_this[lists].length < 20) {
                            //     _this.$myFun.loadMore_reply(_this, lists, hostPath, ref)
                            //   }
                            // } else {
                            //   if (_this[lists].length < resInfo.Total) {
                            //     _this.$myFun.loadMore_reply(_this, lists, hostPath, ref)
                            //   }
                            // }
                            //保存用户权限
                            _this[lists] = resInfo.WorkBillList;
                            //判断工单数量
                            _this[lists].length == 0 ? _this.current_reply = 0 : _this.current_reply = 1;
                            if (resInfo.Total <= 7) {
                                _this.allLoaded_reply = true
                            }
                            _this.total_reply = resInfo.Total;
                        } else {
                            Toast(resInfo.Message);
                        }
                        _this.isLoading = false;
                    },
                    function (err) {
                        Toast("请检查您的网络");
                        _this.isLoading = false;
                    }
                );
            _this.$refs[ref].onTopLoaded();
        }, 1000);
        //初始化数据
        _this.allLoaded_reply = false;
        _this.pageNum_reply = 1
    },
    //获取当前index
    getIndex: function (_this, current) {
        let top = _this.$refs.scrollTop.getDocument().scrollTop;
        let listIndex = Math.floor(top / 82) + 1;
        _this[current] = listIndex;
    },
}

export default {
    install: function (Vue) {
        Vue.prototype.$myConfig = config;
        Vue.prototype.$myFun = myFun;
    }
}

<template>
    <div class="toolbar">
        <div class="backTop" @click="top()"></div>
        <div class="total">
            <div class="current">{{current}}</div>
            <div>{{total}}</div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      current:0
    };
  },
  props: ["total", "current"],
  mounted() {
      window.addEventListener('scroll',this.handleScroll,true)
  },
  methods: {
    top() {
      console.log(document.documentElement.scrollTop)
      var _time = null;
      var _this = this;
      var top = this.getDocument().scrollTop;
      var timer = null;
      clearInterval(timer);
      //模拟运动效果
      timer = setInterval(function() {
        var _top = _this.getDocument().scrollTop;
        var _left = _this.getDocument().scrollLeft;
        var step = top / 20;
        if (_top > 0) {
          if (top < 500) {
            window.scrollTo(_left, _top - 80);
          } else if (top < 1500) {
            window.scrollTo(_left, _top - 300);
          } else {
            window.scrollTo(_left, _top - step);
          }
        } else {
          //清空计时器
          clearInterval(timer);
        }
      }, 30);
    },
    //获取元素
    getDocument() {
      var _document = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        _document = document.documentElement;
      } else if (document.body) {
        _document = document.body;
      }
      return _document;
    },
    //获取当前index
    getIndex() {
      var _this = this;
      window.onscroll = function() {
        var top = _this.getDocument().scrollTop;
        // console.log(top)
        var listIndex = Math.floor(top / 82) + 1;
        if(_this.total == 0){
          _this.current = 0
        }else{
          _this.current = listIndex
        }
        return listIndex;
      };
    }
  }
};
</script>
<style scoped>
.toolbar {
  position: fixed;
  min-width:0.45rem;
  height: 0.85rem;
  right: 0.15rem;
  bottom: 1.5rem;
  text-align: center;
}
/* 媒体查询 */
/* 图标样式 */
@media only screen and (max-device-width: 413px) {
  /*iPhone 6 Portrait*/
  .backTop {
    background: url("../../static/images/客服移动端切图/首页/回到顶部 copy.png") no-repeat
      center;
  }
}

@media only screen and (min-device-width: 414px) {
  /*iPhone 6+ Portrait*/
  .backTop {
    background: url("../../static/images/客服移动端切图/首页/回到顶部 copy@1.5x.png")
      no-repeat center;
  }
}
.backTop {
  width: 100%;
  height: 0.3rem;
  background-size: 0.18rem;
  margin-bottom: 0.1rem;
}

.total {
  border-radius: 50%;
  background-color: #49a9ea;
  font-size: 0.12rem;
  padding: 0 0.07rem;
}

.total > div {
  height: 0.22rem;
}

.current {
  color: #fff;
  border-bottom: 0.02rem solid #fff;
}
</style>

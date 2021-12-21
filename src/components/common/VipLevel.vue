<template>
  <div class="vip_level_wrap">
    <div class="yixif" :style="{ 'padding-left': paddingcss, 'padding-right': paddingcss }">
      <span class="yixiaof" :style="{ left: csshongxian }">已累计{{ haspay }}积分</span><br />
      <img src="@/assets/img/home/position.png" class="dingwei" :style="{ left: csshongxian }"/>
    </div>
    <div class="xianpa" :style="{ 'padding-left': paddingcss, 'padding-right': paddingcss }">
      <div class="hengxian">
        <div class="hongxian" :style="{ width: csshongxian }"></div>
      </div>
    </div>
    <div class="flexbox djwai">
      <div class="yifen dengji" :class="{ gray: classx < index }" v-for="(item, index) in vipLevels" :key="item.val">
        <img src="@/assets/img/home/juyuandian.png" />
        <div class="jucol">{{ item.name }}</div>
        <div>累计{{ item.val }}积分</div>
      </div>
    </div>
    <!-- 活跃等级权益 -->
    <div class="vip_interests">
      <h4>活跃等级权益</h4>
      <div class="inter_cont">
        <div class="item" v-for="item in vipLevels" :key="item.val">
          {{item.name}}：{{item.interests}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vipLevels: [
        { name: "Vip0", val: 0 ,interests:'初始用户，平台基本权限，可查看当前的配套、地块信息'},
        { name: "Vip1", val: 100 ,interests:'个人地图创建或导入土地信息超过10条，可查看航拍链接（免费和收费的）、下载收费出让文件；开放公共地图信息导出明细功能，但每日仅限50条信息'},
        { name: "Vip2", val: 500 ,interests:'添加好友超过3人，可查看出价记录和参拍信息，可建1个好友群，开放人口数据数据功能、新房预售和开盘数据查看功能'},
        { name: "Vip3", val: 800 ,interests:'个人地图创建或导入土地信息超过100条，可查阅隐藏的集中供地预测信息等，开放公共地图信息导出功能，不限制条数'},
        { name: "Vip4", val: 1000 ,interests:'添加好友超过10人，开放新房预售和开盘数据明细下载功能'},
        { name: "Vip5", val: 2000 ,interests:'消费积分达到1000分，可建群数量不受限制'},
      ],
      haspay: 600,
      classx: 0,
      csshongxian: undefined,
      paddingcss: undefined,
    };
  },
  mounted() {
    this.setPosition();
  },
  computed: {},
  methods: {
    // i+1 已到nodes尾部
    /*设置进度条当前位置*/
    setPosition() {
      this.classx = 0;
      this.csshongxian = "0px";
      this.paddingcss = "0px";
      for (let i = 0; i < this.vipLevels.length; i++) {
        let hengxian = document.getElementsByClassName("xianpa");
        let hengwidth = hengxian[0].offsetWidth; //获取总进度条的长度(横线)
        let danwidth = hengwidth / this.vipLevels.length; //单个块的长度
        this.paddingcss = danwidth / 2 + "px";
        if (this.haspay < this.vipLevels[i].val) {
          //橘红分隔
          console.log(hengwidth);
          console.log(danwidth);
          let hongwidth =
            danwidth * i -
            (danwidth / (this.vipLevels[i].val - this.vipLevels[i - 1].val)) *
              (this.vipLevels[i].val - this.haspay);
          this.csshongxian = hongwidth + "px";
          this.classx--;
          break; //第一次就跳出停止了
        } else if (this.haspay === this.vipLevels[i].val) {
          console.log(hengwidth);
          console.log(danwidth);
          let hongwidth = danwidth * i;
          this.csshongxian = hongwidth + "px";
          break; //第一次就跳出停止了
        }
        this.classx++; //橘红个数
        console.log("这是第" + i + "个" + this.classx);
      }
    },
  },
};
</script>
<style lang="scss">
.vip_level_wrap {
  .vip_interests{
    .inter_cont{
      .item{
        margin-top: 10px;
      }
    }
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(180px);
  }
  /*v-enter-active【入场动画的时间段】*/
  /*v-leave-active【离场动画的时间段】*/
  .fade-enter-active,
  .fade-leave-active {
    transition: all 1s ease;
  }
  /*进度条开始*/
  .waic {
    /*padding: 30px;*/
  }
  .hengxian {
    width: 100%;
    height: 1.5px;
    background-color: #a0a0a0;
  }
  .hongxian {
    width: 0;
    height: 1.5px;
    background-color: #ff6933;
  }
  .yixiaof {
    color: #ff6933;
    display: inline-block;
    line-height: 18px;
    font-size: 13px;
    position: relative;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .dingwei {
    width: 13px;
    position: relative;
    top: 3px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .yifen {
    -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
    -moz-box-flex: 1; /* OLD - Firefox 19- */
    width: 20%; /* For old syntax, otherwise collapses. */
    -webkit-flex: 1; /* Chrome */
    -ms-flex: 1; /* IE 10 */
    flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  }
  .flexbox {
    display: box; /* OLD - Android 4.4- */
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox; /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Chrome */
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  }
  .jucol {
  }
  .dengji {
    text-align: center;
    font-size: 13px;
    line-height: 20px;
  }
  .dengji img {
    width: 16px;
  }
  .djwai {
    position: relative;
    top: -8px;
  }
  .jucol {
    color: #ff6933;
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
  /*进度条结束*/
}
</style>
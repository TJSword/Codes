<template>
  <div class="wechatpayBox">
    <div class="pay-logo">
      <img src="@/assets/img/home/wechatpay.png" alt="" />
    </div>
    <div class="info-box">
      <div id="qrcode" ref="qrcode"></div>
      <div class="pay_tip">
        <img class="icon" src="@/assets/img/home/saoma.png" alt="" />
        <div class="text">请使用微信扫描二维码以完成支付</div>
      </div>
      <p class="price">¥&nbsp;{{ amt }}</p>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";

export default {
  data() {
    return {
      amt: 0,
      qrurl: "",
      timer: null,
    };
  },

  components: {
    //QrcodeVue,
  },

  methods: {
    getOrderInfo() {
      if (sessionStorage.qrurl && sessionStorage.amt) {
        this.qrurl = sessionStorage.qrurl;
        this.amt = sessionStorage.amt;
        let qrcode = new QRCode("qrcode", {
          width: 320,
          height: 320,
          text: sessionStorage.qrurl,
          render: "canvas",
          background: "#f0f",
          foreground: "#ff0",
          correctLevel: 0,
        });
      }
    },

    startLoop() {
      this.timer = setInterval(() => {
        this.isPaySuccess();
      }, 3000);
    },

    async isPaySuccess() {
      const orderId = sessionStorage.order_id;
      const res = await this.$http.get(
        "orderInfo/queryOrder?orderId=" + orderId
      );
      const { code, msg, resultList } = res.data;

      if (code === "200") {
        clearInterval(this.timer);
        this.timer = null;
        sessionStorage.removeItem("qrurl");
        sessionStorage.removeItem("amt");
        sessionStorage.removeItem("order_id");
        sessionStorage.removeItem("returnUrl");
        setTimeout(() => {
          this.$router.push({
            name: "order",
          });
        }, 3000);
      } else if (code === 401) {
        clearInterval(this.timer);
        this.timer = null;
        sessionStorage.removeItem("qrurl");
        sessionStorage.removeItem("amt");
        sessionStorage.removeItem("order_id");
        sessionStorage.removeItem("returnUrl");
        this.$message.error(msg);
        this.$router.push({
          name: "login",
        });
      } else {
      }
    },
  },

  created() {
    this.getOrderInfo();
    this.startLoop();
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss">
.wechatpayBox {
  width: 100%;
  height: 100%;
  .pay-logo{
    text-align: center;
    padding: 15px 0;
    img {
      width: 160px;
    }
  }
  .info-box {
    padding: 60px 0;
    border-top: 3px solid #f43b66;
    -webkit-box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.18);
    box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.18);
    text-align: center;
    .pay_tip{
      margin: auto;
      width: 250px;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #445f85;
      color: #fff;
      .icon{
        width: 46px;
        height: 46px;
      }
      .text{
        width: 120px;
        text-align: left;
        margin-left: 20px;
      }
    }
    .price {
      margin-top: 20px;
      color: #f43b66;
      font-size: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f1f1;
    }
  }
}


</style>


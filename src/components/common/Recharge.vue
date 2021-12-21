<template>
  <div class="recharge">
    <div class="wrap" v-if="!isWechatPay">
      <div class="recharge_box">
        <div class="item">
          <h4 style="margin-bottom: 15px">充值金额</h4>
          <el-radio-group v-model="amountVal" @change="amountChange">
            <el-radio border :label="'' + 100">充值100</el-radio>
            <el-radio border :label="'' + 500">充值500</el-radio>
            <el-radio border :label="'' + 1000">充值1000</el-radio>
            <el-radio border :label="'' + 2000">充值2000</el-radio>
            <el-radio border :label="'' + 5000">充值5000</el-radio>
            <el-radio border :label="''">自定义</el-radio>
          </el-radio-group>
        </div>
        <div class="item">
          <h4 style="margin-bottom: 15px">充值方式</h4>
          <el-radio-group
            v-model="rechargeParams.paymentType"
            @change="paymentTypeChange"
          >
            <el-radio border :label="'' + 0">微信</el-radio>
            <el-radio border :label="'' + 1">支付宝</el-radio>
          </el-radio-group>
        </div>
        <div class="item">
          <h4 style="margin-bottom: 15px">充值金额</h4>
          <!-- <img src="{:url('qrcode',['text'=>$text])}" /> -->
          <el-input
            :disabled="disabled"
            clearable
            v-model="rechargeParams.totalAmt"
            placeholder="请输入金额"
            style="width: 150px"
          ></el-input>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px">
        <el-button type="primary" @click="surePay">确认支付</el-button>
      </div>
    </div>
    <wechatQRcode v-if="isWechatPay" />
    <el-button class="record_btn" type="text" @click="isRecord = true">充值明细</el-button>
    <el-dialog title="充值明细" :visible.sync="isRecord" width="40%" :append-to-body="true">
      <el-table :data="recordArr" height="450" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="val" label="充值金额"></el-table-column>
        <el-table-column  prop="state" label="充值状态">
          <template slot-scope="scope">
            <el-tag  :type="scope.row.state === 1?'primary':'danger'" disable-transitions>{{scope.row.state === 1?'成功':'失败'}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import wechatQRcode from "@/components/common/wechatQRcode";
export default {
  components: {
    wechatQRcode,
  },
  data() {
    return {
      amountVal: "",
      disabled: false,
      //充值参数
      rechargeParams: {
        totalAmt: "", //金额
        paymentType: "0", //支付方式[0:微信,1:支付宝,2:余额,3:活动]
        // transType: "0", //交易类型[0:充值,1:消费]
      },
      code: "",
      isWechatPay:false,//微信支付页面
      isRecord:false,//充值明细
      recordArr:[
        { id:'1',date:'2021-05-01',val:100,state:1 },
        { id:'1',date:'2021-05-01',val:200,state:0 },
        { id:'1',date:'2021-05-01',val:100,state:0 },
        { id:'1',date:'2021-05-01',val:300,state:1 },
        { id:'1',date:'2021-05-01',val:500,state:1 },
        { id:'1',date:'2021-05-01',val:1000,state:1 },
        { id:'1',date:'2021-05-01',val:200,state:1 },
        { id:'1',date:'2021-05-01',val:300,state:1 },
        { id:'1',date:'2021-05-01',val:100,state:1 },
        { id:'1',date:'2021-05-01',val:200,state:0 },
        { id:'1',date:'2021-05-01',val:100,state:0 },
        { id:'1',date:'2021-05-01',val:300,state:1 },
        { id:'1',date:'2021-05-01',val:500,state:1 },
        { id:'1',date:'2021-05-01',val:1000,state:1 },
        { id:'1',date:'2021-05-01',val:200,state:1 },
        { id:'1',date:'2021-05-01',val:300,state:1 }
      ]
    };
  },

  methods: {
    //充值金额
    amountChange(val) {
      this.rechargeParams.totalAmt = val;
      if (val == "") {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },

    //支付方式

    paymentTypeChange(val) {
      this.rechargeParams.paymentType = val;
    },

    //确认支付

    surePay() {
      if (this.rechargeParams.totalAmt == "") {
        this.$message.warning("请输入金额");
        return;
      }
      if (this.rechargeParams.paymentType == "0") {
        this.$message.success("微信支付");
        this.wechatPay();
      } else if (this.rechargeParams.paymentType == "1") {
        this.$message.success("支付宝支付");
        const payDiv = document.getElementById("payDiv");
        if (payDiv) {
          document.body.removeChild(payDiv);
        }
        const div = document.createElement("div");
        div.id = "payDiv";
        div.innerHTML = result;
        document.body.appendChild(div);
        document
          .getElementById("payDiv")
          .getElementsByTagName("form")[0]
          .submit();
      }
      //   post("weixin/createOrderInfo", this.rechargeParams).then((res) => {
      //     var result = res.result;
      //     if (res.code === 20000) {
      //       // 支付方式跳转

      //       if (this.rechargeParams.paymentType == "0") {
      //         this.$message.success("微信支付");
      //         this.wechatPay(result);
      //       } else if (this.rechargeParams.paymentType == "1") {
      //         this.$message.success("支付宝支付");
      //         const payDiv = document.getElementById("payDiv");
      //         if (payDiv) {
      //           document.body.removeChild(payDiv);
      //         }
      //         const div = document.createElement("div");
      //         div.id = "payDiv";
      //         div.innerHTML = result;
      //         document.body.appendChild(div);
      //         document.getElementById("payDiv").getElementsByTagName("form")[0].submit();
      //       }
      //     }
      //   });
    },

    //微信支付

    wechatPay(result) {
        this.isWechatPay = true
    },
  },
  // },
};
</script>

<style lang="scss">
.recharge {
  position: relative;
  .record_btn{
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
}
.el-radio.is-bordered {
    margin-bottom: 15px;
}
.el-radio.is-bordered+.el-radio.is-bordered{
    margin-left: 0;
}
.el-dialog__body {
  padding: 0px 20px 20px 20px;
}
</style>


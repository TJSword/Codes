<template>
  <div class="userinfo_wrap">
    <!-- 用户 -->
    <div class="photo_wrap" :style="{right:curMenu=='StaticCalc'?'8px':'425px'}">
      <img class="user_photo" :src="userPhoto" alt=""/>
      <div class="user_option">
        <div class="op_top">
          <div class="user_name">{{userName}}</div>
          <el-tooltip v-if="isAdmin" class="item" effect="light" content="管理员" placement="bottom-start">
            <el-image v-if="isAdmin" class="badge_icon" :src="require('@/assets/img/home/admin.png')" fit="contain"></el-image>
          </el-tooltip>
          <el-tooltip v-if="isSuperUser" class="item" effect="light" content="超级用户" placement="bottom-start">
            <el-image v-if="isSuperUser" class="badge_icon" :src="require('@/assets/img/home/super1.png')" fit="contain"></el-image>
          </el-tooltip>
          <el-popover placement="bottom" width="300" trigger="click" v-model="cityVisible">
          <div class="city_box">
            <div>切换城市</div>
            <div class="s_box">
              <!-- 省份 -->
              <el-select size="small" v-model="curProvince" placeholder="省份" style="width:48%;" 
              @change="getCityData" clearable filterable>
                <el-option-group v-for="group in provinces" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-option-group>
              </el-select>
              <!-- 城市 -->
              <el-select size="small" style="width:48%;" v-model="curCityCode" placeholder="城市" @change="selcetCity" clearable filterable>
                <el-option-group v-for="group in cities" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-option-group>
              </el-select>
            </div>
            <div class="b_box">
              <el-button type="default" size="small" @click="cityVisible = false">取消</el-button>
              <el-button type="primary" size="small" @click="changeCity()">切换城市</el-button>
            </div>
          </div>
          <el-tag slot="reference" class="city_select" size="mini">{{cityName}}</el-tag>
          </el-popover>
        </div>
        <div class="btns">
          <div class="btn_box">
            <el-tooltip class="item" effect="light" content="登出" placement="bottom-start">
              <i class="log_out iconfont icon-logout" @click="userLogout()"></i>
            </el-tooltip>
          </div>
          <div class="btn_box" v-if="isAdmin">
            <el-tooltip class="item" effect="light" content="日志" placement="bottom-start">
              <i class="log_out iconfont el-icon-user" @click="userInfo()" style="font-size:14px;"></i>
            </el-tooltip>
          </div>
          <div class="btn_box">
            <el-tooltip class="item" effect="light" content="个人信息" placement="bottom-start">
              <i class="log_out iconfont icon-userinfo" @click="isModify = true"></i>
            </el-tooltip>
          </div>
          <div class="btn_box" v-if="curBigMenu=='TzyMap'">
            <el-tooltip class="item" effect="light" content="好友" placement="bottom-start">
              <i class="log_out iconfont icon-tongxunlu" @click="friends()" :style="{color:showFriends?'#e4ff06':'#00ff96'}"></i>
            </el-tooltip>
            <div class="has_message" v-show="hasMessage"></div>
          </div>
          <div class="btn_box" v-if="isAdmin">
            <el-tooltip class="item" effect="light" content="数据下载" placement="bottom-start">
              <i class="log_out iconfont icon-xiazai" @click="downFile = true"></i>
            </el-tooltip>
          </div>
          <div class="btn_box">
            <el-tooltip class="item" effect="light" content="使用分享口令" placement="bottom-start">
              <i class="log_out iconfont icon-fenxiangma" @click="showShare = true"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!-- 分享口令 -->
    <el-dialog title="添加功能" :visible.sync="showShare" width="20%" :append-to-body="true">
      <div class="title" style="margin-bottom:10px;">请输入您的新增功能口令：</div>
      <el-input v-model="secretKey" size="small" placeholder="请输入分享口令">
        <el-button slot="append" size="small" @click="sendSecret()">确认</el-button>
      </el-input>
    </el-dialog>
    <!-- 用户日志 -->
    <el-drawer title="用户日志" :visible.sync="showLog" :modal-append-to-body="false" size="25%" direction="rtl">
      <div class="user_log" style="padding:0 20px;">
        <el-table class="user_log" :data="logData" stripe :height="tHeight" style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="用户名"></el-table-column>
          <el-table-column prop="loginnum" label="登陆次数" sortable></el-table-column>
          <el-table-column prop="infonum" label="创建地块数量" sortable></el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!-- 用户信息修改及密码找回 -->
    <el-dialog title="修改" :visible.sync="isModify" width="20%" :append-to-body="true">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="修改密码" name="modifyPass">
          <el-form ref="modifyPassForm" :model="modifyPassForm" :rules="modifyRules" label-width="80px">
            <el-form-item label="原密码">
              <el-input v-model="modifyPassForm.password" type="password" auto-complete="new-password" clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="modifyPassForm.newPassword" type="password" auto-complete="new-password" clearable></el-input>
            </el-form-item>
            <el-form-item label="再输一遍">
              <el-input v-model="modifyPassForm.reNewPassword" type="password" auto-complete="new-password" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改信息" name="modifyInfo">
          <el-form ref="modifyInfoForm" :model="modifyInfoForm" :rules="modifyInfoRules" label-width="80px">
            <el-form-item label="头像">
              <el-upload class="avatar-uploader" list-type="picture-card" action="#" :show-file-list="false"
                accept=".png,.jpg" :on-change="avatarChange" :auto-upload="false">
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input placeholder="1-5字的昵称" v-model="modifyInfoForm.realname" auto-complete="new-password" clearable></el-input>
            </el-form-item>
            <el-form-item label="单位">
              <el-input placeholder="" v-model="modifyInfoForm.company" auto-complete="new-password" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="modify_footer" style="display:flex;justify-content: flex-end;align-items: center;">
        <el-button @click="isModify = false">取 消</el-button>
        <el-button type="primary" @click="modify()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="下载数据" :visible.sync="downFile" width="20%" :append-to-body="true">
      <div class="down">
        <div class="time">
          <div class="title">时间范围：</div>
          <div class="cont" style="width:100%">
              <el-date-picker
                style="width:100%"
                v-model="dateRange"
                size="small"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          </div>
        </div>
        <div class="tip" style="margin-top:10px;">Tips:1、数据默认当前城市官方公开土地数据；2、时间范围为土地公告时间，若不选择将下载所有数据</div>
        <div class="loading" v-if="downLoading"><i class="el-icon-loading"></i>数据下载中。。。</div>
      </div>
      <div slot="footer" class="modify_footer" style="display:flex;justify-content: flex-end;align-items: center;">
        <el-button @click="downFile = false">取 消</el-button>
        <el-button type="primary" :disabled="downLoading" @click="downloadFile()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 个人信息 -->
    <div class="self_info" v-if="showUserInfo" :style="{left:positionX+'px',top:positionY+'px'}">
      <el-card class="info_card">
        <div slot="header" class="info_head" @mousedown="move">
          <span>个人信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="showUserInfo = false">关闭</el-button>
        </div>
        <div class="info_cont">
          <div class="info_wrap user_info">
            <el-image :src="userPhoto" fit="cover" class="photo"></el-image>
            <div class="info">
              <div class="info_item" style="margin-bottom:10px;">昵称：<el-tag>{{userName}}</el-tag>
                <el-button type="text" style="margin-left:10px;" @click="isModify = true">修改</el-button>
              </div>
              <div class="info_item" style="margin-bottom:10px;">
                <div class="vip_level">
                  等级：<el-image class="level_icon" :src="require('@/assets/img/home/vip.png')" fit="contain"></el-image>
                  <div class="level_num">{{vipLevel}}</div>
                </div>
                <el-image class="level_icon" :src="require('@/assets/img/home/super.png')" fit="contain" style="margin-left:10px;"></el-image>
                <el-button type="text" style="margin-left:10px;" @click="isVipLevel = true">查看等级</el-button>
              </div>
              <div class="info_item">积分：<el-tag type="warning">{{userIntegral}}</el-tag>
                <el-button type="text" style="margin-left:10px;" @click="isRecharge = true">充值积分</el-button>
                <el-button type="text" style="margin-left:10px;" @click="intRecord = true">积分记录</el-button>
              </div>
              <div class="info_item" style="margin-bottom:10px;">邀请码：<h3>{{InvitationCode}}</h3>
                <el-button type="text" style="margin-left:10px;" 
                  v-clipboard:copy="'快来投资云地图注册会员吧，注册地址：http://www.tzymap.com，填写邀请码有惊喜：'+InvitationCode"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">复制</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 充值界面 -->
    <el-dialog title="积分充值" :visible.sync="isRecharge" width="40%" :append-to-body="true">
      <Recharge />
    </el-dialog>
    <!-- 活跃等级界面 -->
    <el-dialog title="活跃等级" :visible.sync="isVipLevel" width="40%" :append-to-body="true">
      <VipLevel />
    </el-dialog>
    <!-- 积分记录 -->
    <el-dialog title="积分记录" :visible.sync="intRecord" width="40%" :append-to-body="true">
      <el-table :data="intRecordArr" height="450" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="val" label="积分">
          <template slot-scope="scope">
            <div class="val">{{scope.row.state === 1?'+':'-'}}{{scope.row.val}}</div>
          </template>
        </el-table-column>
        <el-table-column  prop="going" label="积分去向"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import userApi from "@/api/userApi";
import ledgerApi from "@/api/ledgerApi";
import commonApi from "@/api/commonApi";
import { mapGetters } from 'vuex'
//组件
import Recharge from "@/components/common/Recharge"
import VipLevel from "@/components/common/VipLevel"
export default {
  name:'userinfo',
  components:{
    Recharge,
    VipLevel
  },
  data(){
    return {
      curBigMenu:'TzyMap',//当前主菜单
      positionX:null,
      positionY:null,
      tHeight:window.innerHeight-100,
      showLog:false,//用户日志
      logData:[],//日志数据
      allArrIds:[],//个人土地数据
      impArrIds:[],//个人土地数据
      creArrIds:[],//个人土地数据
      activeName:'modifyPass',
      isModify:false,//修改弹出框显示
      isFind:false,//找回密码状态
      downFile:false,//下载文件
      showShare:false,//实用分享码
      downLoading:false,//下载等待
      dateRange:'',//日期范围
      modifyPassForm:{ //修改信息
        password:'', //原密码
        newPassword:'', //新密码
        reNewPassword:'' //重复密码
      },
      modifyRules:{ //修改校验
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback)=>{this.checkPassword(rule, value, callback)}, message: '密码必须是由6-12位字母+数字组合', trigger: ['blur'] }
        ],
        reNewPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: "密码必须是由6-12位字母+数字组合", trigger: "blur"},
          { validator: (rule, value, callback)=>{this.checkRepassword(rule, value, callback)}, message: '两次输入密码不一致', trigger: "blur", required: true }
        ],
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
      },
      modifyInfoForm:{
        avatar:null,
        realname:'',
        company:''
      },
      modifyInfoRules:{
        realname: [
          { required: false, min:1, max:5, message: '请输入1-5字的昵称', trigger: 'blur' }
        ],
      },
      avatarUrl:'',//头像地址
      userPhoto:'http://47.104.165.136:8099/test/portrait.jpg',

      provinces:[],//省份
      curProvince:'',//当前省代码
      cities:[],//城市
      curCityCode:'',//当前城市代码
      curCity:null,//当前城市信息
      cityVisible:false,
      cityName:'成都市',//城市名称

      updateFlag:false,//信息更新flag

      //用户信息
      showUserInfo:false,//显示个人信息
      userName:'佚名', //用户昵称
      vipLevel:0,//积分等级
      userIntegral:12600,//用户积分
      InvitationCode:"GAVO021",//邀请码
      isRecharge:false,//打开充值
      isVipLevel:false,//打开积分等级
      intRecord:false,//积分记录dialog
      intRecordArr:[ //积分记录
        { id:'1',date:'2021-05-01',val:100,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:200,state:0,going:'查看土地A航拍' },
        { id:'1',date:'2021-05-01',val:100,state:0,going:'购买土地B参拍纪录' },
        { id:'1',date:'2021-05-01',val:300,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:500,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:1000,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:200,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:300,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:100,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:200,state:0,going:'购买土地C出让文件' },
        { id:'1',date:'2021-05-01',val:100,state:0,going:'购买土地D全部信息' },
        { id:'1',date:'2021-05-01',val:300,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:500,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:1000,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:200,state:1,going:'' },
        { id:'1',date:'2021-05-01',val:300,state:1,going:'' }
      ],
      secretKey:'',//控规图层分享口令
    }
  },
  beforeMount(){
    let cityName = localStorage.getItem('cityName')
    if(!cityName){
      localStorage.setItem('cityName','成都市')
    }
    this.cityName = cityName?cityName:'成都市'
    
  },
  mounted(){
    this.getProvinceData()
    setTimeout(()=>{
      this.userName = localStorage.getItem('userName')?localStorage.getItem('userName'):'佚名'
      this.userPhoto = localStorage.getItem('headUrl')?localStorage.getItem('headUrl'):'http://47.104.165.136:8099/test/portrait.jpg'
      this.curBigMenu = sessionStorage.getItem('curMainMenu')?sessionStorage.getItem('curMainMenu'):'TzyMap'
    },1500)
  },
  computed:{
    ...mapGetters(['curMenu','cityCode','ledger_map','cityCode','showFriends','hasMessage','isAdmin','isSuperUser','freshMenu'])
  },
  watch:{
    curMenu:{
      handler(newVal){
        this.curBigMenu = newVal
      },
      deep:true
    },
    cityCode:{
      handler(newVal){
        this.curProvince = newVal.substring(0,2)+'0000'
        this.getCityData(this.curProvince,false)
        this.curCityCode = newVal
      },
      deep:true
    },
  },
  methods: {
    //切换城市
    changeCity(){
      if(this.curCity===null){
        this.$message('请先选择城市')
      }else{
        this.cityName = this.curCity.label
        this.$store.dispatch('setCityCode',this.curCity.value)
        localStorage.setItem('cityCode',this.curCity.value)
        localStorage.setItem('cityName',this.curCity.label)
        this.cityVisible = false
        //飞往城市中心点
        if(this.curCity.center){
          let center = this.curCity.center.split(',')
          localStorage.setItem('cityCenter',JSON.stringify(center))
          this.ledger_map.flyTo({
            center:center,
            zoom: 9
          })
        }
        //控制城市图层
        let map = this.ledger_map
        let filter = [
          'all',
          ["==", "tree_level", 3],
          ["==","pid",JSON.parse(this.curCity.value)]
        ]
        map.setFilter("plate_fill",filter)
        map.setFilter("plate_line",filter)
        map.setFilter("plate_labels",filter)

      }
    },
    //校验密码格式
    checkPassword(rule,value,callback){
      let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if(!reg.test(value)){callback(new Error('密码必须是由6-12位字母+数字组合'))
      }else{
          callback()
      }
    },
    //校验密码是否一致
    checkRepassword(rule,value,callback){
      let password = this.isFind?this.findForm.password:this.modifyPassForm.newPassword
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    modify(){
      if(this.activeName==='modifyPass'){
        this.modifyPassword()
      }else{
        this.modifyInfomation()
      }
    },
    //修改密码
    modifyPassword(){
      var that = this
      that.$refs.modifyPassForm.validate((valid) => {
        if (valid) {
          let data = {
            password:that.modifyPassForm.password,
            newPassword:that.modifyPassForm.newPassword,
          }
          userApi.modifyPassword(data)
          .then(res=>{
            console.log(res)
            if(res.data.code===0){
              that.$message.success('密码修改成功,请重新登录')
              setTimeout(_=>{
                that.userLogout()
              },2000)
            }else{
              that.$message.error(res.data.msg)
            }
          })
        } else {
          console.log('请先完善信息');
          return false;
        }
      });
    },
    //修改用户信息
    modifyInfomation(){
      var that = this
      that.$refs.modifyInfoForm.validate((valid) => {
        if (valid) {
          let data = that.modifyInfoForm
          const formData = new FormData()
          if(data.avatar){
            formData.append('headImg',data.avatar)
          }
          if(data.realname){
            formData.append('nickname',data.realname)
          }
          if(data.company){
            formData.append('company',data.company)
          }
          if(data.avatar||data.realname||data.company){ //至少修改一项
            userApi.modifyUserInfo(formData)
            .then(res=>{
              console.log(res)
              if(res.data.code===0){
                that.$message.success('信息修改成功')
                that.userPhoto = res.data.data.headUrl
                that.userName = res.data.data.nickname
                localStorage.setItem('userName',res.data.data.nickname)
                localStorage.setItem('headUrl',res.data.data.headUrl)
                that.$refs.modifyInfoForm.resetFields()
                that.isModify = false
                that.updateFlag = !that.updateFlag
                that.$store.dispatch('setInfoUpdate',that.updateFlag)
              }else{
                that.$message.error(res.data.msg)
              }
            })
          }else{
            that.$message('至少修改一项内容')
          }
        } else {
          console.log('请先完善信息');
          return false;
        }
      });
    },
    //用户登出
    userLogout() {
      this.$store.dispatch("logOut").then(res => {
        console.log(res)
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    //打开好友
    friends(){
      this.$store.dispatch('setShowFriends',!this.showFriends)
      if(this.showFriends){
        this.$store.dispatch('setHasMessage',false)
      }
    },
    //用户操作
    userInfo(){
      var that = this
      ledgerApi.getUserLogs()
      .then(res=>{
        if(res.data.code===0){
          that.showLog = true
          console.log('用户日志',res)
          let data = res.data.data
          data.forEach(item=>{
            item.loginnum = JSON.parse(item.loginnum)
            item.infonum = JSON.parse(item.infonum)
          })
          that.logData = data
        }else{
          that.$message(res.data.msg)
        }
      })
      
    },
    //获取土地列表
    getLandList(){ 
      var that = this
      let reqObj = {
        isself:true,
      }
      
      ledgerApi.getMyLedgers(reqObj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('个人全部土地',data)
          let allArrIds = []
          let impArrIds = []
          let creArrIds = []

          data.forEach(item => {
            if(item.lands){
              item.lands.forEach(land => {
                allArrIds.push(land.id)
                if(land.ossId){ //导入的
                  impArrIds.push(land.id)
                }else{ //新建的
                  creArrIds.push(land.id)
                }
              })
            }else{
                allArrIds.push(item.id)
                if(item.ossId){ //导入的
                  impArrIds.push(item.id)
                }else{ //新建的
                  creArrIds.push(item.id)
                }
            }
          })
          that.allArrIds = allArrIds
          that.impArrIds = impArrIds
          that.creArrIds = creArrIds
        }
      })
    },
    //导出信息
    exportLands(val){ 
      var that = this
      let obj = {
        ids:val==="all"?that.allArrIds:val==="create"?that.creArrIds:impArrIds
      }
      that.downLoading = true
      ledgerApi.govExpLand(obj)
      .then(res=>{
        if(res.data){
          let str = val==="all"?'全部土地数据':val==="create"?'导入土地数据':'新建土地数据'
          let a = document.createElement('a');
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"}); 
          let objectUrl = URL.createObjectURL(blob);
          a.setAttribute("href",objectUrl);
          a.setAttribute("download", str+new Date().toLocaleString());
          a.click();
          that.$message.success(str+'已导出')
          // window.URL.revokeObjectURL(a.href);
          // document.body.removeChild(a);
          that.downLoading = false
        }else{
          that.$message.error(res.data.msg)
          that.downLoading = false
        }
      })
    },
    //头像切换图片
    avatarChange(file,filelist){
      const isLt1M = file.size / 1024 / 1024 < 1
      if(isLt1M){
        this.modifyInfoForm.avatar = file.raw
        this.avatarUrl = file.url
      }else{
        this.$message.error('图片大小不能超过1M')
      }
    },
    //获取省市区数据
    getProvinceData(val){
      var that = this
      commonApi.getPCR()
      .then(res=>{
        if(res.data.code===0){
          that.provinces = res.data.data
          that.curProvince = that.cityCode.substring(0,2)+'0000'
          that.getCityData(that.curProvince,true)
        }
      })
    },
    //获取城市数据
    getCityData(val,flag){
      var that = this
      that.curCityCode = ''
      this.curCity = null
      if(val===''){
        that.cities = []
        return
      }
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          that.cities = res.data.data
          that.cities.forEach(item=>{
            item.options.forEach(op=>{
              if(op.value===that.cityCode){
                that.cityName = op.label
              }
            })
            
          })
          if(flag){ //初始化时选择城市
            that.curCityCode = that.cityCode
          }
        }
      })
    },
    //切换选择城市
    selcetCity(val){
      console.log(val)
      this.cities.forEach(item=>{
        item.options.forEach(op=>{
          if(op.value===val){
            this.curCity = op
          }
        })
      })
    },
    move(e){
      let e1 = e.currentTarget;
      let e2 = e.target;
      if(e1 === e2){ //阻止子元素冒泡
        //移动目标距离左上角的位置
        this.positionX = e.clientX - e.layerX;
        this.positionY = e.clientY - e.layerY;
        document.onmousemove = (e)=>{
          //更新移动量
          this.positionX += e.movementX;
          this.positionY += e.movementY;
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    //剪切板拷贝成功
    onCopy(e){
      console.log('You just copied: ' + e.text)
      this.$message.success('邀请码已拷贝')
    },
    //剪切板拷贝失败
    onError(e){
      console.log('拷贝失败')
    },
    //管理员下载土地数据
    downloadFile(){
      var that = this
      let code = this.cityCode
      let obj = {
        landCityno:code
      }
      if(that.dateRange.length>0){
        obj.minDate = that.dateRange[0]
        obj.maxDate = that.dateRange[1]
      }
      that.downLoading  = true
      userApi.adminDownLoadFile(obj)
      .then(res=>{
        if(res.data){
          let cityName = localStorage.getItem('cityName')
          let str = that.dateRange.length>0?(that.dateRange[0]+'/'+that.dateRange[1]):'全部'
          let name = cityName+str+'官方公开土地数据'
          let a = document.createElement('a');
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"}); 
          let objectUrl = URL.createObjectURL(blob);
          a.setAttribute("href",objectUrl);
          a.setAttribute("download", name);
          a.click();
          that.$message.success(name+'已导出')
          // window.URL.revokeObjectURL(a.href);
          // document.body.removeChild(a);
          that.downLoading = false
        }else{
          that.$message.error(res.data.msg)
          that.downLoading = false
        }
      })
    },
    //添加口令功能
    sendSecret(){
      var that = this
      if(that.secretKey==''){
        that.$message('请先输入分享口令')
        return false
      }
      ledgerApi.addShareSecret({key:that.secretKey})
      .then(res=>{
        if(res.data.code===0){
          let name = res.data.data
          that.sureSecret(name)
        }else{
          that.$message(res.data.msg)
        }
      })
    },
    //删除文件中的数据
    sureSecret(name){
      var that = this
      that.$confirm(`是否导入 ${name} 分享的给你控规图层？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }) .then(() => {
        ledgerApi.addShareSecret({key:that.secretKey,flag:'1'})
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('您已成功添加控规图层功能，请刷新查看')
            that.showShare = false
            //通知更新菜单
            that.$store.dispatch('setFreshMenu',!that.freshMenu)
          }else{
            that.$message(res.data.msg)
          }
        })
      }) .catch(() => {

      })
      
    },
  }
}
</script>
<style lang="scss">

.tip{
  font-size: 12px;
  margin-bottom: 15px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
.userinfo_wrap{
  position: relative;
  
  .photo_wrap{
    position: fixed;
    top: 8px;
    right: 425px;
    z-index: 999;
    color: #fff;
    display: flex;
    align-items: center;
    background: rgb(13 13 13 / 42%);
    padding: 10px;
    border-radius: 6px;
    .user_photo {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      overflow: hidden;
      transition: all 0.5s;
      cursor: pointer;
    }
    .user_option{
      margin-left: 10px;
      .op_top{
        display: flex;
        align-items: center;
        .badge_icon{
          width: 20px;
          margin-left: 7px;
          cursor: pointer;
        }
        .city_select{
          cursor: pointer;
          margin-left: 10px;
        }
        .user_name{
          font-size: 12px;
          color: #ecf5ff;
        }
      }
      .btns{
        color: #00ff96;
        display: flex;
        align-items: center;
        margin-top: 5px;
      }
      .info_modify,.log_out{
        font-size: 13px;
        margin-right: 10px;
        cursor: pointer;
        user-select: none;
      }
      .exp{
        font-size: 16px;
        margin-right: 10px;
        cursor: pointer;
      }
      .btn_box{
        position: relative;
        .has_message{
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fa0909;
          right: 6px;
          top: 3px;
        }
      }
    }
  }
  .self_info{
    position: fixed;
    z-index: 999;
    width: 30vw;
    left: 35%;
    top: 20%;
    .info_card{
      width: 100%;
      height: 100%;
      .info_head{
        cursor: move;
      }
      .info_cont{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .info_wrap{
          width: 100%;
          padding: 20px 10px;
          border-radius: 5px;
          background: #fff;
          border: 1px solid #ebeef5;
          // box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          .info{
            margin-right: 20px;
            .info_item{
              display: flex;
              align-items: center;
              .vip_level{
                display: flex;
                align-items: center;
                position: relative;
                .level_num{
                  font-size: 22px;
                  font-weight: bold;
                  color: #ffcc32;
                  position: absolute;
                  right: 8px;
                  top: -4px;
                  font-family: 'fangsong';
                }
              }
              .level_icon{
                width: auto;
                height: 25px;
              }
              
              .el-image__inner{
                width: unset;
              }
            }
          }
        }
        .user_info{
          display: flex;
          align-items: center;
          .photo{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 20px;
            border: #ebeef5 1px solid;
          }
        }
      }
    }
  }
}
.s_box{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.b_box{
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}


</style>
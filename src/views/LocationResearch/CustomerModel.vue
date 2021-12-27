<template>
  <div class="customerModel_wrap">
     <div class="mask" v-if="progress >1" @click="showToast"></div>
       <div class="customerModel_box">
          <div class="chooseLand_box">
               <el-select v-model="chooseModel" placeholder="选择客户模型" size="small" class="select">
                    <el-option
                      v-for="item in modelList"
                      :key="item.value"
                      :label="item.modelName"
                      :value="item.id">
                       <span style="float: right;color:#d00000;">
                         <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='取消'
                            :title="'确定删除“'+item.modelName +  '”客户模型吗？'"
                            @confirm="deleteOption(item.id)"
                          >
                            <i class="el-icon-circle-close" slot="reference" v-if="item.id !=0" ></i>
                          </el-popconfirm>
                         
                          </span> 
                          <span style="float: left; color: #8492a6; font-size: 13px">{{ item.modelName }}</span> 
                      </el-option>
                  </el-select>
                <div class="new_btn" @click="newCustomer">新建客户模型</div>
          </div>
          <dv-border-box-2 class="info_box">
              <div class="title">{{modelInfo.modelName}}</div>
              <div class="region">{{modelInfo.province}} {{modelInfo.city}}</div>
              <div id="echarts"></div>
               <el-table
                  :data="tableData"
                  style="width:100%;background:transparent;color:white"
                  height="250">
                  <el-table-column
                    prop="name"
                    label="客群命名"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    :label="modelInfo.type === '1'?'单价(元)':'总价(元)'"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="area"
                    label="面积(㎡)"
                    align="center">
                  </el-table-column>
                </el-table>
               <div class="redact_btn" @click="redact" v-if="chooseModel!=0">编辑该模型</div>
          </dv-border-box-2>
          <div class="next_btn" @click="currentMenu">下一步</div>
      </div>
      <dv-border-box-8 :class="['edit_box',ani?'edit_box_active':'']">
        <div class='close_box'> 
          <i class="iconfont icon-guanbi" @click="ani = false"></i>
        </div>
        <div class="title">{{openType}}客户模型</div>
        <div class="select_box">
          <el-cascader
            placeholder="选择城市（模糊搜索）"
            :options="cityList"
            filterable
            label="name"
            value="id"
            size="small"
            v-model="cityCode"
            :props="{
              value:'id',
              label:'name'
            }">
          </el-cascader>
          <el-select v-model="logic" placeholder="选择逻辑" size="small" class="select">
            <el-option
              v-for="item in logicArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
          <el-input v-model="modelName"  placeholder="模型名称" size="small"  class="select"></el-input>
        </div>
         <el-table
            :data="form"
            style="width:90%;background:transparent;color:white;margin-left:5%;margin-top:22px;"
            height="335">
            <el-table-column
              label="客群命名"
              align="center"
              width="120">
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-input placeholder="客群名称" v-model="scope.row.moduleName" size="small" style="width:150px"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="logic==1?'单价(元)':'总价(元)'"
              align="center">
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-input placeholder="最小值" v-model="scope.row.minPrice" size="small" style="width:150px"/> ~ <el-input placeholder="最大值" size="small" v-model="scope.row.maxPrice" style="width:150px" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="area"
              label="面积(㎡)"
              align="center">
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-input placeholder="最小值" v-model="scope.row.minArea" size="small" style="width:150px"/> ~ <el-input placeholder="最大值" v-model="scope.row.maxArea" size="small" style="width:150px" />
                </div>
              </template>
            </el-table-column>
              <el-table-column
                label="操作"
                width="80"
                align="center">
                <template slot-scope="scope">
                  <el-button @click="deleteItem(scope)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
          <div class="btn_box">
            <div class="saveAs_btn" style="margin-right:8%" @click="addLine" >新增一行</div>
            <div class="save_btn" @click="modelHandler" style="margin-right:7%">保存</div>
          </div>
      </dv-border-box-8>
  </div>
</template>

<script>
import Map from "../../components/main/locationResearch/map"
import locationResearch from "../../api/locationResearch"
import { mapGetters } from "vuex"
export default {
  components:{
    Map,
  },
  computed:{
    ...mapGetters(['locationId','point','map','progress'])
  },
  data(){
    return{
      ani:false,
      chooseModel:'0',
      logic:'2',
      modelName:'',
      dialogFormVisible:false,
      cityCode:[],
      modelList:[],
      cityList:[],
      openType:'新建',
      tableData: [{
            name: '王小虎',
            price:'1000~2000',
            area:'80~90'
          },],
        echartsData:[],
        logicArr:[{
          value: '1',
          label: '单价-面积',
        },{
          value: '2',
          label: '总价-面积',
        }],
        modelInfo:{},
        form:[
          {
            moduleName:'',
            minPrice:'',
            maxPrice:'',
            minArea:'',
            maxArea:''
          },{
            moduleName:'',
            minPrice:'',
            maxPrice:'',
            minArea:'',
            maxArea:''
          },{
            moduleName:'',
            minPrice:'',
            maxPrice:'',
            minArea:'',
            maxArea:''
          }]
    }
  },
  watch:{
    chooseModel:{
      handler(newVal){
        locationResearch.getModelInfo(newVal).then(res=>{
          console.log(res.data.data)
          this.modelInfo = res.data.data
          let data = res.data.data.itemList
          let echartsData = []
          let tableData = []
          data.forEach(item=>{
            echartsData.push(
              [item.minPrice,item.maxPrice,item.minArea,item.maxArea,item.moduleName]
            )
            tableData.push({
              name:item.moduleName,
              price:item.minPrice + '~' + item.maxPrice,
              area:item.minArea + '~' + item.maxArea
            })
          })
          this.echartsData = echartsData
          this.tableData = tableData
          this.echartsInit()
        })
      },
      immediate:true
    }
  },
  methods:{
    showToast(){
          this.$message({
              type:'warning',
              message:'当前模块已锁定，如需更改，请点击“我要重做”'
          })
      },
    currentMenu(){
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      locationResearch.updateList({
        id:this.locationId,
        modelId:this.chooseModel
      }).then(res=>{
        setTimeout(() => {
          loading.close();
            this.$router.push({
            name:'GoodsMarket'
            })
        }, 1000);
      })
      
      
    },
    modelHandler(){
      if(this.cityCode.length === 0){
         this.$message({
            message: '请选择城市',
            type: 'warning'
        })
        return
      }
        if(this.modelName === ''){
         this.$message({
            message: '请填写模型名称',
            type: 'warning'
        })
        return
      }
      let flag = false
      for(var i = 0; i < this.form.length;i++){
        if(this.form[i].moduleName === '' || this.form[i].minPrice === '' || this.form[i].maxPrice === '' || this.form[i].minArea === '' || this.form[i].maxArea === ''){
          this.$message({
              message: '请补充模型',
              type: 'warning'
          })
          flag = true
          break
        }
      }
      if(flag)return
      let data = {
        modelName:this.modelName,
        type:this.logic,
        provinceCode:this.cityCode[0],
        cityCode:this.cityCode[1],
        itemList:this.form
      }
      if(this.isRedact){
        this.updateModel(data)
      }else{
        this.addModel(data)
      }
    },
    updateModel(data){
      data.id = this.chooseModel
      locationResearch.updateModel(data).then(res=>{
        if(res.data.code == 0){
           this.$message({
              message: '修改模型成功',
              type: 'success'
          })
          this.ani = false;
          this.getModelList();
          //再次请求详情
          locationResearch.getModelInfo(this.chooseModel).then(res=>{
            console.log(res.data.data)
            this.modelInfo = res.data.data
            let data = res.data.data.itemList
            let echartsData = []
            let tableData = []
            data.forEach(item=>{
              echartsData.push(
                [item.minPrice,item.maxPrice,item.minArea,item.maxArea,item.moduleName]
              )
              tableData.push({
                name:item.moduleName,
                price:item.minPrice + '~' + item.maxPrice,
                area:item.minArea + '~' + item.maxArea
              })
            })
            this.echartsData = echartsData
            this.tableData = tableData
            this.echartsInit()
          })
        }
        if(res.data.code ===500){
          this.$message({
              message: res.data.msg,
              type: 'warning'
          })
        }
      })
    },
    addModel(data){
      locationResearch.addModel(data).then(res=>{
        if(res.data.code === 0){
           this.$message({
              message: '添加模型成功',
              type: 'success'
          })
          this.ani = false;
          this.getModelList()
        }
        if(res.data.code ===500){
          this.$message({
              message: res.data.msg,
              type: 'warning'
          })
        }
      })
    },
    addLine(){
      this.form.push({
        modelName:'',
        minPrice:'',
        maxPrice:'',
        minArea:'',
        maxArea:''
      })
    },
    getCityList(){
      locationResearch.getCityList().then(res=>{
        console.log(res.data.data)
        let data = res.data.data 
        let proviceList = []
        data.forEach(item=>{
          if(item.pid === '0'){
            proviceList.push(item)
          }
        })
        proviceList.forEach(item=>{
          item.children = []
          data.forEach(item1=>{
            if(item.id === item1.pid){
              item.children.push(item1)
            }
          })
        })
        console.log(proviceList)
        this.cityList = proviceList
      })
    },
    deleteOption(id){
      locationResearch.deleteModel([id]).then(res=>{
        if(res.data.code === 0){
          this.$message({
            type:'success',
            message:'删除客户模型成功'
          })
        }
        this.chooseModel = '0'
        this.getModelList()
      })
    },
    echartsInit(){
      let myChart = this.$echarts.init(document.getElementById('echarts'));
      // var data = [[80, 90, 8000,10000, '蚁族'],[90,100,10000,11000,'窝族'],[100,110,11000,12000,'优选'],[90,110,8000,9000,'奇怪']];
      let data = this.echartsData
      var colorList = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#f07167', '#e76f51','#cb997e','#4361ee','#073b4c','#577590','#197278','#84a98c'];
      data = data.map(function (item, index) {
          return {
              value: item,
              itemStyle: {
                  color: colorList[index]
              }
          };
      });
      function renderItem(params, api) {
          var yValue = api.value(3);
          var start = api.coord([api.value(0), yValue]);
          var size = api.size([api.value(1) - api.value(0), api.value(3) - api.value(2)]);
          var style = api.style();

          return {
              type: 'rect',
              shape: {
                  x: start[0],
                  y: start[1],
                  width: size[0],
                  height: size[1]
              },
              style: style
          };
      }

      let option = {
          tooltip: {
          },
          grid: {
              top: '10%',
              bottom: '10%',
              left:'5%',
              containLabel: true
          },
          xAxis: {
              scale: true,
              axisLabel: {
                  show: true,
                  formatter: '{value} ',
                  textStyle: {
                      color: '#eee'
                  }
              },
              splitLine:{
          　　　　show:true
          　　 }
          },
          yAxis: {
              scale: true,
              axisLabel: {
                  show: true,
                  formatter: '{value} ',
                  textStyle: {
                      color: '#fff'
                  }
              },
          },
          series: [{
              type: 'custom',
              renderItem: renderItem,
              label: {
                  show: true,
                  formatter:`{@[4]}`,
                  color: '#eee'
              },
              labelLayout:{
                  show:true,
                  position: 'inside',
                  fontSize:14,
                  
              },
              dimensions: ['最小单价', '最大单价', '最小面积','最大面积'],
              encode: {
                  x: [0, 1],
                  y: [2, 3],
                  tooltip: [0, 1, 2,3],
                  itemName: 4
              },
              data: data
          }]
      };
      myChart.setOption(option);
    },
    deleteItem(data){
      console.log(data)
      let index = data.$index
      this.form.splice(index,1)
    },
    newCustomer(){
      this.ani = true
      this.openType="新建"
    },
    redact(){
      this.ani = true
      this.openType="编辑"
      console.log(this.modelInfo)
      this.cityCode = [this.modelInfo.provinceCode,this.modelInfo.cityCode]
      this.logic = this.modelInfo.type
      this.modelName = this.modelInfo.modelName
      this.form = this.modelInfo.itemList
      this.isRedact = true
    },
    getModelList(){
      locationResearch.getModelList().then(res=>{
        this.modelList = res.data.data
      })
    }
  },
  created(){
    this.getCityList()
    this.getModelList()
  }
}
</script>

<style lang="scss" scoped>
.customerModel_wrap{
    height: calc(100% - 60px);
    width: 100%;
    position: fixed;
    top:60px;
    pointer-events: none;
    .mask{
        height: 100%;
        width: 100%;
        position: fixed;
        top:60px;
        left: 0;
        z-index: 999999;
        pointer-events: auto;
    }
    ::v-deep .el-table__body-wrapper{
          &::-webkit-scrollbar{
          background-color: #212e3e !important;
          opacity: 1!important;
          height:10px;
          width: 5px;
        }
        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #02adf7;
            background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
        }
      }
      ::v-deep .el-table__row{
        background: transparent;
      }
      ::v-deep .el-table tr{
        background-color: transparent!important;
      }
      ::v-deep .el-table th{
        background-color: transparent!important;
      }
      ::v-deep .el-table__row>td{
        border: none;
      }
      ::v-deep .el-table::before {
        height: 0px;
      }
      ::v-deep .is-leaf{
        color:white;
        border-color: rgba(255, 255, 255, .3);
      }
      ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: #212e3e !important;
      }
      
    .customerModel_box{
        position: absolute;
        padding: 30px 0 ;
        height: calc(100% - 60px);
        width: 30%;
        left:0;
        top:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
         pointer-events: auto;
        .chooseLand_box{
            height: 40px;
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            ::v-deep .el-input__inner{
                background: transparent;
                color: rgb(252, 191, 73);
                border-color: white;
            }
            .new_btn{
                position: relative;
                color:white;
                font-size:12px;
                padding:8px 16px;
                letter-spacing: 1.5px;
                background: #457fca;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                border-radius: 4px;
                user-select: none;
                cursor: pointer;
                &:active{
                    opacity: 0.7;
                }
            }
        }
        .info_box{
            height: 85%;
            width: 70%;
            background: rgba(47,62,70,.7);
            flex-shrink:1;
            border-radius: 8px;
            padding: 0 5%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .title{
              text-align: center;
              color:white;
              font-size:22px;
              margin-top:16px;
            }
            .region{
              text-align: center;
              color:white;
              font-size:14px;
              margin-top:12px;
            }
            #echarts{
              width:100%;
              height: 40%;
            }
            
            .redact_btn{
              margin-top:10px;
              margin-left:70%;
              width: fit-content;
              border-radius: 8px;
              position: relative;
              color:white;
              font-size:12px;
              padding:8px 16px;
              letter-spacing: 1.5px;
              background: #457fca;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              border-radius: 4px;
              user-select: none;
              cursor: pointer;
              &:active{
                  opacity: 0.7;
              }
            }
        }
        .next_btn{
            margin-left:60%;
            border-radius: 8px;
            position: relative;
            color:white;
            font-size:12px;
            padding:8px 16px;
            letter-spacing: 1.5px;
            background: #457fca;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            border-radius: 4px;
            user-select: none;
            cursor: pointer;
            &:active{
                opacity: 0.7;
            }
        }
    }
    .edit_box{
      position: absolute;
      height: 65%;
      width: 35%;
      left:36%;
      top:15%;
      background: rgba(47,62,70,.8);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: scaleY(0.0);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: auto;
      ::v-deep .el-input__inner{
        background: transparent;
        border: 0;
        border-bottom: 1px solid rgba(255,255,255,.3);
        border-radius: 0px;
        text-align: center;
        color: rgb(252, 191, 73);
       
      }
      .close_box{
            position: absolute;
            right:14px;
            top:10px;
            height:30px;
            width:30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:white;
            &:hover{
                transform: rotate(180deg);
                transition: all 0.3s ease;
            }
            .icon-guanbi{
                margin-top:-11px;
                cursor: pointer;
                font-size:20px;
            }
         }
        .title{
            text-align: center;
            color:white;
            font-size:22px;
            margin-top:22px;
        }
        .select_box{
          margin-top:22px;
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          ::v-deep .el-input__inner{
              background: transparent;
              border:1px solid white;
              border-radius: 4px;
              text-align: left;
            }
          .el-cascader{
            width: 25%;
          }
          .el-select{
            width: 25%;
          }
          .el-input{
            width:25%
          }
        }
        .btn_box{
          display: flex;
          width: 100%;
          justify-content: flex-end;
          margin-top:30px;
          .save_btn{
              border-radius: 8px;
              position: relative;
              color:white;
              font-size:12px;
              padding:8px 20px;
              letter-spacing: 1.5px;
              background: #457fca;  /* fallback for old browsers */
              background: -webkit-linear-gradient(to right, #5691c8, #457fca);  /* Chrome 10-25, Safari 5.1-6 */
              background: linear-gradient(to right, #5691c8, #457fca); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              border-radius: 4px;
              user-select: none;
              cursor: pointer;
              &:active{
                  opacity: 0.7;
              }
          }
          .saveAs_btn{
            border-radius: 8px;
              position: relative;
              color:white;
              font-size:12px;
              padding:8px 16px;
              letter-spacing: 1.5px;
              background: linear-gradient(to right, #F4A261, #F4A261); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
              border-radius: 4px;
              user-select: none;
              cursor: pointer;
              &:active{
                  opacity: 0.7;
              }
          }
        }
    }
    .edit_box_active{
      transform: scaleY(1);
      opacity: 1;
      transition: all 0.3s ease;
    }
}
</style>
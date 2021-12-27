<template>
    <div class="Management_warp">
        <div class="table">
            <el-table
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                height="89%"
                style="width: 100%"
                stripe
                :show-header="true"
                :style="{'width': '100%','background':'#172835'}"
                :row-class-name="tableRowClassName"
                :header-cell-style="{ background: '#0c1015', color: '#c4d0de' }"
                >
                <el-table-column
                type="index"
                width="80"
                align="center"
                header-align="center"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名"
                width="250"
                align="center"
                header-align="center"
                >
                </el-table-column>
                <el-table-column
                prop="department"
                label="所属部门"
                width="250"
                align="center"
                header-align="center"
                sortable>
                </el-table-column>
                <el-table-column
                prop="position"
                label="职位"
                width="250"
                align="center"
                header-align="center"
                sortable>
                </el-table-column>
                <el-table-column
                >
                  <template slot="header">
                    <el-input
                      v-model="search"
                      size="mini"
                      :style="{'width':'150px'}"
                      @input="handleSearch(search)"
                      placeholder="输入员工姓名搜索"
                      clearable/>
                      <el-button type="warning" size="mini" style="margin-left:15px;">添加人员</el-button>
                  </template>
                 <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="success"
                    @click="handleEdit(scope.$index, scope.row)">升职</el-button>
                     <el-button
                     type="primary"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">平调</el-button>
                     <el-button
                    size="mini"
                    type="info"
                    @click="handleEdit(scope.$index, scope.row)">降职</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">解雇</el-button>
                </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
            </el-pagination>
        </div>
    </div>
</template>
<script>

export default {
    name:'management',
    data(){
        return{
        tableData: [{
            department: '数据部',
            name: '张三',
            position: '部门部长'
          }, {
            department: '开发部',
            name: '李四',
            position: '部门副部长'
          }, {
            department: '企业部',
            name: '王五',
            position: '部门组长'
          }, {
            department: '人事部',
            name: '赵六',
            position: '部门部员'
          },{
            department: '数据部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '开发部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '企业部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '人事部',
            name: '王小虎',
            position: '部门部员'
          },{
            department: '数据部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '开发部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '企业部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '人事部',
            name: '王小虎',
            position: '部门部员'
          },{
            department: '数据部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '开发部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '开发部',
            name: '王小虎',
            position: '部门部员'
          }, {
            department: '人事部',
            name: '王小虎',
            position: '部门部员'
          }],
           // 当前页
          currentPage: 1,
          // 每页多少条
          pageSize: 10,
          search:"",
          beforeTableData:[]

        }
       
    },
    mounted(){
      this.beforeTableData = this.tableData
    },
    methods:{
       // 每页多少条
        handleSizeChange(val) {
            this.pageSize = val;
        },
        // 当前页
        handleCurrentChange(val) {
            this.currentPage = val;
        },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      tableRowClassName({ rowIndex }) {
        if (rowIndex % 2 === 0) {
          return "row2";
        } else if (rowIndex % 2 === 1) {
          return "row1";
        }
        return "";
      },
      handleSearch(search){
        let data = this.beforeTableData;
        let searchedData = []
        data.forEach(item=>{
          if(item.name.indexOf(search) !== -1){
            searchedData.push(item)
          }else{
            this.tableData = []
          }
        })
        console.log(searchedData)
        this.tableData = searchedData
      }
    },
}
</script>
<style lang="scss">
.Management_warp{
    height:100%;
    width: 100%;
    position: absolute;
    bottom: 0;
    top:51px;
    background:#1A1F23;
    .table{
        margin-top:5%;
        height:70%;
        width:90%;
        margin-left:5%;
        overflow-y: scroll;
        background:#172835;
        border:1px solid white;
        .el-table__body-wrapper{
          background:#172835!important;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td {
           background: #0c121b;
        }
       .el-table .row1 {
        background: #0c121b;
      } 

      .el-table .row2 {
        background: #14202d;
      }
            .el-table{
        background: #0c1015;
      }
      .el-table .row1 {
        background: #0c121b;
      }

      .el-table .row2 {
        background: #14202d;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
        color: rgb(35, 41, 51) !important;
        font-weight: bold !important;
        background: white!important;
      }
      .el-table__body-wrapper {
        background: #0c1015;
      }
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #263950;
        color: #c4d0de;
      }
      .el-table--border{
        border: none;
      }
      .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        width: 0;
        border: none;
      }
    }
    .el-pagination{
      float:right;
      margin-top:20px;
      color:white;
      .el-pagination__total{
        color:white;
      }
      .el-input__inner,.btn-prev,.btn-next{
        background: #172835;
        color:white
      }
      .el-pager{
        .number{
          color:white;
          background: #172835;
        }
        .active{
          color:#409EFF;
        }
      }
      .el-pagination__jump{
        color:white;
      }
    }
}
</style>
<template>
  <div class="ledger">
    <!-- 土地新增按钮 -->
    <div class="creatland_btns" v-if="false" :style="{right:showCreat?'20px':'-100px'}">
      <div class="centered">
        <el-tooltip class="item" effect="light" content="新建土地" placement="top-start">
          <div :class="['plus',creatlandMenu?'plus--active':'']" @click="creatNewLand()">
            <div class="plus__line plus__line--v"></div>
            <div class="plus__line plus__line--h"></div>
          </div>
        </el-tooltip>
      </div>
    </div>
    <el-button class="tocreat_btn" v-if="tocreatShow" type="primary" size="small" @click="changeToCreat()">{{modifyMode?'切换到更新':'切换到新建'}}</el-button>
    <!-- 土地列表 -->
    <div class="ledger_box" v-loading="landLoading||delLoading||expLoading" :element-loading-text="landLoading?'加载中':delLoading?'删除中':'操作中'"
      element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
      :style="{'left':showLandList?'80px':'-'+sidebarW+'px','width':sidebarW+'px'}">
      <div class="handle" @mousedown="changeSidebar"></div>
      <i :class="['list_btn',showLandList?'el-icon-s-fold':'el-icon-s-unfold']" :style="{right:showLandList?'-25px':'-105px'}" @click="showLandList = !showLandList"></i>
      <!-- 文件夹下添加文件夹 -->
      <div class="add_folder" v-show="showAddFolder">
        <i class="addicon el-icon-error" @click="showAddFolder = false,curAddFloder = null"></i>
        <div style="font-size:12px;margin-bottom:8px;">在文件夹 {{curAddFloder?curAddFloder.name:''}} 下创建:</div>
        <el-input v-model="groupName" placeholder="文件夹名称" size="mini" style="width:120px;"></el-input>
        <el-button type="primary" size="mini" style="margin-left:10px" @click="addFolder()">创建</el-button>
      </div>
      <!-- 文件夹下添加文件夹 -->
      <div class="rename_folder" v-show="showReFolder">
        <i class="addicon el-icon-error" @click="showReFolder = false,curAddFloder = null"></i>
        <div style="font-size:12px;margin-bottom:8px;">修改文件夹 {{curAddFloder?curAddFloder.name:''}} 为:</div>
        <el-input v-model="groupNewName" placeholder="文件夹新名称" size="mini" style="width:120px;"></el-input>
        <el-button type="primary" size="mini" style="margin-left:10px" @click="renameFolder()">修改</el-button>
      </div>
      <!-- 土地添加导入目标文件夹 -->
      <div class="self_tree" v-show="tofolderState">
        <i class="addicon el-icon-error" @click="tofolderState = false,toselfState = false, curAddToFloder = '',selectTreeName = ''"></i>
        <div style="font-size:12px;margin-bottom:8px;">将土地-{{curAddLandName}} 添加到文件夹：</div>
        <el-select size="mini" style="width:120px" v-model="selectTreeName" placeholder="请选择文件夹" clearable @clear="clearCurFolder">
          <el-option :value="curAddToFloder" style="height: auto" >
            <el-tree style="background:none;" ref="tree" :data="selfLandTree" node-key="id" :props="defaultProps"
              @node-click="handleNodeClick" />
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" style="margin-left:10px" @click="addToFolder()">添加</el-button>
        <div class="tip">Tip:若不选择文件夹，将添加到根目录下</div>
      </div>
      <div class="ledger_boxwrap">
        <div class="common_tool">
          <!-- 公共工具 -->
          <div class="list_top">
            <div class="logo_name">
              <!-- <img class="logo" src="@/assets/img/login/logo1.png" alt=""> -->
              <!-- <div class="name">投资云地图</div> -->
            </div>
            <div class="top_btns">
              <!-- 土地分组 -->
              <el-tooltip v-if="curListTab==='self'" class="item" effect="light" content="土地分组" placement="bottom-start">
                <i v-if="curListTab==='self'" class="group_btn iconfont icon-fenzu" @click="setLandGroup()" :style="{color:showGroupBtn?'#fff800':'#00c4ff'}"></i>
              </el-tooltip>
              <!-- 批量删除 -->
              <el-tooltip v-if="curListTab==='self'" class="item" effect="light" content="批量删除" placement="bottom-start">
                <i v-if="curListTab==='self'" class="bdelete_btn iconfont icon-piliangshanchu" @click="setLandDelete()" :style="{color:showDeleteBtn?'#fff800':'#00c4ff'}"></i>
              </el-tooltip>
              <!-- 官方导出为csv -->
              <el-tooltip v-if="curListTab==='gov'&&isSuperUser" class="item" effect="light" content="导出为csv文件" placement="bottom-start">
                <i v-if="curListTab==='gov'&&isSuperUser" class="csvexp_btn iconfont icon-csvexport" @click="setCsvXeport()" :style="{color:showCsvexpBtn?'#fff800':'#00c4ff'}"></i>
              </el-tooltip>
              <!-- 转为个人土地 -->
              <el-tooltip v-if="curListTab==='gov'" class="item" effect="light" content="转为个人土地" placement="bottom-start">
                <i v-if="curListTab==='gov'" class="toself_btn iconfont icon-fuzhi" @click="setLandToself()" :style="{color:showToselfBtn?'#fff800':'#00c4ff'}"></i>
              </el-tooltip>
              <!-- 导出土地 -->
              <el-tooltip class="item" effect="light" content="批量导出" placement="bottom-start">
                <i class="bexport_btn iconfont icon-daochu" @click="setLandExport()" :style="{color:showExportBtn?'#fff800':'#00c4ff'}"></i>
              </el-tooltip>
              <!-- 分享土地 -->
              <el-tooltip v-if="curListTab==='self'" class="item" effect="light" content="分享土地" placement="bottom-start">
                <i v-if="curListTab==='self'" class="share_btn iconfont icon-fenxiang" @click="shareLands()" :style="{color:showShareBtn?'#fff800':'#00c4ff'}"></i>
              </el-tooltip>
              <!-- 土地筛选 -->
              <el-popover ref="filterPover" placement="right" width="640">
                <div class="filter_box">
                  <!-- 土地搜索 -->
                  <el-divider content-position="left">编号/名称/公告号/土地标签/竞拍规则</el-divider>
                  <div class="land_search">
                    <div style="width:35%">
                      <el-input class="search_input" size="small" v-model="searchVal" placeholder="请输入编号/名称/公告号" clearable></el-input>
                    </div>
                    <div style="margin-left:10px;">
                      <el-select size="small" v-model="serchLandLabels" multiple collapse-tags placeholder="土地标签">
                        <el-option
                          v-for="item in landLabelArr"
                          :key="item.id"
                          :label="item.label"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                    <div style="margin-left:10px;">
                      <el-select size="small" v-model="selectRules" multiple collapse-tags placeholder="竞拍规则">
                        <el-option
                          v-for="item in biddingRules"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <!-- 区域筛选 -->
                  <el-divider content-position="left">区(市)县筛选</el-divider>
                  <div style="margin-bottom:10px;display:flex;">
                    <el-select size="small" style="width:30%;" v-model="regionCheck" placeholder="区(市)县" 
                    @change="regionChange" multiple collapse-tags clearable filterable>
                      <el-checkbox style="margin-left:20px;margin-top:6px;" :indeterminate="regionIsAll" v-model="regionAll" @change="regionAllChange">全选</el-checkbox>
                      <el-option-group v-for="group in regionArr" :key="group.label" :label="group.label">
                        <el-option
                          v-for="item in group.options" :key="item.value"
                          :label="item.label" :value="item.value">
                        </el-option>
                      </el-option-group>
                    </el-select>
                    <!-- 板块 -->
                    <el-select size="small" disabled style="width:30%;margin-left:10px;" v-model="filterPart" placeholder="板块" multiple collapse-tags clearable filterable>
                      <el-option-group v-for="group in partArr" :key="group.label" :label="group.label">
                        <el-option
                          v-for="item in group.options" :key="item.value"
                          :label="item.label" :value="item.value">
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </div>
                  <!-- 土地状态 -->
                  <el-divider content-position="left">土地状态</el-divider>
                  <el-checkbox :indeterminate="landTypeIsAll" v-model="landTypeAll" @change="landTypeAllChange">全选</el-checkbox>
                  <div style="margin: 10px 0;"></div>
                  <el-checkbox-group v-model="landTypeCheck" @change="landTypeChange">
                    <el-checkbox v-for="item in landTypeArr" :label="item.value" :key="item.value" v-show="item.value!=='supply_cls'">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                  <!-- 土地性质 -->
                  <el-divider content-position="left">土地性质</el-divider>
                  <el-checkbox :indeterminate="landUseIsAll" v-model="landUseAll" @change="landUseAllChange">全选</el-checkbox>
                  <div style="margin: 10px 0;"></div>
                  <el-checkbox-group v-model="landUseCheck" @change="landUseChange">
                    <el-checkbox v-for="item in landUseArr" :label="item.value" :key="item.value">{{item.label}}
                      <label class="filter_label" :style="{background:convertLandUseColor(item.value)}"></label>
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- 时间范围 -->
                  <el-divider content-position="left">时间范围</el-divider>
                  <div class="block" style="margin-bottom:10px;">
                    <span class="demonstration" style="margin-right:10px;">公告时间</span>
                    <el-date-picker
                      v-model="annoTimeRange"
                      size="small"
                      type="daterange"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      @change="annoTimeChange">
                    </el-date-picker>
                  </div>
                  <div class="block">
                    <span class="demonstration" style="margin-right:10px;">成交时间</span>
                    <el-date-picker
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
                  <!-- 区间范围 -->
                  <el-divider content-position="left">区间范围</el-divider>
                  <div class="filter_range">
                    <div class="filter_item">
                      <div class="name">占地面积</div>
                      <el-input type="number" placeholder="" v-model="landAreaS" size="mini" style="width:70px;"></el-input>
                      <label class="unit">-</label>
                      <el-input type="number" placeholder="" v-model="landAreaE" size="mini" style="width:70px;"></el-input>
                      <label class="unit">亩</label>
                    </div>
                    <div class="filter_item">
                      <div class="name">亩价筛选</div>
                      <el-input type="number" placeholder="" :min="0" v-model="tradePriceS" size="mini" style="width:70px;"></el-input>
                      <label class="unit">-</label>
                      <el-input type="number" placeholder="" :min="0" v-model="tradePriceE" size="mini" style="width:70px;"></el-input>
                      <label class="unit">万元/亩</label>
                    </div>
                    <div class="filter_item">
                      <div class="name">总价筛选</div>
                      <el-input type="number" placeholder="" :min="0" v-model="totalPriceS" size="mini" style="width:70px;"></el-input>
                      <label class="unit">-</label>
                      <el-input type="number" placeholder="" :min="0" v-model="totalPriceE" size="mini" style="width:70px;"></el-input>
                      <label class="unit">万元</label>
                    </div>
                    <div class="filter_item">
                      <div class="name">楼面价</div>
                      <el-input type="number" placeholder="" :min="0" v-model="priceS" size="mini" style="width:70px;"></el-input>
                      <label class="unit">-</label>
                      <el-input type="number" placeholder="" :min="0" v-model="priceE" size="mini" style="width:70px;"></el-input>
                      <label class="unit">元/㎡</label>
                    </div>
                  </div>
                  <div style="margin: 10px 0;width:100%;height:1px;border-bottom:#e9e9e9 1px solid;"></div>
                  <div class="search_box">
                    <div>
                      <el-popover placement="top" width="300" trigger="click">
                        <div style="margin-bottom:10px;"><i class="el-icon-info" style="margin-right:10px;color:#e6a23c;"></i>请先选择选框方式</div>
                        <div class="enclosure_box">
                          <el-button type="primary" size="small" @click="setEnclosure('custom')">自定义围栏</el-button>
                          <el-input type="number" placeholder="0-15Km" :min="0" :max="15" v-model="circleRadius" size="small" style="width:170px;margin-left:20px;">
                            <el-button size="small" type="primary" slot="append" @click="setEnclosure('circle')">半径圈</el-button>
                          </el-input>
                        </div>
                        <el-button slot="reference" type="warning" size="small">地图框选</el-button>
                      </el-popover>
                      <el-button v-if="filterCoords!==null" type="default" size="small" @click="delEnclosure()" style="margin-left:15px;">删除选框</el-button>
                    </div>
                    <div>
                      <el-button type="default" size="small" @click="resetFilter()" style="margin-right:10px;">重置</el-button>
                      <el-button type="primary" size="small" @click="filterLand()" :disabled="serchLoading" :loading="serchLoading">{{serchLoading?'筛选中':'筛选土地'}}</el-button>
                    </div>
                  </div>
                </div>
                <el-tooltip slot="reference" class="item" effect="light" content="土地搜索" placement="bottom-start">
                  <i class="filter_btn iconfont icon-shaixuan"></i>
                </el-tooltip>
              </el-popover>
            </div>
          </div>
        </div>
        <el-tabs class="list_tab" v-model="curListTab" @tab-click="item => changeLandType(item,false)">
          <el-tab-pane name="self">
            <span slot="label"><i class="el-icon-user"></i> 个人</span>
          </el-tab-pane>
          <el-tab-pane name="gov">
            <span slot="label"><i class="el-icon-location-information"></i> 公共</span>
          </el-tab-pane>
          <el-tab-pane name="friend">
            <span slot="label"><i class="el-icon-connection"></i> 好友</span>
          </el-tab-pane>
        </el-tabs>
        <div class="land_map">
          <div class="opt_box">
            <!-- 分组信息 -->
            <div class="ledger_btn" v-if="showGroupBtn">
              <div class="btn_wrap">
                <div class="create_radio">
                  <el-radio v-model="createModel" label="create">创建文件夹</el-radio>
                  <el-radio v-model="createModel" label="addto">添加到文件夹</el-radio>
                </div>
                <el-input class="gname" v-if="createModel=='create'" v-model="groupName" v-show="showGroupBtn" placeholder="文件夹名称(不可重复)" size="mini"></el-input>
                <el-select class="gname" v-if="createModel=='addto'" size="mini" v-model="selectTreeName" placeholder="请选择文件夹" clearable @clear="clearCurFolder">
                  <el-option :value="curAddToFloder" style="height: auto" >
                    <el-tree style="background:none;" ref="tree" :data="selfLandTree" node-key="id" :props="defaultProps" @node-click="handleNodeClick" />
                  </el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="createAddGroup()">确认</el-button>
                <el-button type="default" size="mini" v-show="showGroupBtn" @click="cancelGroup()">取消</el-button>
              </div> 
            </div>
            <!-- 批量删除 -->
            <div class="ledger_btn" v-if="showDeleteBtn" style="justify-content:space-between">
              <el-checkbox v-model="checkAllLand" @change="handleCheckAllLand" style="color:#fff;">全选本页</el-checkbox>
              <el-popover
                placement="top"
                width="200"
                v-model="deleteTip">
                <p>是否删除勾选的土地？</p>
                <p class="tip"><i class="el-icon-warning" style="color:red;"></i> 注意：该操作将删除选择的所有数据，无法恢复，请谨慎操作</p> 
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="deleteTip = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteCheckLand()">确认删除</el-button>
                </div>
                <el-button slot="reference" type="primary" size="mini">删除所选</el-button>
              </el-popover>
            </div>
            <!-- 批量导出 -->
            <div class="ledger_btn" v-if="showExportBtn" style="justify-content:space-between;">
              <el-checkbox v-model="checkAllLand" @change="handleCheckAllLand" style="color:#fff;">全选本页</el-checkbox>
              <el-popover
                placement="top"
                width="300"
                v-model="deleteTip">
                <div>
                  <p>是否导出勾选的土地？</p>
                  <div class="tip">Tips：1、不包含点线数据；
                    <span v-if="!isAdmin">2、公共土地每日导出限制100条，个人土地每日导出限制200条；</span>
                    <span v-else>2、管理员公共土地每日导出限制1000条；</span>
                  </div>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="deleteTip = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="exportCheckLand()">确认导出</el-button>
                </div>
                <el-button slot="reference" type="danger" size="mini">导出所选</el-button>
              </el-popover>
            </div>
          </div>
          <!-- 导出为csv -->
          <div class="ledger_btn" v-if="showCsvexpBtn" style="justify-content:space-between;">
            <el-checkbox v-model="checkAllLand" @change="handleCheckAllLand" style="color:#fff;">全选本页</el-checkbox>
            <el-popover
              placement="top"
              width="160"
              v-model="deleteTip">
              <div>
                <p>是否将选择的文件导出为csv文件？</p>
                <div class="tip"></div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteTip = false">取消</el-button>
                <el-button type="primary" size="mini" @click="exportCsvExport()">确认导出</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini">导出所选</el-button>
            </el-popover>
          </div>
          <!-- 批量转为个人 -->
          <div class="ledger_btn" v-if="showToselfBtn" style="justify-content:space-between;">
            <el-checkbox v-model="checkAllLand" @change="handleCheckAllLand" style="color:#fff;">全选本页</el-checkbox>
            <el-popover
              placement="top"
              width="300"
              v-model="deleteTip">
              <div>
                <p>选择要添加到个人的文件夹：</p>
                <el-select size="mini" v-model="selectTreeName" placeholder="请选择文件夹" clearable @clear="clearCurFolder">
                  <el-option :value="curAddToFloder" style="height: auto" >
                    <el-tree style="background:none;" ref="tree" :data="selfLandTree" node-key="id" :props="defaultProps"
                      @node-click="handleNodeClick" />
                  </el-option>
                </el-select>
                <div class="tip">Tips：1、添加到个人的公共土地修改后将转为个人土地；2、若不选择文件夹将添加到个人根目录；3、活动期间：每天可转到个人1000条，每次100条；非活动期间：每天可转到个人200条，每次50条；</div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteTip = false">取消</el-button>
                <el-button type="primary" size="mini" @click="toselfCheckLand()">确认添加</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" @click="getSelfTree()">添加所选</el-button>
            </el-popover>
          </div>
          <!-- 批量分享 -->
          <div class="ledger_btn" v-if="showShareBtn" :style="{'justify-content':isAdmin?'space-between':'flex-end'}">
            <el-checkbox v-model="checkAllLand" @change="handleCheckAllLand" style="color:#fff;" v-if="isAdmin">全选本页</el-checkbox>
            <el-popover
              placement="top"
              v-model="shareTip">
              <div style="margin-bottom:10px;">请选择要分享的在线好友：</div>
              <el-select size="small" v-model="shareFriendId" filterable placeholder="选择在线的好友分享">
                <el-option
                  v-for="item in friendList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.online==='0'">
                </el-option>
              </el-select>
              <div style="text-align: right; margin-top: 10px;">
                <el-button size="mini" type="text" @click="shareTip = false">取消</el-button>
                <el-button type="primary" size="mini" @click="shareLandToFriend()">确认</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" @click="getFirendsList()">分享所选</el-button>
            </el-popover>
          </div>
          <!-- 土地列表 -->
          <div class="ledger_wrap">
            <div class="search_tip" v-show="isSearch">
              搜索结果(点击"X"号返回上级土地列表)：
              <i class="clsoeicon el-icon-circle-close" @click="backLandList()"></i>  
            </div>
            <!-- 全选显示隐藏土地 -->
            <div class="cbox">
              <el-checkbox v-show="!showGroupBtn&&!showDeleteBtn&&!showExportBtn&&!showToselfBtn&&!showCsvexpBtn&&!showShareBtn" v-model="showLandAll" @change="checkShowAllLand">{{showLandAll?'显示全部':'隐藏全部'}}</el-checkbox>
            </div>
            <!-- 土地列表树 -->
            <div class="lands_tree">
              <!-- :filter-node-method="filterLandNode" -->
              <el-tree 
              ref="landTree" id="list_tree" :height="landListHeight" highlight-current :data="landsGroup" 
              :props="landTreeProps" :load="loadNode" lazy show-checkbox
              :default-expanded-keys="landExpanded"
              :default-checked-keys="landDefault" node-key="id" 
              @node-expand="groupExpand" @node-collapse="groupCollapse"
              @check="setCheckLand">
                <div class="land_solt" slot-scope="{ data }" @click="showLand(data.center,data.id,data.kind)" :id="data.id">
                  <i v-if="data.leaf=='2'" :class="['ticon iconfont',data.kind=='POLYGON'?'icon-mian':data.kind=='LINE'?'icon-xian':'icon-dian']"></i>
                  <div class="land_state" v-if="data.state" :style="{background:convertLandUseColor(data.purpose),border:convertBorder(data.purpose,data.state),color:!data.purpose||data.purpose===''||data.purpose===null?'#fff':'#000'}">{{convertLandTypeText(data.state)}}</div>
                  
                  <i v-if="data.leaf!=='2'" :class="['gicon', (landExpanded.indexOf(data.id)!==-1)?'el-icon-folder-opened':'el-icon-folder']"></i>
                  <div class="land_name" :style="{color:data.center===null?'#dedbdb':'#99faff'}" @click="showLandInfo(data)">{{ data.lands?data.name:data.recordName?data.recordName:data.buildingName?data.buildingName:data.nickName?data.nickName:data.landNumber?data.landNumber:data.name}}</div>
                  <div class="land_num" v-if="data.leaf!=='2'">{{data.num}}</div>
                  <!-- 分组操作 -->
                  <div class="land_btn" v-if="data.leaf!=='2'&&data.isself">
                    <el-tooltip class="item" effect="light" content="该文件夹下新建" placement="top-start">
                      <el-button size="mini" type="primary" icon="el-icon-circle-plus" circle @click.stop="setAddFolder(data)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="修改文件夹名" placement="top-start">
                      <el-button size="mini" type="success" icon="el-icon-s-order" circle @click.stop="setReFolder(data)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="删除文件夹" placement="top-start">
                      <el-button size="mini" type="warning" icon="el-icon-error" circle @click.stop="relieveGroup(data.id,data.name)"></el-button>
                    </el-tooltip>
                  </div>
                  <!-- 土地操作 -->
                  <div class="land_btn" v-else>
                    <div class="my_btn" v-if="data.isself">
                      <!-- 修改 -->
                      <el-tooltip class="item" effect="light" content="修改" placement="top-start">
                        <el-button size="mini" type="primary" icon="el-icon-edit" circle @click.stop="modifyLand(data)"></el-button>
                      </el-tooltip>
                      <!-- 删除 -->
                      <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                        <el-button size="mini" type="danger" icon="el-icon-delete" circle @click.stop="deleteLand(data)"></el-button>
                      </el-tooltip>
                      <!-- 移出文件夹 -->
                      <!-- <el-tooltip class="item" effect="light" content="移出" placement="top-start">
                        <el-button size="mini" type="warning" icon="el-icon-s-release" circle @click.stop="removeLand(data)" v-if="data.pid!=='0'"></el-button>
                      </el-tooltip> -->
                      <!-- 添加到文件夹 -->
                      <el-tooltip class="item" effect="light" content="切换文件夹" placement="top-start">
                        <el-button size="mini" type="success" icon="el-icon-sort" circle @click.stop="setAddInfo(data,'addtofolder')"></el-button>
                      </el-tooltip>
                    </div>
                    <!-- 添加为自己的土地(从公共地图中) -->
                    <!-- <el-button v-if="data.leaf==='2'&&!data.isself" size="mini" type="success" icon="el-icon-money" circle @click.stop="setAddInfo(data,'addtoself')"></el-button> -->
                  </div>
                  <img class="hot_img" v-if="data.state==='supply_cls'" src="../../../assets/img/home/hot.png" style="width:40px;" />
                </div>
              </el-tree>
            </div>
            <!-- 分页 -->
            <div class="page_box" v-if="false" :style="{'bottom':showPageList?'10px':'-100px'}">
              <div class="parge_wrap">
                <el-pagination
                  small
                  @size-change="listSizeChange"
                  @current-change="curPageChange"
                  :current-page="landCurPage"
                  :page-sizes="[50, 100, 150, 200]"
                  :page-size="landPageNum"
                  :total="landListNum"
                  layout="sizes, prev, pager, next, jumper">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建土地信息 -->
    <div class="upload_info" ref="uploadBox" v-show="uploadShow" :style="{left:positionX+'px',top:positionY+'px'}">
      <div class="detailInfo">
        <div class="info_head" @mousedown="move">
          <h4 class="info_title">新建土地信息</h4>
          <div class="btns_box">
            <el-button size="small" @click="changeToMap()">切换到地图</el-button>
            <el-button size="small" @click="creatCancel()" style="margin-right:20px;">{{modifyMode?'取消更新':'取消创建'}}</el-button>
            <el-button size="small" @click="resetData()">重置</el-button>
            <el-button size="small" type="primary" @click="creatUpdataLand()" :loading="creatLoading">{{modifyMode?'更新土地':'创建土地'}}</el-button>
          </div>
        </div>
        <div class="parInfoForm">
          <!-- 土地信息表单 -->
          <el-form ref="landinfosEdit" :rules="landinfoRules" :model="landInfos" label-width="130px">
            <!-- 土地状态、轮廓位置 -->
            <div class="info_item4" style="margin-top:10px;">
              <el-form-item label="权限设置" prop="isOpen" v-if="isAdmin">
                <el-select v-model="landInfos.isOpen" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in landJurArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="宗地位置" prop="address">
                <div class="" style="display:flex;align-items:center">
                  <el-input size="small" placeholder="" v-model="landInfos.address"></el-input>
                  <i class="resite el-icon-place" @click="chooseParPosition()"></i>
                </div>
              </el-form-item>
              <el-form-item label="土地轮廓" style="width:50%;">
                <div class="btns">
                  <el-button v-if="landCoordinates==null" size="small" @click="drawPolygon" type="primary" plain>点击绘制</el-button>
                  <el-button v-else size="small" @click="repaintLand(landFeatureID)">重绘</el-button>
                  <el-button v-if="modifyMode" size="small" @click="modifyLandOutline(landFeatureID)">修改</el-button>
                  <el-popover placement="right" trigger="click">
                    <div class="colors">
                      <div class="item">
                        <span class="label">填充</span>
                        <el-color-picker size="mini" v-model="landInfos.fillColor"></el-color-picker>
                        <span class="label">透明度</span>
                        <el-input size="mini" style="width:100px;" placeholder="0~1" v-model="landInfos.fillHy" type="number" :step="0.01" :min="0" :max="1"></el-input>
                      </div>
                      <div class="item">
                        <span class="label">描边</span>
                        <el-color-picker size="mini" v-model="landInfos.lineColor"></el-color-picker>
                        <span class="label">透明度</span>
                        <el-input size="mini" style="width:100px;" placeholder="0~1" v-model="landInfos.lineHy" type="number" :step="0.01" :min="0" :max="1"></el-input>
                      </div>
                      <div class="item">
                        <span class="label">线宽</span>
                        <el-input size="mini" style="width:100px;" placeholder="0~5" v-model="landInfos.lineWidth" type="number" :step="0.1" :min="0" :max="5"></el-input>
                      </div>
                      <div class="item">
                        <i class="el-icon-info" style="color:#E6A23C;margin-right:10px;"></i>
                        <span>若不设置，图层样式将按照默认渲染</span>
                      </div>
                    </div>
                    <el-button slot="reference" size="small" type="default" style="margin-left:10px;">样式</el-button>
                  </el-popover>
                </div>
              </el-form-item>
            </div>
            <!-- 土地基础信息 -->
            <el-divider content-position="left">土地基础信息</el-divider>
            <div class="info_item">
              <el-form-item label="土地状态" prop="state">
                <el-select v-model="landInfos.state" placeholder="请选择" @change="landStateChange" size="small">
                  <el-option
                    v-for="item in landTypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="收费航拍链接" prop="chargeFlylink">
                <el-input size="small" placeholder="" v-model="landInfos.chargeFlylink"></el-input>
              </el-form-item>
              <el-form-item label="免费航拍链接" prop="landAerial">
                <el-input size="small" placeholder="" v-model="landInfos.landAerial"></el-input>
              </el-form-item>
              <el-form-item label="公告网址" prop="noticeWebsite">
                <el-input size="small" placeholder="" v-model="landInfos.noticeWebsite"></el-input>
              </el-form-item>
              <el-form-item label="公告号" prop="annoId">
                <el-input size="small" placeholder="" v-model="landInfos.annoId"></el-input>
              </el-form-item>
              <el-form-item label="宗地编号" prop="landNumber">
                <el-input size="small" placeholder="" v-model="landInfos.landNumber"></el-input>
              </el-form-item>
              <el-form-item label="宗地名称" prop="parcelLocation">
                <el-input size="small" placeholder="" v-model="landInfos.parcelLocation"></el-input>
              </el-form-item>
              <!-- <el-form-item label="公告时间" prop="annoTime">
                <el-date-picker size="small" type="date" placeholder="选择时间" v-model="landInfos.annoTime" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item> -->
              <el-form-item label="区(市)县" prop="regionno">
                <el-select size="small" v-model="landInfos.regionno" :placeholder="regionArr.length==0?'请先选择城市':'请选择城区'" clearable filterable>
                  <el-option-group
                    v-for="group in regionArr"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="环域" prop="torus">
                <el-input size="small" placeholder="" v-model="landInfos.torus"></el-input>
              </el-form-item>
              <el-form-item label="板块" prop="partname">
                <el-input size="small" placeholder="" v-model="landInfos.partname"></el-input>
              </el-form-item>
              <el-form-item label="出让面积" prop="landArea1">
                <el-input size="small" type="number" placeholder="㎡" v-model="landInfos.landArea1" @input="val=>unitConverse('landArea1',val)"></el-input>
              </el-form-item>
              <el-form-item label="出让面积" prop="landArea">
                <el-input size="small" type="number" placeholder="亩" v-model="landInfos.landArea" @input="val=>unitConverse('landArea',val)"></el-input>
              </el-form-item>
              <el-form-item label="用地性质" prop="purpose">
                <el-select size="small" v-model="landInfos.purpose" placeholder="用地性质">
                  <el-option 
                  v-for="type in landUseArr" 
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="规划用途" prop="landNature">
                <el-input size="small" placeholder="" v-model="landInfos.landNature"></el-input>
              </el-form-item>
              <el-form-item label="使用年限" prop="userYears">
                <el-input size="small" placeholder="" v-model="landInfos.userYears"></el-input>
              </el-form-item>
              <el-form-item label="容积率" prop="ratio">
                <el-input size="small" placeholder="" v-model="landInfos.ratio"></el-input>
              </el-form-item>
              <el-form-item label="计算容积率" prop="volumeRatio">
                <el-input size="small" type="number" :step="0.1" placeholder="" v-model="landInfos.volumeRatio" @input="getBusinessArea"></el-input>
              </el-form-item>
              <el-form-item label="计算建筑面积" prop="buildArea">
                <el-input size="small" type="number" placeholder="㎡" v-model="landInfos.buildArea"></el-input>
              </el-form-item>
              <el-form-item label="商占比" prop="rcScale">
                <el-input size="small" placeholder="" v-model="landInfos.rcScale"></el-input>
              </el-form-item>
              <el-form-item label="商业建筑面积" prop="businessArea">
                <el-input size="small" type="number" placeholder="㎡" v-model="landInfos.businessArea"></el-input>
              </el-form-item>
              <el-form-item label="建筑密度" prop="buildingDensity">
                <el-input size="small" placeholder="" v-model="landInfos.buildingDensity"></el-input>
              </el-form-item>
              <el-form-item label="绿地率" prop="greenRate">
                <el-input size="small" placeholder="" v-model="landInfos.greenRate"></el-input>
              </el-form-item>
              <el-form-item label="建筑高度" prop="buildingHeight">
                <el-input size="small" placeholder="米" v-model="landInfos.buildingHeight"></el-input>
              </el-form-item>
              <el-form-item label="土地标签" prop="labels">
                <el-select size="small" v-model="landInfos.labels" multiple collapse-tags placeholder="请选择">
                  <el-option
                    v-for="item in landLabelArr"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remarks" style="width:96%">
                <el-input size="small" :rows="4" placeholder="" type="textarea" v-model="landInfos.remarks"></el-input>
              </el-form-item>
            </div>
            <!-- 土地出让信息 -->
            <el-divider content-position="left">土地出让信息</el-divider>
            <div class="info_item">
            <el-form-item label="出让方式" prop="sellType">
              <el-select size="small" v-model="landInfos.sellType" placeholder="请选择">
                <el-option 
                v-for="type in sellTypeArr" 
                :key="type.value"
                :label="type.label"
                :value="type.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="拍卖规则" prop="auctionRules">
              <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.auctionRules"></el-input>
            </el-form-item>
            <el-form-item label="产业条件" prop="industryConditions">
              <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.industryConditions"></el-input>
            </el-form-item>
            <el-form-item label="配建/自持/无偿移交" prop="otherInfo" class="fold_label">
              <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.otherInfo"></el-input>
            </el-form-item>
            <el-form-item label="预售要求" prop="presaleRe">
              <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.presaleRe"></el-input>
            </el-form-item>
            <el-form-item label="装修要求" prop="decorationRe">
              <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.decorationRe"></el-input>
            </el-form-item>
            <el-form-item label="新房限价" prop="fixedPrice">
              <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.fixedPrice"></el-input>
            </el-form-item>
            <el-form-item label="公告时间" prop="annoTime">
              <el-date-picker size="small" type="date" placeholder="选择时间" v-model="landInfos.annoTime" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="竞买保证金" prop="bond">
              <el-input size="small" placeholder="万元" v-model="landInfos.bond"></el-input>
            </el-form-item>
            <el-form-item label="是否有底价" prop="haveFloorprice">
              <el-input size="small" placeholder="" v-model="landInfos.haveFloorprice"></el-input>
            </el-form-item>
            <el-form-item label="起始总价" prop="startTotalPrice">
              <el-input size="small" type="number" placeholder="万元" v-model="landInfos.startTotalPrice"></el-input>
            </el-form-item>
            <el-form-item label="起始楼面地价" prop="startFloorPrice">
              <el-input size="small" type="number" placeholder="元/㎡" v-model="landInfos.startFloorPrice"></el-input>
            </el-form-item>
            <el-form-item label="起始单价" prop="startPrice">
              <el-input size="small" type="number" placeholder="万元/亩" v-model="landInfos.startPrice"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="sellRemark" style="width:96%">
              <el-input size="small" :rows="4" placeholder="" type="textarea" v-model="landInfos.sellRemark"></el-input>
            </el-form-item>
            </div>
            <!-- 土地成交信息 -->
            <el-divider content-position="left">土地成交信息</el-divider>
            <div class="info_item">
              <!-- <el-form-item label="交易状态" prop="tradingStatus">
                <el-select size="small" v-model="landInfos.tradingStatus" placeholder="请选择">
                  <el-option 
                  v-for="type in dealState" 
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="交易时间" prop="date">
                <el-date-picker size="small" type="date" placeholder="选择时间" v-model="landInfos.date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="成交总价" prop="totalPrice">
                <el-input size="small" type="number" placeholder="万元" v-model="landInfos.totalPrice"></el-input>
              </el-form-item>
              <el-form-item label="成交楼面价" prop="price">
                <el-input size="small" type="number" placeholder="元/㎡" v-model="landInfos.price"></el-input>
              </el-form-item>
              <el-form-item label="成交单价" prop="tradePrice">
                <el-input size="small" type="number" placeholder="万元/亩" v-model="landInfos.tradePrice"></el-input>
              </el-form-item>
              <el-form-item label="溢价率" prop="premiumRatio">
                <el-input size="small" type="number" placeholder="填写小数" v-model="landInfos.premiumRatio"></el-input>
              </el-form-item>
              <el-form-item label="竞配建" prop="comConstruction">
                <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.comConstruction"></el-input>
              </el-form-item>
              <el-form-item label="竞无偿移交" prop="comFreetransfer">
                <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.comFreetransfer"></el-input>
              </el-form-item>
              <el-form-item label="竞自持" prop="comSelfsupport">
                <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.comSelfsupport"></el-input>
              </el-form-item>
              <el-form-item label="实际楼面价" prop="actualFloorPrice">
                <el-input size="small" type="number" placeholder="元/㎡" v-model="landInfos.actualFloorPrice"></el-input>
              </el-form-item>
              <el-form-item label="竞得者" prop="competeCompany">
                <el-input size="small" placeholder="" v-model="landInfos.competeCompany"></el-input>
              </el-form-item>
              <el-form-item label="竞得者简称" prop="comAbbreviation">
                <el-input size="small" placeholder="" v-model="landInfos.comAbbreviation"></el-input>
              </el-form-item>
              <el-form-item label="参拍信息" prop="auction">
                <el-input size="small" placeholder="" type="textarea" :rows="1" v-model="landInfos.auction"></el-input>
              </el-form-item>
              <div class="info_item3">
                <el-form-item label="参拍企业" prop="participationList">
                  <el-upload
                    class="file_upload"
                    ref="upload_traded"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="(file,fileList)=>fileSelect(file,fileList,'participationList')"
                    :on-remove="(file,fileList)=>fileRemove(file,fileList,'participationList')"
                    accept=".xls,.xlsx"
                    :file-list="parList"
                    :limit="1"
                    :auto-upload="false">
                    <el-button slot="trigger" type="primary" size="small" plain>选取文件</el-button>
                    <el-button @click="getFileModule('participationList')" type="default" size="small" plain style="margin-left:10px">下载模板</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="出价记录" prop="bidHistory">
                  <el-upload
                    class="file_upload"
                    ref="upload_traded"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="(file,fileList)=>fileSelect(file,fileList,'bidHistory')"
                    :on-remove="(file,fileList)=>fileRemove(file,fileList,'bidHistory')"
                    accept=".xls,.xlsx"
                    :file-list="bidList"
                    :limit="1"
                    :auto-upload="false">
                    <el-button slot="trigger" type="primary" size="small" plain>选取文件</el-button>
                    <el-button @click="getFileModule('bidHistory')" type="default" size="small" plain style="margin-left:10px">下载模板</el-button>
                  </el-upload>
                </el-form-item>
              </div>
              <el-form-item label="备注" prop="tradeRemark" style="width:96%">
                <el-input size="small" :rows="4" placeholder="" type="textarea" v-model="landInfos.tradeRemark"></el-input>
              </el-form-item>
            </div>
            <!-- 开发销售信息 -->
            <el-divider content-position="left">开发销售信息</el-divider>
            <div class="info_item">
              <el-form-item label="开发进度" prop="devProgress">
                <el-input size="small" :rows="1" placeholder="" type="textarea" v-model="landInfos.devProgress"></el-input>
              </el-form-item>
              <el-form-item label="销售进度" prop="saleProgress">
                <el-input size="small" :rows="1" placeholder="" type="textarea" v-model="landInfos.saleProgress"></el-input>
              </el-form-item>
              <el-form-item label="预售许可证首次批准日期" prop="preSaledate" class="fold_label">
                <el-date-picker size="small" type="date" placeholder="选择时间" v-model="landInfos.preSaledate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="操盘企业系" prop="dbo">
                <el-input size="small" v-model="landInfos.dbo"></el-input>
              </el-form-item>
              <el-form-item label="推广名" prop="promotionName">
                <el-input size="small" v-model="landInfos.promotionName"></el-input>
              </el-form-item>
              <el-form-item label="备案名" prop="recordName">
                <el-input size="small" v-model="landInfos.recordName"></el-input>
              </el-form-item>
              <el-form-item label="楼盘地址" prop="saleAddress">
                <el-input size="small" v-model="landInfos.saleAddress"></el-input>
              </el-form-item>
              <el-form-item label="装修情况" prop="decoration">
                <el-input size="small" :rows="1" placeholder="" type="textarea" v-model="landInfos.decoration"></el-input>
              </el-form-item>
              <el-form-item label="装修标准" prop="decorationSta">
                <el-input size="small" placeholder="元/㎡" v-model="landInfos.decorationSta"></el-input>
              </el-form-item>
              <el-form-item label="物业费" prop="property_charges">
                <el-input size="small" placeholder="元/㎡" v-model="landInfos.property_charges"></el-input>
              </el-form-item>
              <el-form-item label="物业公司" prop="property_company">
                <el-input size="small" v-model="landInfos.property_company"></el-input>
              </el-form-item>
              <el-form-item label="交付时间" prop="deliveryTime">
                <el-date-picker size="small" type="date" placeholder="选择时间" v-model="landInfos.deliveryTime" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item label="销售备注" prop="saleRemark" style="width:96%">
                <el-input size="small" :rows="4" placeholder="" type="textarea" v-model="landInfos.saleRemark"></el-input>
              </el-form-item>
            </div>
            <!-- 土地文件上传 -->
            <el-divider content-position="left">土地文件上传</el-divider>
            <div class="info_item3">
              <el-form-item label="图片" prop="pictures">
                <el-upload
                  class="file_upload"
                  ref="img_upload"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="(file,fileList)=>fileSelect(file,fileList,'pictures')"
                  :on-remove="(file,fileList)=>fileRemove(file,fileList,'pictures')"
                  :file-list="picturesList"
                  accept=".JPG, .PNG, .JPEG,.jpg, .png, .jpeg"
                  multiple
                  :auto-upload="false">
                  <el-button slot="trigger" type="primary" size="small" plain>添加图片</el-button>
                  <div class="el-upload__tip" slot="tip">{{isAdmin?'单文件大小不能超过5MB':'单文件大小不能超过2M'}}</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="文档" prop="files">
                <el-upload
                  class="file_upload"
                  ref="img_upload"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="(file,fileList)=>fileSelect(file,fileList,'files')"
                  :on-remove="(file,fileList)=>fileRemove(file,fileList,'files')"
                  :file-list="filesList"
                  accept=".doc, .docx, .xls,.xlsx, .ppt, .pptx, .pbf, .txt"
                  multiple
                  :auto-upload="false">
                  <el-button slot="trigger" type="primary" size="small" plain>添加文档</el-button>
                  <div class="el-upload__tip" slot="tip">{{isAdmin?'单文件大小不能超过5MB':'单文件大小不能超过2M'}}</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="压缩包" prop="zips">
                <el-upload
                  class="file_upload"
                  ref="img_upload"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-change="(file,fileList)=>fileSelect(file,fileList,'zips')"
                  :on-remove="(file,fileList)=>fileRemove(file,fileList,'zips')"
                  :file-list="zipsList"
                  accept=".zip, .rar, .arj, .z, .ZIP, .RAR, .ARJ, .Z"
                  multiple
                  :auto-upload="false">
                  <el-button slot="trigger" type="primary" size="small" plain>添加压缩包</el-button>
                  <div class="el-upload__tip" slot="tip">{{isAdmin?'单文件大小不能超过5MB':'单文件大小不能超过2M'}}</div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      
    </div>
    <!-- 修改土地轮廓 -->
    <div class="modify_info" v-if="modifyOutline">
      <div class="info">
        点击选中土地轮廓，进行轮廓修改
      </div>
      <div class="btn">
        <el-button type="default" size="small" @click="modifyCancel()">取消</el-button>
        <el-button type="primary" size="small" @click="modifyOk()">修改</el-button>
      </div>
    </div>
    <!-- 点击的土地列表 -->
    <div class="clcik_land" v-if="clickLandInfo.features">
      <i class="list_icon el-icon-close" @click="clickLandInfo = {}"></i>
      <div class="top">当前位置的土地</div>
      <div class="land_wrap">
        <div class="land_item" v-for="(item,i) in clickLandInfo.features" :key="i" @click="briefInfo(clickLandInfo,i)">
          <div class="land_number">宗地编号：{{item.properties.landNumber==='null'?'-':item.properties.landNumber}}</div>
          <div class="land_name">宗地名称：{{item.properties.name==='null'?'-':item.properties.name}}</div>
        </div>
      </div>
    </div>
    <!-- 土地聚类 -->
    <LandPoly :landData="landPolyData" :landListType="curListTab" :showLandAll="showLandAll" ref="landpoly" />
    <!-- 分享链接 -->
    <div class="shareurl_box" v-if="shareUrl!==null">
      <div class="box">
        <i class="el-icon-circle-close close_sharebox" @click="closeShareBox"></i>
        <el-input v-model="shareUrl">
          <template slot="prepend">分享链接</template>
          <el-button slot="append" 
            icon="el-icon-document-copy" 
            type="primary"
            v-clipboard:copy="shareUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">复制</el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
//Api
import ledgerApi from "@/api/ledgerApi";
import commonApi from "@/api/commonApi";
import friendsApi from "@/api/friendsApi";
//store
import { mapGetters } from "vuex"
//插件
//import fileDownload from 'js-file-download'//文件流下载
import * as turf from '@turf/turf'
import { Encrypt } from '@/utils/public'

import LandPoly from '@/components/main/ledgermap/landPoly'


export default {
  name:'ledgercomponent',
  props:{},
  components:{
    LandPoly
  },
  data(){
    return{
      positionX:null,
      positionY:null,
      landListHeight:window.innerHeight-156,//土地列表高度
      showCreat:false,//显示添加按钮
      creatlandMenu:false,//显示创建土地菜单
      landsGroup:[], //土地分组数据
      landListData:[],//土地列表数据(纯土地)
      loadLandID:[],//ID暂存
      addGroupId:null, //要添加土地分组的ID
      groupPid:null, //新建分组父节点id
      groupName:'', //分组名称
      groupNewName:'', //分组新名称
      curAddFloder:null,//当前要添加文件夹的目标
      showAddFolder:false,//显示创建信息
      showReFolder:false,//显示修改信息
      landTreeProps:{ //土地树参数
        children: 'lands',
        label: 'name',
        id:'id',
        parentId:'pid',
        isLeaf:'isLeaf'
      },
      tofolderState:false,//添加到文件夹
      toselfState:false,//添加到个人土地
      selectTreeName:'',//选择的文件夹名称
      selfLandTree:[],//个人文件夹树
      curAddToFloder:'',//要添加的目标文件夹
      defaultProps:{
        children: 'children',
        label: 'name',
      },
      curAddLand:null, //要添加文件夹的土地
      curAddLandName:'',//土地名称
      
      landLoading:false,//土地列表加载loading
      creatLoading:false,//创建更新loading
      delLoading:false,//批量删除土地loading
      expLoading:false,//批量导出loading
      landExpanded:[],//默认展开土地分组的ID数组
      landDefault:[],//选取的土地、文件夹ID数组
      landDefaultBac:[],//选取的土地、文件夹ID数组备份
      checkLandIdArr:[],//选中的土地Id数组
      checkFolderIdArr:[],//选中的文件夹的Id数组
      searchVal:'',//土地搜索
      serchLandLabels:[],//选择的要查询的土地标签
      isSearch:false,//搜索状态
      addLand:false,//添加土地状态
      drawOutline:false,//绘制土地轮廓
      tocreatShow:false,//切换到新建
      showGroupBtn:false,//分组复选框按钮
      createModel:'create',//创建文件夹、添加到文件夹 create、addto

      
      showFilter:false,
      isself:false,//个人土地
      isOther:false,//他人公开
      landTypeIsAll:false,
      landTypeAll:false,
      landTypeCheck:[], //'traded','announcement','supply','streaming','termination','other'
      landUseIsAll:false,
      landUseAll:false,
      landUseCheck:[],
      regionIsAll:false,
      regionAll:false,
      annoTimeRange:null,//公告时间查询范围
      dateRange:null,//成交时间查询范围
      landAreaS:'',//占地面积
      landAreaE:'',//占地面积
      tradePriceS:'',//亩价筛选
      tradePriceE:'',//亩价筛选
      totalPriceS:'',//总价筛选
      totalPriceE:'',//总价筛选
      priceS:'',//楼面价
      priceE:'',//楼面价
      circleRadius:'',//圈半径
      enclosureType:null,//围栏格式 custom:自定义 circle:半径圈
      filterCoords:null,//围栏坐标
      filterProvince:'',
      filterCity:'',
      regionCheck:[],
      filterPart:'',
      showLandInd:false,
      showLandAll:true,//显示全部土地


      landType:'traded',//创建土地类型
      landTypeArr:[ //土地类型数组（集中公告属于计划，后台字典未做层级，后续需要改动）
        // {label:'规划',value:'plan'},
        // {label:'预估集中供地',value:'plan_focus'},
        // {label:'集中公告',value:'supply_cls'},
        // {label:'计划',value:'supply'},
        // {label:'公告',value:'announcement'},
        // {label:'成交',value:'traded'},
        // {label:'流拍',value:'streaming'},
        // {label:'终止',value:'termination'},
        // {label:'其他',value:'other'},
      ],
      landJurArr:[ //土地权限
        {label:'公开',value:'1'},
        {label:'不公开',value:'0'},
      ],
      provinces:[
        // {
        //   label: 'S',
        //   options: [{
        //     value: '37',
        //     label: '山东省'
        //   }, {
        //     value: '31',
        //     label: '四川省'
        //   }]
        // }
      ],
      cities:[], //城市列表
      regionArr:[], //城区数据
      regionListData:[],//城区列表数据
      partArr:[], //板块数据
      
      landUseArr:[
        // {label:'纯住宅',remark:'#fefe89',value:'house'},
        // {label:'住兼商',remark:'#ff6a00',value:'house_commerce'},
        // {label:'商兼住',remark:'#ff6a00',value:'commerce_house'},
        // {label:'商业',remark:'#ff0000',value:'commerce'},
        // {label:'工业',remark:'#8b6f59',value:'industry'},
        // {label:'其他',remark:'#ecf5ff',value:'other'}
      ],
      sellTypeArr:[
        // {label:'拍卖',value:'auction'},
        // {label:'挂牌',value:'listing'},
        // {label:'转让',value:'assignment'},
        // {label:'划拨',value:'transfer'},
        // {label:'协议',value:'agreement'},
        // {label:'其他',value:'other'},
      ],
      dealState:[
        // {label:'已成交',value:'traded'},
        // {label:'流拍',value:'streaming'},
        // {label:'因故终止',value:'termination'},
      ],
      landLabelArr:[ //用户土地标签
        // {label:'优先级高',id:'1'},
        // {label:'低总价',id:'2'},
        // {label:'配套不错',id:'3'},
        // {label:'交通便利',id:'4'},
        // {label:'不利因素',id:'5'},
      ],
      biddingRules:[
        // {label:'限房价',id:'1'},
        // {label:'定品质',id:'2'},
        // {label:'竞地价',id:'3'},
        // {label:'竞销售型人才公寓比例',id:'4'},
        // {label:'固定+续竞销售型人才公寓比例',id:'5'},
        // {label:'竞自持租赁保障住房比例',id:'6'},
        // {label:'固定起始自持租赁保障住房比例',id:'7'},
      ],
      selectRules:[],
      landId:null,//土地ID
      landFeatureID:null,//绘制土地轮廓ID
      landCoordinates:null,//土地轮廓坐标
      modifyBackCoord:null,//备份要修改的坐标
      
      landAddress:null,//土地位置
      landLng:null,//土地经度
      landLat:null,//土地纬度
      //上传土地信息表单
      landInfos:{
        type:'land', //数据类型
        kind:'POLYGON', //要素类型
        //coordinates:null,//土地轮廓坐标
        center:null,//宗地坐标---新增
        fillColor:null,//填充颜色
        fillHy:null,//填充透明度
        lineColor:null,//描边颜色
        lineHy:null,//描边透明度
        lineWidth:null,//描边宽度

        //土地基础信息
        isOpen:'0',//是否公开*
        chargeFlylink:'',//收费航拍链接---新增
        landAerial:'',//免费航拍链接---新增
        noticeWebsite:'',//公告网址---新增
        state:'',//土地状态*
        annoId:'',//公告号
        landNumber:'', //宗地编号*
        parcelLocation:'', //宗地名称
        address:null,//宗地位置
        
        curProvince:'',//当前省份
        regionno:'',//区(市)县*
        landCityno:'',//城市*---新增
        torus:'',//环域
        partname:'',//板块
        landArea1:'',//出让面积（㎡）*（数字）
        landArea:'',//出让面积（亩）*（数字）
        purpose:'',//用地性质*
        landNature:'',//规划用途
        userYears:'',//使用年限
        ratio:'',//容积率(字符串)
        volumeRatio:'',//计算容积率（数字）
        buildArea:'',//计算建筑面积（㎡）（数字）
        rcScale:'',//商占比
        businessArea:'',//商业建筑面积（㎡）（数字）---新增
        buildingDensity:'',//建筑密度
        greenRate:'',//绿地率
        buildingHeight:'',//建筑高度
        labels:[],//土地标签
        remarks:'',//基础信息备注

        //土地出让信息
        sellType:'',//交易状态
        auctionRules:'',//拍卖规则
        industryConditions:'',//产业条件
        otherInfo:'',//配建/自持/无偿移交要求
        presaleRe:'',//预售要求---新增
        decorationRe:'', //装修要求---新增
        fixedPrice:'', //新房限价---新增
        annoTime:'',//公告时间
        //sellTime:'',//出让时间
        bond:'',//竞买保证金（万元）
        haveFloorprice:'',//是否有底价---新增
        startTotalPrice:'',//起始总价（万元）（数字）
        startFloorPrice:'',//起始楼面地价(元/㎡)（数字）
        startPrice:'',//起始单价（万元/亩）（数字）
        sellRemark:'',//出让备注

        //土地成交信息
        date:'',//交易时间*
        totalPrice:'',//成交总价（万元）（数字）
        price:'',//成交楼面价(元/㎡)（数字）
        tradePrice:'',//成交单价（万元/亩）（数字）
        premiumRatio:'',//溢价率 小数点后两位
        comConstruction:'',//竞配建---新增
        comFreetransfer:'',//竞无偿移交---新增
        comSelfsupport:'',//竞自持---新增
        actualFloorPrice:'',//实际楼面价
        competeCompany:'',//竞得者
        comAbbreviation:'',//竞得者简称---新增
        auction:'',//参拍信息
        participationList:null,//参拍企业名单
        bidHistory:null,//企业出价记录
        tradeRemark:'',//交易备注
        //tradingStatus:'traded',//交易状态

        //开发销售信息---新增
        devProgress:'',//开发进度
        saleProgress:'',//销售进度
        preSaledate:'',//预售许可证首次批准日期
        dbo:'',//操盘企业系
        promotionName:'',//推广名
        recordName:null,//备案名
        saleAddress:'',//楼盘地址
        decoration:'',//装修情况
        decorationSta:'',//装修标准（元/㎡）
        property_charges:'',//物业费（元/㎡/月）
        property_company:'',//物业公司
        deliveryTime:'',//交付时间
        saleRemark:'',//销售备注

        //土地文件上传
        pictures:[], //图片
        files:[], //文档
        zips:[], //压缩包
      },
      
      parList:[],
      bidList:[],
      picturesList:[],
      filesList:[],
      zipsList:[],
      landinfoRules:{
        // state: [ { required: true, message: '请选择', trigger: 'change' } ],
        // isOpen: [ { required: true, message: '请选择', trigger: 'change' } ],
        // landNumber: [ { required: true, message: '请输入', trigger: 'blur' } ],
        parcelLocation: [ { required: true, message: '请输入', trigger: 'blur' } ],
        //landCityno: [ { required: true, message: '请输入', trigger: 'blur' } ],
        //regionno: [ { required: true, message: '请选择', trigger: 'change' } ],
        // landArea1: [ { required: true, message: '请输入', trigger: 'blur' } ],
        // purpose: [ { required: true, message: '请选择', trigger: 'change' } ],
        //curProvince: [ { required: true, message: '请选择', trigger: 'change' } ],
      },
      uploadShow:false,//信息上传显示
      showLandList:true,//土地列表显示
      sidebarW:300,//侧边栏宽度
      showPageList:false,//显示分页
      //我的土地
      isParModify:false,//修改模式
      modifyOutline:false,//修改土地外轮廓
      //新建土地
      dialogVisible:false,
      dialogImageUrl:'',
      landImgList:[],//土地图片列表
      accountId:null,//上传土地信息返回的ID用于土地图片上传
      addMaker:null,//地图绘制提示
      makerEl:null,//maker dom

      modifyMode:false,//土地信息修改
      serchLoading:false,//土地查询loading
      
      checkAllLand:false,//全选土地
      showDeleteBtn:false,//批量删除复选
      showExportBtn:false,//导出选项
      showToselfBtn:false,//转为个人
      showCsvexpBtn:false,//导出csv
      showShareBtn:false,//分享土地
      deleteTip:false,//删除提醒

      //分页
      landCurPage:1,//当前页码
      landPageNum:200,//当前每页条数
      landListNum:null,//土地总数

      ledgerPopup:null,//土地简要信息popup
      loadLand:false,//土地图层是否已添加
      geojson_land:{ //土地轮廓线
        type: "FeatureCollection",
        features: []
      }, 
      geojson_landpoint:{ //土地点
        type: "FeatureCollection",
        features: []
      },
      clickLandInfo:{},//选中的土地数据

      curListTab:'gov',
      sysIsload:false,//系统已加载
      landPolyData:{},//土地聚类数据
      friendList:[],//好友列表
      shareFriendId:null,//要分享的土地
      shareTip:false,
      optionInfo:[],//要分享或导出的文件夹及土地

      rootFolderIdArr:[],//个人根文件夹ID数组
      shareUrl:null,//分享链接
    }
  },
  beforeMount(){
    //设置初始图层数据
    this.getAllFitLand()
    let cityCode = localStorage.getItem("cityCode")?localStorage.getItem("cityCode"):'510100'
    if(cityCode!=='510100'){
      this.getRootList()
    }
  },
  mounted(){
    //字典获取
    this.getDict()
    //好友列表
    this.getFirendsList()
  },
  watch:{
    cityCode:{ //切换城市
      handler(newVal){
        this.landExpanded = []
        this.getRegionData(newVal)
        this.getSelfTree()
        this.landInfos.landCityno = newVal
        this.filterCity = newVal
        if(this.sysIsload){
          this.changeLandType()
        }
      }
    },
    fileIsimport:{ //土地文件是否导入成功
      handler(newVal){
        console.log(newVal)
        //查询条件修改为个人
        this.isself = true
        this.changeLandType() //列表
      },
      deep:true
    },
    mapIsload:{ //地图是否加载
      handler(newVal){
        if(newVal){
          //添加土地图层、土地中心点图层、点线图层
          this.landLayerLoad()
          //添加土地边界、中心点临时图层
          this.loadLandTemporaryLayer()
          this.mapLoadEvents()
          this.sysIsload = true
        }
      },
      deep:true
    },
    freshFmFlag:{ //刷新好友列表
      handler(newVal){
        if(this.curListTab==='friend'){
          this.changeLandType()
        }
      },
      deep:true
    },
    createLandFlag:{ //新建土地
      handler(newVal){
        this.creatNewLand(newVal)
      },
      deep:true
    },
    freshSelf:{ //刷新个人地图
      handler(newVal){
        if(this.curListTab=="self"){
          if(this.isSearch){ //搜索状态
            this.searchLand()
          }else{
            this.changeLandType(null,true)
          }
        }
      },
      deep:true
    },
    landlistFlag:{
      handler(newVal){
        this.showLandList = newVal
      }
    },
  },
  computed:{
    ...mapGetters([
      "ledger_map",
      "local_map",
      "ledgerDraw",
      "plateData",
      "fileIsimport",
      "cityCode",
      "customState",
      "measureState",
      "mapIsload",
      "freshFmFlag",
      "createLandFlag",
      "freshSelf",
      "landlistFlag",
      "isAdmin",
      "isSuperUser"])
  },
  methods:{
    mapLoadEvents(){
      this.showCreat = true
      //地图绘制事件
      this.ledgerMapEvent()
      //获取省份数据
      this.getProvinceData()
      //获取个人文件夹树
      this.getSelfTree()
    },
    //好友列表
    getFirendsList(){
      friendsApi.getFirendsList().then(res=>{
        let data = res.data.data
        let arr = []
        data.forEach(item=>{
          arr.push({
            id:item.id,
            name:item.realName?item.realName:item.username,
            value:item.id, 
            isLeaf:false,
            lands:[],
            isself:false,
            online:item.online
          })
        })
        this.friendList = arr
      })
    },
    //筛选土地
    filterLandNode(value, data) {
      if (!value) return true;
      if(data.landNumber){
        return data.landNumber.indexOf(value) !== -1;
      }
    },
    //节点展开
    groupExpand(node){
      console.log(node)
      //this.landExpanded.push(node.id)
    },
    //节点关闭
    groupCollapse(node){
      console.log(node)
      //let i = this.landExpanded.indexOf(node.id)
      //this.landExpanded.splice(i,1)
    },
    annoTimeChange(){
      console.log(this.annoTimeRange)
    },
    //获取个人文件夹树
    getSelfTree(){
      ledgerApi.getLandTree({cityCode:this.cityCode})
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('个人文件夹树',data)
          this.selfLandTree = data
        }
      })
    },
    //选择土地要添加的文件夹
    handleNodeClick(data,node,nodeData){
      this.curAddToFloder = data
      this.selectTreeName = data.name
    },
    //获取省市区数据
    getProvinceData(val){
      var that = this
      commonApi.getPCR()
      .then(res=>{
        if(res.data.code===0){
          console.log('省份数据',res)
          that.provinces = res.data.data
        }
      })
    },
    //获取城市数据
    getCityData(val){
      var that = this
      that.filterCity = ''
      that.landInfos.landCityno = ''
      that.landInfos.regionno = ''
      that.regionCheck = []
      that.regionArr = []
      if(val===''){
        that.cities = []
        return
      }
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          console.log('城市数据',res)
          that.cities = res.data.data
        }
      })
    },
    //获取区县数据
    getRegionData(val){
      var that = this
      that.landInfos.regionno = ''
      that.regionCheck = []
      if(val===''){
        that.regionArr = []
        return 
      }
      //获取按因为字母排序的行政区
      commonApi.getPCR({value:val})
      .then(res=>{
        if(res.data.code===0){
          console.log('城区数据',res)
          that.regionArr = res.data.data
        }
      })
      //根据城市获取特定顺序的行政区
      ledgerApi.getRegionByCity({cityCode:val})
      .then(res=>{
        if(res.data.code===0){
          let arr = []
          res.data.data.searchRst.forEach(item=>{
            arr.push({
              id:item.id,
              value:item.id,
              name:item.name, 
              isLeaf:false,
              lands:[],
              supplyClsNum:item.supplyClsNum?item.supplyClsNum:0,
              supplyNum:item.supplyNum?item.supplyNum:0,
              tradedNum:item.tradedNum?item.tradedNum:0,
              announcementNum:item.announcementNum?item.announcementNum:0,
              planFocusNum:item.planFocusNum?item.planFocusNum:0,
              otherNum:item.otherNum?item.otherNum:0,
            })
          })
          that.regionListData = arr
        }
      })
    },
    
    //获取字典
    getDict(){
      var that = this
      //土地类型
      ledgerApi.getTypeDict("land_type")
      .then(res=>{
        if(res.data.code===0){
          console.log('土地类型字典',res)
          that.landTypeArr = res.data.data
          // let arr = []
          // that.landTypeArr.forEach(item=>{
          //   arr.push(item.value)
          // })
          // that.landTypeCheck = arr
        }
      })
      //用地性质
      ledgerApi.getTypeDict("land_use")
      .then(res=>{
        if(res.data.code===0){
          that.landUseArr = res.data.data
          // let arr = []
          // that.landUseArr.forEach(item=>{
          //   arr.push(item.value)
          // })
          // that.landUseCheck = arr
        }
      })
      //交易状态
      ledgerApi.getTypeDict("sell_type")
      .then(res=>{
        if(res.data.code===0){
          that.sellTypeArr = res.data.data
        }
      })
      //交易状态
      ledgerApi.getTypeDict("dealState")
      .then(res=>{
        if(res.data.code===0){
          that.dealState = res.data.data
        }
      })
      //土地标签
      ledgerApi.getGovLandLabel()
      .then(res=>{
        if(res.data.code===0){
          that.landLabelArr = res.data.data
        }
      })
      //竞拍规则
      ledgerApi.getTypeDict('auction_rules')
      .then(res=>{
        if(res.data.code===0){
          that.biddingRules = res.data.data
        }
      })
    },
    //获取公共土地一级目录土地数量统计
    async setGovFirstNum(){
      var that = this
      let obj = { landCityno: that.cityCode?that.cityCode:'510100'}
      let res = await ledgerApi.getGovLandNum(obj)
      console.log(res)
      let data = res.data.data
      let states = [
        // { id:'plan_focus',name:'预估集中供地',value:'plan_focus', isLeaf:false,lands:[],isself:false},
        { id:'supply_cls',name:'集中公告',value:'supply_cls', isLeaf:false,lands:[],isself:false},
        { id:'announcement',name:'公告',value:'announcement', isLeaf:false,lands:[],isself:false},
        { id:'supply',name:'计划',value:'supply', isLeaf:false,lands:[],isself:false},
        { id:'traded',name:'成交',value:'traded', isLeaf:false,lands:[],isself:false},
        { id:'other',name:'其他',value:'other', isLeaf:false,lands:[],isself:false}, //其他包含：流拍、终止、其他
      ]
      states.forEach(item=>{
        let cur = data.filter(d=>item.id==d.state)[0]
        item.num = cur?cur.num:0
      })
      return states
    },
    //土地类型切换
    async changeLandType(item,freshList){ //只刷新列表
      console.log(this.curListTab)
      this.showDeleteBtn = false
      this.showGroupBtn = false
      this.showExportBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      this.showShareBtn = false
      this.isSearch = false
      this.showLandAll = true
      this.landDefault = []
      this.landDefaultBac = []
      //存储到store
      this.$store.dispatch('setLandType',this.curListTab)
      //重置筛选条件
      this.resetFilter()
      if(this.curListTab==='gov'){ //公共
        if(this.cityCode==='510100'){
          let states = await this.setGovFirstNum()
          
          this.landDefault = ['supply_cls','announcement','supply','traded','other'] //,'plan_focus'
          this.landDefaultBac = ['supply_cls','announcement','supply','traded','other'] //,'plan_focus'
          this.landsGroup = states
        }else{
          this.getRootList()
        }
      }else if(this.curListTab==='friend'){ //好友
        await this.getFirendsList()
        let list = JSON.parse(JSON.stringify(this.friendList))
        this.landsGroup = list
        this.showPageList = false
        let checkArr = []
        list.forEach(item=>{
          if(!this.landDefault.includes(item.id)){
            checkArr.push(item.id)
          }
          if(!this.landDefaultBac.includes(item.id)){
            this.landDefaultBac.push(item.id)
          }
        })
        this.landDefault = this.landDefault.concat(checkArr)
      }else{ //个人
        this.getRootList()
      }
      if(!freshList){ //全加载
        //设置图层数据
        this.getAllFitLand()
        //控制图层
        this.$refs.landpoly.controlLayer(null,null);
      }
    },
    //加载公共土地数据
    async loadGovData(node,resolve){
      var that = this
      if(node.level === 0){
        let states = await this.setGovFirstNum()
        resolve(states)
        that.landDefault = ['supply_cls','announcement','supply','traded','other'] //,'plan_focus'
        that.landDefaultBac = ['supply_cls','announcement','supply','traded','other'] //,'plan_focus'
      }else if(node.level === 1){
        let arr = JSON.parse(JSON.stringify(that.regionListData))
        arr.forEach(item=>{
          item.id = node.key+'_'+item.id
          item.isself=false
          item.num =  node.key == 'plan_focus'?item.planFocusNum:node.key == 'supply_cls'?item.supplyClsNum:node.key == 'announcement'?item.announcementNum:node.key == 'supply'?item.supplyNum:node.key == 'traded'?item.tradedNum:item.otherNum
          if(that.showLandAll){ //非土地操作状态
            if(that.landDefault.includes(node.data.id)){
              that.landDefault.push(item.id)
            }
            if(!that.landDefaultBac.includes(item.id)){
              that.landDefaultBac.push(item.id)
            }
          }
        })
        resolve(arr)
      }else if(node.level === 2){
        if(node.parent.data.value==='traded'){ //成交时获取年份
          ledgerApi.getRegionYears({regionno:node.data.value})
          .then(res=>{
            if(res.data.code===0){
              let data = res.data.data
              let arr = []
              data.forEach(item=>{
                arr.unshift({
                  id:node.key+'_'+item.date,
                  name:item.date, 
                  value:item.date,
                  num:item.num,
                  isLeaf:false,
                  isself:false,
                  lands:[]
                })
                if(that.showLandAll){ //非土地操作状态
                  if(that.landDefault.includes(node.data.id)){
                    that.landDefault.push(item.id)
                  }
                  if(!that.landDefaultBac.includes(item.id)){
                    that.landDefaultBac.push(item.id)
                  }
                }
              })
              resolve(arr)
              if(data.length===0){
                node.isLeaf = false
              }
            }
          })
        }else{ //获取城区下的土地
          that.getFolderLands(node,resolve,'byregion')
        }
      }else{ //根据年份城区类型获取土地数据
        that.getFolderLands(node,resolve,'byyear')
      }
    },
    getFolderLands(node,resolve,type){
      var that = this
      let obj = { datatype:'gov' }
      if(type==='byyear'){
        obj.landType = [node.parent.parent.data.value]
        obj.region = [node.parent.data.value]
        obj.year = node.data.value
      }else{
        obj.landType = [node.parent.data.value]
        obj.region = [node.data.value]
      }
      ledgerApi.getAllLands(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data.land_list
          data.forEach(item=>{
            item.isLeaf = true
            item.leaf = '2'
            if(that.landDefault.includes(node.data.id)){
              that.landDefault.push(item.id)
            }
            if(!that.landDefaultBac.includes(item.id)){
              that.landDefaultBac.push(item.id)
            }
          })
          resolve(data)
          if(data.length===0){
            node.isLeaf = false
          }
        }
      })
    },
    //加载好友数据
    loadFriendData(node,resolve){
      var that = this
      if(node.level === 0){ //加载好友列表
        let list = JSON.parse(JSON.stringify(that.friendList))
        resolve(list)
      }else{ //加载好友分享的土地
        ledgerApi.getFriendLand(node.level === 1?{friendId:node.data.value,landCityno:that.cityCode}:{pid:node.data.id,landCityno:that.cityCode})
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            that.landListData = that.landListData.concat(data.ipage)
            let getData = data.apage.concat(data.ipage)
            let checkArr = []
            getData.forEach(item=>{
              if(item.createDate){
                let date = item.createDate.split(' ')
                item.createDate = date[0]
              }
              if(item.leaf==='2'){ //土地
                item.parentId = item.pid
                item.isLeaf = true
              }else{ //文件夹
                item.lands = []
                item.parentId = item.pid
                item.isLeaf = false //是否为叶子节点
              }
              if(that.landDefault.includes(node.data.id)&&that.showLandAll){
                checkArr.push(item.id)
              }
              if(!that.landDefaultBac.includes(item.id)){
                that.landDefaultBac.push(item.id)
              }
            })
            resolve(getData)
            if(getData.length===0){
              node.isLeaf = false
            }
            //that.loadLandID = that.loadLandID.concat(checkArr)
            that.landDefault = that.landDefault.concat(checkArr)
          }
        })
      }
    },
    //加载个人土地数
    loadSelfData(node,resolve){
      var that = this
      //改代码解决一个未知bug可能跟地图懒加载有关
      if(node.data.id=='plan'||node.data.id=='supply_cls'||node.data.id=='supply'||node.data.id=='announcement'||node.data.id=='traded'||node.data.id=='streaming'||node.data.id=='termination'||node.data.id=='other'){
        return
      }
      if(node.level > 0){
        let obj = {
          pid:node.data.id,
          datatype:that.curListTab
        }
        ledgerApi.searchLandChild(obj)
        .then(res=>{
          if(res.data.code===0){
            let data = res.data.data
            that.landListData = that.landListData.concat(data.ipage)
            let getData = data.apage.concat(data.ipage)
            let checkArr = []
            
            getData.forEach(item=>{
              if(item.createDate){
                let date = item.createDate.split(' ')
                item.createDate = date[0]
              }
              if(item.leaf==='2'){ //土地
                item.parentId = item.pid
                item.isLeaf = true
              }else{ //文件夹
                item.lands = []
                item.parentId = item.pid
                item.isLeaf = false //是否为叶子节点
              }
              if(that.landDefault.includes(node.data.id)&&that.showLandAll){
                checkArr.push(item.id)
              }
              if(!that.landDefaultBac.includes(item.id)){
                that.landDefaultBac.push(item.id)
              }
            })
            resolve(getData)
            //that.loadLandID = that.loadLandID.concat(checkArr)
            that.landDefault = that.landDefault.concat(checkArr)
            if(getData.length===0){
              node.isLeaf = false
            }
            console.log(getData)
          }else{
            that.$message.error(res.data.msg)
          }
        })
      }

    },
    //转换土地类型文本
    convertLandTypeText(val){
      let str = ''
      this.landTypeArr.forEach(item=>{
        if(item.value==val){
          str = item.label
        }
      })
      if(val==='supply_cls'){ //集中公告转为公告
        str = '公告'
      }
      return str
    },
    //转换城区
    convertRegion(val){
      let str = ''
      this.regionArr.forEach(item=>{
        item.options.forEach(op=>{
          if(op.value===val){
            str = op.label
          }
        })
      })
      return str
    },
    //根据区划号返回区划名称
    async getRegionLabel(regionno){
      let cityno = regionno.substring(0,4)+'00'
      let str = await commonApi.getPCR({value:cityno})
      .then(res=>{
        if(res.data.code===0){
          let label = ''
          let data = res.data.data
          data.forEach(item=>{
            item.options.forEach(op=>{
              if(regionno===op.value){
                label = op.label
              }
            })
          })
          return label
        }
      })
      return str
    },
    //用地性质颜色
    convertLandUseColor(val){
      let str = ''
      this.landUseArr.forEach(item=>{
        if(item.value==val){
          str = item.remark
        }
      })
      return str
    },
    convertBorder(purpose,state){
      let str = ''
      if(state==='plan'){
        str = '#000000 1px dashed'
      }else if(state==='plan_focus'){
        str = '#8bc34a 1px dashed'
      }else if(state==='supply'){
        str = '#0000ff 1px dashed'
      }else if(state==='announcement'||state==='supply_cls'){
        str = '#0000ff 1px solid'
      }else if(state==='traded'){
        if(purpose==='commerce'){
          str = '#ffff4c 1px solid'
        }else{
          str = '#ff0000 1px solid'
        }
      }else{
        str = '#fff 1px solid'
      }
      return str
    },
    //用地性质
    convertLandUse(val){
      let str = ''
      this.landUseArr.forEach(item=>{
        if(item.value==val){
          str = item.label
        }
      })
      return str
    },
    //土地筛选
    filterLand(){
      //设置土地数据
      this.getAllFitLand(true)
      //重置页码
      this.searchLand()
      //重置图层控制
      this.$refs.landpoly.controlLayer(null,null);
      this.showFilter = false
      this.$refs.filterPover.doClose()
      //退出分组、删除、导出操作、搜索、分享
      this.showGroupBtn = false 
      this.addGroupId = null
      this.showDeleteBtn = false
      this.showExportBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      this.showShareBtn = false
      //高亮筛选的城区
      this.hightLightRegion()
      this.showPageList = true
    },
    //重置筛选条件
    resetFilter(){
      this.searchVal = ''
      this.regionCheck = [] 
      this.regionIsAll = false
      this.regionAll = false
      this.landTypeIsAll = false
      this.landTypeAll = false
      this.landTypeCheck = []
      this.landUseIsAll = false
      this.landUseAll = false
      this.landUseCheck = []
      this.annoTimeRange = null
      this.dateRange = null
      this.landAreaS=''
      this.landAreaE=''
      this.tradePriceS=''
      this.tradePriceE=''
      this.totalPriceS=''
      this.totalPriceE=''
      this.priceS=''
      this.priceE=''
      if(this.filterCoords!==null){
        this.delEnclosure()
      }
      this.hightLightRegion()
    },
    //高亮筛选的城区
    hightLightRegion(){
      let map = this.local_map
      let arr = []
      this.regionCheck.forEach(item=>{
        arr.push(JSON.parse(item))
      })
      let borderColor = ["match", ["get", "id"],arr,'#3cff43','rgba(149, 149, 246,1)']
      let borderOpacity = ["match", ["get", "id"],arr,1,0.4]
      map.setPaintProperty("plate_line", "line-color", arr.length>0?borderColor:'rgba(149, 149, 246,1)')
      map.setPaintProperty("plate_line", "line-opacity", arr.length>0?borderOpacity:0.4)
      map.setPaintProperty("plate_line", "line-width", arr.length>0?1.5:1)
    },
    //土地排序
    landSortList(data){
      let ruleArr = ['supply_cls','supply','announcement','traded','streaming','termination','plan','other'] 
      let arr = data.sort((a,b) => ruleArr.indexOf(a.state)-ruleArr.indexOf(b.state))
      return arr
    },
    //设置符合查询条件的全部土地数据
    getAllFitLand(isFilter){ //若isFilter 为true 则为搜索查询
      var that = this
      let cityCode = localStorage.getItem("cityCode")
      let reqObj = {}
      if(isFilter){
        reqObj = this.searchConAll()
      }else{
        reqObj = {
          datatype:this.curListTab,
          landCityno:cityCode?cityCode:'510100'
        }
      }
      that.landLoading = true
      ledgerApi.getAllLands(reqObj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          this.landPolyData = data
          //选中土地
          let checkArr = []
          data.land_list.forEach(item=>{
            if(!that.landDefault.includes(item.id)){
              checkArr.push(item.id)
            }
          })
          that.loadLandID = checkArr
          // if(that.showLandAll){ //删除或者分组状态土地不做勾选
          //   that.landDefault = that.landDefault.concat(checkArr)
          // }
          that.landLoading = false
        }else{
          setTimeout(_=>{
            that.landLoading = false
          },3000)
        }
      })
    },
    //设置选中土地
    setCheckLand(checkedNodes,check){
      // let node = this.$refs.landTree.getNode(checkedNodes.id)
      // node.expand();
      console.log(checkedNodes,check);
      let checkLandArr = []
      let checkFolderArr = []
      check.checkedNodes.forEach(item=>{
        if(item.leaf==='2'){ //土地
          checkLandArr.push(item.id)
        }else{ //文件夹
          checkFolderArr.push(item.id)
        }
      })
      this.checkLandIdArr = checkLandArr
      this.checkFolderIdArr = checkFolderArr
      this.landDefault = checkLandArr.concat(checkFolderArr)
      
      //分享、导出、删除、转为个人 土地/文件夹、导出csv
      if(this.showExportBtn||this.showShareBtn||this.showDeleteBtn||this.showToselfBtn||this.showCsvexpBtn){
        let checkAinfo = check.checkedNodes.concat(check.halfCheckedNodes)
        let arr = []
        checkAinfo.forEach(item=>{
          if(item.leaf==='2'){ //2为土地，0,1为文件夹
            arr.push({
              landId:item.id,
              pid:item.pid
            })
          }else{
            arr.push({
              accountId:item.id,
              pid:item.pid
            })
          }
        })
        this.optionInfo = arr
      }
      //分组、删除、导出时不触发图层控制
      if(this.showGroupBtn||this.addGroupId!==null||this.showDeleteBtn||this.showExportBtn||this.showShareBtn||this.showToselfBtn||this.showCsvexpBtn){
        return
      }
      //控制图层
      this.$refs.landpoly.controlLayer(checkLandArr,checkFolderArr);
    },
    loadNode(node, resolve) {        // 加载 树数据   
      let that = this;
      let cityCode = localStorage.getItem('cityCode')?localStorage.getItem("cityCode"):'510100'
      if(that.curListTab==='gov'){ //公共
        if(cityCode==='510100'){
          this.loadGovData(node,resolve)
        }else{
          this.loadSelfData(node,resolve)
        }
      }else if(that.curListTab==='friend'){ //好友
        this.loadFriendData(node,resolve)
      }else if(that.curListTab==='self'){ //个人
        this.loadSelfData(node,resolve)
      }
      
    },
    //获取列表根数据
    getRootList(){
      var that = this
      let cityCode = localStorage.getItem("cityCode")
      let obj = {
        pid:0,
        datatype:that.curListTab,
        landCityno:that.cityCode?that.cityCode:cityCode
      }
      ledgerApi.searchLandChild(obj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          that.landListData = that.landListData.concat(data.ipage)
          let getData = data.apage.concat(data.ipage)
          let checkArr = []
          let IdArr = []
          getData.forEach(item=>{
            IdArr.push(item.id)
            if(item.createDate){
              let date = item.createDate.split(' ')
              item.createDate = date[0]
            }
            if(item.leaf==='2'){ //土地
              item.parentId = item.pid
              item.isLeaf = true
            }else{ //文件夹
              item.lands = []
              item.parentId = item.pid
              item.isLeaf = false //是否为叶子节点
            }
            if(!that.landDefault.includes(item.id)&&that.showLandAll){
              checkArr.push(item.id)
            }
          })
          that.landDefault = checkArr
          that.landDefaultBac = checkArr
          that.landsGroup = getData

          that.loadLandID = IdArr
        }
      })
    },
    //查询条件
    searchCon(pid){
      var that = this
      let reqObj = {
        datatype:that.curListTab,
      }
      // if(that.curListTab!=="self"){
      //   reqObj.pid = 0
      // }
      if(that.landTypeCheck.length>0){
        //若勾选公告，同时把隐藏的集中公告添加，全选时不需要添加
        let arr = that.landTypeCheck
        let announcement = arr.includes('announcement')
        let supply_cls = arr.includes('supply_cls')
        if(!supply_cls&&announcement){
          arr.push('supply_cls')
        }
        if(!announcement&&supply_cls){
          let i = arr.indexOf('supply_cls')
          arr.splice(i,1)
        }
        reqObj.landType = arr
      }
      if(that.landUseCheck.length>0){
        reqObj.landUse = that.landUseCheck
      }
      reqObj.landCityno = that.cityCode
      if(that.regionCheck.length>0){ //选择了城区
        reqObj.region = that.regionCheck
      }
      if(that.annoTimeRange!==null){
        reqObj.minAnnoTime = that.annoTimeRange[0]
        reqObj.maxAnnoTime = that.annoTimeRange[1]
      }
      if(that.dateRange!==null){
        reqObj.minDate = that.dateRange[0]
        reqObj.maxDate = that.dateRange[1]
      }

      if(that.landAreaS!==''){
        reqObj.landAreaS = JSON.parse(that.landAreaS)
      }
      if(that.landAreaE!==''){
        reqObj.landAreaE = JSON.parse(that.landAreaE)
      }
      if(that.tradePriceS!==''){
        reqObj.tradePriceS = JSON.parse(that.tradePriceS)
      }
      if(that.tradePriceE!==''){
        reqObj.tradePriceE = JSON.parse(that.tradePriceE)
      }
      if(that.totalPriceS!==''){
        reqObj.totalPriceS = JSON.parse(that.totalPriceS)
      }
      if(that.totalPriceE!==''){
        reqObj.totalPriceE = JSON.parse(that.totalPriceE)
      }
      if(that.priceS!==''){
        reqObj.priceS = JSON.parse(that.priceS)
      }
      if(that.priceE!==''){
        reqObj.priceE = JSON.parse(that.priceE)
      }

      if(that.filterCoords!==null){
        let coordstr = ''
        that.filterCoords.forEach(coor=>{
          coordstr += (coor[0]+','+coor[1]+';')
        })
        reqObj.coordinates = coordstr
      }
      if(that.serchLandLabels.length>0){
        let labels = ''
        that.serchLandLabels.forEach(item=>{
          labels += item+','
        })
        reqObj.labels = labels
      }
      if(that.selectRules.length>0){
        let auctionRules = ''
        that.selectRules.forEach(item=>{
          auctionRules += item+'、'
        })
        reqObj.auctionRules = auctionRules
      }
      
      return reqObj
    },
    //查询条件(全部)
    searchConAll(pid){
      var that = this
      let reqObj = {
        datatype:that.curListTab,
        searchName:that.searchVal,
        landCityno:that.cityCode,
        isAll:'1'
      }
      // if(that.curListTab!=='self'){
      //   reqObj.pid = 0
      // }
      if(that.landTypeCheck.length>0){
        //若勾选规划，同时把隐藏的集中公告添加，全选时不需要添加
        let arr = that.landTypeCheck
        let supply = arr.includes('supply')
        let supply_cls = arr.includes('supply_cls')
        if(!supply_cls&&supply){
          arr.push('supply_cls')
        }
        if(!supply&&supply_cls){
          let i = arr.indexOf('supply_cls')
          arr.splice(i,1)
        }
        reqObj.landType = arr
      }
      if(that.landUseCheck.length>0){
        reqObj.landUse = that.landUseCheck
      }
      if(that.regionCheck.length>0){ //选择了城区
        reqObj.region = that.regionCheck
      }else{
        reqObj.landCityno = that.cityCode
      }
      if(that.annoTimeRange!==null){
        reqObj.minAnnoTime = that.annoTimeRange[0]
        reqObj.maxAnnoTime = that.annoTimeRange[1]
      }
      if(that.dateRange!==null){
        reqObj.minDate = that.dateRange[0]
        reqObj.maxDate = that.dateRange[1]
      }

      if(that.landAreaS!==''){
        reqObj.landAreaS = JSON.parse(that.landAreaS)
      }
      if(that.landAreaE!==''){
        reqObj.landAreaE = JSON.parse(that.landAreaE)
      }
      if(that.tradePriceS!==''){
        reqObj.tradePriceS = JSON.parse(that.tradePriceS)
      }
      if(that.tradePriceE!==''){
        reqObj.tradePriceE = JSON.parse(that.tradePriceE)
      }
      if(that.totalPriceS!==''){
        reqObj.totalPriceS = JSON.parse(that.totalPriceS)
      }
      if(that.totalPriceE!==''){
        reqObj.totalPriceE = JSON.parse(that.totalPriceE)
      }
      if(that.priceS!==''){
        reqObj.priceS = JSON.parse(that.priceS)
      }
      if(that.priceE!==''){
        reqObj.priceE = JSON.parse(that.priceE)
      }

      if(that.filterCoords!==null){
        let coordstr = ''
        that.filterCoords.forEach(coor=>{
          coordstr += (coor[0]+','+coor[1]+';')
        })
        reqObj.coordinates = coordstr
      }
      if(that.serchLandLabels.length>0){
        let labels = ''
        that.serchLandLabels.forEach(item=>{
          labels += item+','
        })
        reqObj.labels = labels
      }
      if(that.selectRules.length>0){
        let auctionRules = ''
        that.selectRules.forEach(item=>{
          auctionRules += item+'、'
        })
        reqObj.auctionRules = auctionRules
      }
      return reqObj
    },
    //删除临时点跟土地轮廓
    deletAddPoint(){ 
      var map = this.ledger_map
      if(map){
        //临时点
        let geojsonPoint = {
          "type": "FeatureCollection",
          "features": []
        }
        map.getSource('ledgerAddLayer').setData(geojsonPoint)
        //土地轮廓
        let geojsonLand = {
          "type": "FeatureCollection",
          "features": []
        }
        map.getSource('ladgerLand').setData(geojsonLand)
        //移除地图绘制工具
        this.ledgerDraw.deleteAll()
      }
    },

    //**新建土地**
    //新建土地信息
    creatNewLand(val){
      this.creatlandMenu = val
      if(this.creatlandMenu){
        this.resetData()
        this.chooseParPosition()
      }else{
        this.creatCancel()
        this.ledger_map.getCanvas().style.cursor = ''
        if(this.addMaker){
          this.addMaker.remove()
          this.addMaker = null
        }
      }
    },
    //切换到地图
    changeToMap(){
      this.uploadShow = false
      this.tocreatShow = true
      this.drawOutline = true
      
    },
    //切换到新建
    changeToCreat(){
      this.uploadShow = true
      this.tocreatShow = false
      this.drawOutline = false
    },
    //取消创建、更新土地
    creatCancel(){
      this.resetData()
      this.uploadShow = false
      this.addLand = false
      this.modifyMode = false
      this.creatlandMenu = false
      this.$store.dispatch('setCreateLandFlag',false)
    },
    //切换土地状态切换对应交易状态
    landStateChange(val){
      if(val==='traded'||val==='streaming'||val==='termination'){
        this.landInfos.tradingStatus = val
      }else{
        this.landInfos.tradingStatus = ''
      }
    },
    //选择土地点位置
    chooseParPosition(){ 
      this.addLand = true
      this.uploadShow = false
      if(this.addMaker==null){
        let map = this.ledger_map
        this.makerEl = document.createElement('div');
        this.makerEl.setAttribute('class', 'measure-result');
        this.makerEl.innerHTML = '点击确认土地位置'
        var option = {
          element: this.makerEl,
          anchor: 'top',
          offset: [0, -35]
        };
        this.addMaker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
    },
     //绘制土地轮廓
    drawPolygon(){
      if(this.landLng==null&&this.landLat==null){
        this.$message('请先在地图上选择土地位置')
        return false
      }
      this.ledgerDraw.changeMode('draw_polygon')
      this.uploadShow = false
      this.drawOutline = true
      if(this.addMaker==null){
        let map = this.ledger_map
        if(this.makerEl==null){
          this.makerEl = document.createElement('div');
          this.makerEl.setAttribute('class', 'measure-result');
          this.makerEl.innerHTML = '点击开始绘制土地轮廓'
        }else{
          this.makerEl.innerHTML = '点击开始绘制土地轮廓'
        }
        var option = {
          element: this.makerEl,
          anchor: 'top',
          offset: [0, -35]
        };
        this.addMaker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
    },
    //土地轮廓+点位置图层
    landLayerLoad(){
      var that = this
      var map = this.ledger_map
      if(map.getSource('landOutline')===undefined){
        //土地轮廓
        map.addSource("landOutline", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
            tolerrance:100
          },
          buffer:512
        });
        map.addLayer({
          id: "landOutline_fill",
          type: "fill",
          source: "landOutline",
          layout: {
            visibility: "visible",
          },
          minzoom:8,
          paint: {
            "fill-color": [
              "coalesce",
              ['get','fillColor'],
              ['match',
                ['get','purpose'],
                'house','#fefe89',
                'house_commerce','#ff6a00',
                'commerce_house','#ff6a00',
                'commerce','#ff0000',
                'industry','#8b6f59',
                'other','#ecf5ff',
                '#ecf5ff'
              ]
            ],
            "fill-opacity": [
              "coalesce",
              ['get','fillHy'],
              [
                'case',
                ["boolean", ["==", ["get", "state"], "streaming"], false],0,
                ["boolean", ["==", ["get", "state"], "other"], false],0,
                ["boolean", ["==", ["get", "state"], "termination"], false],0,
                0.5
              ],
              0.5
            ]
          },
        });
        map.addLayer({ //公告（+集中公告）、成交、流拍、终止、其他
          id: "landOutline_line",
          type: "line",
          source: "landOutline",
          filter:['in','state','announcement','supply_cls','traded','streaming','termination','other'],
          layout: {
            "visibility": "visible",
            "line-join":"round"
          },
          minzoom:8,
          paint: {
            "line-color":
            [
              "coalesce",
              ['get','lineColor'],
              [
              "case",
                ["boolean", ["==", ["get", "state"], "announcement"], false],
                "#0000ff", //蓝色
                ["boolean", ["==", ["get", "state"], "supply_cls"], false],
                "#0000ff", //蓝色
                ["boolean", ["==", ["get", "state"], "traded"], false],
                "#ff0000", //红色
                ["boolean", ["all",["==", ["get", "state"],"traded"], ["==", ["get", "commerce"],"traded"]], false],
                "#ffff4c", //黄色
                '#fff'
              ]
            ],
            "line-opacity": [
              "coalesce",
              ['get','lineHy'],
              0.6
            ],
            "line-width": [
              "coalesce",
              ['get','lineWidth'],
              1
            ],
          },
        });
        map.addLayer({ //规划、计划
          id: "landOutline_line_ps",
          type: "line",
          source: "landOutline",
          filter:['in','state','plan','supply'],//,'plan_focus'
          layout: {
            "visibility": "visible",
            "line-join":"round"
          },
          minzoom:8,
          paint: {
            "line-color":
            [
              "coalesce",
              ['get','lineColor'],
              [
                "case",
                ["boolean", ["==", ["get", "state"], "plan"], false],
                "#000000", //黑色
                ["boolean", ["==", ["get", "state"], "plan_focus"], false],
                "#8bc34a", //紫色
                ["boolean", ["==", ["get", "state"], "supply"], false],
                "#0000ff", //蓝色
                '#fff'
              ]
            ],
            "line-dasharray":[4,2],
            "line-opacity": [
              "coalesce",
              ['get','lineHy'],
              0.6
            ],
            "line-width": [
              "coalesce",
              ['get','lineWidth'],
              1
            ]
          },
        });
        //土地点
        map.addSource("landpoint_source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "landpoint_label",
          type: "symbol",
          source: "landpoint_source",
          filter:['!in','state','plan'],
          minzoom:8,
          layout: {
            "text-field": [
              "coalesce",['get','recordName'],['get','buildingName'],['get','nickName'],['get','landNumber'],['get','parcelLocation'] //返回第一个非空值
            ],
            "text-font": ["DIN Offc Pro Bold"],
            "text-allow-overlap": true,
            "text-offset": [0, -1],
            "text-anchor": "bottom",
            "text-size":[
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0,
              9,0,
              16, 16
            ],
            "text-letter-spacing": 0.1,
            "text-max-width":10,
            "text-padding":5,
            
            "icon-image": "landPoint",
            "icon-allow-overlap":true,
            "icon-ignore-placement":true,
            "icon-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0,
              9,0,
              16, 0.7
            ],
            "visibility":"visible"
          },
          paint: {
            "text-color": "#202",
            "text-halo-color": "#fff",
            "text-halo-width": 2
          },
        });
        this.ledgerPopup = new that.mbgl.Popup({
          closeButton: true,
          closeOnClick: false,
          anchor:'left',
          offset:20
        });
        map.on("click", "landpoint_label", (e) => {
          //阻止点击事件穿透到底部图层
          e.originalEvent.cancelBubble = true;
          that.layerClick(e)
        });
        map.on("touchstart", "landpoint_label", (e) => {
          //阻止点击事件穿透到底部图层
          e.originalEvent.cancelBubble = true;
          that.layerClick(e)
        });
        map.on("click", "landOutline_fill", (e) => {
          //阻止上层图层的点击事件穿透
          if (e.originalEvent.cancelBubble) {
            return;
          }
          that.layerClick(e)
        });
        map.on("touchstart", "landOutline_fill", (e) => {
          //阻止上层图层的点击事件穿透
          if (e.originalEvent.cancelBubble) {
            return;
          }
          that.layerClick(e)
        });
        //线图层
        map.addSource("lines_source",{
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        })
        map.addLayer({
          id:"layer_line",
          type:"line",
          source:"lines_source",
          minzoom:8,
          paint:{
            "line-width": [
              "coalesce",
              ['get','lineWidth'],
              1
            ],
            "line-color": [
              "coalesce",
              ['get','lineColor'],
              '#ecf5ff'
            ],
            "line-opacity": [
              "coalesce",
              ['get','lineHy'],
              0.5
            ]
          }
        })
        map.addLayer({
          id:"layer_line_symbol",
          type:"symbol",
          source:"lines_source",
          minzoom:8,
          layout: {
            "symbol-placement":"line",
            "text-field": [
              "coalesce",['get','landNumber'],['get','parcelLocation'] //返回第一个非空值
            ],
            "text-font": ["DIN Offc Pro Bold"],
            "text-allow-overlap": true,
            "text-offset": [0, -1],
            "text-anchor": "bottom",
            "text-size":[
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0,
              11,4,
              16, 16
            ],
            "text-letter-spacing": 0.1,
            "text-max-width":10,
            "text-padding":5,
          },
          paint:{
            "text-color": "#202",
            "text-halo-color": "rgba(255,255,255,1)",
            "text-halo-width": 2
          }
        })
        map.on("click", "layer_line", (e) => {
          if (e.originalEvent.cancelBubble) {
            return;
          }
          that.layerClick(e)
        });
        map.on("click", "layer_line_symbol", (e) => {
          e.originalEvent.cancelBubble = true;
          that.layerClick(e)
        });
        //点图层
        map.addSource("points_source",{
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        })
        map.addLayer({
          id:"layer_point",
          type:"symbol",
          source:"points_source",
          minzoom:8,
          layout: {
            "text-field": [
              "coalesce",['get','landNumber'],['get','parcelLocation'] //返回第一个非空值
            ],
            "text-font": ["DIN Offc Pro Bold"],
            "text-allow-overlap": true,
            "text-offset": [0, -1],
            "text-anchor": "bottom",
            "text-size":[
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0,
              11,4,
              16, 16
            ],
            "text-letter-spacing": 0.1,
            "text-max-width":10,
            "text-padding":5,
            
            "icon-image": "landPoint",
            "icon-allow-overlap":true,
            "icon-ignore-placement":true,
            "icon-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 0,
              11,0.4,
              16, 0.7
            ],
            "visibility":"visible"
          },
          paint:{
            "text-color": "#202",
            "text-halo-color": "#fff",
            "text-halo-width": 2
          }
        })
        map.on("click", "layer_point", (e) => {
          e.originalEvent.cancelBubble = true;
          that.layerClick(e)
        });
      }
    },
    //图层点击事件
    layerClick(e){
      var that = this
      if(that.modifyOutline||that.drawOutline||that.customState||that.measureState){ //重绘、修改轮廓、自定义板块绘制、测量模式不可点击
        return false
      }
      if(e.features.length>1){ //土地数量>1
        that.clickLandInfo = {
          features:e.features,
          lngLat:e.lngLat
        }
      }else{
        that.clickLandInfo = {}
      }
      that.briefInfo(e,0)
    },
    //弹出简要信息面板
    async briefInfo(e,i){
      var that = this
      var map = that.ledger_map
      let coordinates = [e.lngLat.lng, e.lngLat.lat];
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      var id = e.features[i].properties.id;
      var kind = e.features[i].properties.kind;
      var code = e.features[i].properties.code;
      var center = e.features[i].properties.center;
      var name = e.features[i].properties.landNumber?e.features[i].properties.landNumber:e.features[i].properties.parcelLocation;
      const infos = await that.getShortInfo(id) //请求土地信息
      
      that.ledgerPopup.setLngLat(coordinates).setHTML(infos).addTo(map);
      that.$('.land_score_btn').click(()=>{
        //that.$message('该功能后续开放')
        if(!center){
          that.$message('该地块没有中心点，无法进行土地评分')
        }else{
          that.ledgerCoord = center
          that.$store.dispatch('setCurLandCoords',center)
          that.ledgerPopup.remove()
          let fcenter = center.split(',')
          map.flyTo({
            center: fcenter,
            zoom: 12,
            speed: 0.6,
            curve: 1.42
          })
        }
      })
      that.$('.land_info_btn').click(()=>{
        //that.curLandId = id
        that.$store.dispatch('setCurLandId',id)
        that.ledgerPopup.remove()
      })
      that.$('.land_share_btn').click(()=>{
        let key = Encrypt(id)
        that.shareUrl = 'http://www.tzymap.com/#/shareland?id='+key
      })

      that.$('.sale_house_btn').click(()=>{
        let obj = {
          id:id,
          name:name,
          center:center
        }
        that.$store.dispatch('setCurLandSaleInfo',obj)
        that.ledgerPopup.remove()
      })
      //飞到土地中心点并选中土地
      that.showLand(e.lngLat.lng+','+e.lngLat.lat,id,kind)
      //列表定位
      if(that.isSearch||(that.cityCode!=='510100'&&that.curListTab=='gov')){
        let index = that.loadLandID.indexOf(id)
        let top = 25*(index>0?(index):0)
        that.$("#list_tree").children().first().scrollTop(top)
        that.$refs.landTree.setCurrentKey(id)
      }else{
        console.log(code)
        if(code=="null"||code==''){ //根土地定位
          that.landExpanded = []
          this.$refs.landTree.store._getAllNodes().forEach(item=>{
            item.expanded = false
          })
          let index = that.loadLandID.indexOf(id)
          let top = 25*(index>0?(index):0)
          that.$("#list_tree").children().first().scrollTop(top)
          that.$refs.landTree.setCurrentKey(id)
        }else{ //文件夹内土地定位
          let folder = []
          if(that.curListTab==='self'||that.curListTab==='friend'){ //个人、好友
            folder = code.split('_')
          }else if(that.curListTab==='gov'){ //公共
            let fol = code.split('_')
            fol.forEach((f,j)=>{
              if(j==0){
                folder.push(f)
              }else{
                folder.push(folder[j-1]+'_'+f)
              }
            })
          }
          
          let index = that.loadLandID.indexOf(folder[0])
          that.landExpanded = folder
          this.$refs.landTree.store._getAllNodes().forEach(item=>{
            if(folder.includes(item.id)){
              item.expanded = true
            }else{
              item.expanded = false
            }
          })
          if(that.curListTab==='self'||that.curListTab==='friend'){
            ledgerApi.searchLandChild({pid:folder[folder.length-1],datatype:that.curListTab})
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data
                let getData = data.apage.concat(data.ipage)
                let jndex
                getData.forEach((item,j)=>{
                  if(item.id === id){
                    jndex = j
                  }
                })
                let top = 25*(index+folder.length+jndex)
                that.$("#list_tree").children().first().scrollTop(top)
                setTimeout(() => {
                  that.$refs.landTree.setCurrentKey(id)
                }, 600)
                
              }
            })
          }else if(that.curListTab==='gov'){
            let rfol = code.split('_')
            let obj = { datatype:'gov',landType: [rfol[0]]}
            if(rfol.length==2){
              obj.region = [rfol[1]]
            }else if(rfol.length==3){
              obj.region = [rfol[1]]
              obj.year = rfol[2]
            }
            ledgerApi.getAllLands(obj)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data.land_list
                let jndex
                data.forEach((item,j)=>{
                  if(item.id === id){
                    jndex = j
                  }
                })
                let top = 25*(index+folder.length+jndex)
                that.$("#list_tree").children().first().scrollTop(top)
                setTimeout(() => {
                  that.$refs.landTree.setCurrentKey(id)
                }, 600)
              }
            })
          }
        }
      }
      //document.getElementById(id).scrollIntoView()
    },
    //获取简要数据
    getShortInfo(id){
      var that = this
      return ledgerApi.getMyLedgerDetail(id)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data

          var kind = data.kind
          var recordName = data.recordName;
          var landNumber = data.landNumber;
          var remarks = data.remarks;
          var parcelLocation = data.parcelLocation;
          var landArea = data.landArea;
          var volumeRatio = data.volumeRatio;
          var buildArea = data.buildArea;
          var state = that.convertLandTypeText(data.state);
          var date = data.date;
          if(date!=='null'&&date!==null){
            let date1 = date.split(' ')
            date = date1[0]
          }else{
            date = '-'
          }
          var startFloorPrice = data.startFloorPrice;
          var price = data.price;
          var actualFloorPrice = data.actualFloorPrice;
          var premiumRatio = data.premiumRatio;
          var comFreetransfer = data.comFreetransfer;
          var fixedPrice = data.fixedPrice;
          var competeCompany = data.competeCompany;
          var region = data.region;
          var realName = data.realName;
          
          let btns = that.isAdmin||that.isSuperUser?'<div class="land_score_btn">评分</div><div class="sale_house_btn">在售</div>':''
          let creater = that.isAdmin?`<div class="item_name" style="width:100%;">创建人：<span class="item_val">${realName? realName : "-"}</span></div>`:``
          var info1 = `<div class="infos_wrap">${recordName!==null&&recordName!=''?`<div class="item_name" style="width:100%;">备案名：<span class="item_val">${recordName}</span></div>`:``}
          <div class="item_name" style="width:100%;">宗地编号：<span class="item_val">${landNumber!==null&&landNumber!=='null'&&landNumber!==''? landNumber : "-"}</span></div>
            <div class="item_name">所属区域：<span class="item_val">${region!==null&&region!=='null'&&region!==''? region : "-"}</span></div>
            <div class="item_name">占地面积：<span class="item_val">${landArea!==null&&landArea!=='null'&&landArea!==''? landArea.toFixed(2) : "-"} 亩</span></div>
            <div class="item_name">容积率：<span class="item_val">${volumeRatio!==null&&volumeRatio!=='null'&&volumeRatio!==''? JSON.parse(volumeRatio).toFixed(2) : "-"}</span></div>
            <div class="item_name">建筑面积：<span class="item_val">${buildArea!==null&&buildArea!=='null'&&buildArea!==''? parseInt(buildArea) : "-"} ㎡</span></div>
            <div class="item_name">交易状态：<span class="item_val">${state!==null&&state!=='null'&&state!==''? state : "-"}</span></div>
            <div class="item_name">交易日期：<span class="item_val">${date}</span></div>
            <div class="item_name">起始楼面价：<span class="item_val">${startFloorPrice!==null&&startFloorPrice!=='null'&&startFloorPrice!==''? parseInt(startFloorPrice) : "-"} 元/㎡</span></div>
            <div class="item_name">成交楼面价：<span class="item_val">${price!==null&&price!=='null'&&price!==''? parseInt(price) : "-"} 元/㎡</span></div>
            <div class="item_name">溢价率：<span class="item_val">${premiumRatio!==null&&premiumRatio!=='null'&&premiumRatio!==''?(premiumRatio*100).toFixed(1): "-"} %</span></div>
            <div class="item_name">实际楼面价：<span class="item_val">${actualFloorPrice!==null&&actualFloorPrice!=='null'&&actualFloorPrice!==''? parseInt(actualFloorPrice) : "-"} 元/㎡</span></div>
            <div class="item_name" style="width:100%;">移交比例：<span class="item_val">${comFreetransfer!==null&&comFreetransfer!=='null'&&comFreetransfer!==''? comFreetransfer : "-"}</span></div>
            <div class="item_name" style="width:100%;">新房限价：<span class="item_val">${fixedPrice!==null&&fixedPrice!=='null'&&fixedPrice!==''? fixedPrice : "-"}</span></div>
            <div class="item_name" style="width:100%;">竞得者：<span class="item_val">${competeCompany!==null&&competeCompany!=='null'&&competeCompany!==''? competeCompany : "-"}</span></div>
            ${creater}
            <div class="land_opt">
              <div class="land_info_btn">详情</div>
              <div class="land_share_btn">分享</div>
              ${btns}
            </div>
          </div>`;
          var info2 = `<div class="infos_wrap" style="width:200px;">
            <div class="item_name" style="width:100%;">图层名称：<span class="item_val">${parcelLocation!==null&&parcelLocation!=='null'&&parcelLocation!==''? parcelLocation : "-"}</span></div>
            <div class="item_name" style="width:100%;">所属区域：<span class="item_val">${region!==null&&region!=='null'&&region!==''? region : "-"}</span></div>
            <div class="item_name" style="width:100%">备注：<span class="item_val">${remarks!==null&&remarks!=='null'&&remarks!==''? remarks : "-"}</span></div>
          </div>`;
          return kind=="POLYGON"?info1:info2
        }
      })
    },
    //无坐标数据的土地点击列表名称直接打开土地信息
    showLandInfo(data){ 
      if(data.leaf==='2'){
        if(data.center===null&&data.coordinates===null){
          this.$store.dispatch('setCurLandId',data.id)
        }
        if(data.center!==null&&data.coordinates!==null){
          this.$store.dispatch('setCurLandId',null)
        }
      }
    },
    //添加土地边界、中心点临时图层
    loadLandTemporaryLayer(){
      var map = this.ledger_map
      //临时边界图层
      if(map.getSource('ladgerLand')==undefined){
        map.addSource("ladgerLand", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "ladgerLand_fill",
          type: "fill",
          source: "ladgerLand",
          layout: {
            visibility: "visible",
          },
          paint: {
            "fill-color": "#ffff00",
            "fill-opacity": 0.4,
          },
        });
        map.addLayer({
          id: "ladgerLand_line",
          type: "line",
          source: "ladgerLand",
          layout: {
            visibility: "visible",
          },
          paint: {
            "line-color":'#fff',
            "line-opacity": 0.25,
            "line-width": 1
          },
        });
        map.addLayer({
          id: "ladgerLand_labels",
          type: "symbol",
          source: "ladgerLand",
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["DIN Offc Pro Bold"],
            "text-allow-overlap": true,
            "text-size": 12,
            "text-letter-spacing": 0.1,
          },
          paint: {
            "text-color":'#fff'
          },
        });
      }
      //临时中心点
      if(map.getSource('ledgerAddLayer')==undefined){
        map.addSource("ledgerAddLayer", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "ledgerAddPoint",
          type: "symbol",
          source: "ledgerAddLayer",
          layout: {
            "icon-image": "landPoint",
            "text-field": "{name}",
            "text-offset": [0, -3.5],
            "icon-offset": [0, -24],
            "text-anchor": "top",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 13,
            "icon-size": 0.5,
            "visibility": "visible",
          },
          paint: {
            "text-opacity": 1,
            "text-halo-color": "rgba(255,255,255,1)",
            "text-halo-width": 1.5,
            "text-color": "#1b82f1",
          },
        });
      }
    },
    //新建土地边界图层设置
    landLayerSet(){
      let features = []
      if(this.landCoordinates!==null){
        let feature = JSON.parse(JSON.stringify(this.landCoordinates))
        feature.properties.name = '新建土地'
        features = [feature]
      }
      
      var geojson = {
        "type": "FeatureCollection",
        "features": features
      }
      let map = this.ledger_map
      map.setLayoutProperty('ladgerLand_fill','visibility','visible')
      map.setLayoutProperty('ladgerLand_labels','visibility','visible')
      map.getSource('ladgerLand').setData(geojson)
    },
    //地图绘制事件
    ledgerMapEvent(){
      var that = this
      var map = this.ledger_map
      map.on('touchstart',e=>{
        console.log('地图触摸事件')
      })
      map.on("click", (e) => {
        //console.log(e);
        if(that.addLand){ //添加土地位置
          that.landLng = e.lngLat.lng
          that.landLat = e.lngLat.lat
          that.landInfos.center = e.lngLat.lng+','+e.lngLat.lat
          if(that.landInfos.address == '' || that.landInfos.address == null){
            that.getGaodeAdress(e.lngLat.lng,e.lngLat.lat)
          }
          that.setSiteRegion(e.lngLat.lng+','+e.lngLat.lat)
          var geojson = {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [e.lngLat.lng, e.lngLat.lat]
              },
              "properties": {
                "name": '新建土地'
              }
            }]
          }
          map.getSource('ledgerAddLayer').setData(geojson)
          that.addLand = false
          that.uploadShow = true
          map.getCanvas().style.cursor = ''
          that.addMaker.remove()
          that.addMaker = null

          //重置城市城区数据
          //that.cities = []
          //that.regionArr = []
        }
        if(that.enclosureType==='circle'){ //筛选半径圆
          that.setRadiusCircle(e.lngLat)
          map.getCanvas().style.cursor = 'default'
          that.addMaker.remove()
          that.addMaker = null
          that.enclosureType = null
          that.$message('围栏已绘制 点击筛选土地')
          that.$refs.filterPover.doShow()
        }
      });
      map.on('mousemove',(e)=>{
        if(that.addMaker){ //更新绘制提示maker
          that.addMaker.setLngLat([e.lngLat.lng,e.lngLat.lat])
          map.getCanvas().style.cursor = 'crosshair'
        }
        if((that.drawOutline||that.modifyOutline)&&!that.tocreatShow){ //绘制土地轮廓
          //计算绘制面积
          let drawFeature = that.ledgerDraw.getAll()
          let coorditionates = drawFeature.features[0].geometry.coordinates[0]
          if(coorditionates.length>3){
            that.makerEl.innerHTML = that.getArea(coorditionates);
            that.addMaker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
          }
        }
      })
      map.on('mouseup',(e)=>{
        
      })
      map.on('draw.create', function (e) {
        if(that.drawOutline){ //土地轮廓绘制
          console.log(e.features);
          that.landCoordinates = e.features[0]
          that.landFeatureID = e.features[0].id
          that.landLayerSet()
          map.getCanvas().style.cursor = 'default'
          that.addMaker.remove()
          that.addMaker = null
          that.uploadShow = true
          that.drawOutline = false
        }
        if(that.enclosureType){ //筛选围栏绘制
          that.filterCoords =  e.features[0].geometry.coordinates[0]
          console.log(that.filterCoords)
          map.getCanvas().style.cursor = 'default'
          that.addMaker.remove()
          that.addMaker = null
          that.enclosureType = null
          that.$message('围栏已绘制 点击筛选土地')
          that.$refs.filterPover.doShow()
        }
      });
      map.on('draw.update', function (e) {
        if(that.drawOutline||that.modifyOutline){
          console.log(e.features);
          that.landCoordinates = e.features[0]
          that.landLayerSet()
        }
      });
      map.on('draw.delete', function (e) {
        if(that.drawOutline){
          console.log(e.features);
          that.landCoordinates = null
          that.landFeatureID = null
          that.landLayerSet()
        }
        if(that.enclosureType){ //筛选围栏绘制
          that.filterCoords = null
        }
      });
      //添加地图图标
      map.loadImage("http://47.104.165.136:8099/test/chengdu/icons/land_point.png",function(error, landPoint) {
        if (error) throw error;
        map.addImage("landPoint", landPoint);
      });
    },
    //计算面积
    getArea(coords) {
      var polygon = turf.polygon([coords]);
      var area = turf.area(polygon);
      area = Math.round(area) //平方米
      var area1 = (area * 0.0015).toFixed(2) //亩
      var str = area+' ㎡; '+area1+' 亩'
      return str;
    },
    //获取点击位置所在区县code
    setSiteRegion(coordinates){
      var that = this
      ledgerApi.getSiteRegionno({cityCode:this.cityCode,coordinates:coordinates})
      .then(res=>{
        if(res.data.code===0){
          that.landInfos.regionno = res.data.data.id
        }
      })
    },
    getGaodeAdress(lng, lat) {
      //高德地图坐标反查API
      var that = this
      that.$.ajax({
        type: "get",
        url: "https://restapi.amap.com/v3/geocode/regeo",
        cache: false,
        dataType: "json",
        data: {
          key: "d222a0cc9d49fe7a60ab4b123a20c34a",
          location: lng + "," + lat,
          poitype: "",
          radius: 200,
          extensions: "all",
          batch: false,
          roadlevel: 0,
        },
        success: (data) => {
          console.log(data);
          if (data && data.status === "1") {
            let address = data.regeocode.addressComponent;
            //this.areaInfo.belongArea = address.city+address.district //行政区
            let pointAddress =
              address.city +
              address.district +
              address.township +
              address.streetNumber.street +
              address.streetNumber.number; //详细地址
              that.landInfos.address = pointAddress
          } else {
            this.$message("未获取到改位置地址");
            that.landInfos.address = '未获取到地址,请手动输入'
          }
        },
      });
    },
    //重绘土地
    repaintLand(id){
      this.uploadShow = false
      this.ledgerDraw.delete(id)
      this.landCoordinates = null
      this.landFeatureID = null
      this.landLayerSet()
      //添加maker
      if(this.addMaker==null){
        let map = this.ledger_map
        this.makerEl = document.createElement('div');
        this.makerEl.setAttribute('class', 'measure-result');
        this.makerEl.innerHTML = '点击开始重绘,双击结束'
        var option = {
          element: this.makerEl,
          anchor: 'top',
          offset: [0, -35]
        };
        this.addMaker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
      this.drawPolygon()
    },
    //修改土地轮廓
    modifyLandOutline(id){
      console.log(this.landCoordinates)
      if(this.landCoordinates==null){
        this.$message('轮廓还未绘制，请先绘制轮廓')
        return
      }
      if(this.landLng !== null&&this.landLat !== null){
        this.ledger_map.flyTo({
          center:[this.landLng,this.landLat],
          zoom: 17
        })
      }
      this.modifyOutline = true
      this.uploadShow = false
      let coordType = typeof(this.landCoordinates)
      if(coordType=='string'){ //有四至修改
        this.modifyBackCoord = JSON.parse(JSON.stringify(this.landCoordinates)) //备份要修改的坐标
        let c1 = this.landCoordinates.split(';')
        c1.pop()
        let coor = []
        c1.forEach(c=>{
          let c2 = c.split(',')
          coor.push([JSON.parse(c2[0]),JSON.parse(c2[1])])
        })
        let feature = {
          type: 'Feature',
          properties: {},
          id: this.landId,
          geometry: { type: 'Polygon', coordinates: [coor] }
        }
        this.ledgerDraw.add(feature);
      }
      if(this.addMaker==null){
        let map = this.ledger_map
        if(this.makerEl==null){
          this.makerEl = document.createElement('div');
          this.makerEl.setAttribute('class', 'measure-result');
          this.makerEl.innerHTML = '点击开始绘制土地轮廓'
        }else{
          this.makerEl.innerHTML = '点击开始绘制土地轮廓'
        }
        var option = {
          element: this.makerEl,
          anchor: 'top',
          offset: [0, -35]
        };
        this.addMaker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
    },

    //**修改内容**
    //删除文件夹    
    relieveGroup(id,name){   
      this.$confirm('确认删除文件夹——'+name+'?')
      .then(() => {
          let res = ledgerApi.unLandgroup(id)
          res.then(res=>{
            if(res.data.code === 0){
              this.$message({
                type: 'success',
                message: '文件夹-'+name+'已删除!'
              })
              //更新土地
              this.changeLandType()
              this.getSelfTree()
            }else{
              this.$message.error(res.data.msg)
            }
          })
          
      })
      .catch(() => {});
    },
    //设置添加文件夹的信息
    setAddFolder(data){
      this.curAddFloder = data
      this.showAddFolder = true
    },
    //设置重命名文件夹的信息
    setReFolder(data){
      this.curAddFloder = data
      this.showReFolder = true
    },
    //删除土地   
    deleteLand(data){ 
      var that = this 
      let name = data.landNumber?data.landNumber:data.name
      that.$confirm('确认删除——'+name+'?')
      .then(() => {
          ledgerApi.delLand(data.id)
          .then(res=>{
            if(res.data.code === 0){
              if(that.isSearch){ //搜索状态
                that.searchLand()
              }else{
                //新增修改删除通知LandPoly
                that.$store.dispatch('setCmNotice',{
                  kind:data.kind,
                  id:data.id,
                  type:'delete'
                })
                that.changeLandType(null,true)
              }
              that.$message({
                type: 'success',
                message: name+'已删除!'
              })
            }else{
              that.$message.error(res.data.msg)
            }
          })
          
      })
      .catch(() => {});
    },
    //移出土地
    removeLand(data){ 
      var that = this
      let name = data.landNumber?data.landNumber:data.name
      that.$confirm('是否将土地——'+name+'移出文件夹？')
      .then(() => {
          let res = ledgerApi.remLand(data.id)
          res.then(res=>{
            if(res.data.code === 0){
              //更新土地
              if(that.isSearch){ //搜索状态
                that.searchLand()
              }else{
                that.changeLandType(null,true)
              }
              that.$message({
                type: 'success',
                message: '土地-'+name+'已移出!'
              })
            }else{
              that.$message.error(res.data.msg)
            }
          })
          
      })
      .catch(() => {});
    },
    //修改土地信息
    modifyLand(item){
      var that = this
      if(item.type=="land"){ //土地数据修改
        ledgerApi.getMyLedgerDetail(item.id)
        .then(res=>{
          console.log('土地详情',res)
          if(res.data.code===0){
            let data = res.data.data
            that.landId = data.id
            if(data.coordinates){
              that.landCoordinates = data.coordinates
            }
            if(data.center){
              let center = data.center.split(',')
              that.landLng = center[0]
              that.landLat = center[1]
            }
            for(let key in that.landInfos){
              if(key!=='participationList'&&key!=='bidHistory'&&key!=='pictures'&&key!=='files'&&key!=='zips'&&key!=='coordinates'){
                that.landInfos[key] = data[key]
              }
              // if(key==='premiumRatio'){ //溢价率转为百分制
              //   if(data[key]){
              //     that.landInfos[key] = data[key]*100
              //   }
              // }
            }
            that.uploadShow = true
            that.modifyMode = true
          }
        })
      }else{ //点线数据修改
        that.$store.dispatch('setPLModifyId',item.id)
      }
    },
    
    //设置添加的土地信息
    setAddInfo(data,type){ //type:addtofolder-添加到文件夹 addtoself添加为个人土地
      this.getSelfTree()
      this.curAddLand = data
      if(type==='addtofolder'){
        this.tofolderState = true
        this.toselfState = false
      }else if(type==='addtoself'){
        this.tofolderState = false
        this.toselfState = true
      }
      if(data.landNumber){
        this.curAddLandName = data.landNumber
      }else{
        this.curAddLandName = data.name
      }
    },
    //添加到、切换分组+添加到个人土地
    addToFolder(){
      var that = this
      if(that.tofolderState){ //添加到、切换分组
        let obj = {
          "accountId":that.curAddToFloder.id,
          "landId":[that.curAddLand.id]
        }
        ledgerApi.groupLands(obj)
        .then(res=>{
          if(res.data.code===0){
            that.tofolderState = false
            that.curAddToFloder = ''
            that.selectTreeName = ''
            that.curAddLand = null
            that.$message.success('土地已添加到分组')
            //更新土地
            if(that.isSearch){ //搜索状态
              that.searchLand()
            }else{
              that.changeLandType(null,true)
            }
          }else{
            that.$message.error(res.data.msg)
          }
        })
      }
      if(that.toselfState){ //添加到个人土地
        let obj = {
          "landId":that.curAddLand.id
        }
        if(that.curAddToFloder!==''){
          obj.pid = that.curAddToFloder.id
        }
        ledgerApi.addToselfLand(obj)
        .then(res=>{
          if(res.data.code===0){
              that.toselfState = false
              that.curAddToFloder = ''
              that.selectTreeName = ''
              that.curAddLand = null
              that.$message.success('已添加到个人土地')
            }else{
              that.$message.error(res.data.msg)
            }
        })
      }
    },
    //取消分组
    cancelGroup(){ 
      this.showGroupBtn = false
      this.resetLandCheck()
    },
    //新建分组、添加到分组
    createAddGroup(){ 
      var that = this
      if(that.createModel=='create'){ //创建文件夹，不选择土地则创建一个空文件夹
        if(that.groupName==''){
          that.$message('请输入分组名称')
        }else{
          let obj = {
            "name":that.groupName,
            "accountId":'',
            "landId":that.checkLandIdArr,
            "cityCode":that.cityCode
          }
          ledgerApi.groupLands(obj)
          .then(res=>{
            if(res.data.code===0){
              //更新土地
              that.changeLandType(null,true)
              that.groupName = ""
              that.showGroupBtn = false
              that.getSelfTree()
            }else{
              that.$message.error(res.data.msg)
            }
          })
        }
      }else{ //将土地添加到文件夹，至少选择一块土地，必须选择一个文件夹
        if(that.checkLandIdArr.length===0){
          that.$message('至少选择一块土地添加到文件夹')
        }else if(that.curAddToFloder==''){
          that.$message('请选择文件夹')
        }else{
          let obj = {
            "accountId":that.curAddToFloder.id,
            "landId":that.checkLandIdArr
          }
          ledgerApi.groupLands(obj)
          .then(res=>{
            if(res.data.code===0){
              //更新土地
              that.changeLandType(null,true)
              that.curAddToFloder = ""
              that.selectTreeName = ""
              that.showGroupBtn = false
            }else{
              that.$message.error(res.data.msg)
            }
          })
        }
      }
    },
    //在分组下创建分组
    addFolder(){
      let that = this
      if(that.curAddFloder!==null){
        let obj = {
          "cityCode":that.cityCode,
          "name":that.groupName,
          "pid":that.curAddFloder.id
        }
        ledgerApi.groupLands(obj)
        .then(res=>{
          if(res.data.code===0){
            //更新土地
            that.changeLandType(null,true)
            that.getSelfTree()
            that.groupName = ""
            that.showAddFolder = false
            that.curAddFloder = null
          }else{
            that.$message.error(res.data.msg)
          }
        })
      }
    },
    //重命名分组
    renameFolder(){
      let that = this
      if(that.curAddFloder!==null){
        let obj = {
          "name":that.groupNewName,
          "id":that.curAddFloder.id
        }
        ledgerApi.ledgerBaseUpdata(obj)
        .then(res=>{
          if(res.data.code===0){
            //更新土地
            that.changeLandType(null,true)
            that.getSelfTree()
            that.groupNewName = ""
            that.showReFolder = false
            that.curAddFloder = null
          }else{
            that.$message(res.data.msg)
          }
        })
      }
    },
    resetData(){ //重置数据
      this.landId = null
      this.landCoordinates = null
      this.parList = []
      this.bidList = []
      this.picturesList = []
      this.filesList = []
      this.zipsList = []
      this.landLng = null
      this.landLat = null
      this.$refs.landinfosEdit.resetFields();
      //重置城市城区数据
      //this.cities = []
      //this.regionArr = []
      this.filterProvince = ''
      //清除临时图层
      this.deletAddPoint()
    },
    creatUpdataLand(){ //提交、更新土地信息
      var that = this
      that.$refs.landinfosEdit.validate((valid) => {
        if (valid) {
          const formData = new FormData();
          if(that.modifyMode){
            formData.append('id',that.landId)
          }
          //上传土地信息
          let coordStr = ''
          let coordinates = that.landCoordinates
          if(coordinates!==null){ //土地轮廓为非必填
            if(typeof coordinates === 'string'){
              coordStr = coordinates
            }else{
              let coord = coordinates.geometry.coordinates[0]
              coord.forEach(co=>{
                coordStr += (co[0]+','+co[1]+';')
              })
            }
            formData.append('coordinates',coordStr)
          }
          
          if(that.landInfos.landCityno==''||that.landInfos.landCityno==null){
            that.landInfos.landCityno = that.cityCode
          }
          const info = that.landInfos
          for(let key in info){
            if(info[key]!==null){
              if(key=='participationList'||key=='bidHistory'){ //参拍企业、出价记录，单文件
                formData.append(key+'_',info[key])
              }else if(key=='pictures'||key=='files'||key=='zips'){ //文件上传多文件
                info[key].forEach(item=>{
                  formData.append(key+'_',item)
                })
              }
              // else if(key==='premiumRatio'){ //溢价率转为非百分制
              //   if(info[key]!==''){
              //     formData.append(key,(JSON.parse(info[key])/100).toFixed(2))
              //   }
              // }
              else{
                formData.append(key,info[key])
              }
            }
          }
          that.creatLoading = true
          ledgerApi.ledgerLandCreat(formData,that.modifyMode)
          .then(res=>{
            if(res.data.code===0){
              that.$message.success(that.modifyMode?'土地数据已更新':'土地已创建')
              //新增修改通知LandPoly
              that.$store.dispatch('setCmNotice',{
                kind:info.kind,
                id:that.modifyMode?that.landId:res.data.data,
                type:that.modifyMode?'modify':'create'
              })
              if(that.isSearch){ //搜索状态
                that.searchLand()
              }else{
                //更新土地
                that.changeLandType(null,true)
              }
              
              //移除临时点跟土地轮廓
              that.deletAddPoint()
              that.uploadShow = false
              that.addLand = false
              that.modifyMode = false
              that.creatlandMenu = false
              that.creatLoading = false
              that.resetData()
              this.$store.dispatch('setCreateLandFlag',false)
            }else{
              that.$message.warning(res.data.msg)
              that.creatLoading = false
            }
          })
        }else{
          console.log('error submit!!');
          return false;
        }
      })
    },
    //添加开盘信息
    addOpeningInfo(){
      if(this.landType=='sales'){
        this.salesInfo.openingInfo.push({
          openTime:'',
          openFormat:'',
          openArea:'',
        })
      }else if(this.landType=='liquidation'){
        this.liquidationInfo.openingInfo.push({
          openTime:'',
          openFormat:'',
          openArea:'',
        })
      }
    },
    //删除开盘信息
    removeOpeningInfo(i){
      if(this.landType=='sales'){
        this.salesInfo.openingInfo.splice(i,1)
      }else if(this.landType=='liquidation'){
        this.liquidationInfo.openingInfo.splice(i,1)
      }
    },
    //选择文件
    fileSelect(file,fileList,key){
      console.log(file,fileList,key)
      const isLimit = file.size / 1024 / 1024 < (this.isAdmin?5:2)
      if(key==='participationList'||key==='bidHistory'){ //参拍企业、出价记录文件上传
        if(!isLimit) {
          this.$message.warning(`上传文件大小不能超过${this.isAdmin?'5MB':'2MB'}!`);
          return false;
        }else{
          this.landInfos[key] = file.raw
        }
      }else{ //图片文件压缩包文件上传
        if(key==="pictures"){
          this.picturesList = fileList
        }else if(key==="files"){
          this.filesList = fileList
        }else if(key==="zips"){
          this.zipsList = fileList
        }
        if(!isLimit) {
          this.$message.warning(`${file.name}文件大小超过${this.isAdmin?'5MB':'2MB'}!`)
          if(key==="pictures"){
            this.picturesList.splice(-1,1)
          }else if(key==="files"){
            this.filesList.splice(-1,1)
          }else if(key==="zips"){
            this.zipsList.splice(-1,1)
          }
          return false;
        }else{
          this.landInfos[key].push(file.raw)
        }
      }
    },
    //文件列表移除文件
    fileRemove(file,fileList,type){
      console.log(file,fileList,type)
      if(type==='participationList'){
        this.landInfos.participationList = null
        this.parList = []
      }else if(type==='bidHistory'){
        this.landInfos.bidHistory = null
        this.bidList = []
      }else{
        if(type==='pictures'){
          this.picturesList = fileList
        }else if(type==='files'){
          this.filesList = fileList
        }else if(type==='zips'){
          this.zipsList = fileList
        }
        this.landInfos[type].forEach((item,i)=>{
          if(item.uid===file.raw.uid){
            this.landInfos[type].splice(i,1)
          }
        })
      } 
      
    },
    //下载模板
    getFileModule(type){
      var that = this
      if(type=='participationList'){ //参拍企业模板下载
        ledgerApi.getModuleCompany()
        .then(res=>{
          if(res){
            let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});  // res就是接口返回的文件流了
            if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                navigator.msSaveBlob(blob, '参拍企业')
            } else {
                const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
                const a = document.createElement('a') //创建a标签
                a.style.display = 'none'
                a.href = href // 指定下载链接
                a.download = '参拍企业模板' //指定下载文件名
                a.click() //触发下载
                URL.revokeObjectURL(a.href) //释放URL对象
            }
            that.$message.success('模板已下载')
          }
        })
      }else if(type=='bidHistory'){ //企业出价记录模板下载
        ledgerApi.getModuleBidHistory()
        .then(res=>{
          if(res){
            let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});  // res就是接口返回的文件流了
            if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                navigator.msSaveBlob(blob, '企业出价记录')
            } else {
                const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
                const a = document.createElement('a') //创建a标签
                a.style.display = 'none'
                a.href = href // 指定下载链接
                a.download = '企业出价记录' //指定下载文件名
                a.click() //触发下载
                URL.revokeObjectURL(a.href) //释放URL对象
            }
            that.$message.success('模板已下载')
          }
        })
      }
    },
    //飞到土地中心点并选中土地
    showLand(center,id,kind){ //kind 图形类型
      var map = this.ledger_map
      if(center){
        //飞往中心点
        var site = center.split(',')
        map.flyTo({
          center: site?site:this.plateData.curCityInfo.center,
          zoom: site?14:9,
          speed: 1.2,
          curve: 1.42
        })
        if(kind=="POLYGON"){
          //选中土地
          let borderColor = ["match", ["get", "id"],id,'#3cff43',
            [
              "coalesce",
              ['get','lineColor'],
              [
              "case",
                ["boolean", ["==", ["get", "state"], "announcement"], false],
                  "#0000ff", //蓝色
                ["boolean", ["==", ["get", "state"], "supply_cls"], false],
                  "#0000ff", //蓝色
                ["boolean", ["==", ["get", "state"], "traded"], false],
                  "#ff0000", //红色
                ["boolean", ["all",["==", ["get", "state"],"traded"], ["==", ["get", "commerce"],"traded"]], false],
                  "#ffff4c", //黄色
                '#fff'
              ]
            ]
          ]
          let borderColorPs = ["match", ["get", "id"],id,'#3cff43',
            [
              "coalesce",
              ['get','lineColor'],
              [
                "case",
                  ["boolean", ["==", ["get", "state"], "plan"], false],
                  "#000000", //黑色
                  ["boolean", ["==", ["get", "state"], "plan_focus"], false],
                  "#8bc34a", //黑色
                  ["boolean", ["==", ["get", "state"], "supply"], false],
                  "#0000ff", //蓝色
                  '#fff'
              ]
            ]
          ]
          let borderWidth = ["match", ["get", "id"],id,2,[ "coalesce", ['get','lineWidth'], 1 ]]
          map.setPaintProperty("landOutline_line", "line-color", borderColor)
          map.setPaintProperty("landOutline_line", "line-width", borderWidth)
          map.setPaintProperty("landOutline_line_ps", "line-color", borderColorPs)
          map.setPaintProperty("landOutline_line_ps", "line-width", borderWidth)

          map.setPaintProperty("layer_point", "text-halo-color", "#fff")
          map.setPaintProperty("layer_line_symbol", "text-halo-color", "#fff")
        }else{ //点线
          map.setPaintProperty("landOutline_line", "line-color", [
            "coalesce",
            ['get','lineColor'],
            [
            "case",
              ["boolean", ["==", ["get", "state"], "announcement"], false],
                "#0000ff", //蓝色
              ["boolean", ["==", ["get", "state"], "supply_cls"], false],
                "#0000ff", //蓝色
              ["boolean", ["==", ["get", "state"], "traded"], false],
                "#ff0000", //红色
              ["boolean", ["all",["==", ["get", "state"],"traded"], ["==", ["get", "commerce"],"traded"]], false],
                "#ffff4c", //黄色
              '#fff'
            ]
          ])
          map.setPaintProperty("landOutline_line", "line-width", 1)
          map.setPaintProperty("landOutline_line_ps", "line-color", [
            "coalesce",
            ['get','lineColor'],
            [
              "case",
              ["boolean", ["==", ["get", "state"], "plan"], false],
              "#000000", //黑色
              ["boolean", ["==", ["get", "state"], "plan_focus"], false],
              "#8bc34a", //黑色
              ["boolean", ["==", ["get", "state"], "supply"], false],
                "#0000ff", //蓝色
              '#fff'
            ]
          ])
          map.setPaintProperty("landOutline_line_ps", "line-width", 1)
        }
        let symbolColor = ["match", ["get", "id"],id,'#3cff43','#ffffff']
        map.setPaintProperty("layer_point", "text-halo-color", symbolColor)
        map.setPaintProperty("layer_line_symbol", "text-halo-color", symbolColor)
        map.setPaintProperty("landpoint_label", "text-halo-color", symbolColor)
      }
    },
    //图层筛选
    landTypeAllChange(val){
      let arr = []
      this.landTypeArr.forEach(item=>{
        arr.push(item.value)
      })
      this.landTypeCheck = val?arr:[]
      this.landTypeIsAll = false
    },
    landTypeChange(val){
      let checkedCount = val.length;
      this.landTypeAll = checkedCount === this.landTypeArr.length;
      this.landTypeIsAll = checkedCount > 0 && checkedCount < this.landTypeArr.length;
    },
    landUseAllChange(val){
      let arr = []
      this.landUseArr.forEach(item=>{
        arr.push(item.value)
      })
      this.landUseCheck = val?arr:[]
      this.landUseIsAll = false
    },
    landUseChange(val){
      let checkedCount = val.length;
      this.landUseAll = checkedCount === this.landUseArr.length;
      this.landUseIsAll = checkedCount > 0 && checkedCount < this.landUseArr.length;
    },
    regionAllChange(val){
      let arr = []
      this.regionArr.forEach(item=>{
        item.options.forEach(op=>{
          arr.push(op.value)
        })
      })
      this.regionCheck = val?arr:[]
      this.regionIsAll = false
    },
    regionChange(val){
      let arr = []
      this.regionArr.forEach(item=>{
        item.options.forEach(op=>{
          arr.push(op.value)
        })
      })
      let checkedCount = val.length;
      this.regionAll = checkedCount === arr.length;
      this.regionIsAll = checkedCount > 0 && checkedCount < arr.length;
    },
    //取消轮廓修改
    modifyCancel(){
      this.landCoordinates = JSON.parse(JSON.stringify(this.modifyBackCoord))
      this.modifyOutline = false
      this.uploadShow = true
      this.ledgerDraw.deleteAll()
      this.ledger_map.getCanvas().style.cursor = ''
      if(this.addMaker){
        this.addMaker.remove()
        this.addMaker = null
      }
    },
    //修改轮廓
    modifyOk(){
      this.modifyOutline = false
      this.uploadShow = true
      this.modifyBackCoord = null
      this.ledger_map.getCanvas().style.cursor = ''
      if(this.addMaker){
        this.addMaker.remove()
        this.addMaker = null
      }
    },
    //全选可删除、导出土地
    handleCheckAllLand(val){
      this.optionInfo = []
      if(val){
        this.getTreeAllData(this.landsGroup)
      }
      let IdArr = []
      this.optionInfo.forEach(item=>{
        IdArr.push(item.accountId?item.accountId:item.landId)
      })
      this.landDefault = val?IdArr:[]
      this.checkLandIdArr = val?IdArr:[]
      this.$refs.landTree.setCheckedKeys(this.landDefault)
    },
    //获取树全部数据
    getTreeAllData(data){
      data.forEach(item=>{
        if(item.leaf==='2'){ //2为土地，0,1为文件夹
          this.optionInfo.push({
            landId:item.id,
            pid:item.pid
          })
        }else{
          this.optionInfo.push({
            accountId:item.id,
            pid:item.pid
          })
        }
        if(item.lands?.length>0){
          this.getTreeAllData(item.lands)
        }
      })
    },
    //确认删除勾选的土地
    deleteCheckLand(){
      var that = this
      that.deleteTip = false
      if( that.optionInfo.length>0 ){
        that.delLoading = true
        ledgerApi.deleteFolderLand({
          lists:that.optionInfo
        })
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('所选土地已删除')
            that.changeLandType()
            that.delLoading = false
          }else{
            that.$message.error(res.data.msg)
            that.delLoading = false
          }
        })
      }else{
        that.$message('至少选择一项')
      }
    },
    //导出所选土地
    exportCheckLand(){
      var that = this
      that.deleteTip = false
      if(that.optionInfo.length===0){
        that.$message('至少选择一项')
      }else{
        let reqObj
        if(that.curListTab=='gov'){ //公共土地的导出方式做处理
          let list = []
          that.optionInfo.forEach(item=>{
            let obj = {}
            if(item.accountId!==null){
              obj.accountCode = item.accountId
            }
            if(item.landId!==null){
              obj.landId = item.landId
            }
            list.push(obj)
          })
          reqObj = {
            lists:list
          }
          reqObj.exportType = 'common'
          reqObj.landCityno = that.cityCode
        }else{
          reqObj = {
            lists:that.optionInfo
          }
        }
        that.expLoading = true
        //校验用户的导出权限
        ledgerApi.batchExpLandCheck(reqObj)
        .then(resC=>{
          if(resC.data.code===500){
            that.$message.warning(resC.data.msg)
            that.expLoading = false
          }else{
            ledgerApi.batchExpLand(reqObj)
            .then(res=>{
              let a = document.createElement('a');
              let blob = new Blob([res.data], {type: "application/vnd.ms-excel"}); 
              let objectUrl = URL.createObjectURL(blob);
              a.setAttribute("href",objectUrl);
              a.setAttribute("download", '导出土地'+new Date().toLocaleString());
              a.click();
              that.$message.success('土地数据已导出')
              // window.URL.revokeObjectURL(a.href);
              // document.body.removeChild(a);
              that.expLoading = false
            })
          }
        })
        
      }
    },
    //清除选择的目标文件夹
    clearCurFolder(){
      this.curAddToFloder = ''
      this.selectTreeName = ''
    },
    //导出官方为csv
    exportCsvExport(){
      var that = this
      that.deleteTip = false
      if(that.optionInfo.length===0){
        that.$message('至少选择一项')
      }else{
        let reqObj
        let list = []
        that.optionInfo.forEach(item=>{
          let obj = {}
          if(item.accountId!==null){
            obj.accountCode = item.accountId
          }
          if(item.landId!==null){
            obj.landId = item.landId
          }
          list.push(obj)
        })
        reqObj = {
          "exportType": "common",
          "lists":list,
        }
        //reqObj.exportType = 'common'
        reqObj.landCityno = that.cityCode
        
        that.expLoading = true
        ledgerApi.exportGovCsv(reqObj)
        .then(res=>{
          console.log(res)
          if(res.data){
            let a = document.createElement('a');
            let blob = new Blob(["\ufeff"+res.data], {type: 'text/csv;charset=UTF-8'}); 
            let objectUrl = URL.createObjectURL(blob);
            a.setAttribute("href",objectUrl);
            a.setAttribute("download", '官方土地'+new Date().toLocaleString()+'.csv');
            a.click();
            that.$message.success('所选土地已导为csv文件')
            window.URL.revokeObjectURL(a.href);
            //document.body.removeChild(a);
            that.expLoading = false
          }else{
            that.$message.error('未发现导出数据')
            that.expLoading = false
          }
        })
      }
    },
    //批量公共土地转到个人
    toselfCheckLand(){
      var that = this
      that.deleteTip = false
      if(that.optionInfo.length===0){
        that.$message('至少选择一项')
      }else{
        let reqObj
        let list = []
        that.optionInfo.forEach(item=>{
          let obj = {}
          if(item.accountId!==null){
            obj.accountCode = item.accountId
          }
          if(item.landId!==null){
            obj.landId = item.landId
          }
          list.push(obj)
        })
        reqObj = {
          "lists":list,
          "accountId":that.curAddToFloder.id,
        }
        //reqObj.exportType = 'common'
        reqObj.landCityno = that.cityCode
        
        that.expLoading = true
        ledgerApi.addToselfLand(reqObj)
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('所选土地已添加到个人')
            that.expLoading = false
            that.curAddToFloder = ''
            that.selectTreeName = ''
          }else{
            that.$message.warning(res.data.msg)
            that.expLoading = false
          }
        })
      }
    },
    //切换每页条数
    listSizeChange(val){
      console.log('每页条数',val)
      this.landPageNum = val
      this.landCurPage = 1
      // let data = JSON.parse(JSON.stringify(this.landsGroupBackup))
      // this.landsGroup = data.slice(0,val)
      this.changeLandType()
      this.checkAllLand = false
    },
    //切换当前页
    curPageChange(val){
      console.log('当前页',val)
      this.landCurPage = val
      // let data = JSON.parse(JSON.stringify(this.landsGroupBackup))
      // this.landsGroup = data.slice(this.landPageNum*(val-1),this.landPageNum*val)
      this.changeLandType()
      this.checkAllLand = false
    },
    //显示隐藏所有土地
    checkShowAllLand(val){
      console.log(this.landsGroup)
      if(val){
        this.$refs.landpoly.controlLayer(null,null);
        this.landDefault = JSON.parse(JSON.stringify(this.landDefaultBac))
      }else{
        this.landDefault = []
        this.$refs.landpoly.controlLayer([],[]);
      }
      this.$refs.landTree.setCheckedKeys(this.landDefault)
    },
    //土地分组
    setLandGroup(){
      this.showGroupBtn = !this.showGroupBtn
      this.showDeleteBtn = false
      this.showExportBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      this.showShareBtn = false
      if(this.showGroupBtn){
        this.landDefault = []
        this.$refs.landTree.setCheckedKeys(this.landDefault)
        this.checkLandIdArr = []
        this.showLandAll = false
      }else{
        this.resetLandCheck()
      }
    },
    //土地批量删除
    setLandDelete(){
      this.showDeleteBtn = !this.showDeleteBtn
      this.showGroupBtn = false
      this.showExportBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      this.showShareBtn = false
      if(this.showDeleteBtn){
        this.landDefault = []
        this.$refs.landTree.setCheckedKeys(this.landDefault)
        this.checkLandIdArr = []
        this.showLandAll = false
      }else{
        this.resetLandCheck()
      }
    },
    //批量导出土地
    setLandExport(){
      this.showExportBtn = !this.showExportBtn
      this.showDeleteBtn = false
      this.showGroupBtn = false
      this.showShareBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      if(this.showExportBtn){
        this.landDefault = []
        this.$refs.landTree.setCheckedKeys(this.landDefault)
        this.checkLandIdArr = []
        this.showLandAll = false
      }else{
        this.resetLandCheck()
      }
    },
    //批量转到个人土地
    setLandToself(){
      this.showToselfBtn = !this.showToselfBtn
      this.showDeleteBtn = false
      this.showGroupBtn = false
      this.showShareBtn = false
      this.showExportBtn = false
      if(this.showToselfBtn){
        this.landDefault = []
        this.$refs.landTree.setCheckedKeys(this.landDefault)
        this.checkLandIdArr = []
        this.showLandAll = false
      }else{
        this.resetLandCheck()
      }
    },
    
    //批量导出csv
    setCsvXeport(){
      this.showCsvexpBtn = !this.showCsvexpBtn
      this.showDeleteBtn = false
      this.showGroupBtn = false
      this.showShareBtn = false
      this.showExportBtn = false
      this.showToselfBtn = false
      if(this.showCsvexpBtn){
        this.landDefault = []
        this.$refs.landTree.setCheckedKeys(this.landDefault)
        this.checkLandIdArr = []
        this.showLandAll = false
      }else{
        this.resetLandCheck()
      }
    },
    //批量分享
    shareLands(){
      this.showShareBtn = !this.showShareBtn
      this.showExportBtn = false
      this.showDeleteBtn = false
      this.showGroupBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      if(this.showShareBtn){
        this.landDefault = []
        this.$refs.landTree.setCheckedKeys(this.landDefault)
        this.checkLandIdArr = []
        this.showLandAll = false
      }else{
        this.resetLandCheck()
      }
    },
    //重置土地勾选状态
    resetLandCheck(){
      this.landDefault = JSON.parse(JSON.stringify(this.landDefaultBac))
      //this.checkShowAllLand(true)
      this.showLandInd = false
      this.showLandAll = true
    },
    //删除选框
    delEnclosure(){
      var map = this.ledger_map
      this.ledgerDraw.deleteAll()
      let layerFlag = map.getSource("radiusCircleSource")
      if(layerFlag){
        map.getSource("radiusCircleSource").setData({
          type: "FeatureCollection",
          features: []
        });
      }
      this.filterCoords = null
    },
    //围栏方式
    setEnclosure(val){ 
      this.enclosureType = val
      this.$refs.filterPover.doClose()
      this.$message('请在地图上绘制围栏')
      var map = this.ledger_map

      this.makerEl = document.createElement('div');
      this.makerEl.setAttribute('class', 'measure-result');
      if(val==='custom'){ //自定义围栏
        this.ledgerDraw.changeMode('draw_polygon')
        this.makerEl.innerHTML = '地图点击绘制围栏'
        //清除半径圆
        let layerFlag = map.getSource("radiusCircleSource")
        if(layerFlag){
          map.getSource("radiusCircleSource").setData({
            type: "FeatureCollection",
            features: []
          });
        }
      }else{ //半径圈
        this.makerEl.innerHTML = '地图点击确认圆点'
        //退出绘制模式清除多边形
        this.ledgerDraw.deleteAll()
      }
      if(this.addMaker==null){
        var option = {
          element: this.makerEl,
          anchor: 'top',
          offset: [0, -35]
        };
        this.addMaker = new this.mbgl.Marker(option).setLngLat([0, 0]).addTo(map);
      }
    },
    //半径圆绘制
    setRadiusCircle(lngLat){
      var that = this
      let map = this.ledger_map;
      let layerFlag = map.getSource("radiusCircleSource")
      if(layerFlag===undefined){
        map.addSource("radiusCircleSource", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
        map.addLayer({
          id: "radiusCircle_fill",
          type: "fill",
          source: "radiusCircleSource",
          "layout": {},
          "paint": {
            "fill-color": "#ff7f4e",//"#7dfd3e","#409EFF"
            "fill-opacity": 0.06
          }
        });
        map.addLayer({
          id: "radiusCircle_line",
          type: "line",
          source: "radiusCircleSource",
          "layout": {},
          "paint": {
            "line-color":"#ff7f4e",
            "line-dasharray": [2, 4],
            "line-width":1.5,
            "line-opacity": 0.9
          }
        });
        map.addLayer({
          "id": "radiusCircle_symbol",
          "type": "symbol",
          "source": "radiusCircleSource",
          "layout": {
            "text-field":"半径 "+(that.circleRadius?that.circleRadius:5)+'Km',
            "text-font": ["DIN Offc Pro Bold"],
            "symbol-placement": "line",
            "text-padding": 1,
            "text-max-angle": 90,
            "text-allow-overlap": true,
            "text-size": {
              base: 1.2,
              stops: [
                [8, 12],
                [22, 30],
              ],
            },
            "text-letter-spacing": 0.1,
          },
          "paint": {
            "text-halo-color": "hsl(55, 1%, 20%)",
            "text-color": "#fff",
            "text-halo-width": 2,
          }
        });
      }

      var points = 64; //点的个数
      var km = that.circleRadius?that.circleRadius:5; //半径
      var ret = [];
      var distanceX = km/(111.320*Math.cos(lngLat.lat*Math.PI/180));
      var distanceY = km/110.574;
      var theta, x, y;
      for(var i=0; i<points; i++) {
          theta = (i/points)*(2*Math.PI);
          x = distanceX*Math.cos(theta);
          y = distanceY*Math.sin(theta);
          ret.push([lngLat.lng+x, lngLat.lat+y]);
      }
      ret.push(ret[0]);
      let geojsonData = {
        type: "FeatureCollection",
        features: [{
        "type": "Feature",
        "properties": { "name": '暂无'}, 
        "geometry": {
          "type": "Polygon",
          "coordinates": [ret],
        }
      }]
      }
      map.getSource("radiusCircleSource").setData(geojsonData);
      that.filterCoords = ret
      console.log(that.filterCoords)
    },
    //土地搜索
    searchLand(){
      var that = this
      //退出分组、删除、导出操作
      this.showGroupBtn = false 
      this.addGroupId = null
      this.showDeleteBtn = false
      this.showExportBtn = false
      this.showShareBtn = false
      this.showToselfBtn = false
      this.showCsvexpBtn = false
      this.landCurPage = 1
      that.serchLoading = true
      that.landLoading = true

      let reqObj = that.searchCon() //查询条件
      if(that.searchVal!==''){
        reqObj.searchName = that.searchVal
      }
      ledgerApi.searchLands(reqObj)
      .then(res=>{
        if(res.data.code===0){
          let data = res.data.data
          console.log('土地列表数据-未排序',data)
          that.landListNum = data.total
          that.landListData = data.list
          let getData = data.list
          let checkArr = []
          let landIdarr = []
          getData.forEach(item=>{
            if(item.createDate){
              let date = item.createDate.split(' ')
              item.createDate = date[0]
            }
            if(item.leaf==='2'){ //土地
              item.parentId = item.pid
              item.isLeaf = true
              checkArr.push(item.id)
            }else{  //分组
              item.lands = []
              item.parentId = item.pid
              item.isLeaf = false //是否为叶子节点
            }
            landIdarr.push(item.id)
          })
          that.loadLandID = landIdarr
          let loadId = JSON.parse(JSON.stringify(that.loadLandID))
          if(!that.showDeleteBtn&&!that.showGroupBtn){ //删除或者分组状态土地不做勾选
            that.landDefault = that.showLandAll?loadId:[]
          }
          that.landsGroupBackup = getData
          that.landsGroup = getData
          that.serchLoading = false
          that.landLoading = false
          that.isSearch = true
        }else{
          that.$message.error(res.data.msg)
          that.serchLoading = false
          that.landLoading = false
        }
      })
    },
    //清空搜索返回列表
    backLandList(){
      var that = this
      if(that.isSearch){
        that.landCurPage = 1
        that.landPageNum = 200
        that.changeLandType()
        that.isSearch = false
      }
    },
    //单位换算
    unitConverse(type,val){
      if(val===''){
        return false
      }else{
        if(type==='landArea1'){ //出让面积㎡转亩
          this.landInfos.landArea = (JSON.parse(val)*0.0015).toFixed(2)
        }
        if(type==='landArea'){ //出让面积亩转㎡
          this.landInfos.landArea1 = (JSON.parse(val)*666.66).toFixed(2)
        }
        if(this.landInfos.volumeRatio!==''){ //计算计算建筑面积=出让面积*计算容积率
          this.landInfos.buildArea = (JSON.parse(this.landInfos.landArea1)*JSON.parse(this.landInfos.volumeRatio)).toFixed(2)
        }
      }
    },
    //输入计算容积率计算计算建筑面积
    getBusinessArea(val){
      if(val!==''&&this.landInfos.landArea1!==''){
        this.landInfos.buildArea = (JSON.parse(this.landInfos.landArea1)*JSON.parse(val)).toFixed(2)
      }
    },
    //分享土地给好友
    shareLandToFriend(){
      var that = this
      if(that.shareFriendId===null){
        that.$message('请先选择要分享的好友')
      }else if(that.optionInfo.length===0){
        that.$message('至少选择一个分享内容')
      }else{
        let obj = {
          friendId:that.shareFriendId,
          lists:that.optionInfo
        }
        friendsApi.shareLands(obj)
        .then(res=>{
          if(res.data.code===0){
            that.$message.success('内容已推送给好友')
            that.shareTip = false
            //存储推送的分享信息到localstorage
            let optionInfo = {
              friendId:that.shareFriendId,
              msg:res.data.data
            }
            this.$store.dispatch('setShareInfo',optionInfo)
          }else{
            that.$message.error(res.data.msg)
          }
        })
        
      }
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
    //修改侧边栏宽度
    changeSidebar(e){
      let e1 = e.currentTarget;
      let e2 = e.target;
      if(e1 === e2){ //阻止子元素冒泡
        document.onmousemove = (e)=>{
          //更新移动量
          this.sidebarW += e.movementX;
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    //关闭分享链接界面
    closeShareBox(){
      this.shareUrl = null
    }, 
    //剪切板拷贝成功
    onCopy: function (e) {
      this.$message.success('拷贝成功')
    },
    //剪切板拷贝失败
    onError: function (e) {
      console.log('Failed to copy texts',e)
    },
  }
}
</script>
<style lang="scss">
.tip{
  color:#f60;
  margin-top:8px;
}
.fold_label .el-form-item__label {
  white-space: pre-line;
  text-align: right;
  line-height: 17px;
  position: relative;
  top: 8px;
}
.colors{
  .item{
    display:flex;
    align-items:center;
    margin-top:15px;
    &:first-child{
      margin: 0;
    }
    .label{
      margin-right:10px;
      margin-left:20px;
    }
  }
}
.filter_box{
  
  .el-select-dropdown__item{
    height: 25px;
    line-height: 25px;
  }
  .el-select-group__title{
    line-height: 20px;
  }
  .el-select-group__wrap:not(:last-of-type) {
    padding-bottom: 15px;
  }
  .land_search{
    display: flex;
    align-items: center;
  }
  .search_box{
    display: flex;
    justify-content: space-between;
  }
  .filter_range{
    display: flex;
    flex-wrap: wrap;
    .filter_item{
      width: 50%;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .el-input__inner{
        padding: 0 5px;
      }
      .name{
        width: 66px;
      }
      .unit{
        margin: 0 10px;
      }
    }
  }
}
.landlabel_box{
  display: flex;
  flex-wrap: wrap;
  max-height: 300px;
  overflow-y: scroll;
  .el-tag{
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  }
.filter_label{
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 5px;
}
.ledger{
  .shareurl_box{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    .box{
      width: 30%;
      position: relative;
      .close_sharebox{
        font-size: 18px;
        position: absolute;
        right: -25px;
        top: -25px;
        cursor: pointer;
        color: #fef0f0;
      }
    }
  }
  .clcik_land{
    position: fixed;
    z-index: 999;
    right: 100px;
    top: 23%;
    width: 200px;
    height: 50vh;
    .list_icon{
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: #fff;
    }
    .top{
      height: 40px;
      line-height: 40px;
      color: #e6a23c;
      font-size: 14px;
    }
    .land_wrap{
      width: 100%;
      height: calc(100% - 40px);
      overflow-y: scroll;
      padding-right: 5px;
      .land_item{
        background: rgba(0,0,0,0.6);
        margin-bottom: 10px;
        border-radius: 6px;
        color: #fff;
        font-size: 12px;
        padding: 10px;
        cursor: pointer;
        transition: all 0.5s;
        &:hover{
          background: rgba(49, 59, 69, 0.7);
        }
        .land_number{
          color: #66b1ff;
        }
        .land_name{
          margin-top: 10px;
          color: #c0c4cc;
        }
      }
    }
  }
  .tocreat_btn{
    position: fixed;
    right: 20%;
    top: 20%;
    z-index: 999;
  }
  .creatland_btns{
    position: fixed;
    right: 20px;
    bottom: 140px;
    z-index: 999;
    transition: all 0.5s;
    .centered {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      .plus {
        width: 50px;
        cursor:pointer;
        transition: all .3s ease 0s;
        height: 50px;
        background: #67c23a;
        border-radius: 50%;
        display: flex;
        position: relative;
        &__line {
          width: 3px;
          height: 25px;
          background: rgba(0,0,0,0.8);
          border-radius:10px;
          position: absolute;
          left: calc(50% - 1.5px);
          top: calc(50% - 12.5px);
          &--h {
            transform: rotate(90deg);
          } 
          &--v {
            
            overflow: hidden;
            transition: all .4s ease 0s;
            .wrap{
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-around;
            }
          }
        }
        &__link {
          color: #fff;
          font-size: 24px;
          opacity: 0;
          visibility: hidden;
          transition : .3s ease 0s;
          transform:scale(.5);
        }
        &--active {
          height:32px;
          border-radius:30px;
          .plus__line--v {
            display: none;
          }
          .icon_wrap{
            width: 20%;
            text-align: center;
            margin-top: -16px;
            .plus__link{
              opacity:1;
              visibility:visible;
              transform:scale(1);
              transition-delay: .05s;
            }
            .menu_name{
              font-size: 12px;
              color: #fff;
              transition-delay: .05s;
            }
            &:hover .menu_name{
              color: #44d2fd;
            }
            &:hover .plus__link{
              color: #44d2fd;
            }
          }
        }
        
      }
    }
  }
  .ledger_box{
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    left: 0px;
    z-index: 998;
    background: rgba(19,37,43,0.9);
    width: 300px;
    user-select: none;
    .handle{
      position: absolute;
      right: 0px;
      top: 0;
      width: 5px;
      background: none;
      cursor: w-resize;
      height: 100%;
    }
    .add_folder,.rename_folder,.self_tree{
      position: absolute;
      top: 200px;
      right: -220px;
      width:190px;
      padding: 10px;
      background: #fff;
      border-radius: 10px;
      .addicon{
        position: absolute;
        right: -15px;
        top: -15px;
        color: #fff;
        cursor: pointer;
      }
    }
    .convenient_box{
      position: absolute;
      top: -200px;
      right: -350px;
      transition: all 0.5s;
      .el-checkbox.is-bordered{
        background: #fff;
        margin-right: 6px;
        margin-left: 0;
      }
    }
    .ledger_boxwrap{
      padding: 10px 20px;
      height: 100%;
      .list_tab{
        height: 50px;
        .el-tabs__nav-wrap::after{
          background: linear-gradient(90deg, rgba(0,188,212,0.71), rgba(33,150,243,0.76));
        }
        .el-tabs__active-bar{
          background-color: #ffc107;
        }
        .el-tabs__content{
          height: 0;
          .el-tab-pane{
            height: 0;
          }
        }
        .el-tabs__item{
          color: #c0c4cc;
        }
        .el-tabs__item.is-active {
          font-weight: bold;
          font-size: 18px;
          color: #ffc107;
        }
        .el-tree{
          background: none;
        }
        .el-tree-node__content:hover {
          background-color: unset !important;
          color: #ffec00 !important;
        }
        .el-tree-node__label{
          color: #99faff;
        }
      }
      .el-tree-node__content{
        height: 25px;
      }
    }
    .list_btn{
      position: absolute;
      right: -25px;
      top: 20px;
      cursor: pointer;
      font-size: 20px;
      color: #fff;
      transition: all 0.5s;
      &:hover{
        color:#f4a460;
      }
    }
    .list_top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logo_name{
        width: 60%;
        display: flex;
        align-items: center;
        .logo{
          width: 35px;
        }
        .name{
          margin-left: 10px;
          letter-spacing: 6px;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-family: "微软雅黑";
          text-shadow: 0 0 0px #0ebeff, 0 0 10px #0ebeff, 0 0 10px #0ebeff, 0 0 50px #0ebeff, 0 0 100px #0ebeff;
        }
      }
      .top_btns{
        display: flex;
        align-items: center;
        .filter_btn{
          font-size: 16px;
          color: #ff9900;
          cursor: pointer;
          font-weight: bold;
          margin-left: 6px;
        }
        .group_btn,.bdelete_btn,.bexport_btn,.toself_btn,.csvexp_btn,.share_btn{
          font-size: 18px;
          color: #00c4ff;
          cursor: pointer;
          margin-left: 6px;
          position: relative;
          margin-top: -5px;
          
        }
        .bexport_btn,.toself_btn{
          font-weight: bold;
        }
      }
      
    }
    .ledger_btn{
      margin-top: 10px;
      display: flex;
      align-items: center;
      position: relative;
      .gname{
        width: 126px;
        margin-right: 10px;
        margin-top:10px;
      }
      .create_radio .el-radio__label{
        color: #fff;
      }
      
    }
    .ledger_wrap{
      width: 100%;
      height: calc(100% - 120px);
      overflow: hidden;
      .search_tip{
        font-size: 12px;
        color: #c0c4cc;
        position: relative;
        .clsoeicon{
          position: absolute;
          right: 5px;
          top: 5px;
          font-size: 14px;
          cursor: pointer;
          color: #f4a460;
        }
      }
      .cbox{
        .el-checkbox__label{
          color: #ecf5ff;
        }
      }
      .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #4c4949;
        border-color: #7d828f;
        cursor: not-allowed;
      }
      .page_box{
        position: fixed;
        bottom: 10px;
        left: 0px;
        transition: all 0.5s;
        .parge_wrap{
          margin-left: 10px;
          background: #fff;
          padding: 3px;
          border-radius: 6px;
          width: fit-content;
          .el-input--mini .el-input__inner {
            height: 23px;
            line-height: 23px;
            border: none;
          }
          .el-pagination__sizes{
            margin: 0;
          }
          .btn-prev ,.btn-next{
            padding: 0px 6px;
          }
          .el-pagination__jump{
            margin-left: 0;
          }
        }
      }
      .wraps{
        width: 102.5%;
        height: 100%;
        overflow-y: scroll;
        .ledger_item{
          overflow:hidden;
          .land_box{
            border: #e6c63a 2px solid;
            padding: 0 8px;
            position: relative;
            .land:last-child{
              margin-bottom: 0;
            }
            .land{
              color: #fff;
              background-size: cover;
              background-repeat: no-repeat;
              width: 100%;
              height: 30px;
              position: relative;
              margin-bottom: 10px;
              cursor: pointer;
              
              .shadow{
                position: relative;
                z-index: 9;
                background: linear-gradient(45deg, rgba(96, 98, 102, 0.85), transparent);
                display: flex;
                align-items: flex-end;
                transition: all 0.5s ease-in-out;
                height: 100%;
                &:hover{
                  background: linear-gradient(45deg, rgba(78, 123, 150, 0.85), transparent);
                }
                &:hover .btns{
                  right: 0;
                }
                .name_date{
                  width: 90%;
                  height: 100%;
                  position: relative;
                  .land_type{
                    position: absolute;
                    height: 100%;
                    left: 0;
                    top: 0;
                    z-index: 0;
                    width: 10px;
                    opacity: 0.4;
                  }
                  .name{
                    font-size: 14px;
                    user-select: none;
                    color: #fff;
                    margin-left: 25px;
                    line-height: 30px;
                    height: 100%;
                    overflow:hidden;
                  }
                  .date{
                    font-size: 12px;
                    color: #e0e0e0;
                  }
                  .check{
                    position: absolute;
                    left: 0px;
                    top: -3px;
                  }
                }
                .btns{
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  right: -120px;
                  transition: all 0.3s;
                  .op_item{
                    width: 30px;
                    height: 100%;
                    text-align: center;
                    line-height: 30px;
                    background: #000;
                    font-size: 12px;
                  }
                 
                }
                
              }
              .shadow:hover .item{
                display: block;
              }
            }
            .land:after {
              content: "";
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              /* 从父元素继承 background 属性的设置 */
              background: inherit;
              filter: blur(4px);
              z-index: 0;
            }
          }
          .ledger_group{
            position: relative;
            display: flex;
            .ledger_name{
              background: rgba(230, 198, 58, 0.46);
              padding: 3px 5px;
              width: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: fit-content;
              color: #fff;
              font-weight: bold;
              cursor: pointer;
            }
            .add{
              background: #409eff;
              padding: 3px 5px;
              width: 60px;
              text-align: center;
              height: fit-content;
              color: #fff;
              font-weight: bold;
              cursor: pointer;
              display: none;
            }
            .relieve{
              background: #909399;
              padding: 3px 5px;
              width: 60px;
              text-align: center;
              height: fit-content;
              color: #fff;
              font-weight: bold;
              cursor: pointer;
              display: none;
            }
          }
          .ledger_group:hover .add{
            display: block !important;
          }
          .ledger_group:hover .relieve{
            display: block !important;
          }
        }
      }
      .lands_tree{
        margin-top: 10px;
        //height: calc(100% - 46px);
        width: 100%;
        // .el-tree .el-tree-node__expand-icon.expanded {
        //   -webkit-transform: rotate(0deg);
        //   transform: rotate(0deg);
        // }
        // .el-tree .el-icon-caret-right:before {
        //   content: "\e723";
        // }
        // .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
        //   content: "\e722";
        // }
        .el-tree{
          background: none;
          color: #ebeef5;
          padding-right: 5px;
        }
        .el-tree-node__content{
          color: #99faff;
          background: none !important;
        }
        .land_name:hover{
          color: #ffb700 !important;
          font-weight: bold;
        }
        .el-tree-node:focus>.el-tree-node__content{
          background: none !important;
        }
        .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .land_name{
          background: none;
          color: #ffb700 !important;
          font-weight: bold;
        }
        .el-tree-node__expand-icon.is-leaf{
          display: none;
        }
        .land_solt{
          display: flex;
          align-items: center;
          width: 100%;
          height: 30px;
          overflow: hidden;
          position: relative;
          .land_num{
            color: #e6a23c;
          }
          .gicon{
            margin-right: 10px;
          }
          .ticon{
            margin-right: 6px;
            color: #ffb700;
            font-size: 12px;
          }
          .hot_img{
            position: absolute;
            z-index: 1;
            top: 8px;
            right: 0px;
          }
          .land_state{
            padding: 0 2px;
            height: 16px;
            line-height: 17px;
            font-size: 12px;
            color: #fff;
            margin-right: 10px;
            font-weight: bold;
            border-radius: 3px;
          }
          .land_name{
            width: calc(100% - 90px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
          }
          .land_btn{
            position: absolute;
            right: -200px;
            transition: all 0.2s;
            z-index: 9;
            .el-button--mini.is-circle{
              padding: 5px;
            }
          }
          &:hover .land_btn{
            right: 10px;
          }
        }
      }
    }
  }
  .upload_info{
    position: fixed;
    width: 70vw;
    height:85vh;
    left: 15%;
    top: 8%;
    z-index: 999;
    background: rgba(4, 4, 4, 0.5);
    border-radius: 4px;
    padding: 10px;
    padding: 10px;
    .el-form-item__error{
      top: 87%;
    }
    .el-form-item{
      margin: 4px 0;
    }
    .resite{
      font-size: 18px;
      color: #99a9bf;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .modify_imgbox{
    display: flex;
    .img_item{
      width: 148px;
      height: 148px;
      margin-right: 20px;
      position: relative;
      .modify_img{
        width: 100%;
        height: 100%;
      }
      .img_remove{
        position: absolute;
        right: 3px;
        top: 3px;
        color: #f78989;
        font-size: 18px;
        z-index: 99;
        display: none;
        cursor: pointer;
      }
      
    }
    .img_item:hover .img_remove{
        display: block;
      }
  }
  .land_head{
    font-size: 14px;
    padding: 10px 0;
    color: #e6a23c;
  }
  .v-modal{
    display: none;
  }
  .hideAdd {
    .el-upload--picture-card {
      display: none;
    }
  }
  
  .query_info{
    padding: 30px;
    color: #9aa5bb;
    .el-date-editor .el-range-input{
      background: none;
    }
  }
  #parameter {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
  .parameterWrap {
    width: 100%;
    height: 10%;
    position: relative;
  }
  .parameterHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .macroscopicName {
    font-weight: bold;
    font-size: 14px;
    display: inline-block;
    width: 12%;
  }
  .parameterWrap .el-card__body {
    height: 91%;
  }
  .parameterWrap .caseCardContent {
    height: 100%;
    position: relative;
  }
  .parameterTitle{
    margin-left: 20px;
  }
  .el-card__header{
    padding: 5px 20px !important;
  }
  .optionBtns{
    display: flex;
  }
  .demo-table-expand {
    font-size: 0;
    padding: 0 20px;
    background: #1d1f21;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }
  .infoitem_wrap{
    position: relative;
    .add_info{
      position: absolute;
      right: 30px;
      top: 15px;
      font-size: 20px;
      cursor: pointer;
      color: #67c23a;
      z-index: 99;
    }
    .remove_info{
      position: absolute;
      right: 60px;
      top: 15px;
      font-size: 20px;
      cursor: pointer;
      color: #f56c6c;
    }
  }
  .info_item{
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .el-form-item{
      width: 24%;
    }
  }
  .info_item4{
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .el-form-item{
      width: 24%;
    }
  }
  .info_item3{
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 96%;
    .el-form-item{
      width: 33%;
    }
  }
  .baseInfo,.detailInfo{
    background: #fff;
    border-radius: 4px;
    padding: 1%;
    height: 97%;
  }
  .info_head{
    height: 6%;
    border-bottom: #e4e7ed 1px solid;
    display:flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
  }
  .parInfoForm{
    height: 94%;
    width: 100%;
    overflow: scroll;
  }
  
  .parInfoBox .el-input--medium .el-input__inner{
    width: 250px;
  }
  .bottomBar{
    padding: 13px;
  }
  .paginationBox{
    margin-top: 26px;
    text-align: center;
  }
  #myParTable .demo-table-expand label{
    width: 130px;
  }
  #parStatisticalChart{
    margin-top: 30px;
  }
  .ledger_total{
    height: 60%;
    width: 100%;
  }
  #ledger_chart{
    height: 400px;
    width: 100%;
  }
  .modify_info{
    position: fixed;
    top: 30%;
    right: 20%;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 250px;
    z-index: 999;
    .info{
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .lb{
        width: 100px;
      }
    }
    .btn{
      display: flex;
      justify-content: flex-end;
    }
  }
}

  .el-tabs__item.is-disabled:hover{
    cursor: not-allowed;
  }
</style>
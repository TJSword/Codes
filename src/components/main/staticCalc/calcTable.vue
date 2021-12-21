<template>
    <!-- 测算表格 -->
    <div class="calc_table">
        <div class="table_wrap">
            <el-tabs tab-position="top" style="height:100%">
                <el-tab-pane label="指标模拟">
                    <div class="tableC">
                        <div class="tableC_1">
                            <div class="head">
                                <div class="head_item" v-for="item in tableC_1Head" :key="item">{{item}}</div>
                            </div>
                            <div class="contC">
                                <div class="row_item border_b">{{tableC_1Cont.area_mu}}</div>
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.area"></el-input></div>
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.price"></el-input></div>
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.plotRatio"></el-input></div>
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.density"></el-input></div>
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.hLimit"></el-input></div>
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.floorH"></el-input></div>
                                <div class="row_item border_b">{{tableC_1Cont.maxFloor}}</div>
                            </div>
                            <div class="head" style="margin-top:20px;">
                                <div class="head_item">计容</div>
                                <div class="head_item">基底</div>
                            </div>
                            <div class="contC">
                                <div class="row_item inputs border_b"><el-input v-model="tableC_1Cont.cpRatio"></el-input></div>
                                <div class="row_item border_b">{{tableC_1Cont.basal}}</div>
                            </div>
                        </div>
                        <div class="tableC_2" style="margin-top:20px;">
                            <div class="head">
                                <div class="head_item" v-for="item in tableC_2Head" :key="item">{{item}}</div>
                                <el-popover placement="right" trigger="click">
                                    <el-select v-model="tableC_2Select" value-key="label" size="small" placeholder="请选择" style="width:260px" multiple collapse-tags @change="selectProduct">
                                        <el-option-group v-for="group in tableC_2Add"
                                            :key="group.label" :label="group.label">
                                            <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item">
                                                <span style="float: left">{{ item.label }}</span>
                                                <el-tag style="float: right;margin-right:20px" size="mini" 
                                                    :type="item.type=='house'?'success':item.type=='nonord_house'?'primary':'warning'">
                                                    {{ item.type=='house'?'普通住宅':item.type=='nonord_house'?'非普通住宅':'非住宅' }}
                                                </el-tag>
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                    <i slot="reference" class="op_icon el-icon-circle-plus"></i>
                                    <el-button size="small" type="primary" @click="addProduct()" style="margin-left:10px;">新增空白项</el-button>
                                </el-popover>
                            </div>
                            <div class="tc_cont">
                                <div class="contC" v-for="(item,i) in tableC_2Cont" :key="i">
                                    <div class="row_item inputs"><el-input v-model="item.name"></el-input></div>
                                    <div class="row_item">{{item.ratio}}</div>
                                    <div class="row_item inputs"><el-input v-model="item.volume"></el-input></div>
                                    <div class="row_item inputs"><el-input v-model="item.floor"></el-input></div>
                                    <div class="row_item inputs"><el-input v-model="item.hLimit"></el-input></div>
                                    <div class="row_item">{{item.basal}}</div>
                                    <i class="op_icon el-icon-remove" @click="removeProduct(i)"></i>
                                </div>
                                <div class="contC">
                                    <div class="row_item">{{tableC_ground.name}}</div>
                                    <div class="row_item">{{tableC_ground.ratio}}</div>
                                    <div class="row_item">{{tableC_ground.volume}}</div>
                                    <div class="row_item"></div>
                                    <div class="row_item"></div>
                                    <div class="row_item">{{tableC_ground.basal}}</div>
                                </div>
                                <div class="contC">
                                    <div class="row_item border_b"></div>
                                    <div class="row_item border_b"></div>
                                    <div class="row_item border_b"></div>
                                    <div class="row_item border_b"></div>
                                    <div class="row_item border_b">{{tableC_basal.name}}</div>
                                    <div class="row_item border_b">{{tableC_basal.basalTest}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="tableC_3" style="margin-top:20px;">
                            <!-- <div class="tc_cont" style="border-bottom:#ccc 1px solid">
                                <div class="contC" v-for="(item,i) in tableC_3Cont" :key="i">
                                    <div class="row_item">{{item.val1}}</div>
                                    <div class="row_item">{{item.val2}}</div>
                                    <div :class="['row_item',i==2?'inputs':'']">
                                        <el-input v-if="i==2" v-model="item.val3"></el-input>
                                        <div v-else>{{item.val3}}</div>
                                    </div>
                                    <div class="row_item">{{item.val4}}</div>
                                    <div :class="['row_item',i==1?'inputs':'']">
                                        <el-input v-if="i==1" v-model="item.val5"></el-input>
                                        <div v-else>{{item.val5}}</div>
                                    </div>
                                    <div :class="['row_item',i==1?'inputs':'']">
                                        <el-input v-if="i==1" v-model="item.val6"></el-input>
                                        <div v-else>{{item.val6}}</div>
                                    </div>
                                    <div class="row_item">{{item.val7}}</div>
                                </div>
                            </div> -->
                            <div class="head">
                                <div class="head_item">类型</div>
                                <div class="head_item">车位数(个)</div>
                                <div class="head_item">单个车位面积(㎡/个)</div>
                                <div class="head_item">车位面积(㎡)</div>
                                
                            </div>
                            <div class="tc_cont">
                                <div class="contC" v-for="(item,i) in tableC_3Cont" :key="i">
                                    <div :class="['row_item',i==6?'border_b':'']">{{item.name}}</div>
                                    <div :class="['row_item',i==0||i==1?'inputs':'',i==6?'border_b':'']">
                                        <el-input v-if="i==0||i==1" v-model="item.carNum"></el-input>
                                        <div v-else>{{item.carNum}}</div>
                                    </div>
                                    <div :class="['row_item',i==5||i==6?'inputs':'',i==6?'border_b':'']">
                                        <el-input v-if="i==5||i==6" v-model="item.aveArea"></el-input>
                                        <div v-else>{{item.aveArea}}</div>
                                    </div>
                                    <div :class="['row_item',i==5?'inputs':'',i==6?'border_b':'']">
                                        <el-input v-if="i==5" v-model="item.carArea"></el-input>
                                        <div v-else>{{item.carArea}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tableC_4" style="margin-top:20px;">
                            <div class="head">
                                <div class="head_item">配件设施</div>
                                <div class="head_item">物管</div>
                                <div class="head_item">公厕</div>
                                <div class="head_item">社区中心</div>
                            </div>
                            <div class="tc_cont">
                                <div class="contC">
                                    <div class="row_item border_b">面积(㎡)</div>
                                    <div class="row_item inputs border_b"><el-input v-model="tableC_area.pm"></el-input></div>
                                    <div class="row_item inputs border_b"><el-input v-model="tableC_area.wc"></el-input></div>
                                    <div class="row_item inputs border_b"><el-input v-model="tableC_area.cc"></el-input></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="基本经济技术指标">
                    <div class="tableB">
                        <div class="head_flex">
                            <div class="head_item">序号</div>
                            <div class="head_item">类目</div>
                            <div class="head_item">数值</div>
                        </div>
                        <div class="cont">
                            <div class="cont_wrap" style="border:none;">
                                <div class="cont_item" v-for="(item,i) in tableBCont" :key="i">
                                    <div class="self">
                                        <div :class="['row_item ',i==8?'border_b':'']">{{item.index}}</div>
                                        <div :class="['row_item ',i==8?'border_b':'']">{{item.name}}</div>
                                        <div :class="['row_item ',i==8?'border_b':'',i==5?'inputs':'']">
                                            <el-input v-if="i==5" v-model="item.val"></el-input>
                                            <div v-else>{{item.val}}</div>
                                        </div>
                                        <i v-if="item.children" :class="['open ',item.open?'el-icon-remove-outline':'el-icon-circle-plus-outline']" @click="child1Toggle(i,'tableB')"></i>
                                    </div>
                                    <div class="children" :style="{display:item.open?'block':'none'}">
                                        <div class="child_item" v-for="(child1,j) in item.children" :key="j">
                                            <div class="row_item">{{"4-"+(j+1)}}</div>
                                            <div class="row_item">{{child1.name}}</div>
                                            <div class="row_item">{{child1.val}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="融资方案">
                    <div class="tableG">
                        <div class="g1_cont">
                            <div class="head_item border_b">预计项目摘牌时间</div>
                            <div class="row_item border_b">
                                <el-date-picker v-model="tableG1.delisting" type="date" value-format="yyyy-M-d" placeholder="选择日期"></el-date-picker>
                            </div>
                            <div class="head_item border_b">施工证取得日期</div>
                            <div class="row_item border_b">
                                <el-date-picker v-model="tableG1.acpDate" type="date" value-format="yyyy-M-d" placeholder="选择日期"></el-date-picker>
                            </div>
                        </div>
                        <div class="g2_cont">
                            <div class="top">
                                <div class="item3">融资</div>
                                <div class="t2">
                                    <div class="t2_item">
                                        <div class="item2">可售</div>
                                        <div class="t2b">
                                            <div class="item1">额度</div>    
                                            <div class="item1">首次下款时间</div>    
                                        </div>    
                                    </div> 
                                    <div class="t2_item">
                                        <div class="item2">持有</div>
                                        <div class="t2b">
                                            <div class="item1">额度</div>    
                                            <div class="item1">首次下款时间</div>    
                                        </div>    
                                    </div> 
                                </div>
                                <div class="item3">说明</div>
                            </div>
                            <div class="cont">
                                <div class="cont_item" v-for="(item,i) in tableG2" :key="i">
                                    <div :class="['row_item',i==3?'border_b':'']" style="width:200px;"><el-input v-model="item.name"></el-input></div>
                                    <div :class="['row_item',i==3?'border_b':'']"><el-input v-model="item.quota1"></el-input></div>
                                    <div :class="['row_item',i==3?'border_b':'']"><el-input v-model="item.firstDate1"></el-input></div>
                                    <div :class="['row_item',i==3?'border_b':'']"><el-input v-model="item.quota2"></el-input></div>
                                    <div :class="['row_item',i==3?'border_b':'']"><el-input v-model="item.firstDate2"></el-input></div>
                                    <div :class="['row_item',i==3?'border_b':'']" style="width:200px;"><el-input v-model="item.explain"></el-input></div>
                                </div>
                            </div>
                        </div>
                        <div class="date_range">
                            <span class="demonstration">请选择时间范围：</span>
                            <el-date-picker v-model="dateRange" type="monthrange" size="small" :unlink-panels="true" range-separator="至"
                                start-placeholder="开始月份" end-placeholder="结束月份" value-format="yyyy-M">
                            </el-date-picker>
                        </div>
                        <div class="tg_cont">
                            <div>
                                <div class="cont_item" v-for="(item,i) in tableGCont1" :key="i">
                                    <div class="item">
                                        <div class="head_item">{{item.name}}</div>
                                        <div class="head_item">下贷</div>
                                        <div class="head_item">还贷</div>
                                        <div class="head_item">贷款余额</div>
                                        <div class="head_item" v-if="i!=0">执行利率</div>
                                        <div class="head_item">利息</div>
                                        <div :class="['head_item border_b',i==0?'stress':'']">融资成本合计</div>
                                    </div>
                                    <div class="item" v-for="(child,j) in item.children" :key="j">
                                        <div class="row_item">{{child.name}}</div>
                                        <div :class="['row_item',j>1&&i!=0?'inputs':'']">
                                            <el-input v-if="j>1&&i!=0" v-model="child.loan" @input="val=>tgChange(i,j,'loan_reLoan','tg_1')"></el-input>
                                            <div v-else>{{child.loan}}</div>
                                        </div>
                                        <div :class="['row_item',j>1&&i!=0?'inputs':'']">
                                            <el-input v-if="j>1&&i!=0" v-model="child.reLoan" @input="val=>tgChange(i,j,'loan_reLoan','tg_1')"></el-input>
                                            <div v-else>{{child.reLoan}}</div>
                                        </div>
                                        <div class="row_item">{{child.balance}}</div>
                                        <div :class="['row_item',j==0?'inputs':'']" v-if="i!=0">
                                            <el-input v-if="j==0" v-model="child.exeRate" @input="val=>tgChange(i,j,'exeRate','tg_1')"></el-input>
                                            <div v-else>{{child.exeRate}}</div>
                                        </div>
                                        <div class="row_item">{{child.interest}}</div>
                                        <div :class="['row_item border_b',i==0&&j==1?'stress':'']">{{child.tfCosts}}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="cont_item" v-for="(item,i) in tableGCont2" :key="i">
                                    <div class="item">
                                        <div class="head_item colora">{{item.name}}</div>
                                        <div class="head_item colora">下贷</div>
                                        <div class="head_item colora">还贷</div>
                                        <div class="head_item colora">贷款余额</div>
                                        <div class="head_item colora" v-if="i!=0">执行利率</div>
                                        <div class="head_item colora">利息</div>
                                        <div :class="['head_item border_b colora',i==0?'stress':'']">融资成本合计</div>
                                    </div>
                                    <div class="item" v-for="(child,j) in item.children" :key="j">
                                        <div class="row_item">{{child.name}}</div>
                                        <div :class="['row_item',j>1&&i!=0?'inputs':'']">
                                            <el-input v-if="j>1&&i!=0" v-model="child.loan" @input="val=>tgChange(i,j,'loan_reLoan','tg_2')"></el-input>
                                            <div v-else>{{child.loan}}</div>
                                        </div>
                                        <div :class="['row_item',j>1&&i!=0?'inputs':'']">
                                            <el-input v-if="j>1&&i!=0" v-model="child.reLoan" @input="val=>tgChange(i,j,'loan_reLoan','tg_2')"></el-input>
                                            <div v-else>{{child.reLoan}}</div>
                                        </div>
                                        <div class="row_item">{{child.balance}}</div>
                                        <div :class="['row_item',j==0?'inputs':'']" v-if="i!=0">
                                            <el-input v-if="j==0" v-model="child.exeRate" @input="val=>tgChange(i,j,'exeRate','tg_2')"></el-input>
                                            <div v-else>{{child.exeRate}}</div>
                                        </div>
                                        <div class="row_item">{{child.interest}}</div>
                                        <div :class="['row_item border_b',i==0&&j==1?'stress':'']">{{child.tfCosts}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="当地适用计税政策">
                    <div class="tableH">
                        <div class="head">
                            <div class="head_item">类目</div>
                            <div class="head_item">数值</div>
                            <div class="head_item" style="width:300px;">备注</div>
                        </div>
                        <div class="cont1">
                            <div class="cont_item" v-for="(item,i) in tableHCont1" :key="i">
                                <div :class="['row_item ',i==3?'border_b':'']" style="border-left:#ccc 1px solid">{{item.name}}</div>
                                <div :class="['row_item ',i==3?'border_b':'']"><el-input v-model="item.val"></el-input></div>
                                <div :class="['row_item ',i==3?'border_b':'']" style="width:300px;"><el-input v-model="item.remarks"></el-input></div>
                            </div>
                        </div>
                        <div class="cont2">
                            <div class="head_item border_b" style="height:61px;line-height: 61px;">土增税预缴率(%)</div>
                            <div class="c2_left">
                                <div class="top">
                                    <div class="head_item" style="border-left:none;">普通</div>
                                    <div class="head_item">非普通</div>
                                    <div class="head_item">非住宅</div>
                                </div>
                                <div class="bot">
                                    <div class="row_item border_b"><el-input v-model="tableHCont2.houseVal"></el-input></div>
                                    <div class="row_item border_b"><el-input v-model="tableHCont2.nonordVal"></el-input></div>
                                    <div class="row_item border_b"><el-input v-model="tableHCont2.nonVal"></el-input></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="主表">
                    <el-button class="tablef_btn" size="small" style="margin-bottom:10px;" @click="computedTableA()">计算数据</el-button>
                    <div class="tableA">
                        <div class="head_flex">
                            <div class="head_item" v-for="item in tableAhead" :key="item">{{item}}</div>
                        </div>
                        <div class="cont">
                            <div class="cont_wrap">
                                <div class="cont_item" v-for="(item,i) in tableACont" :key="i">
                                    <!-- 第一級 -->
                                    <div class="self">
                                        <div class="row_item">{{item.index}}</div>
                                        <div class="row_item"><el-input v-model="item.name"></el-input></div>
                                        <div class="row_item">{{item.unit}}</div>
                                        <div class="row_item">{{item.quantities}}</div>
                                        <div class="row_item">{{item.unit_price}}</div>
                                        <div class="row_item">{{item.money}}</div>
                                        <div :class="['row_item',i==0?'inputs':'']">
                                            <el-input v-if="i==0" v-model="item.tax_rate"></el-input>
                                            <div v-else>{{item.tax_rate}}</div>
                                        </div>
                                        <div class="row_item"><el-input v-model="item.si_tax"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.responsible"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.remarks"></el-input></div>
                                        <i v-if="item.children" style="color:#f56c6c" :class="['open ',item.open?'el-icon-remove-outline':'el-icon-circle-plus-outline']" @click="child1Toggle(i,'tableA')"></i>
                                    </div>
                                    <!-- 第二級 -->
                                    <div class="children" v-if="item.children" :style="{display:item.open?'block':'none'}">
                                        <div v-for="(child1,j) in item.children" :key="j">
                                            <div class="child_wrap">
                                                <div class="row_item">{{j+1}}</div>
                                                <div class="row_item"><el-input v-model="child1.name"></el-input></div>
                                                <div class="row_item">{{child1.unit}}</div>
                                                <div class="row_item">{{child1.quantities}}</div>
                                                <div :class="['row_item',i==0||(i==1&&(j==2||j==3))?'inputs':'']">
                                                    <el-input v-if="i==0||(i==1&&(j==2||j==3))" v-model="child1.unit_price"></el-input>
                                                    <div v-else>{{child1.unit_price}}</div>
                                                </div>
                                                <div class="row_item"><el-input v-model="child1.money"></el-input></div>
                                                <div :class="['row_item',i==0||(i==1&&(j==2||j==3))?'inputs':'']">
                                                    <el-input v-if="i==0||(i==1&&(j==2||j==3))" v-model="child1.tax_rate"></el-input>
                                                    <div v-else>{{child1.unit_price}}</div>
                                                </div>
                                                <div class="row_item">{{child1.si_tax}}</div>
                                                <div class="row_item">{{child1.responsible}}</div>
                                                <div class="row_item">{{child1.remarks}}</div>
                                                <i v-if="child1.children" style="color:#3a8ee6" :class="['open ',child1.open?'el-icon-remove-outline':'el-icon-circle-plus-outline']" @click="child2Toggle(i,j)"></i>
                                            </div>
                                            <!-- 第三級 -->
                                            <div class="children" v-if="child1.children" :style="{display:child1.open?'block':'none'}">
                                                <div v-for="(child2,k) in child1.children" :key="k">
                                                    <div class="child_wrap">
                                                        <div class="row_item">{{child2.index}}</div>
                                                        <div class="row_item"><el-input v-model="child2.name"></el-input></div>
                                                        <div class="row_item">{{child2.unit}}</div>
                                                        <div :class="['row_item',i==1&&j==1&&k==4?'inputs':'']"><el-input v-model="child2.quantities"></el-input></div>
                                                        <div :class="['row_item',i==1&&((j==0&&k>0)||(j==1&&k==4)||(j==5&&k==0)||(j==8&&k==0))?'inputs':'']"><el-input v-model="child2.unit_price"></el-input></div>
                                                        <div class="row_item">{{child2.money}}</div>
                                                        <div :class="['row_item',i==1&&((j==0&&k==4)||(j==1&&k>2))?'inputs':'']"><el-input v-model="child2.tax_rate"></el-input></div>
                                                        <div class="row_item">{{child2.si_tax}}</div>
                                                        <div class="row_item">{{child2.responsible}}</div>
                                                        <div class="row_item">{{child2.remarks}}</div>
                                                        <i v-if="child2.children" style="color:#67c23a" :class="['open ',child2.open?'el-icon-remove-outline':'el-icon-circle-plus-outline']" @click="child3Toggle(i,j,k)"></i>
                                                    </div>
                                                    <!-- 第四級 -->
                                                    <div class="children" v-if="child2.children" :style="{display:child2.open?'block':'none'}">
                                                        <div v-for="(child3,l) in child2.children" :key="l">
                                                            <div class="child_wrap">
                                                                <div class="row_item"><el-input v-model="child3.index"></el-input></div>
                                                                <div class="row_item"><el-input v-model="child3.name"></el-input></div>
                                                                <div class="row_item"><el-input v-model="child3.unit"></el-input></div>
                                                                <div :class="['row_item',i==1&&j==1&&k==3?'inputs':'']"><el-input v-model="child3.quantities"></el-input></div>
                                                                <div :class="['row_item',i==1&&j==1&&((k==0&&l!=3)||(k==1&&l>1)||k==2||k==3)?'inputs':'']"><el-input v-model="child3.unit_price"></el-input></div>
                                                                <div class="row_item"><el-input v-model="child3.money"></el-input></div>
                                                                <div :class="['row_item',i==1&&j==1?'inputs':'']"><el-input v-model="child3.tax_rate"></el-input></div>
                                                                <div class="row_item"><el-input v-model="child3.si_tax"></el-input></div>
                                                                <div class="row_item"><el-input v-model="child3.responsible"></el-input></div>
                                                                <div class="row_item"><el-input v-model="child3.remarks"></el-input></div>
                                                                <i v-if="child3.children" style="color:#e6a23c" :class="['open ',child3.open?'el-icon-remove-outline':'el-icon-circle-plus-outline']" @click="child4Toggle(i,j,k,l)"></i>
                                                            </div>
                                                            <!-- 第五級 -->
                                                            <div class="children" v-if="child3.children" :style="{display:child3.open?'block':'none'}">
                                                                <div v-for="(child4,m) in child3.children" :key="m">
                                                                    <div class="child_wrap">
                                                                        <div class="row_item"><el-input v-model="child4.index"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.name"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.unit"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.quantities"></el-input></div>
                                                                        <div class="row_item inputs"><el-input v-model="child4.unit_price"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.money"></el-input></div>
                                                                        <div class="row_item inputs"><el-input v-model="child4.tax_rate"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.si_tax"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.responsible"></el-input></div>
                                                                        <div class="row_item"><el-input v-model="child4.remarks"></el-input></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="单方可售验证">
                    <el-button class="tablef_btn" size="small" style="margin-bottom:10px;" @click="computedTableD()">计算数据</el-button>
                    <div class="tableD">
                        <div class="head">
                            <div class="head_item" v-for="item in tableDhead" :key="item">{{item}}</div>
                        </div>
                        <div class="td_cont">
                            <div class="contD" v-for="(item,i) in tableDCont" :key="i">
                                <div class="row_item">{{item.name}}</div>
                                <div class="row_item"><el-input v-model="item.price"></el-input></div>
                                <div class="row_item"><el-input v-model="item.ratio"></el-input></div>
                                <div class="row_item"><el-input v-model="item.si_tax"></el-input></div>
                                <div class="row_item inputs"><el-input v-model="item.tcp"></el-input></div>
                                <div class="row_item inputs"><el-input v-model="item.remarks"></el-input></div>
                            </div>
                            <div class="contD">
                                <div class="row_item border_b" style="width:calc(20% + 1px)">净利润率（含税）</div>
                                <div class="row_item inputs border_b">{{tableD_pm.pm_taxin}}</div>
                                <div class="row_item border_b" style="width:calc(20% + 1px)">净利润率（税后）</div>
                                <div class="row_item inputs border_b">{{tableD_pm.pm_taxout}}</div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="土增税计算表">
                    <div class="tableF">
                        <el-button class="tablef_btn" size="small" style="margin-bottom:10px;" @click="computedTableF()">计算数据</el-button>
                        <div class="tableF_1"> 
                            <div class="tf_head">
                                <div :class="['head_item',i==18?'border_b':'']" v-for="(item,i) in tableFhead" :key="item">{{item}}</div>
                            </div> 
                            <div class="tf_cont">
                                <div class="cont_item" v-for="(item,i) in tableF1Cont" :key="i">
                                    <div class="item_children" v-if="item.children">
                                        <div class="child_item" v-for="(child,j) in item.children" :key="j">
                                            <div class="row_item" :style="{background:child.type=='nonord_house'?'#00b0f0':child.type=='house'?'#00b050':'#ff6600',color:'#fff'}">{{child.name}}</div>
                                            <div class="row_item"><el-input v-model="child.val1"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val2"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val3"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val4"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val5"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val6"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val7"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val8"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val9"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val10"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val11"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val12"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val13"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val14"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val15"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val16"></el-input></div>
                                            <div class="row_item"><el-input v-model="child.val17"></el-input></div>
                                            <div class="row_item border_b"><el-input v-model="child.val18"></el-input></div>
                                        </div>
                                        
                                    </div>
                                    <div class="cont_self" v-else>
                                        <div class="row_item" :style="{background:i==0?'#993300':i==2?'#00b0f0':i==3?'#00b050':'#ff6600',color:i>=0?'#fff':''}">{{item.name}}</div>
                                        <div class="row_item"><el-input v-model="item.val1"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val2"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val3"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val4"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val5"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val6"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val7"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val8"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val9"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val10"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val11"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val12"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val13"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val14"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val15"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val16"></el-input></div>
                                        <div class="row_item"><el-input v-model="item.val17"></el-input></div>
                                        <div class="row_item border_b"><el-input v-model="item.val18"></el-input></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tableF_2">
                            <div class="f2_head">
                                <div class="item" style="height:61px;background:#ddeeff;border:#ccc 1px solid;text-align:center;line-height:61px;">名称</div>
                                <div class="item" style="height:154px;border:#ccc 1px solid;border-top:none;text-align:center;line-height:154px;">土增税比例</div>
                            </div>
                            <div class="f2_cont">
                                <div class="cont_item" v-for="(item,i) in tableF2Cont" :key="i">
                                    <div class="row_item" style="background:#ddeeff;font-weight:bold;"><el-input v-model="item.val1"></el-input></div>
                                    <div class="row_item" style="background:#ddeeff;font-weight:bold;"><el-input v-model="item.val2"></el-input></div>
                                    <div class="row_item"><el-input v-model="item.val3"></el-input></div>
                                    <div class="row_item"><el-input v-model="item.val4"></el-input></div>
                                    <div class="row_item"><el-input v-model="item.val5"></el-input></div>
                                    <div class="row_item"><el-input v-model="item.val6"></el-input></div>
                                    <div class="row_item border_b"><el-input v-model="item.val7"></el-input></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class=""></div>
                </el-tab-pane>
                
                <el-tab-pane label="测算结果">
                    <div class="tableE">
                        <div class="te_cont">
                            <div class="contE" v-for="(item,i) in tableECont" :key="i">
                                <div :class="['row_item',i==4?'border_b':'']">{{i+1}}</div>
                                <div :class="['row_item',i==4?'border_b':'']">{{item.name}}</div>
                                <div :class="['row_item inputs',i==4?'border_b':'']"><el-input v-model="item.val"></el-input></div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
export default {
    name:'calctable',
    data(){
        return {
            tableAhead:['序号','项目','单位','工程量','单价（元/单位）','金额（万元）','适用税率%','销/进项税额','责任部门','备注'],
            tableACont:[
                { open:false,index:'一',name:'销售收入',unit:'',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'营销部',remarks:'',children:[
                    { name:'别墅',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' },
                    { name:'叠拼',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' },
                    { name:'高层',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' },
                    { name:'小高层',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' },
                    { name:'商业综合体',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' },
                    { name:'地下可售车位(个）',unit:'个',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                ] },
                { open:false,index:'二',name:'成本及税费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                    { open:false,index:'1',name:'土地成本',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                        { index:'1.1',name:'土地价格',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'1.2',name:'契税/印花税',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'1.3',name:'指标费(证书OR价款）',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'1.4',name:'交易服务费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'1.5',name:'征地拆迁补偿费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' }
                    ] },
                    { open:false,index:'2',name:'开发成本（不含土地）',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'成本部',remarks:'',children:[
                        { open:false,index:'2.1',name:'前期工程费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                            { index:'2.1.1',name:'三通一平',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.1.2',name:'临时设施费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.1.3',name:'勘察测绘费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { open:false,index:'2.1.4',name:'报建费用',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'报建费用',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'基础设施配套费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { index:'2.1.5',name:'设计费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.1.6',name:'顾问咨询费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.1.7',name:'前期工程其他费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        ] },
                        { open:false,index:'2.2',name:'建安工程费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                            { open:false,index:'2.2.1',name:'地上建安部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'别墅',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'叠拼',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'高层',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'小高层',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'商业综合体',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'地上不计容物业',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.2',name:'地下建安部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'基础工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'土石方工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'基坑支护及降水工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'主体建筑安装工程(不含桩基）',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.3',name:'批量精装修工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.4',name:'样板房装修工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.5',name:'公共区域装修工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.6',name:'外墙装修（专业）',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.7',name:'电梯设备及安装工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'电梯设备安装部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'电梯设备采购部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.2.8',name:'其他建安工程（含甲供）',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                        ] },
                        { open:false,index:'2.3',name:'基础设施费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                            { index:'2.3.1',name:'红线内市政工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.3.2',name:'室外附属工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { open:false,index:'2.3.3',name:'环境景观工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.3.4',name:'自来水工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.3.5',name:'永久性供电工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.3.6',name:'消防系统工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.3.7',name:'室内采暖工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.3.8',name:'室内燃气工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { open:false,index:'2.3.9',name:'安防工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                                { index:'◆',name:'工程部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                                { index:'◆',name:'甲供部分',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            ] },
                            { index:'2.3.10',name:'有线电视工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.3.11',name:'电信系统工程',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.3.12',name:'其他基础设施',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        ] },
                        { open:false,index:'2.4',name:'配套设施费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'',children:[
                            { index:'2.4.1',name:'配套设施费',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.4.2',name:'社区卫生中心',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.4.3',name:'幼儿园',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.4.4',name:'道路',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                            { index:'2.4.5',name:'绿地',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        ] },
                        { open:false,index:'2.5',name:'开发间接费用',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' }
                    ] },
                    { open:false,index:'3',name:'管理费用',unit:'销售收入',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'投资小组',remarks:'' },
                    { open:false,index:'4',name:'销售费用',unit:'销售收入',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'营销部',remarks:'' },
                    { open:false,index:'5',name:'财务费用',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'财务部',remarks:'' },
                    { open:false,index:'6',name:'增值税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'财务部',remarks:'',children:[
                        { index:'6.1',name:'已预征增值税',unit:'销售收入',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'6.2',name:'清算增值税',unit:'销项税-进项税',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' }
                    ] },
                    { open:false,index:'7',name:'增值税附加',unit:'增值税',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'财务部',remarks:'' },
                    { open:false,index:'8',name:'土地增值税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'财务部',remarks:'',children:[
                        { index:'8.1',name:'已预征土增税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'8.2',name:'清算增值税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' }
                    ] },
                    { open:false,index:'9',name:'所得税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'财务部',remarks:'',children:[
                        { index:'9.1',name:'已预征所得税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                        { index:'9.2',name:'清算所得税',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' }
                    ] },
                ] },
                { open:true,index:'三',name:'项目税后净利润=销售收入-成本及税费',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                { open:true,index:'四',name:'项目层面不含税销售净利润率=税后净利润/销售收入',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                { open:true,index:'五',name:'我司净利润=税后净利润*股权比例-我司溢价',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
                { open:true,index:'六',name:'我司销售净利润率=税后净利润/销售收入*股权比例',unit:'',quantities:null,unit_price:null,money:null,tax_rate:null,si_tax:null,responsible:'',remarks:'' },
            ],
            //基本经济技术指标
            tableBCont:[
                { open:true,index:'1',name:'实际用地面积',val:null },
                { open:true,index:'2',name:'容积率',val:null },
                { open:true,index:'3',name:'建筑密度（%）',val:null },
                { open:true,index:'4',name:'计容面积（m²）',val:null,children:[
                    { name:'别墅',val:null },
                    { name:'叠拼',val:null },
                    { name:'高层',val:null },
                    { name:'小高层',val:null },
                    { name:'商业综合体',val:null }
                ] },
                { open:true,index:'5',name:'可售面积（m²）',val:null },
                { open:true,index:'6',name:'地上不计容物业',val:null },
                { open:true,index:'7',name:'估算总建面积（m²）',val:null },
                { open:true,index:'8',name:'地下可售车位(个）',val:null },
                { open:true,index:'9',name:'估算地下建面（m²）',val:null },
            ],
            //指标模拟
            tableC_1Head:['亩','土地','楼面地价','容积率','密度（%）','限高','层高','极限层数'],
            tableC_1Cont:{
                area_mu:null,area:null,price:755,plotRatio:2.5,density:30,hLimit:80,floorH:3,maxFloor:null,cpRatio:82200,basal:null
            },
            tableC_2Head:['产品','比例(%)','体量','层数','限高','基底'],
            tableC_2Cont:[
                { isCustom:false,name:'高层',type:'house',isSale:true,ratio:null,volume:40000,floor:22,hLimit:80,basal:null },
                { isCustom:false,name:'小高层',type:'house',isSale:true,ratio:null,volume:42200,floor:6,hLimit:80,basal:null },
            ],
            tableC_2Select:[
                { label:'高层',type:'house',isSale:true },
                { label:'小高层',type:'house',isSale:true },
            ],
            tableC_2Add:[
                { label:'常规配置',options:[ //nonord_house 非普通住宅 house 普通住宅 non_house 非住宅
                    { label:'别墅',type:'nonord_house',isSale:true },{ label:'联排',type:'nonord_house',isSale:true },{ label:'叠拼',type:'nonord_house',isSale:true },
                    { label:'高层',type:'house',isSale:true },{ label:'小高层',type:'house',isSale:true },{ label:'洋房',type:'house',isSale:true },
                    { label:'公寓',type:'non_house',isSale:true },{ label:'写字楼',type:'non_house',isSale:true },{ label:'酒店',type:'non_house',isSale:true },
                    { label:'开放式商业街',type:'non_house',isSale:true },{ label:'商业综合体',type:'non_house',isSale:true }
                ]},{ label:'非常规配置',options:[
                    { label:'医院',type:'non_house',isSale:false },{ label:'K12学校',type:'non_house',isSale:false },{ label:'高中',type:'non_house',isSale:false },
                    { label:'幼儿园',type:'non_house',isSale:false },{ label:'菜市场',type:'non_house',isSale:false },{ label:'社区中心',type:'non_house',isSale:false },
                    { label:'护理中心',type:'non_house',isSale:false },{ label:'体育馆',type:'non_house',isSale:false },{ label:'秘书官',type:'non_house',isSale:false },
                    { label:'艺术中心',type:'non_house',isSale:false }
                ]},
            ],
            tableC_ground:{name:'地上',ratio:null,volume:null,basal:null },
            tableC_basal:{name:'基底验证',basalTest:null },
            // tableC_3Cont:[
            //     { val1:'底下',val2:null,val3:null,val4:null,val5:'住宅',val6:'商业/配套',val7:'合计' },
            //     { val1:'普通',val2:null,val3:null,val4:'车位数',val5:null,val6:null,val7:null },
            //     { val1:'人防',val2:null,val3:null,val4:'车位面积',val5:null,val6:null,val7:null },
            //     { val1:'非机动',val2:null,val3:null,val4:'配件设施',val5:'物管',val6:'公厕',val7:'社区中心' },
            //     { val1:'',val2:null,val3:null,val4:'面积',val5:null,val6:null,val7:null },
            // ],
            tableC_3Cont:[
                { name:'住宅',carNum:1200,aveArea:29.8,carArea:null},
                { name:'商业/配套',carNum:300,aveArea:35,carArea:null},
                { name:'合计',carNum:null,aveArea:"——",carArea:null},
                { name:'地下',carNum:null,aveArea:"——",carArea:null},
                { name:'普通',carNum:null,aveArea:"——",carArea:null},
                { name:'人防',carNum:null,aveArea:34,carArea:4602},
                { name:'非机动',carNum:null,aveArea:1.5,carArea:null},
            ],
            tableC_area:{ pm:null,wc:null,cc:null },
            //单方可售验证
            tableDhead:['单方可售口径','单价（元/㎡）','占比','销/进项税额','总建单方','备注'],
            tableDCont:[
                { name:'售价（毛坯）',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'建安成本',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'开发间接费',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'土地有票成本',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'土地溢价',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'三费',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'税',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' },
                { name:'净利润',price:null,ratio:null,si_tax:null,tcp:null,remarks:'' }
            ],
            tableD_pm:{pm_taxin:null,pm_taxout:null},
            //测算结果
            tableECont:[
                { name:'项目层面净利润（万元）',val:''},
                { name:'项目销售净利润率（%）',val:''},
                // { name:'我司实际净利润（万元）',val:''},
                // { name:'我司实际销售净利润率',val:''},
                { name:'总货值（含税）',val:''},
                { name:'税费（万元）',val:''},
                { name:'税负率（%）',val:''},
            ],

            tableFhead:[
                '项目','占地面积','可租售面积','地上可售面积','建筑面积','土地','建安',
                '小计','开发费用','附加费','开发商加计','合计','销售收入','增值额','增值比例',
                '增值税清算(累进税率）','预交增值税率','预交土地增值税','应计土地增值税'
            ],
            tableF1Cont:[
                { name:'分项清算合计',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null },
                { name:'产品',children:[
                    { name:'别墅',type:'nonord_house',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null },
                    { name:'叠拼',type:'nonord_house',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null },
                    { name:'高层',type:'house',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null },
                    { name:'小高层',type:'house',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null },
                    { name:'商业综合体',type:'non_house',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null }
                ] },
                { name:'1.普通住宅',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null },
                { name:'2.非普通住宅',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val5:null,val6:null,val17:null,val8:null },
                { name:'3.非住宅',val1:null,val2:null,val3:null,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null }
            ],
            tableF2Cont:[
                { val1:'类型',val2:'增值额与扣除项目之比',val3:'＜20%',val4:'＜50%',val5:'＜100%',val6:'＜200%',val7:'≥200%' },
                { val1:'普通住宅',val2:'适用税率',val3:'0%',val4:'30%',val5:'40%',val6:'50%',val7:'60%' },
                { val1:'非普通住宅（非住宅）',val2:'适用税率',val3:'30%',val4:'30%',val5:'40%',val6:'50%',val7:'60%' },
                { val1:'非普通+普通+非住宅',val2:'速算扣除系数',val3:'0%',val4:'0%',val5:'5%',val6:'15%',val7:'35%' },
                { val1:'计算说明',val2:'增值税计算公式',val3:'0',val4:'=增值额*30%',val5:'=增值额*40%-扣除项目金额*5%',val6:'=增值额*50%-扣除项目金额*15%',val7:'=增值额*60%-扣除项目金额*35%' }
            ],
            
            tableG1:{ delisting:'',acpDate:'' },
            tableG2:[
                { name:'前前融',quota1:null,firstDate1:'',quota2:null,firstDate2:'',explain:'' },
                { name:'前端融资',quota1:null,firstDate1:'',quota2:null,firstDate2:'',explain:'' },
                { name:'开发贷',quota1:null,firstDate1:'',quota2:null,firstDate2:'',explain:'' },
                { name:'其他融资',quota1:null,firstDate1:'',quota2:null,firstDate2:'',explain:'' }
            ],
            dateRange:'',
            tableGCont1:[
                { name:'销售物业融资',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,interest:null,tfCosts:null },
                ]},
                { name:'前前融',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
                { name:'前端融资',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
                { name:'开发贷',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
                { name:'借款-D',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
                { name:'借款-E',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]}
            ],
            tableGCont2:[
                { name:'持有物业贷款',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,interest:null,tfCosts:null },
                ]},
                { name:'前端融资',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
                { name:'开发贷',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
                { name:'借款-D',children:[
                    { name:'利率',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,exeRate:null,interest:null,tfCosts:null },
                ]},
            ],
            tableHCont1:[
                { name:'流转附加税(%)',val:'12',remarks:'基数为流转税；附加需说明' },
                { name:'所得税率(%)',val:'25',remarks:'一般25%，中西部或有优惠区域单独设置' },
                { name:'所得税预缴毛利率(%)',val:'20',remarks:'一般10%-20%，按当地规定' },
                { name:'土增清算车位是否分摊土地成本',val:'否',remarks:'需结合当地税政，必须做出选择' },
            ],
            tableHCont2:{ houseVal:'1',nonordVal:'2',nonVal:'2.5' },
            landCost:null,//土地成本 = 楼面地价*计容/10000
        }
    },
    watch:{
        //基本经济技术指标
        tableBCont:{
            handler(newVal){
                let arr = newVal
                let arr3val = 0
                let arr4val = 0
                arr[3].children.forEach((item,i)=>{
                    arr3val += JSON.parse(item.val)
                    if(item.isSale){ //计算可售面积
                        arr4val += JSON.parse(item.val)
                    }
                })
                arr[3].val = arr3val //D18 = SUM(D19:D27)
                arr[4].val = arr4val //D28 = D18-D27-D26 此处判断可售产品体量相加
                arr[6].val = arr[8].val + arr[3].val + JSON.parse(arr[5].val) //D30 = D32+D18+D29

                this.tableACont[0].quantities = arr3val //E35 = D18
                this.tableACont[1].quantities = arr3val //E45 = D18
                this.tableACont[1].children[0].quantities = arr3val //E46 = D18
                this.tableACont[1].children[0].children[0].quantities = arr3val //E47 = D18
                this.tableACont[1].children[1].quantities = arr3val //E52 = D18

                
                
            },
            deep:true
        },
        //指标模拟
        tableC_1Cont:{
            handler(newVal){
                let obj = newVal
                obj.area_mu = (obj.area/666.6667).toFixed(2) //N5 = O5/666.6667
                obj.maxFloor = Math.ceil(obj.hLimit/obj.floorH) //T5 = R5/S5
                obj.basal = obj.area*(obj.density/100) //O8 = O5*Q5
                this.tableC_basal.basalTest = obj.basal - this.tableC_ground.basal //S21 = O8-S20
                this.tableC_3Cont[3].val2 = obj.cpRatio/100 //O25 = N8/100
                this.tableC_2Cont.forEach(item=>{
                    item.ratio = item.volume/obj.cpRatio*100 //O10~O19 = P10~P19/N8*100
                })
                this.tableBCont[0].val = obj.area  //D15 = O5
                this.tableBCont[1].val = obj.plotRatio  //D16 = P5
                this.tableBCont[2].val = obj.density  //D17 = Q5
                this.tableC_3Cont[6].carNum = (obj.cpRatio/100).toFixed(0)
                this.tableF1Cont[0].val1 = obj.area

                //土地成本 = 楼面地价*计容/10000
                this.landCost = obj.price*obj.cpRatio/10000
                this.tableG2[1].quota1 = this.landCost*0.6
                this.tableG2[2].quota1 = this.landCost*0.6
                this.tableF1Cont[0].val5 = this.landCost //土增税计算表 C6='静态收益测算 '!$G$18
            },
            deep:true
        },
        tableC_2Cont:{
            handler(newVal){
                let arr = newVal
                let ratioSum = 0
                let volumeSum = 0
                let basalSum = 0
                let tableB4Arr = []
                let tableA1Arr = [] //销售收入
                let tableA2Arr = [] //地上建安部分
                let tableF1Arr = [] //土增税计算表-产品
                arr.forEach(item=>{
                    let cpRatio = this.tableC_1Cont.cpRatio
                    let cpRatioFlag = cpRatio==0||cpRatio==null||cpRatio==''
                    item.ratio = (cpRatioFlag?0:item.volume/this.tableC_1Cont.cpRatio*100).toFixed(2) //O10~O19 = P10~P19/N8*100
                    item.basal = item.floor==0||item.floor==null||item.floor==''?0:Math.ceil(item.volume/item.floor) //S10~S19 = =P10~P19/Q10~Q19
                    ratioSum += JSON.parse(item.ratio?item.ratio:0)
                    volumeSum += JSON.parse(item.volume?item.volume:0)
                    basalSum += JSON.parse(item.basal?item.basal:0)
                    tableB4Arr.push({name:item.name,val:item.volume,isSale:item.isSale})
                    tableA1Arr.push({name:item.name,unit:'㎡',quantities:item.volume,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' })
                    tableA2Arr.push({index:'◆',name:item.name,unit:'㎡',quantities:item.volume,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' })
                    tableF1Arr.push({ name:item.name,type:item.type,val1:null,val2:item.volume,val3:item.volume,val4:item.volume,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null })
                })
                this.tableBCont[3].children = tableB4Arr
                tableA1Arr.push({ name:'地下可售车位(个）',unit:'个',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' })
                this.tableACont[0].children = tableA1Arr
                tableA2Arr.push({ index:'◆',name:'地上不计容物业',unit:'㎡',quantities:null,unit_price:null,money:null,tax_rate:9,si_tax:null,responsible:'',remarks:'' })
                this.tableACont[1].children[1].children[1].children[0].children = tableA2Arr
                tableF1Arr.push({ name:'地下车库',type:'non_house',val1:null,val2:null,val3:0,val4:null,val5:null,val6:null,val7:null,val8:null,val9:null,val10:null,val11:null,val12:null,val13:null,val14:null,val15:null,val16:null,val17:null,val18:null })
                this.tableF1Cont[1].children = tableF1Arr

                this.tableC_ground.ratio = ratioSum.toFixed(2) //O20 = SUM(O10:O19)
                this.tableC_ground.volume = volumeSum.toFixed(0) //P20 = SUM(P10:P19)
                this.tableC_ground.basal = basalSum.toFixed(0) //S20 = SUM(S10:S19)
                this.tableC_basal.basalTest = this.tableC_1Cont.basal - basalSum //S21 = O8-S20
            },
            deep:true
        },
        tableC_3Cont:{
            handler(newVal){
                let arr = newVal
                // arr[1].val7 = JSON.parse(arr[1].val5) + JSON.parse(arr[1].val6) //T23 = R23+S23
                // arr[0].val2 = arr[1].val7 //O22 = T23
                // arr[0].val3 = JSON.parse(arr[2].val7) + JSON.parse(arr[2].val3) //P22 = T24+P24
                // arr[1].val2 = JSON.parse(arr[0].val2) - JSON.parse(arr[2].val2) //O23 = O22-O24
                // arr[1].val3 = JSON.parse(arr[0].val3) - JSON.parse(arr[3].val3) //P23 = P22-P24
                // arr[0].val4 = (arr[0].val3/arr[0].val2).toFixed(1) //Q22 = P22/O22
                // arr[2].val2 = (arr[2].val3/34).toFixed(0) //O24 = P24/34
                // arr[2].val5 = (arr[1].val5*29.8).toFixed(0)//R24 = R23*29.8
                // arr[2].val6 = (arr[1].val6*29.5+30.42).toFixed(0)//S24 = S23*29.5+30.42
                // arr[2].val7 = JSON.parse(arr[2].val5)+JSON.parse(arr[2].val6)//T24 = S24+R24
                // arr[3].val3 = (arr[3].val2*1.5).toFixed(0) //P24 = O25*1.5

                arr[0].carArea = arr[0].carNum*arr[0].aveArea
                arr[1].carArea = arr[1].carNum*arr[1].aveArea
                arr[2].carNum = JSON.parse(arr[0].carNum)+JSON.parse(arr[1].carNum)
                arr[2].carArea = JSON.parse(arr[0].carArea)+JSON.parse(arr[1].carArea)
                arr[3].carNum = JSON.parse(arr[0].carNum)+JSON.parse(arr[1].carNum)
                arr[3].carArea = JSON.parse(arr[0].carArea)+JSON.parse(arr[1].carArea)+JSON.parse(arr[5].carArea)
                arr[4].carNum = JSON.parse(arr[3].carNum)-JSON.parse(arr[5].carNum)
                arr[4].carArea = JSON.parse(arr[3].carArea)-JSON.parse(arr[5].carArea)
                arr[5].carNum = (arr[5].carArea/arr[5].aveArea).toFixed(0)
                arr[6].carArea = arr[6].carNum*arr[6].aveArea

                this.tableBCont[7].val = arr[3].carNum
                this.tableBCont[8].val = arr[3].carArea
                this.tableACont[0].children[this.tableACont[0].children.length-1].quantities = arr[3].carNum*0.6

                //土增税计算表 M3='静态收益测算 '!D31*34
                this.tableF1Cont[1].children[this.tableF1Cont[1].children.length-1].val2 = this.tableBCont[7].val*34
                //土增税计算表 M5='静态收益测算 '!D32
                this.tableF1Cont[1].children[this.tableF1Cont[1].children.length-1].val4 = this.tableBCont[8].val 
            },
            deep:true
        },
        dateRange:{
            handler(newVal){
                console.log(newVal)
                let s = newVal[0].split('-')
                let e = newVal[1].split('-')
                let sYear = JSON.parse(s[0])
                let sMonth = JSON.parse(s[1])
                let eYear = JSON.parse(e[0])
                let eMonth = JSON.parse(e[1])
                let arr = []
                let monthArr = []
                for(let i=sYear;i<=eYear;i++){
                    if(sYear==eYear){
                        for(let j=sMonth;j<=eMonth;j++){
                            arr.push(i+'年'+j+'月')
                            monthArr.push(j)
                        }
                    }else{
                        if(i==sYear){
                            for(let j=sMonth;j<=12;j++){
                                arr.push(i+'年'+j+'月')
                                monthArr.push(j)
                            }
                        }else if(i==eYear){
                            for(let j=1;j<=eMonth;j++){
                                arr.push(i+'年'+j+'月')
                                monthArr.push(j)
                            }
                        }else{
                            for(let j=1;j<=12;j++){
                                arr.push(i+'年'+j+'月')
                                monthArr.push(j)
                            }
                        }
                    }
                }
                console.log(arr)
                let tgArr = [
                    { name:'利率（%）',loan:null,reLoan:null,balance:null,interest:null,tfCosts:null },
                    { name:'合计',loan:null,reLoan:null,balance:null,interest:null,tfCosts:null }
                ]
                arr.forEach((item,i)=>{
                    tgArr.push({ name:item,month:monthArr[i],loan:null,reLoan:null,balance:null,interest:null,tfCosts:null })
                })
                this.tableGCont1.forEach(item=>{
                    item.children = JSON.parse(JSON.stringify(tgArr))
                })
                this.tableGCont2.forEach(item=>{
                    item.children = JSON.parse(JSON.stringify(tgArr))
                })
            },
            deep:true
        },
        tableG1:{
            handler(newVal){
                let date = newVal.delisting.split('-')
                let year = JSON.parse(date[0])
                let month = JSON.parse(date[1])
                year = (month+2)>12?year+1:year
                month = (month+2)>12?(month+2)%12:month+2
                this.tableG2[1].firstDate1 = year+'年'+month+'月'
            },
            deep:true
        },
    },
    methods:{
        child1Toggle(i,tableName){
            if(tableName==="tableA"){
                this.tableACont[i].open = !this.tableACont[i].open
            }else if(tableName==="tableB"){
                this.tableBCont[i].open = !this.tableBCont[i].open
            }
            
        },
        child2Toggle(i,j){
            this.tableACont[i].children[j].open = !this.tableACont[i].children[j].open
        },
        child3Toggle(i,j,k){
            this.tableACont[i].children[j].children[k].open = !this.tableACont[i].children[j].children[k].open
        },
        child4Toggle(i,j,k,l){
            this.tableACont[i].children[j].children[k].children[l].open = !this.tableACont[i].children[j].children[k].children[l].open
        },
        selectProduct(val){
            let arr = JSON.parse(JSON.stringify(this.tableC_2Cont))
            let newArr = [] 
            val.forEach(item=>{
                let cur = arr.filter(a=>item.label==a.name&&!a.isCustom)
                if(cur.length==0){
                    newArr.push({
                        isCustom:false,name:item.label,type:item.type,isSale:item.isSale,ratio:null,volume:null,floor:null,hLimit:null,basal:null
                    })
                }else{
                    newArr.push(cur[0])
                }
            })
            arr.forEach(item=>{
                if(item.isCustom){
                    newArr.push(item)
                }
            })
            this.tableC_2Cont = newArr
        },
        addProduct(){
            this.tableC_2Cont.push({
                isCustom:true,name:'',type:'none',isSale:true,ratio:null,volume:null,floor:null,hLimit:null,basal:null
            })
        },
        removeProduct(i){
            if(this.tableC_2Cont.length>1){
                this.tableC_2Cont.splice(i,1)
                this.tableC_2Select.splice(i,1)
            }else{
                this.$message('至少保留一个')
            }
            
        },
        tgChange(aIndex,bIndex,name,tgName){
            if((name == 'exeRate'&&bIndex==0)||(name=='loan_reLoan'&&bIndex>1)){
                let arr = tgName=='tg_1'?this.tableGCont1:this.tableGCont2
                arr.forEach((item,i)=>{
                    if(i==aIndex){
                        let sum_loan = 0
                        let sum_reLoan = 0
                        let sum_interest = 0
                        let sum_tfCosts = 0
                        item.children.forEach((child,j)=>{
                            if(j>1){
                                child.balance = j==2?JSON.parse(child.loan)-JSON.parse(child.reLoan):JSON.parse(item.children[j-1].balance)+JSON.parse(child.loan-child.reLoan)
                                child.exeRate = item.children[0].exeRate
                                let interest
                                if([3,6,9,12].includes(child.month)){
                                    if(j==2){
                                        interest = (child.balance*2/3)*child.exeRate/100/12
                                    }else if(j==3){
                                        interest = (JSON.parse(item.children[j-1].balance)+JSON.parse(child.balance*2/3))*child.exeRate/100/12
                                    }else if(j==4){
                                        interest = (JSON.parse(item.children[j-2].balance)+JSON.parse(item.children[j-1].balance)+JSON.parse(child.balance*2/3))*child.exeRate/100/12
                                    }else{
                                        interest = (JSON.parse(item.children[j-3].balance)+JSON.parse(item.children[j-2].balance)+JSON.parse(item.children[j-1].balance)+JSON.parse(child.balance*2/3))*child.exeRate/100/12
                                    }
                                }else{
                                    interest = 0
                                }
                                child.interest = interest.toFixed(0)
                                child.tfCosts = JSON.parse(child.interest)

                                sum_loan += JSON.parse(child.loan)
                                sum_reLoan += JSON.parse(child.reLoan)
                                sum_interest += JSON.parse(child.interest)
                                sum_tfCosts += JSON.parse(child.tfCosts)
                            }
                        })
                        item.children[1].loan = sum_loan
                        item.children[1].reLoan = sum_reLoan
                        item.children[1].balance = item.children[item.children.length-1].balance
                        item.children[1].interest = sum_interest
                        item.children[1].tfCosts = sum_tfCosts
                    }
                })
                //计算总表
                let sum0_loan = 0
                let sum0_reLoan = 0
                let sum0_interest = 0
                arr[0].children.forEach((a,i)=>{
                    if(i>1){
                        let sum_loan = 0
                        let sum_reLoan = 0
                        let sum_balance = 0
                        let sum_interest = 0
                        arr.forEach((b,j)=>{
                            if(j>0){
                                sum_loan += JSON.parse(b.children[i].loan)
                                sum_reLoan += JSON.parse(b.children[i].reLoan)
                                sum_balance += JSON.parse(b.children[i].balance)
                                sum_interest += JSON.parse(b.children[i].interest)
                            }
                        })
                        a.loan = sum_loan
                        a.reLoan = sum_reLoan
                        a.balance = sum_balance
                        a.interest = sum_interest

                        sum0_loan += JSON.parse(a.loan)
                        sum0_reLoan += JSON.parse(a.reLoan)
                        sum0_interest += JSON.parse(a.interest)
                    }
                })
                arr[0].children[1].loan = sum0_loan
                arr[0].children[1].reLoan = sum0_reLoan
                arr[0].children[1].balance = arr[0].children[arr[0].children.length-1].balance
                arr[0].children[1].interest = sum0_interest
                arr[0].children[1].tfCosts = sum0_interest

                //表影响
                this.tableACont[1].children[4].money = this.tableGCont1[0].children[1].tfCosts //静态收益测算 G133=表2融资方案!C18
            }
        },
        //计算主表
        computedTableA(){
            let arr = this.tableACont
            let G18 = Math.round(this.tableC_1Cont.price*this.tableC_1Cont.cpRatio/10000) //G18 = I18*N8/10000
            //销售收入
            let money0 = 0
            arr[0].children[arr[0].children.length-1].quantities = this.tableBCont[7].val
            arr[0].children.forEach((item,i)=>{
                item.money = Math.round(item.quantities*item.unit_price/10000) //G36 = E36*F36/10000
                money0 += item.money
                //土增数计算表 E14='静态收益测算 '!G36/1.09
                this.tableF1Cont[1].children[i].val12 = Math.round(item.money/(1+arr[0].tax_rate/100))
            })
            arr[0].money = money0 //G35 = SUM(G36:G44)
            arr[0].unit_price = Math.round(arr[0].money/arr[0].quantities*10000) //F35 = G35/E35*10000
            arr[0].si_tax = Math.round((arr[0].money-G18)/((100+arr[0].tax_rate)/100)*(arr[0].tax_rate/100)) //I35 = (G35-G47)/1.09*0.09
            this.tableECont[2].val = arr[0].money

            //成本及税费
            let money1 = 0
            let si_tax1 = 0
            arr[1].children.forEach((item,i)=>{
                money1 += item.money 
                if(i<5){
                    si_tax1 += item.si_tax
                }
            })
            arr[1].money = money1 //G45 = SUM(G46,G52,G131,G132,G133,G134,G137,G138,G141)
            arr[1].unit_price = Math.round(arr[1].money/arr[1].quantities*10000) //F45 = G45/E45*10000
            arr[1].si_tax = si_tax1 //I45 = SUM(I52,I131,I132,I133,I46)

            //成本及税费-土地成本
            //（子项）
            let children_1_0 = arr[1].children[0].children
            children_1_0[0].money = G18 // G47 = G18 = I18*N8/10000
            children_1_0[0].unit_price = Math.round(G18/children_1_0[0].quantities*10000) //F47 = G47/E47*10000
            children_1_0[0].si_tax = children_1_0[0].tax_rate/(1+children_1_0[0].tax_rate)*G18 //I47 = H47/(1+H47)*G47
            children_1_0[1].quantities = G18 //E48 = G47 = G18
            children_1_0[1].money = Math.round(children_1_0[1].quantities*children_1_0[1].unit_price/100) //G48 = E48*F48
            children_1_0[2].quantities = this.tableC_1Cont.area_mu //E49 = N5
            children_1_0[2].money = children_1_0[2].quantities*children_1_0[2].unit_price //G49 = E49*F49
            children_1_0[3].money = Math.round(100*0.035+400*0.03+500*0.025+4000*0.015+5000*0.01+(G18-10000)*0.005) //G50
            children_1_0[4].si_tax = children_1_0[4].tax_rate/(100+children_1_0[4].tax_rate)*children_1_0[4].money //I51 = H51/(1+H51)*G51
            //（本体）
            arr[1].children[0].money = G18+ children_1_0[1].money+children_1_0[2].money+children_1_0[3].money //G46 = SUM(G47:G50)
            arr[1].children[0].si_tax = children_1_0[0].si_tax //I46 = SUM(I47)
            arr[1].children[0].unit_price = Math.round((arr[1].children[0].money-arr[1].children[0].si_tax)/arr[1].children[0].quantities*10000) //F46 = (G46-I46)/E46*10000

            //成本及税费-开发成本
            let children_1_1 = arr[1].children[1].children //开发成本-子项
            
            //成本及税费-开发成本-前期工程费
            children_1_1[0].quantities = arr[1].children[1].quantities
            let children_1_1_0 = children_1_1[0].children //前期工程费-子项
            let money_1_1_0 = 0
            let si_tax_1_1_0 = 0
            //成本及税费-开发成本-前期工程费-children
            children_1_1_0.forEach((item,i)=>{
                item.quantities = this.tableBCont[6].val //E54 = D30
                if(i==3){
                    item.children.forEach(child=>{
                        child.quantities = this.tableBCont[6].val //E58 = D30
                        child.money = Math.round(item.quantities*item.unit_price/10000) //G58=E58*F58/10000
                        let si_tax1 = child.tax_rate/(100+child.tax_rate)*child.money
                        child.si_tax = si_tax1.toFixed(1) //I58=H58/(1+H58)*G58
                    })
                    item.money = Math.round(item.children[0].money + item.children[1].money) //G57=G58+G59
                    let si_tax2 = JSON.parse(item.children[0].si_tax) + JSON.parse(item.children[1].si_tax)
                    item.si_tax = si_tax2.toFixed(1) //I57=SUM(I58:I59)
                    item.unit_price = item.money/item.quantities*10000 //F57=G57/E57*10000
                }else{
                    item.money = Math.round(item.quantities*item.unit_price/10000) //G54=E54*F54/10000
                    let si_tax3 = item.tax_rate/(100+item.tax_rate)*item.money
                    item.si_tax = si_tax3.toFixed(1) //I54=H54/(1+H54)*G54
                }
                money_1_1_0 += JSON.parse(item.money)
                si_tax_1_1_0 += JSON.parse(item.si_tax)
            })
            children_1_1[0].money = money_1_1_0 //G53=G54+G55+G56+G57+G60+G61+G62
            children_1_1[0].si_tax = si_tax_1_1_0 //I53=I54+I55+I56+I57+I60+I61+I62
            children_1_1[0].unit_price = Math.round(children_1_1[0].money/children_1_1[0].quantities*10000) //F53=G53/E53*10000

            //成本及税费-开发成本-建安工程费
            children_1_1[1].quantities = arr[1].children[1].quantities //E63 = D18
            //成本及税费-开发成本-建安工程费-地上建安部分
            children_1_1[1].children[0].quantities = arr[1].children[1].quantities //E64 = D18
            let dsjabfMoney = 0
            let dsjabfSitax = 0
            children_1_1[1].children[0].children.forEach((item,i)=>{
                if(i==children_1_1[1].children[0].children.length-1){
                    item.quantities = this.tableBCont[5].val //E73 = D29
                }
                item.money = item.quantities*item.unit_price/10000 //G65=E65*F65/10000
                item.si_tax = Math.round(item.money/(1+item.tax_rate/100)*(item.tax_rate/100)) //I65=G65/(1+H65)*H65
                dsjabfSitax += item.si_tax
                dsjabfMoney += item.money
            })
            children_1_1[1].children[0].money = dsjabfMoney //G64=SUM(G65:G73)
            children_1_1[1].children[0].unit_price = Math.round(children_1_1[1].children[0].money/children_1_1[1].children[0].quantities*10000) //F64=G64/E64*10000
            children_1_1[1].children[0].si_tax = dsjabfSitax //I64=SUM(I65:I72)

            //成本及税费-开发成本-建安工程费-地下建安部分
            children_1_1[1].children[1].quantities = this.tableBCont[8].val //E47 = D32
            let dxjabfMoney = 0
            children_1_1[1].children[1].children.forEach((item,i)=>{
                let l = children_1_1[1].children[1].children.length
                item.quantities = i==l-1?this.tableBCont[8].val:this.tableBCont[6].val //E75 = D30 : E78 = D32
                item.money = Math.round(item.quantities*item.unit_price/10000) //F74=G74/E74*10000
                dxjabfMoney += item.money
            })
            children_1_1[1].children[1].money = dxjabfMoney //G74=SUM(G75:G78)
            children_1_1[1].children[1].unit_price = Math.round(children_1_1[1].children[1].money/children_1_1[1].children[1].quantities*10000) //F74=G74/E74*10000
            children_1_1[1].children[1].si_tax = Math.round(children_1_1[1].children[1].money/(1+children_1_1[1].children[1].tax_rate/100)*(children_1_1[1].children[1].tax_rate/100)) //I74=G74/(1+H74)*H74
            
            //成本及税费-开发成本-建安工程费-批量精装修工程及以下
            let jagcfMoney = 0
            let jagcfSitax = 0
            children_1_1[1].children.forEach((item,i)=>{
                if(i>1){
                    item.money = item.quantities*item.unit_price/10000 //G79=E79*F79/10000
                    item.children[0].quantities = item.money //E80=G79
                    item.children[0].money = item.children[0].quantities*item.children[0].unit_price/100 //G80=E80*F80
                    item.children[0].si_tax = Math.round(item.children[0].money/(1+item.children[0].tax_rate/100)*(item.children[0].tax_rate/100)) //I80=G80/(1+H80)*H80

                    item.children[1].quantities = item.money
                    item.children[1].money = item.children[1].quantities*item.children[1].unit_price/100
                    item.children[1].si_tax = Math.round(item.children[1].money/(1+item.children[1].tax_rate/100)*(item.children[1].tax_rate/100)) 

                    item.si_tax = item.children[0].si_tax+item.children[1].si_tax //I79=SUM(I80:I81)
                }
                if(i==6){  //电梯设备及安装工程
                    item.quantities = this.tableBCont[3].val
                }else if(i==7){ //其他建安工程（含甲供）
                    item.quantities = this.tableBCont[6].val
                }
                jagcfMoney += item.money
                jagcfSitax += item.si_tax
            })
            children_1_1[1].money = jagcfMoney //G63=G64+G74+G79+G82+G85+G88+G91+G94
            children_1_1[1].si_tax = jagcfSitax //I63=I64+I74+I79+I82+I85+I88+I91+I94
            children_1_1[1].unit_price = Math.round(children_1_1[1].money/children_1_1[1].quantities*10000) //F63=G63/E63*10000

            //成本及税费-开发成本-基础设施费
            children_1_1[2].quantities = arr[1].children[1].quantities //E97 = D18
            let jcssfMoney = 0
            let jcssfSitax = 0
            children_1_1[2].children.forEach((item,i)=>{
                if(i==0||i==1||i==3||i==4||i==5||i==6||i==7||i==8||i==10||i==11){
                    item.quantities = this.tableBCont[6].val //E98 = D30
                }
                if(i==2){
                    item.quantities = this.tableBCont[0].val*(1-this.tableBCont[2].val/100) //E100=D15*(1-D17)
                }
                if(i==9){
                    item.quantities = this.tableBCont[3].val //E121 = D18
                }
                item.money = Math.round(item.quantities*item.unit_price/10000) //G98=E98*F98/10000
                if(i>1&&i<9){
                    item.children[0].quantities = item.money //E101=G100
                    item.children[0].money = item.children[0].quantities*item.children[0].unit_price/100 //G101=E101*F101
                    item.children[0].si_tax = Math.round(item.children[0].money/(1+item.children[0].tax_rate/100)*(item.children[0].tax_rate/100)) //I101=G101/(1+H101)*H101

                    item.children[1].quantities = item.money
                    item.children[1].money = item.children[1].quantities*item.children[1].unit_price/100
                    item.children[1].si_tax = Math.round(item.children[1].money/(1+item.children[1].tax_rate/100)*(item.children[1].tax_rate/100))

                    item.si_tax = item.children[0].si_tax+item.children[1].si_tax //I100=SUM(I101:I102)
                    
                }
                if(i<=1){
                    item.si_tax = Math.round(item.money*item.tax_rate/100) //I98
                }
                if(i>=9){
                    item.si_tax = Math.round(item.money*(1+item.tax_rate/100)*(item.tax_rate/100)) //I121=G121/(1+H121)*H121
                }
                jcssfMoney += item.money
                jcssfSitax += item.si_tax
            })
            children_1_1[2].money = jcssfMoney //G97=SUM(G98,G99,G100,G103,G106,G109,G112,G115,G118,G121,G122,G123)
            children_1_1[2].unit_price = Math.round(children_1_1[2].money/children_1_1[2].quantities*10000) //F97=G97/E97*10000
            children_1_1[2].si_tax = jcssfSitax //I97=I99+I98+I100+I103+I106+I109+I112+I115+I118+I121+I122+I123

            //成本及税费-开发成本-配套设施费
            children_1_1[3].quantities = arr[1].children[1].quantities //E124 = D18
            let ptssfMoney = 0
            let ptssfSitax = 0
            children_1_1[3].children.forEach(item=>{
                item.money = Math.round(item.quantities*item.unit_price/10000) //G126=E126*F126/10000
                item.si_tax = Math.round(item.money*(1+item.tax_rate/100)*(item.tax_rate/100)) //I126=G126/(1+H126)*H126
                ptssfMoney += item.money
                ptssfSitax += item.si_tax
            })
            children_1_1[3].money = ptssfMoney //G124=SUM(G125:G129)
            children_1_1[3].si_tax = ptssfSitax //I124=SUM(I125:I129)
            children_1_1[3].unit_price = Math.round(children_1_1[3].money/children_1_1[3].quantities*10000) //F124=G124/E124*10000

            //成本及税费-开发成本-开发间接费用
            children_1_1[4].money = Math.round(children_1_1[4].quantities*children_1_1[4].unit_price/100) //G130=E130*F130
            children_1_1[4].si_tax = Math.round(children_1_1[4].money/(1+children_1_1[4].tax_rate/100)*(children_1_1[4].tax_rate/100)) //I130=G130/(1+H130)*H130
            
            //开发成本-本体
            arr[1].children[1].money = children_1_1[0].money+children_1_1[1].money+children_1_1[2].money+children_1_1[3].money //G52 = SUM(G53,G63,G97,G124)
            arr[1].children[1].unit_price = Math.round(arr[1].children[1].money/arr[1].children[1].quantities*10000) //F52 = G52/E52*10000
            arr[1].children[1].tax_rate = Math.round(arr[1].children[1].money/this.tableBCont[6]*10000) //H52 = G52/D30*10000
            arr[1].children[1].si_tax = children_1_1[0].si_tax+children_1_1[1].si_tax+children_1_1[2].si_tax+children_1_1[3].si_tax //I52 = SUM(I53,I63,I97,I124)
            
            //土增税计算表 C7='静态收益测算 '!G52-'静态收益测算 '!I52
            this.tableF1Cont[0].val6 = arr[1].children[1].money - arr[1].children[1].si_tax

            //成本及税费-管理费用
            let children_1_2 = arr[1].children[2]
            children_1_2.quantities = Math.round(arr[0].money/((100+arr[0].tax_rate)/100)) //E131 = G35/1.09
            children_1_2.money = Math.round(children_1_2.quantities*children_1_2.unit_price/100) //G131=E131*F131
            children_1_2.si_tax = Math.round(children_1_2.money/(1+children_1_2.tax_rate/100)*(children_1_2.tax_rate/100)*0.2) //I131=G131/(1+H131)*H131*0.2

            //成本及税费-销售费用
            let children_1_3 = arr[1].children[3]
            children_1_3.quantities = children_1_2.quantities
            children_1_3.money = Math.round(children_1_3.quantities*children_1_3.unit_price/100) //G132=E132*F132
            children_1_3.si_tax = Math.round(children_1_3.money/(1+children_1_3.tax_rate/100)*(children_1_3.tax_rate/100)*0.2) //I132=G132/(1+H132)*H132*0.2

            //成本及税费-财务费用
            let children_1_4 = arr[1].children[4]
            children_1_4.quantities = children_1_2.quantities
            //children_1_4.money = ? //=表2融资方案!C18
            children_1_4.unit_price = (children_1_4.money/children_1_4.quantities*100).toFixed(2) //F133=G133/E133

            //成本及税费-增值税
            let children_1_5 = arr[1].children[5]
            children_1_5.children[0].quantities = Math.round(arr[0].money/((100+arr[0].tax_rate)/100)) //E135 = G35/1.09
            children_1_5.children[0].money = Math.round(children_1_5.children[0].quantities*children_1_5.children[0].unit_price/100) //G135=E135*F135
            children_1_5.children[1].quantities = arr[0].si_tax //E136 = I35
            children_1_5.children[1].unit_price = arr[1].si_tax //F136 = I45
            children_1_5.children[1].money = children_1_5.children[1].quantities - children_1_5.children[1].unit_price //G136=E136-F136
            children_1_5.money = children_1_5.children[0].money>children_1_5.children[1].money?children_1_5.children[0].money:children_1_5.children[1].money //G134=IF(G135>G136,G135,G136)
            
            //成本及税费-增值税附加
            let children_1_6 = arr[1].children[6]
            children_1_6.quantities = children_1_5.money //E137 = G134
            children_1_6.unit_price = this.tableHCont1[0].val //F137 = G23
            children_1_6.money = Math.round(children_1_6.quantities*children_1_6.unit_price/100) //G137=E137*F137

            //土增税计算表 C10='静态收益测算 '!G137
            this.tableF1Cont[0].val9 =  children_1_6.money

            //成本及税费-土地增值费
            let children_1_7 = arr[1].children[7]
            children_1_7.children[0].quantities = Math.round(arr[0].money/((100+arr[0].tax_rate)/100)) //E139 = G35/1.09
            //children_1_7.children[0].money = ? 
            children_1_7.children[0].unit_price = (children_1_7.children[0].money/children_1_7.children[0].quantities*100).toFixed(2) //F139=G139/E139
            //children_1_7.children[1].money = ? 
            children_1_7.moeny = children_1_7.children[0].money>children_1_7.children[1].money?children_1_7.children[0].money:children_1_7.children[1].money //G138=IF(G139>G140,G139,G140)-O141

            //成本及税费-所得税
            let children_1_8 = arr[1].children[8]
            children_1_8.children[0].quantities = Math.round(arr[0].money/((100+arr[0].tax_rate)/100)) //E142 = G35/1.09
            children_1_8.children[0].money = Math.round(children_1_8.children[0].quantities*(children_1_8.children[0].unit_price/100)) //G142=F142*E142
            //E143=G35/1.09-G47/1.09-G48-G49-G50-(G52+G130+G131+G132+G133+G137+G138-I45)
            children_1_8.children[1].quantities = Math.round(arr[0].money/((100+arr[0].tax_rate)/100) - G18/((100+arr[0].tax_rate)/100) - 
            children_1_0[1].money - children_1_0[2].money - children_1_0[3].money - 
            (arr[1].children[1].money+children_1_1[4].money+arr[1].children[2].money+arr[1].children[3].money+arr[1].children[4].money+arr[1].children[6].money+arr[1].children[7].money-arr[1].si_tax))
            
            children_1_8.children[1].unit_price = this.tableHCont1[1].val //F143=G24
            children_1_8.children[1].money = Math.round(children_1_8.children[1].quantities*(children_1_8.children[1].unit_price/100)) //G143=F143*E143
            children_1_8.money = children_1_8.children[1].money>children_1_8.children[0].money?children_1_8.children[1].money:children_1_8.children[0].money //G141=IF(G142>G143,G142,G143)

            //项目税后净利润=销售收入-成本及税费
            arr[2].quantities = arr[1].quantities //E144 = E45
            arr[2].unit_price = Math.round(arr[0].unit_price - arr[1].unit_price) //F144 = F35-F45
            arr[2].money = Math.round(children_1_8.children[1].quantities - children_1_8.money) //G144 = E143-G141
            this.tableECont[0].val = arr[2].money

            //项目层面不含税销售净利润率=税后净利润/销售收入
            arr[3].money = (arr[2].money/(arr[0].money-arr[0].si_tax)*100).toFixed(2) //G145=G144/(G35-I35)
            this.tableECont[1].val = arr[3].money

            //我司净利润=税后净利润*股权比例-我司溢价
            //arr[4].money = arr[2].money*1-0 //G146=G144*G15-G20

            //我司销售净利润率=税后净利润/销售收入*股权比例
            //arr[5].money = arr[4].money/((arr[0].money-arr[0].si_tax)*100%)//G147=G146/((G35-I35)*$G$15)

            //D9=G134+G137+G138+G141
            this.tableECont[3].val = arr[1].children[5].money + arr[1].children[6].money + arr[1].children[7].money + arr[1].children[8].money
            this.tableECont[4].val = (this.tableECont[3].val/this.tableECont[2].val).toFixed(2)
        },
        //单方可售验证
        computedTableD(){
            let arr = this.tableDCont
            arr[0].price = Math.round(this.tableACont[0].money/this.tableBCont[3].val*10000) //G4=G35/$D$18*10000
            arr[1].price = Math.round(this.tableACont[1].children[1].money/this.tableBCont[3].val*10000) //G5=G52/$D$18*10000
            arr[2].price = Math.round(this.tableACont[1].children[1].children[4].money/this.tableBCont[3].val*10000) //G6=G130/$D$18*10000
            arr[3].price = Math.round(this.tableACont[1].children[0].money/this.tableBCont[3].val*10000) //G7=G46/$D$18*10000
            //G9=$L$131+$L$132+$L$133
            arr[5].price = Math.round(this.tableACont[1].children[2].money/this.tableBCont[3].val*10000 + this.tableACont[1].children[3].money/this.tableBCont[3].val*10000 + this.tableACont[1].children[4].money/this.tableBCont[3].val*10000)
            //G10=$L$134+$L$137+$L$138+$L$141
            arr[6].price = Math.round(this.tableACont[1].children[5].money/this.tableBCont[3].val*10000 + this.tableACont[1].children[6].money/this.tableBCont[3].val*10000 + this.tableACont[1].children[7].money/this.tableBCont[3].val*10000 + this.tableACont[1].children[8].money/this.tableBCont[3].val*10000)
            //I4=$I$35/$D$18*10000
            arr[0].si_tax = Math.round(this.tableACont[0].si_tax/this.tableBCont[3].val*10000)
            //G5=G52/$D$30*10000
            arr[1].tcp = Math.round(this.tableACont[1].children[1].money/this.tableBCont[6].val*10000)

            arr[7].price = Math.round(arr[0].price - arr[1].price - arr[2].price - arr[3].price - arr[5].price - arr[6].price) //G11=G4-G5-G6-G7-G8-G9-G10
            let sumRatio = 0
            arr.forEach((item,i)=>{
                if(i>0&&i<7){
                    item.ratio = (item.price/arr[0].price*100).toFixed(1) //H5=G5/$G$4
                    sumRatio += JSON.parse(item.ratio)
                }
            })
            arr[0].ratio = sumRatio //H4=SUM(H5:H12)
            this.tableD_pm.pm_taxin = (arr[7].price/arr[0].price*100).toFixed(2) //H12=G11/G4
            this.tableD_pm.pm_taxout = (arr[7].price/(arr[0].price-arr[0].si_tax)).toFixed(2) //K12=G11/(G4-I4)
        },
        //土增税计算表数据
        computedTableF(){
            let arr = this.tableF1Cont
            arr[0].val7 = (arr[0].val5 + arr[0].val6).toFixed(2) //C8=C6+C7
            arr[0].val8 = (arr[0].val7*0.1).toFixed(2) //C9=C8*10%
            arr[0].val10 = (arr[0].val7*0.2).toFixed(2) //C11=C8*20%
            arr[0].val11 = JSON.parse(arr[0].val7) + JSON.parse(arr[0].val8) + JSON.parse(arr[0].val9) + JSON.parse(arr[0].val10) //C12=C8+C9+C10+C11
            
            let houseSumVal12 = 0
            let nonordSumVal12 = 0
            let nonSumVal12 = 0
            let arr0Val2Sum = 0
            let arr0Val3Sum = 0
            let arr0Val4Sum = 0
            let sumVal4 = 0 //SUM($E$5:$M$5)
            arr[1].children.forEach((item,i)=>{
                if(item.type=='house'){
                    houseSumVal12 += JSON.parse(item.val12)
                }else if(item.type=='nonord_house'){
                    nonordSumVal12 += JSON.parse(item.val12)
                }else if(item.type=='non_house'){
                    nonSumVal12 += JSON.parse(item.val12)
                }
                sumVal4 += JSON.parse(item.val4)
                arr0Val2Sum += JSON.parse(item.val2) 
                arr0Val3Sum += JSON.parse(item.val3)
                arr0Val4Sum += JSON.parse(item.val4)
            })
            arr[2].val12 = (houseSumVal12).toFixed(2) //N14=G14+H14+I14
            arr[3].val12 = (nonordSumVal12).toFixed(2) //O14=E14+F14
            arr[4].val12 = (nonSumVal12).toFixed(2) //P14=J14+M14+K14+L14
            arr[0].val2 = arr0Val2Sum //C3=SUM(E3:M3)
            arr[0].val3 = arr0Val3Sum //C4=SUM(E4:M4)
            arr[0].val4 = arr0Val4Sum //C5=SUM(E5:M5)
            arr[0].val12 = JSON.parse(arr[2].val12)+JSON.parse(arr[3].val12)+JSON.parse(arr[4].val12) //C14=N14+O14+P14

            let houseSumVal5 = 0
            let houseSumVal6 = 0
            let houseSumVal9 = 0
            let nonordSumVal5 = 0
            let nonordSumVal6 = 0
            let nonordSumVal9 = 0
            let nonSumVal5 = 0
            let nonSumVal6 = 0
            let nonSumVal9 = 0
            arr[1].children.forEach((item,i)=>{
                if(i<arr[1].children.length-1){
                    //E2=E5/(SUM($E$5:$M$5)-$M$5)*$C$2
                    item.val1 = item.val4/(sumVal4-arr[1].children[arr[1].children.length-1].val4)*arr[0].val1
                }
                //E6=IF('静态收益测算 '!$G$26="否",E4/$C$4*$C$6,E3/$C$3*$C$6)
                item.val5 = this.tableHCont1[3].val=='否'?Math.round(item.val3/arr[0].val3*arr[0].val5):Math.round(item.val2/arr[0].val2*arr[0].val5)
                //=E7/$C$5*$C$7
                item.val6 = Math.round(item.val4/arr[0].val4*arr[0].val6)
                //E8=SUM(E6:E7)
                item.val7 = Math.round(item.val5+item.val6)
                //E9=E8*10%
                item.val8 = Math.round(item.val7*0.1)
                //E10=E14/$C$14*$C$10
                item.val9 = Math.round(item.val12/arr[0].val12*arr[0].val9)
                //E11=(E6+E7)*20%
                item.val10 = Math.round((item.val5+item.val6)*0.2)
                //E12=SUM(E8:E11)
                item.val11 = Math.round(item.val7+item.val8+item.val9+item.val10)
                //E15=E14-E12
                item.val13 = Math.round(item.val12-item.val11)
                //E16=IF(E12=0,0,E15/E12*100%)
                item.val14 = item.val11==0?0:Math.round(item.val13/item.val11*100)
                //E17=IF(E16<0,0,IF(E16<0.5,E15*0.3,IF(E16<1,E15*0.4-E12*0.05,IF(E16<2,E15*0.5-E12*0.15,E15*0.6-E12*0.35))))
                item.val15 = item.val14<0?0:item.val14<50?item.val13*0.3:item.val14<100?(item.val13*0.4-item.val11*0.5):item.val14<200?(item.val13*0.5-item.val11*0.15):(item.val13*0.6-item.val11*0.35)

                if(item.type=='house'){
                    houseSumVal5 += item.val5
                    houseSumVal6 += item.val6
                    houseSumVal9 += item.val9
                }else if(item.type=='nonord_house'){
                    nonordSumVal5 += item.val5
                    nonordSumVal6 += item.val6
                    nonordSumVal9 += item.val9
                }else if(item.type=='non_house'){
                    nonSumVal5 += item.val5
                    nonSumVal6 += item.val6
                    nonSumVal9 += item.val9
                }
            })
            //N6=G6+H6+I6
            arr[2].val5 = houseSumVal5
            arr[3].val5 = nonordSumVal5
            arr[4].val5 = nonSumVal5
            //N7=G7+H7+I7
            arr[2].val6 = houseSumVal6
            arr[3].val6 = nonordSumVal6
            arr[4].val6 = nonSumVal6
            //N10=G10+H10+I10
            arr[2].val9 = houseSumVal9
            arr[3].val9 = nonordSumVal9
            arr[4].val9 = nonSumVal9
            //N8=N6+N7
            arr[2].val7 = houseSumVal5 + houseSumVal6
            arr[3].val7 = nonordSumVal5 + nonordSumVal6
            arr[4].val7 = nonSumVal5 + nonSumVal6
            //N9=N8*10%
            arr[2].val8 = Math.round(arr[2].val7*0.1)
            arr[3].val8 = Math.round(arr[3].val7*0.1)
            arr[4].val8 = Math.round(arr[4].val7*0.1)
            //N11=(N6+N7)*20%
            arr[2].val10 = Math.round((arr[2].val5+arr[2].val6)*0.2)
            arr[3].val10 = Math.round((arr[3].val5+arr[3].val6)*0.2)
            arr[4].val10 = Math.round((arr[4].val5+arr[4].val6)*0.2)
            //N12=SUM(N8:N11)
            arr[2].val11 = arr[2].val7 + arr[2].val8 + arr[2].val9 + arr[2].val10
            arr[3].val11 = arr[3].val7 + arr[3].val8 + arr[3].val9 + arr[3].val10
            arr[4].val11 = arr[4].val7 + arr[4].val8 + arr[4].val9 + arr[4].val10
            //N15=N14-N12
            arr[2].val13 = arr[2].val12-arr[2].val11
            arr[3].val13 = arr[3].val12-arr[3].val11
            arr[4].val13 = arr[4].val12-arr[4].val11
            //N16=IF(N12=0,0,N15/N12*100%)
            arr[2].val14 = (arr[2].val11==0?0:arr[2].val13/arr[2].val11*100).toFixed(2)
            arr[3].val14 = (arr[3].val11==0?0:arr[3].val13/arr[3].val11*100).toFixed(2)
            arr[4].val14 = (arr[4].val11==0?0:arr[4].val13/arr[4].val11*100).toFixed(2)
            //N17=IF(N16<0,0,IF(N16<0.2,0,IF(N16<=0.5,N15*0.3,IF(N16<=1,N15*0.4-N12*0.05,IF(N16<=2,N15*0.5-N12*0.15,N15*0.6-N12*0.35)))))
            arr[2].val15 = (arr[2].val14<20?0:arr[2].val14<50?arr[2].val13*0.3:arr[2].val14<100?(arr[2].val13*0.4-arr[2].val11*0.5):arr[2].val14<200?(arr[2].val13*0.5-arr[2].val11*0.15):(arr[2].val13*0.6-arr[2].val11*0.35)).toFixed(2)
            arr[3].val15 = (arr[3].val14<20?0:arr[3].val14<50?arr[3].val13*0.3:arr[3].val14<100?(arr[3].val13*0.4-arr[3].val11*0.5):arr[3].val14<200?(arr[3].val13*0.5-arr[3].val11*0.15):(arr[3].val13*0.6-arr[3].val11*0.35)).toFixed(2)
            arr[4].val15 = (arr[4].val14<20?0:arr[4].val14<50?arr[4].val13*0.3:arr[4].val14<100?(arr[4].val13*0.4-arr[4].val11*0.5):arr[4].val14<200?(arr[4].val13*0.5-arr[4].val11*0.15):(arr[4].val13*0.6-arr[4].val11*0.35)).toFixed(2)
            
            arr[2].val16 = this.tableHCont2.houseVal //N18='静态收益测算 '!G28
            arr[3].val16 = this.tableHCont2.nonordVal //O18='静态收益测算 '!H28
            arr[4].val16 = this.tableHCont2.nonVal //P18='静态收益测算 '!I28
            //N19=N14*N18
            arr[2].val17 = arr[2].val12*arr[2].val16/100
            arr[3].val17 = arr[3].val12*arr[3].val16/100
            arr[4].val17 = arr[4].val12*arr[4].val16/100
            //N20=IF(N17>N19,N17,N19)
            arr[2].val18 = arr[2].val15>arr[2].val17?arr[2].val15:arr[2].val17
            arr[3].val18 = arr[3].val15>arr[3].val17?arr[3].val15:arr[3].val17
            arr[4].val18 = arr[4].val15>arr[4].val17?arr[4].val15:arr[4].val17

            //C15=N15+O15+P15
            arr[0].val13 = arr[2].val13+arr[3].val13+arr[4].val13
            //C16=C15/C12*100%
            arr[0].val14 = (arr[0].val13/arr[0].val11*100).toFixed(2)
            //C17=N17+O17+P17
            arr[0].val15 = JSON.parse(arr[2].val15)+JSON.parse(arr[3].val15)+JSON.parse(arr[4].val15)
            //C19=N19+O19+P19
            arr[0].val17 = JSON.parse(arr[2].val17)+JSON.parse(arr[3].val17)+JSON.parse(arr[4].val17)
            //静态收益测算 G139=表3土增税计算表!C19
            this.tableACont[1].children[7].children[0].money = arr[0].val17
            //C20=N20+O20+P20
            arr[0].val18 = JSON.parse(arr[2].val18)+JSON.parse(arr[3].val18)+JSON.parse(arr[4].val18)
        },
    }
}
</script>
<style lang="scss">
.calc_table{
    .table_wrap{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 80px;
        right: 0;
        padding: 20px;
        background: #fff;
        z-index: 9;
        .el-tabs__content{
            height: calc(100% - 55px);
            .el-tab-pane{
                height: 100%;
            }
        }
        .head_row{
            width: 100%;
            height: 30px;
            text-align: center;
            line-height: 30px;
        }
        .tableA,.tableB,.tableC,.tableD,.tableE,.tableF,.tableG,.tableH{
            background: #fff;
            height: 100%;
            position: relative;
            .head{
                display: flex;
                align-items: center;
                background: #fff;
                z-index: 9; 
            }
            .head_flex{
                display: flex;
                align-items: center;
                position: absolute;
                left: 0;
                top: 0;
                width: calc(100% - 36px);
                background: #fff;
                z-index: 9;
                padding-left: 30px;
            }
            .head_item{
                width: 10%;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-top: #ccc 1px solid;
                border-right: #ccc 1px solid;
                background: #efefef;
                &:first-child{
                    border-left: #ccc 1px solid;
                }
            }
            .contC,.contD,.contE{
                display: flex;
                align-items: center;
                position: relative;
                border-left: #ccc 1px solid;
            }
            .cont{
                height: calc(100% - 32px);
                overflow-y: scroll;
                padding-top: 31px;
                .cont_wrap{
                    padding-left: 30px;
                    border-bottom: #ccc 1px solid;
                    
                }
                .children1{
                    //background: #f5faff;
                }
                .self{
                    //background:#ecf5ff;
                }
                .self,.children1,.children2,.child_item,.child_wrap{
                    display: flex;
                    align-items: center;
                    position: relative;
                    border-left: #ccc 1px solid;
                    .open{
                        position: absolute;
                        left: -30px;
                        top: 6px;
                        font-size: 20px;
                        cursor: pointer;
                        user-select: none;
                    }
                }
            }
            .row_item{
                width: 10%;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-top: #ccc 1px solid;
                border-right: #ccc 1px solid;
                .el-input{
                    height: 100%;
                }
                .el-input__inner{
                    border: none;
                    height: 100%;
                    line-height: 30px;
                    background-color: unset;
                }
            }
        }
        .tableA{
            .cont{
                height: calc(100% - 74px);
            }
        }
        .tableF_1{
            display: flex;
            .tf_head{
                .head_item{
                    width: 180px;
                    border-left:#ccc 1px solid;
                }
            }
            .tf_cont{
                display: flex;
                .row_item{
                    width: 130px;
                    text-align: center;
                }
                .item_children{
                    display: flex;
                }
            }
        }
        .tableF_2{
            margin-top:20px;
            display: flex;
            .f2_head{
                .item{
                   width: 180px; 
                }
            }
            .f2_cont{
                display: flex;
                .row_item{
                    width: 180px;
                }
            }
        }
        .tableF{
            overflow-y: scroll;
        }
        .tableG{
            overflow-y: scroll;
            .date_range{
                margin-top: 20px;
            }
            .g1_cont{
                display: flex;
            }
            .g2_cont{
                margin-top: 20px;
                border-left: #ccc 1px solid;
                .top{
                    display: flex;
                    text-align: center;
                    .t2{
                        display: flex;
                    }
                    .t2b{
                        display: flex;
                    }
                    .item3{
                        width: 200px;
                        height: 60px;
                        line-height: 60px;
                        border-top: #ccc 1px solid;
                        border-right: #ccc 1px solid;
                    }
                    .item2{
                        width:241px;
                        height: 30px;
                        line-height: 30px;
                        border-top: #ccc 1px solid;
                        border-right: #ccc 1px solid;
                    }
                    .item1{
                        width: 120px;
                        height: 30px;
                        line-height: 30px;
                        border-top: #ccc 1px solid;
                        border-right: #ccc 1px solid;
                    }
                }
                .cont{
                    padding-top: 0;
                    .cont_item{
                        display: flex;
                        .row_item{
                            width: 120px;
                        }
                    }
                }
            }
            .tg_cont{
                margin-top: 20px;
                .colora{
                    background: #ba9959;
                }
                .cont_item{
                    display: flex;
                    margin-bottom: 10px;
                    .head_item{
                        width: 130px;
                        border-left: #ccc 1px solid;
                    }
                    .row_item{
                        width: 130px;
                    }
                }
            }
        }
        .tableH{
            .head{
                display: flex;
                .head_item{
                    width: 220px;
                }
            }
            .cont_item{
                display: flex;
                .row_item{
                    width: 220px;
                }
            }
            .cont2{
                margin-top: 20px;
                display: flex;
                .head_item{
                    width: 220px;
                }
                .top,.bot{
                    display: flex;
                    .row_item{
                        width: 220px;
                    }
                }
            }
        }
        .tableC{
            overflow-y: scroll;
        }
        .inputs{
            background: #e3f7ff;
        }
        .border_b{
            border-bottom:#ccc 1px solid
        }
        .stress{
            font-weight:bold;
            color:#f03;
        }
        .op_icon{
            cursor: pointer;
            font-size: 16px;
            color: #303133;
            margin-left: 10px;
            &:hover{
                color: #f60;
            }
        }
    }
}
</style>

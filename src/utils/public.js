
import $ from 'jquery'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}
/**
 * 树结构转数组1
 */

export function treeToArray (tree) {
  let arr1 = []
  function treeChange(tree){
    tree.forEach(item=>{
      arr1.push({
        name:item.name,
        itemCode:item.itemCode,
        weight:JSON.stringify(item.weight),
        iid:item.iid,
        ipid:item.ipid
      })
      if(item.children.length>0){
        treeChange(item.children)
      }
    })
  }
  treeChange(tree)
  return arr1
}
/**
 * 树结构转数组2
 */
export function treeToArray1(tree){
  let arr2 = []
  function treechangeArray (tree) {
    tree.forEach(item=>{
      if(item.clickColumn!==null){
        arr2.push({
          name:item.name,
          itemCode:item.itemCode,
          clickColumn:item.clickColumn
        })
      }
      if(item.children.length>0){
        treechangeArray(item.children)
      }
    })
  }
  treechangeArray(tree)
  return arr2
}
//通过id 跟 parentId 转化树结构
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 通过itemCode转化树结构
 */

export function treeDataTranslateCode (data, id = 'itemCode', pid = 'parentCode') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    var code = data[i][id];
    if(code.length>2){
      data[i]['parentCode']=code.substr(0,code.length-2)
    }else{
      data[i]['parentCode']='NO_FOUND_ID'
    }
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
/**
 * 根据数据生成色带图例
 */

export function generateLegend(data){
  if(data.length===0){
    return
  }
  let dataArr = []
  data.forEach(item=>{
      if(item.data){
        dataArr.push(JSON.parse(item.data))
      }else{
        dataArr.push(null)
      } 
  })
  let maxPoint = parseInt(Math.max.apply(null, dataArr)); //最大值
  let minPoint = parseInt(Math.min.apply(null, dataArr)); //最小值
  let ave = parseInt((maxPoint-minPoint)/7); //七等分色带平均值
  
  let arr = []
  for(let i=0;i<7;i++){
    if(i==0){
      arr.push(minPoint)
    }else if(i==6){
      arr.push(maxPoint)
    }else{
      arr.push(minPoint+ave*i)
    }
  }
  return arr
}

/**
 * 根据数据设置图层填充颜色
 */

export function setPlateColor(data,map,color) {
  var that = this
  var expression_fill = ["match", ["get", "regionno"]];
  var expression_line = ["match", ["get", "regionno"]];
  var expression_symbol = ["match", ["get", "regionno"]];
  if (data == undefined || data.length == 0) {
      expression_fill.push("rgba(58, 88, 125, 0.4)");
      expression_fill.push("rgba(58, 88, 125, 1)");
      expression_line.push("rgba(149, 149, 246,1)");
      expression_line.push("rgba(149, 149, 246,1)");
      expression_symbol.push("rgba(68, 249, 237, 1)");
      expression_symbol.push("rgba(68, 249, 237, 1)");
  } else {
      let partPiontArr = pointConversion(data)
      partPiontArr.forEach(function(item) {
          let shapeColor;
          if (item) {
            if (item.data == null||item.data == undefined) {
              shapeColor = "rgba(58, 88, 125, 0.4)";
            } else if (item.data == 0) {
                shapeColor = color[0].value;
            } else if (item.data > 0 && item.data <= 1) {
                shapeColor = color[1].value;
            } else if (item.data >= 1 && item.data <= 2) {
                shapeColor = color[2].value;
            } else if (item.data >= 2 && item.data <= 3) {
                shapeColor = color[3].value;
            } else if (item.data >= 3 && item.data <= 4) {
                shapeColor = color[4].value;
            } else if (item.data >= 4 && item.data <= 5) {
                shapeColor = color[5].value;
            } else if (item.data >= 5 && item.data <= 6) {
                shapeColor = color[6].value;
            } else if (item.data >= 6 && item.data <= 7) {
                shapeColor = color[7].value;
            } else if (item.data >= 7 && item.data <= 8) {
                shapeColor = color[8].value;
            } else if (item.data >= 8 && item.data <= 9) {
                shapeColor = color[9].value;
            } else {
                shapeColor = color[10].value;
            }
          } else {
            shapeColor = "rgba(58, 88, 125, 0.4)";
          }
          expression_fill.push(item["regionno"], shapeColor);
          if (item) {
            if (item.data == null||item.data == undefined) {
              expression_line.push(item["regionno"],"rgba(149, 149, 246,1)");
              expression_symbol.push(item["regionno"],"rgba(68, 249, 237, 1)");
            }else{
              if (item.data == 0) {
                expression_symbol.push(item["regionno"],"rgba(255, 255, 255, 1)");
              }else{
                expression_symbol.push(item["regionno"],"rgba(0, 0, 0, 1)");
              }
              expression_line.push(item["regionno"],"rgba(255, 255, 255, 0.6)");
            }
          }
      });
  }
  expression_fill.push("rgba(58, 88, 125, 0.4)");
  expression_line.push("rgba(149, 149, 246,1)");
  expression_symbol.push("rgba(68, 249, 237, 1)");
  if(map!=null){
    map.setPaintProperty("plate_fill", "fill-color", expression_fill);
    //map.setPaintProperty("plate_line", "line-color", expression_line);
    //map.setPaintProperty("plate_labels", "text-color", expression_symbol);
  }
}

/**
 * 获取数组最大值并转化成十分制
 */

export function pointConversion(arr){
  let pointArr = []
  arr.forEach(item=>{
      if(item.data){
          pointArr.push(JSON.parse(item.data))
      }else{
          pointArr.push(null)
      } 
  })
  let maxPoint = Math.max.apply(null, pointArr);
  let minPoint = Math.min.apply(null, pointArr);
  let divisor = null
  if(maxPoint-minPoint>0){
    divisor = ((maxPoint-minPoint)/10).toFixed(2)
  }else{
    divisor = (maxPoint/10).toFixed(2)
  }
  let backArr = JSON.parse(JSON.stringify(arr))
  if(maxPoint>10){
      backArr.forEach(item=>{
      if(item.data){
          item.data = item.data/divisor
      }
    })
  }
  return backArr
}

/**
 * 高德api查询位置
 */

export function gdSiteSearch(val,cityCode){
  let results = []
  if(val!=''){
    $.ajax({
      type:'get',
      url:'https://restapi.amap.com/v3/place/text',
      cache:false,
      async:false,
      dataType:'json',
      data:{
        "key":"d222a0cc9d49fe7a60ab4b123a20c34a",
        "keywords":val,
        "city":cityCode,
        "citylimit":true,
        "extensions":'base'
      },
      success:data=>{
        console.log('地点查询结果')
        console.log(data)
        if(data&&data.status==="1"){
          results = data.pois
        }
      }
    });
  }
  return results
}

/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 * coordtransform.js
 */
export function corChange(){
  //定义一些常量
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lon
   * @param bd_lat
   * @returns {*[]}
   */
  var bd09togcj02 = function bd09togcj02(bd_lon, bd_lat) {
      var bd_lon = +bd_lon;
      var bd_lat = +bd_lat;
      var x = bd_lon - 0.0065;
      var y = bd_lat - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
      var gg_lng = z * Math.cos(theta);
      var gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat]
  };

  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  var gcj02tobd09 = function gcj02tobd09(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
      var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
      var bd_lng = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return [bd_lng, bd_lat]
  };

  /**
   * WGS84转GCj02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  var wgs84togcj02 = function wgs84togcj02(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      if (out_of_china(lng, lat)) {
          return [lng, lat]
      } else {
          var dlat = transformlat(lng - 105.0, lat - 35.0);
          var dlng = transformlng(lng - 105.0, lat - 35.0);
          var radlat = lat / 180.0 * PI;
          var magic = Math.sin(radlat);
          magic = 1 - ee * magic * magic;
          var sqrtmagic = Math.sqrt(magic);
          dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
          dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
          var mglat = lat + dlat;
          var mglng = lng + dlng;
          return [mglng, mglat]
      }
  };

  /**
   * GCJ02 转换为 WGS84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  var gcj02towgs84 = function gcj02towgs84(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      if (out_of_china(lng, lat)) {
          return [lng, lat]
      } else {
          var dlat = transformlat(lng - 105.0, lat - 35.0);
          var dlng = transformlng(lng - 105.0, lat - 35.0);
          var radlat = lat / 180.0 * PI;
          var magic = Math.sin(radlat);
          magic = 1 - ee * magic * magic;
          var sqrtmagic = Math.sqrt(magic);
          dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
          dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
          var mglat = lat + dlat;
          var mglng = lng + dlng;
          return [lng * 2 - mglng, lat * 2 - mglat]
      }
  };

  var transformlat = function transformlat(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
      ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
      return ret
  };

  var transformlng = function transformlng(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
      return ret
  };

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  var out_of_china = function out_of_china(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      // 纬度3.86~53.55,经度73.66~135.05 
      return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };

  return {
      bd09togcj02: bd09togcj02,
      gcj02tobd09: gcj02tobd09,
      wgs84togcj02: wgs84togcj02,
      gcj02towgs84: gcj02towgs84
  }
}

export function gcj02towgs84(lng, lat) {
  //定义一些常量
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  var lat = +lat;
  var lng = +lng;
  if (out_of_china(lng, lat)) {
      return [lng, lat]
  } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
  }
  function out_of_china(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    // 纬度3.86~53.55,经度73.66~135.05 
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };
  function transformlat(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  };

  function transformlng(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
      return ret
  };
};

export function wgs84togcj02(lng, lat) {
  //定义一些常量
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  var lat = +lat;
  var lng = +lng;
  if (out_of_china(lng, lat)) {
      return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat]
  }
  function out_of_china(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    // 纬度3.86~53.55,经度73.66~135.05 
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };
  function transformlat(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  };

  function transformlng(lng, lat) {
      var lat = +lat;
      var lng = +lng;
      var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
      return ret
  };
};
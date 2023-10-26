import * as THREE from 'three';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';

// 模拟数据
const dataList = [
 {
   name: "FSU",
   E: 0,
   N: 0
 }
]
let R = 150
let N = 20
for(let index =0;index < N;index ++){
 let angle = 2 * Math.PI / N * index;
 dataList.push({
   name: "设备"+(index + 1),
   E: R * Math.cos( angle ),
   N: R * Math.sin( angle )
 })
}

var flyGroup = new THREE.Group();
var deviceGroup = new THREE.Group(); //飞线所有端点标注集合

updateFly('FSU')
//更新绘制飞线
function updateFly(provinceName) {
 //飞线起点坐标
 var start = null;
 var endArr = []; //飞线结束点坐标集合.
 dataList.forEach((coord, i) => {
   if (coord.name == provinceName) {
     // 设置飞线发射起点坐标
     start = new THREE.Vector3(coord.E, coord.N, 50);
   } else {
     // 所有飞线结束点的坐标
     endArr.push(coord)
   }
 });
 // 绘制当前选中省份对应的所有飞线
 currentCityAllFlys(start, endArr)
}

function currentCityAllFlys(start, endArr){
 // 每次重新绘制的时候要清除释放原有飞线等模型几何体和材质占用内存
 if (deviceGroup.children.length) disposeGroup(deviceGroup);
 if (flyGroup.children.length) disposeGroup(flyGroup);

 // 标注发射中心
 var startPoint = createDevice(start,'FSU')
//  startPoint.material.opacity = 0
 deviceGroup.add(startPoint)
 //批量绘制飞线
 endArr.forEach((cood, i) => {
   var end = new THREE.Vector3(cood.E, cood.N, 0); //终点
   var devMesh = createDevice(end,cood.name)
   devMesh.material.opacity = 0.5
   deviceGroup.add(devMesh)

   //飞线运动轨迹绘制函数flyTrack
   var flyTrack = flyTrackFun(start, end);
   flyGroup.add(flyTrack); //线条对象添加到场景中
   // 获取飞线轨迹线上的顶点坐标，用于飞线段绘制
   var points = flyTrack.flyTrackPoints;

   var index = 10; //飞线索引起点
   var flyline = flylineFun(index, points); //绘制一段飞线
   //飞线取点索引范围：points.length - flyline.num
   flyline.index = Math.floor((points.length - flyline.num) * Math.random()); //索引位置随机
   flyTrack.add(flyline); //飞线段flyline作为飞线轨迹flyTrack子对象，可以继承飞线轨迹平移旋转等变换
 })
}

/*释放模型对象几何体和材质所占用的内存*/
function disposeGroup(group) {
 // .traverse方法递归遍历group的所有后代
 group.traverse(function(obj) {
   if (obj.type == 'Mesh' || obj.type == 'Line') {
     obj.geometry.dispose();
     obj.material.dispose();
   }
 })
 if (group.children.length) {
   group.children = []; //删除所有后代模型对象
 }
}

// 绘制一段飞线
function flylineFun(index, points){
 var choosePoints = []; //存储飞线轨迹上选择的顶点坐标，用于飞线绘制
  var num = 5; //从曲线上取11个点 飞线长度占飞线轨迹长度的10%  你可通过获取的点数调节飞线长度
  for (var i = 0; i < num; i++) {
    choosePoints.push(points[i + index])
  }
  // 创建一个LineGeometry几何体
  var geometry = new LineGeometry();
  var pointArr = []
  //把样条曲线返回的顶点坐标Vector3中xyz坐标提取到pointArr数组中
  choosePoints.forEach(function(v3) {
    pointArr.push(v3.x, v3.y, v3.z)
  })
  // 设置几何体顶点位置坐标
  geometry.setPositions(pointArr);

  //几何体LineGeometry对应的材质LineMaterial
  var material = new LineMaterial({
    color: 0xffff00,//使用顶点颜色，材质颜色不用设置
    vertexColors: THREE.VertexColors, //使用顶点颜色插值计算
    linewidth: 2.0, // 设置线宽
  });
  //材质输入Three.js渲染canvas画布的宽高度
  material.resolution.set(window.innerWidth, window.innerHeight);
  var flyline = new Line2(geometry, material);
  // 自定义飞线属性flyline.num、flyline.index，用于飞线动画
  flyline.num = num;
  flyline.index = index;
  return flyline;
}

/*飞线运动轨迹绘制函数flyTrack
参数start,end:飞线的起点和结束点坐标Vector3*/
function flyTrackFun(start, end) {
 var H = 3; //弧线高度全部一样
 var middle = new THREE.Vector3(0, 0, 0);
 middle.add(start).add(end).divideScalar(2)
 // middle.y += H;
 middle.z += H; //调整高度方向为z

 var geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
 // 起始点坐标和弧线高度确定一条3D样条曲线
 var curve = new THREE.CatmullRomCurve3([
   start,
   middle,
   end
 ]);
 var points = curve.getPoints(100); //分段数100，返回101个顶点，返回一个vector3对象作为元素组成的数组
 geometry.setFromPoints(points); // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
 //材质对象
 var material = new THREE.LineBasicMaterial({
   color: 0x00aaaa,
 });
 //线条模型对象
 var line = new THREE.Line(geometry, material);
 line.flyTrackPoints = points; // 自定义属性用于飞线动画
 return line;
}


// 模拟设备
function createDevice(coord,name){
 const geometry = new THREE.BoxGeometry( 10, 10, 10 );
 const material = new THREE.MeshLambertMaterial({
  color: 0x004444,
  transparent: true,
  side: THREE.DoubleSide,
 });
 const cube = new THREE.Mesh( geometry, material );
 cube.name = name
 cube.position.copy(coord)
 return cube
}

function updateFlyGeo(flyline, index, points) {
 var pointArr = []; //存储飞线轨迹上选择的顶点坐标，用于飞线绘制
 for (var i = 0; i < flyline.num; i++) {
   var v3 = points[i + index]
   pointArr.push(v3.x, v3.y, v3.z)
 }
 // 设置几何体顶点位置坐标
 flyline.geometry.setPositions(pointArr);
 flyline.geometry.verticesNeedUpdate = true; //通知three.js几何体顶点位置坐标数据更新
}

export{
 flyGroup,
 deviceGroup,
 updateFlyGeo
}

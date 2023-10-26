// 引入three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { Line2 } from 'three/addons/lines/Line2.js';

const model = new THREE.Group()
/**
* 创建线条模型
*/
var geometry = new LineGeometry(); //创建一个缓冲类型几何体
// 三维样条曲线
var curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(100, 0, -100),
    new THREE.Vector3(0, 30, 0),
    new THREE.Vector3(-100, 0, 100),
]);
//曲线上等间距返回多个顶点坐标
var points = curve.getSpacedPoints(100); //分段数100，返回101个顶点
// setFromPoints方法从points中提取数据赋值给attributes.position
const pointsArr = []
points.forEach(v3 => {
    pointsArr.push(v3.x, v3.y, v3.z)
})
geometry.setPositions(pointsArr);
var material = new LineMaterial({
    linewidth: 2, // 设置线宽      
    color: 0x006666, //轨迹颜色
});
material.resolution.set(window.innerWidth, window.innerHeight);
//线条模型对象
var line = new Line2(geometry, material);
model.add(line);


var index = 10; //取点索引位置
var num = 3; //从曲线上获取点数量
var points2 = points.slice(index, index + num); //从曲线上获取一段
// var geometry2 = new THREE.BufferGeometry();
// geometry2.setFromPoints(points2);
var geometry2 = new LineGeometry();
var pointArr = []
//把圆弧曲线返回的顶点坐标Vector3中xyz坐标提取到pointArr数组中
points2.forEach(function (v3) {
    pointArr.push(v3.x, v3.y, v3.z)
})
// 设置几何体顶点位置坐标
geometry2.setPositions(pointArr);

//几何体LineGeometry对应的材质LineMaterial
var material2 = new LineMaterial({
    color: 0xffff00, //设置线条颜色值
    linewidth: 3, // 设置线宽            
    vertexColors: THREE.VertexColors, // 注释color设置，启用顶点颜色渲染
});
//材质输入Three.js渲染canvas画布的宽高度
material2.resolution.set(window.innerWidth, window.innerHeight);
//Line2模型对象
var line2 = new Line2(geometry2, material2);
model.add(line2);

var indexMax = points.length - num; //飞线取点索引范围
function render() {
   if (index > indexMax) index = 0;
   index += 0.5
   points2 = points.slice(index, index + num); //从曲线上获取一段
   // geometry2.setFromPoints(points2);
   var pointArr = []
   //把圆弧曲线返回的顶点坐标Vector3中xyz坐标提取到pointArr数组中
   points2.forEach(function (v3) {
       pointArr.push(v3.x, v3.y, v3.z)
   })
   // 设置几何体顶点位置坐标
   geometry2.setPositions(pointArr);
   requestAnimationFrame(render);
}
render();

export default model











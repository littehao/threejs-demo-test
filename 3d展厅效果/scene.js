import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import  { doors, deives, model, fsuModel, roomModel }  from './model.js';//模型对象
import { moveCamera } from './event.js'

function groundPan(rangeSize, divisions, color, R, RColor) {
  var group = new THREE.Group()
  var gridHelper = new THREE.GridHelper(rangeSize, divisions, color, color)
  group.add(gridHelper)
  // console.log('gridHelper',gridHelper)
  gridHelper.material.depthWrite = false
  gridHelper.renderOrder = -2
  // CircleGeometry圆形平面几何体
  var geometry = new THREE.CircleGeometry(R, 20, 20)
  geometry.rotateX(Math.PI / 2) // 从XOY平面旋转到XOZ平面
  // 可以选择基础网格材质，基础网格材质不受光照影响，和其它场景配合，颜色更稳定，而且节约渲染资源
  var material = new THREE.MeshBasicMaterial({
    color: RColor,
    side: THREE.DoubleSide,
    depthWrite: false
  })
  // 共享材质和几何体数据，批量创建圆点mesh
  var spacing = rangeSize / divisions
  var spacingR = rangeSize / 2
  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      var mesh = new THREE.Mesh(geometry, material)
      mesh.renderOrder = -1
      mesh.translateX(-spacingR + i * spacing)
      mesh.translateZ(-spacingR + j * spacing)
      group.add(mesh)
    }
  }
  return group
}
//场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020721);
var ground = groundPan(600, 10, 0x004444, 0.5, 0x008888)
// scene.add(ground)
scene.fog = new THREE.Fog(0x020721, 600, 1200)
//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const k = width / height; //canvas画布宽高比
const s = 60;//控制left, right, top, bottom范围大小
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 20000);
// const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 3000);
// camera.position.set(292, 223, 185);
// camera.position.set(110, 43, 0);//根据渲染范围尺寸数量级设置相机位置
camera.position.set(0, 200, 304);//根据渲染范围尺寸数量级设置相机位置
// camera.lookAt(0,100,0);

const renderer = new THREE.WebGLRenderer({
 logarithmicDepthBuffer: true,// 设置对数深度缓冲区，优化深度冲突问题
 antialias:true//执行抗锯齿
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio)
console.log(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

//解决加载gltf格式模型颜色偏差问题
renderer.outputEncoding = THREE.sRGBEncoding;
// 设置渲染器，允许光源阴影渲染
renderer.shadowMap.enabled = true;
// 模型表面产生条纹影响渲染效果，可以改变.shadowMap.type默认值优化
renderer.shadowMap.type = THREE.VSMShadowMap; 

// 创建一个CSS2渲染器CSS3DRenderer
var labelRenderer = new CSS3DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
// 避免renderer.domElement影响HTMl标签定位，设置top为0px
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
//设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
labelRenderer.domElement.style.pointerEvents = 'none';
/* 初始不渲染HTML标签，鼠标点击后在渲染出来 */
// labelRenderer.domElement.style.display = "none";
document.body.appendChild(labelRenderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
//相机距离观察目标点极小距离——模型最大状态
controls.minDistance = 20;
// //相机距离观察目标点极大距离——模型最小状态
controls.maxDistance = 500;
// //左右旋转限制
// controls.minAzimuthAngle = Math.PI/2 * 0.5;
// controls.maxAzimuthAngle = Math.PI/1.5;
// //上下旋转限制
// controls.minPolarAngle = Math.PI/2
// controls.maxPolarAngle = Math.PI/2
// 禁止拖动
// controls.enablePan = false

// controls.target.set(0,100,0); //与lookAt参数保持一致
// controls.update(); //update()函数内会执行camera.lookAt(controls.target)


/**
 * 射线投射器`Raycaster`的射线拾取选中网格模型对象函数choose()
 * 选中的网格模型变为半透明效果
 */
function choose(event) {
 var Sx = event.clientX;
 var Sy = event.clientY;
 //屏幕坐标转标准设备坐标
 var x = (Sx/ width) * 2 - 1;
 var y = -(Sy/ height) * 2 + 1;
 //创建一个射线投射器`Raycaster`
 var raycaster = new THREE.Raycaster();
 //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
 raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
 //返回.intersectObjects()参数中射线选中的网格模型对象
 // 未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
 var intersects = raycaster.intersectObjects([...doors, ...deives]);
 console.log("射线器返回的对象", intersects);
 // console.log("射线投射器返回的对象 点point", intersects[0].point);
 // console.log("射线投射器的对象 几何体",intersects[0].object.geometry.vertices)
 // intersects.length大于0说明，说明选中了模型
 if (intersects.length > 0 && intersects[0].distance < 150) {
     // 选中模型的第一个设置为半透明
     const obj = intersects[0].object
     // 选择门
     var chooseDoor = obj.parent;
     if(chooseDoor.name == '机柜2门1' || chooseDoor.name == '机柜2门2'){
      openCloseDoor(chooseDoor,'机柜2门1','机柜2门2')
     } else if(chooseDoor.name == '机柜3门1' || chooseDoor.name == '机柜3门2'){
      openCloseDoor(chooseDoor,'机柜3门1','机柜3门2')
     } else if(chooseDoor.name == '机柜1门' || chooseDoor.name == '机柜4门') {
      openCloseDoor(chooseDoor)
     }
     // 选择设备
     if(obj.name == 'afs48' || obj.parent.name == 'afs48'){
      labelRenderer.domElement.style.display = "block";
       var div = document.getElementById('deviceTag1');
       div.style.visibility = 'visible';
     }
 }
}
addEventListener('click', choose); 


function chooseFsu(event){
  var Sx = event.clientX;
  var Sy = event.clientY;
  //屏幕坐标转标准设备坐标
  var x = (Sx/ width) * 2 - 1;
  var y = -(Sy/ height) * 2 + 1;
  //创建一个射线投射器`Raycaster`
  var raycaster = new THREE.Raycaster();
  //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  var intersects = raycaster.intersectObjects([...deives]);
  console.log("射线器返回的对象chooseFsu", intersects);
  if (intersects.length > 0 && intersects[0].distance < 150) {
    // 选中模型的第一个设置为半透明
    const obj = intersects[0].object
    // 选择设备
    if(obj.name == 'fsu' || obj.parent.name == 'fsu'){
      scene.remove(model)
      scene.remove(roomModel)
      scene.add(fsuModel); //模型对象添加到场景中
      moveCamera([0, 100, 250], [0, 0, 0])
    }
  }
}
addEventListener('dblclick',chooseFsu)

// 开关机柜们
function openCloseDoor(chooseDoor,leftDoor,rightDoor){
   if (chooseDoor.state == 'close') {
    chooseDoor.state = 'open';
    chooseDoor.openTween.start();//播放开门动画 
    if(leftDoor && rightDoor){
     if(chooseDoor.name == leftDoor) {
      const door = model.getObjectByName(rightDoor)  
      door.state = 'open';
      door.openTween.start();
     } else {
      const door = model.getObjectByName(leftDoor)  
      door.state = 'open';
      door.openTween.start();
     }   
   }
  } else {

    labelRenderer.domElement.style.display = "block";
    var div = document.getElementById('deviceTag1');
    div.style.visibility = 'hidden';

    chooseDoor.state = 'close';
    chooseDoor.closeTween.start();//播放关门动画
    if(leftDoor && rightDoor){
     if(chooseDoor.name == leftDoor) {
      const door = model.getObjectByName(rightDoor)  
      door.state = 'close';
      door.closeTween.start();
     } else {
      const door = model.getObjectByName(leftDoor)  
      door.state = 'close';
      door.closeTween.start();
     } 
    }    
  }
}


const topPos =  [0, 250, 0] //上帝视角
const fontPos = [0, 30, 0]
const leftPos = [-90, 30, 0]
const rightPos = [110, 30, 0]

//上帝视角
document.getElementById('topPos').addEventListener('click',function(){
 moveCamera(topPos, [0, 0, 0])
})
//特殊视角
document.getElementById('fontPos').addEventListener('click',function(){
 moveCamera(fontPos, [-29, 30, 0])
})
//视角1
document.getElementById('leftPos').addEventListener('click',function(){
 moveCamera(leftPos, [0, 30, 0])
})
//视角2
document.getElementById('rightPos').addEventListener('click',function(){
 moveCamera(rightPos, [0, 30, 0])
})
//重置位置
document.getElementById('restPos').addEventListener('click',function(){
 moveCamera([0, 200, 204], [0, 0, 0])
})
// 切换场景
document.getElementById('back').addEventListener('click',function(){
  labelRenderer.domElement.style.display = "none";
  var div = document.getElementById('deviceTag1');
  var fsudiv = document.getElementById('fsu');
  div.style.visibility = 'hidden';
  fsudiv.style.visibility = 'hidden';
  scene.add(roomModel)
  scene.add(model)
  scene.remove(fsuModel)
  moveCamera(fontPos, [-29, 30, 0])
})

export  {
 scene,
 camera,
 renderer,
 labelRenderer,
 controls
}
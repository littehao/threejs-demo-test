import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//场景
const scene = new THREE.Scene();

//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);


//环境光
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

//渲染器和相机
const width = 1000;
const height = 800;
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
camera.position.set(0, 300, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true,// 设置对数深度缓冲区，优化深度冲突问题
    antialias:true//执行抗锯齿
});
renderer.setSize(width, height);
const dom  = document.getElementById('canvas')
dom.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


// 三维样条曲线
const path = new THREE.CatmullRomCurve3([
 new THREE.Vector3(0, 20, 90),
 new THREE.Vector3(200, 20, 90),
 new THREE.Vector3(200, -100, 90),
 new THREE.Vector3(0, -100, 90),
 new THREE.Vector3(90, -40, 60),
 new THREE.Vector3(120, 30, 30),
]);
// 样条曲线path作为TubeGeometry参数生成管道
const geometry = new THREE.TubeGeometry(path, 200, 5, 30);
const texLoader = new THREE.TextureLoader(); 
//纹理贴图
const texture = texLoader.load('../imgs/wall.jpg');
//UV坐标U方向阵列模式
texture.wrapS = THREE.RepeatWrapping;
//纹理沿着管道方向阵列(UV坐标U方向)
texture.repeat.x = 10;
const material = new THREE.MeshLambertMaterial({
 map:texture,
 side: THREE.DoubleSide, //双面显示看到管道内壁
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

// 从曲线上等间距获取一定数量点坐标
const pointsArr = path.getSpacedPoints(1000);
// 渲染循环
let i =0
function render() {
   if (i < pointsArr.length - 1) {
    // 相机位置设置在当前点位置
    camera.position.copy(pointsArr[i]);
    // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
    // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
    camera.lookAt(pointsArr[i + 1]);
    i += 1; //调节速度
  } else {
    i = 0
  }
 renderer.render(scene, camera);
 requestAnimationFrame(render);
}
render();

// 画布跟随窗口变化
window.onresize = function () {
 renderer.setSize(window.innerWidth, window.innerHeight);
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
};

import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {mesh,plane} from './model.js';

//场景
const scene = new THREE.Scene() 
scene.add(mesh)
scene.add(plane)
scene.background = new THREE.Color(0xcce0ff);
scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000)
//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

//光源设置
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 60, 50);
scene.add(directionalLight);
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

//相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
camera.position.set(431, 105, 269);
// camera.lookAt(0, 0, 0)

// WebGL渲染器设置
const renderer = new THREE.WebGLRenderer({
 antialias: true, 
});
// renderer.setClearColor(0xcce0ff)
renderer.setPixelRatio(window.devicePixelRatio); 
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 渲染循环
function render() {
    // console.log(camera.position)
 renderer.render(scene, camera);
 requestAnimationFrame(render);
}
render();

// 相机控件
const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};


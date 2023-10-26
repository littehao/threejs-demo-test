import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import model from './drawline.js'

//场景
const scene = new THREE.Scene();
scene.add(model)

//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);


//环境光
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(0, 300, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true,// 设置对数深度缓冲区，优化深度冲突问题
    antialias:true//执行抗锯齿
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);



// 渲染循环
function render() {
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

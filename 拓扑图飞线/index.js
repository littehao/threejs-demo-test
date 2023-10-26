import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import  model  from './model.js';//模型对象
// import  line2  from './line2.js';//模型对象
import  {
    flyGroup,
    deviceGroup,
    updateFlyGeo
}  from './flyline.js';//模型对象

//场景
const scene = new THREE.Scene();

//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);


//光源设置
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 60, 50);
scene.add(directionalLight);
const ambient1 = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient1);
const ambient2 = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient2);

//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(0, 223, 485);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true,// 设置对数深度缓冲区，优化深度冲突问题
    antialias:true//执行抗锯齿
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// 创建好的飞线添加到场景
var mapGroup = new THREE.Group();
function init(){
    mapGroup.rotateY(Math.PI);
    mapGroup.rotateX(-Math.PI/2);
    // centerCamera(mapGroup, camera);
    mapGroup.add(flyGroup);
    mapGroup.add(deviceGroup);
    scene.add(mapGroup)
}
init()


// 渲染循环
function render() {
    flyGroup.children.forEach((flyTrack, i) => {
        // 获取飞线轨迹线上的顶点坐标，用于飞线段绘制
        var points = flyTrack.flyTrackPoints;
        var flyline = flyTrack.children[0];
        var indexMax = points.length - flyline.num; //飞线取点索引范围
        if (flyline.index < indexMax) {
            flyline.index += 1
        } else {
            flyline.index = 0
        }
        updateFlyGeo(flyline, flyline.index, points); //更新飞线的位置，生成飞行动画
    });
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
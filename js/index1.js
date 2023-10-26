import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import gui from './gui.js';
import  { model }  from './model2.js';//模型对象

function groundPan(rangeSize, divisions, color, R, RColor){
    var group = new THREE.Group();
    var gridHelper = new THREE.GridHelper(rangeSize, divisions, color, color);
    group.add(gridHelper);
    // console.log('gridHelper',gridHelper)
    gridHelper.material.depthWrite = false;
    gridHelper.renderOrder = -2;
    // CircleGeometry圆形平面几何体
    var geometry = new THREE.CircleGeometry(R, 20, 20);
    geometry.rotateX(Math.PI / 2); //从XOY平面旋转到XOZ平面
    // 可以选择基础网格材质，基础网格材质不受光照影响，和其它场景配合，颜色更稳定，而且节约渲染资源
    var material = new THREE.MeshBasicMaterial({
        color: RColor, 
        side: THREE.DoubleSide,
        depthWrite : false,
    });
    // 共享材质和几何体数据，批量创建圆点mesh
    var spacing = rangeSize / divisions
    var spacingR= rangeSize / 2
    for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
            var mesh = new THREE.Mesh(geometry, material);
            mesh.renderOrder = -1;
            mesh.translateX(-spacingR + i * spacing);
            mesh.translateZ(-spacingR + j * spacing);
            group.add(mesh)
        }
    }
    return group
}

//场景
const scene = new THREE.Scene();
scene.add(model); //模型对象添加到场景中

var ground = groundPan(300, 50, 0x004444, 0.5, 0x008888)
// scene.add(ground);
// scene.fog = new THREE.Fog(0x001111, 300, 500);

const textureCube = new THREE.CubeTextureLoader()
    // .setPath('../../环境贴图/环境贴图0/')
    .setPath('./环境贴图/环境贴图4/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
textureCube.encoding = THREE.sRGBEncoding;//和renderer.outputEncoding一致
// 环境贴图纹理对象textureCube作为.environment属性值,影响所有模型
scene.environment = textureCube;


//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


//光源设置
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(50,100, 100);
scene.add(directionalLight1);
// console.log(directionalLight1.position)
// gui.add(directionalLight1.position, 'x', -100, 100)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-50, -100, -100);
// scene.add(directionalLight2);

// const helper1 = new THREE.DirectionalLightHelper( directionalLight1, 5);
// scene.add( helper1 );
// const helper2 = new THREE.DirectionalLightHelper( directionalLight2, 5);
// scene.add( helper2 );

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);


//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const k = width / height; //canvas画布宽高比
const s = 60;//控制left, right, top, bottom范围大小
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
// const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 3000);
// camera.position.set(292, 223, 185);
camera.position.set(35.04, 73.04, 616.46);//根据渲染范围尺寸数量级设置相机位置
camera.lookAt(0,20,0);

const renderer = new THREE.WebGLRenderer({
    antialias:true//执行抗锯齿
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x001111, 1);
console.log(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

//解决加载gltf格式模型颜色偏差问题
renderer.outputEncoding = THREE.sRGBEncoding;

// 渲染循环
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    // console.log(camera.position)
}
render();


const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 100;
// //相机距离观察目标点极大距离——模型最小状态
controls.maxDistance = 1000;

// 上下旋转最大值设置
controls.maxPolarAngle = Math.PI/2*0.9;
controls.target.set(0,20,0); //与lookAt参数保持一致
controls.update(); //update()函数内会执行camera.lookAt(controls.target)

// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
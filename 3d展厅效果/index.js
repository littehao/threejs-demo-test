import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'three/addons/libs/stats.module.js';

// import gui from './gui.js';

import { scene, camera, renderer, labelRenderer } from './scene.js'
import  { roomModel, model, fsuModel }  from './model.js';//模型对象
import { tubeLines } from './drawline.js'

import { moveCamera } from './event.js';//创建热点

const stats = new Stats()
document.body.appendChild(stats.dom);


model.add(tubeLines)
scene.add(roomModel); //模型对象添加到场景中
scene.add(model); //模型对象添加到场景中
// scene.add(fsuModel); //模型对象添加到场景中


const geoFloor = new THREE.BoxGeometry( 200, 0.1, 200 );
const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.rotateX(Math.PI/2)
// scene.add( mshStdFloor );

const textureCube = new THREE.CubeTextureLoader()
    // .setPath('../../环境贴图/环境贴图0/')
    .setPath('../环境贴图/环境贴图4/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
textureCube.encoding = THREE.sRGBEncoding;//和renderer.outputEncoding一致
// 环境贴图纹理对象textureCube作为.environment属性值,影响所有模型
// scene.environment = textureCube;


//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);


//光源设置
//半球光源，颜色从天空颜色渐变为地面颜色。
const light = new THREE.HemisphereLight(0xffffff, 0x888888, 0.8); 
scene.add(light); //				这光不能用于投射阴影。

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
// scene.add(ambient);


// 旋转
let isR = false
let des = 0.1//相机旋转速度
document.getElementById('isRotation').addEventListener('click',function(){
    isR = !isR
})

// 信息流
let infoFlag = false
const lineName = ['line1','line2','line3','line4','line5','line6','line7']
document.getElementById('infoflow').addEventListener('click',function(){
    if(infoFlag){
        roomModel.traverse(function (obj) {
            if (obj.isMesh) { //判断是否是网格模型
                const line = obj.getObjectByName('edgesLine')
                obj.remove(line)
                obj.material = obj.oldmaterial
            }
        });
        tubeLines.traverse(function (obj) {
            if (obj.isMesh) { //判断是否是网格模型
                const index = lineName.findIndex(item => item == obj.name)
                if(index > -1){
                    obj.visible = false
                }
            }
        });
    } else {
        moveCamera([0, 200, 150], [0, 0, 0])
        roomModel.traverse(function (obj) {
            if (obj.isMesh) { //判断是否是网格模型
                const edges = new THREE.EdgesGeometry(obj.geometry)
                const edgesMaterial = new THREE.LineBasicMaterial({
                    color:0x00ffff,
                    transparent:true,
                    opacity:0.3
                })
                const line = new THREE.LineSegments(edges,edgesMaterial)
                line.name = 'edgesLine'
                obj.add(line)
                obj.oldmaterial = obj.material.clone()
                obj.material = new THREE.MeshLambertMaterial({
                    color:0x004444,
                    transparent:true,
                    opacity:0.1
                })
            }
        });
        
        tubeLines.traverse(function (obj) {
            if (obj.isMesh) { //判断是否是网格模型
                const index = lineName.findIndex(item => item == obj.name)
                if(index > -1){
                    obj.visible = true
                }
            }
        });
    }
    infoFlag = !infoFlag
})
// 渲染循环
function render() {
    // console.log(scene.position)
    if(isR){
        des++
        camera.position.x = Math.cos(Math.PI / 180 * des) * 200
        camera.position.z = Math.sin(Math.PI / 180 * des) * 200
        camera.position.y = 200
        camera.lookAt(scene.position)
    }
    stats.update(); //fps插件更新s

    TWEEN.update();
    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    // console.log(camera.position)
}
render();



// 画布跟随窗口变化
window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
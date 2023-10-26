// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { mergeBufferGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';


import { camera } from './scene.js'
import { setPlan, setLight, setRectAreaLight } from './zhantingModel.js'
import { CreateCarTags } from './PointsTag.js';//创建热点
import { loadDevice } from './drawline.js'

import  {
    flyGroup,
    deviceGroup,
    updateFlyGeo
}  from '../拓扑图飞线/flyline.js';//模型对象


const textureCube = new THREE.CubeTextureLoader()
    // .setPath('../../环境贴图/环境贴图0/')
    .setPath('../环境贴图/环境贴图4/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
textureCube.encoding = THREE.sRGBEncoding;//和renderer.outputEncoding一致

const loader = new GLTFLoader(); //创建一个GLTF加载器
const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
const roomModel = new THREE.Group()
const deives = []
function zhantingLoad(){
    loader.load('../model/展厅.glb', async (glb) => { //gltf加载成功后返回一个对象
        // console.log('控制台查看gltf对象结构', gltf);
        console.log('展厅-场景3D模型数据', glb.scene);
        const mesh = glb.scene
        // 标注热点
        // CreateCarTags(mesh);
        mesh.traverse(function (obj) {
            if (obj.isMesh) { //判断是否是网格模型
                // 批量设置所有Mesh都可以产生阴影和接收阴影
                obj.castShadow = true;
                // 设置接收阴影的投影面
                obj.receiveShadow = true;
            }
            if(obj.name.slice(0,2) == '筒灯'){
                // 灯的设置
                setLight(obj)
            }
            if(obj.name == '屋顶'){
                console.log(obj)
                obj.material.transparent = true
                obj.material.side = THREE.FrontSide
            }
        });
        jiguiLoad()
        // 添加设备
        const fsu = await loadDevice(textureCube)
        console.log(fsu)
        deives.push(fsu)
        // zhuoyiLoad()
        fsuLoad()
        roomModel.add(mesh); //三维场景添加到model组对象中
    })
}
zhantingLoad()

// 加载机柜组
const doors = []

function jiguiLoad(){
    const doorNameArr = ['机柜1门','机柜2门1','机柜2门2','机柜3门1','机柜3门2','机柜4门',]
    const devicNameeArr = ['afs48','afs24','afs96','afs96c','afs96c1',
    '机柜3设备1','机柜4设备1','机柜4设备3','机柜4设备4']
    loader.load('../model/机柜组.glb',(glb) => {
        const mesh = glb.scene
        console.log('机柜组-场景3D模型数据', mesh);
        doorNameArr.forEach(name => {
            const door = mesh.getObjectByName(name)
            door.state = 'close';
            if(name == '机柜1门' || name == '机柜2门2' || name == '机柜3门2' || name == '机柜4门' ){
                door.openTween = openClose('y', 0, Math.PI / 2,door);
                door.closeTween = openClose('y', Math.PI / 2, 0,door);
            }
            if(name == '机柜2门1' || name == '机柜3门1'){
                door.openTween = openClose('y', 0, -Math.PI / 2,door);
                door.closeTween = openClose('y', -Math.PI / 2, 0,door);
            }
            doors.push(door)
        })
        devicNameeArr.forEach(device => {
            const afs = mesh.getObjectByName(device)
            // console.log(afs,device)
            afs.traverse(function(obj){
                if(obj.isMesh){
                    //批量设置环境贴图
                    obj.material = new THREE.MeshStandardMaterial({
                        map:obj.material.map,
                        metalness:0.8,
                        roughness:0.5,
                        color:obj.material.color,
                        envMap:textureCube,
                        envMapIntensity:1
                    })
                }
            })
            deives.push(afs)
        })
        model.add(mesh);
        var div = document.getElementById('deviceTag1');
        // div.style.visibility = 'visible';
        //div元素包装为CSS2模型对象CSS3DObject
        var label = new CSS3DObject(div);    
        // 设置HTML元素标签在three.js世界坐标中位置
        const device1 = model.getObjectByName('afs48')
        console.log(device1)
        // label.position.copy(device1.position);
        label.scale.set(0.18,0.18,1);//根据相机渲染范围缩放到合适尺寸
        label.position.z += -37;
        label.position.y += 15;
        label.rotateY(Math.PI/2)
        device1.add(label);
    })
}

function zhuoyiLoad(){
    loader.load('../model/桌椅.glb',(glb) => {
        const mesh = glb.scene
        console.log('桌椅-场景3D模型数据', mesh);
        model.add(mesh);
    })
}

// 添加fsu
const fsuModel = new THREE.Group()
var mapGroup = new THREE.Group();
function fsuLoad(){
    loader.load('../model/fsu.glb',(glb) => {
        const mesh = glb.scene
        mesh.position.y += 20

        var div = document.getElementById('fsu');
        div.style.visibility = 'visible';
        var label = new CSS3DObject(div);  
        label.position.y += 50
        mesh.add(label)  

        

        mapGroup.rotateY(Math.PI);
        mapGroup.rotateX(-Math.PI/2);
        // centerCamera(mapGroup, camera);
        mapGroup.add(flyGroup);
        mapGroup.add(deviceGroup);
        // const fsu = mapGroup.getObjectByName('FSU')
        // fsu.add(mesh)
        fsuModel.add(mapGroup);
        console.log(mesh.position)
        fsuModel.add(mesh)

        var div = document.getElementById('device1');
        div.style.visibility = 'visible';
        var label = new CSS3DObject(div);
        const device = mapGroup.getObjectByName('设备1')
        label.rotateX(Math.PI/2)
        label.rotateY(Math.PI)
        label.scale.set(0.5,0.5,0.5)
        label.position.z += 10
        device.add(label)

        var div = document.getElementById('devicePic');
        div.style.visibility = 'visible';
        var label = new CSS3DObject(div);
        label.rotateX(Math.PI/2)
        label.rotateY(Math.PI)
        label.scale.set(0.5,0.5,0.5)
        device.add(label)



    })
}

// 创建模型对象旋转动画
function openClose(axis, angle1, angle2, door) {
    var state = {
        angle: angle1, // 车门动画开始角度
    };
    var tween = new TWEEN.Tween(state); //创建一段tween动画      
    tween.to({
        angle: angle2, // 车门动画结束角度
    }, 1000); //1000：表示动画执行时间1000毫秒(ms)
    tween.onUpdate(function () {
        // tween动画执行期间.onUpdate()重复执行，更新车门角度
        if (axis == 'y') {
            door.rotation.y = state.angle;
        } else {
            door.rotation.z = state.angle;
        }
    });
    return tween;
}

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
    requestAnimationFrame(render);
}
render();


export {
    roomModel,
    model,
    fsuModel,
    doors,
    deives
} ;

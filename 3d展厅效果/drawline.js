// 引入Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let texture = new THREE.TextureLoader().load("../imgs/路面流光.png")
// 设置阵列模式为 RepeatWrapping
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.x = 20;// x方向阵列
texture.wrapS = texture.wrapT = THREE.RepeatWrapping; //每个都重复

// 给每条管道添加颜色
let colors = [0x2ec7c9,0xb6a2de,0x5ab1ef,0xffb980,0xd87a80,0x8d98b3,0xe5cf0d]
const lineName = ['line1','line2','line3','line4','line5','line6','line7']
const tubeLines = new THREE.Group()
const glbloader = new GLTFLoader(); //创建一个GLTF加载器
async function loadDevice(textureCube){
  const glb = await glbloader.loadAsync('../model/其他设备.glb')
  const mesh = glb.scene
  mesh.traverse(function (obj) {
      if (obj.isMesh) { //判断是否是网格模型
         const index = lineName.findIndex(item => item == obj.name)
         if(index > -1){
           obj.material = new THREE.MeshLambertMaterial({
            map:texture,
            transparent:true,
            depthTest:false,
            side: THREE.DoubleSide
          })
          obj.material.color.set(colors[index]);
          obj.visible = false
         }
      }
  });
  tubeLines.add(mesh)
  const fsu = tubeLines.getObjectByName('fsu')
  fsu.traverse(function(obj){
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
  console.log(fsu)
  return fsu
}

function animate() {
 if(texture) texture.offset.x += 0.02
 requestAnimationFrame(animate)
}

animate()


export  {
 tubeLines,
 loadDevice
}
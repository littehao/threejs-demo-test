// 引入Three.js
import * as THREE from 'three';
import { scene } from './scene.js'
// import gui from '../gui.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

function setPlan(obj){
 if(obj.name.slice(0,2) == '平面' || obj.name == '天花板' || obj.name == '背面墙'){
  obj.material = new THREE.MeshStandardMaterial({
     transparent:true,
     color:obj.material.color,
     map:obj.material.map
  })
 }
}


// 给每个灯添加个光源
function createPointLight(v3){
 const directionalLight = new THREE.PointLight(0xffffff, 0.8, 100);
 directionalLight.position.set(v3.x, v3.y - 10, v3.z);
 return directionalLight
}

function setLight(obj){
 const v3 = new THREE.Vector3()
 obj.getWorldPosition(v3)
 scene.add(createPointLight(v3))
}

// 创建面光
function createRectAreaLight(v3, width){
 const rectLight = new THREE.RectAreaLight( 0xffbf66, 3,  3, width );
 rectLight.position.set( v3.x, v3.y - 3, v3.z );
 return rectLight
}


function setRectAreaLight(obj){
 const v3 = new THREE.Vector3()
 obj.getWorldPosition(v3)
 let rectLight = createRectAreaLight(v3,155)
 if(obj.name == '面光1' || obj.name == '面光2'){
  rectLight.rotateY(Math.PI/2)
  rectLight.rotateX(Math.PI/2 * 3)
//   scene.add( new RectAreaLightHelper( rectLight ) );
 }
 if(obj.name == '面光3' || obj.name == '面光4'){
  rectLight.rotateX(Math.PI/2 * 3)
//   scene.add( new RectAreaLightHelper( rectLight ) );
 }
 if(obj.name == '面光5机柜' || obj.name == '面光6机柜'){
  rectLight = createRectAreaLight(v3,30)
  rectLight.position.set( v3.x, 0.1, v3.z );
  rectLight.rotateY(Math.PI/2)
  rectLight.rotateX(Math.PI/2)
//   scene.add( new RectAreaLightHelper( rectLight ) );
 }
 if(obj.name == '面光7机柜'){
  rectLight = createRectAreaLight(v3,110)
  rectLight.position.set( v3.x, 0.1, v3.z - 6 );
  rectLight.rotateX(Math.PI/2)
 }
 scene.add(rectLight)
}
 
export {
 setPlan,
 setLight,
 setRectAreaLight
}
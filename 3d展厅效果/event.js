
// 引入Three.js
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { camera, controls } from './scene.js'


function moveCamera( pos, pos2) {
 // console.log(pos, pos2)
 new TWEEN.Tween(camera.position).to({
   x: pos[0],
   y: pos[1],
   z: pos[2]
  }, 1500)
  .easing(TWEEN.Easing.Linear.None).start().onUpdate(tweenHandler).onComplete(() => {})

 function tweenHandler() {
  //controls.target.set(...pos2)
  camera.lookAt(new THREE.Vector3(...pos2))
  controls.target.copy(new THREE.Vector3(...pos2))
 }
}

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
 


export {
  moveCamera,
  groundPan
}


































import * as THREE from 'three';


var loader = new THREE.FileLoader();
loader.setResponseType('json');

let texture = new THREE.TextureLoader().load("../imgs/路面流光.png")
// 设置阵列模式为 RepeatWrapping
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.x = 20;// x方向阵列
texture.wrapS = texture.wrapT = THREE.RepeatWrapping; //每个都重复
// texture.repeat.set(1, 1)
// texture.needsUpdate = true

let material = new THREE.MeshLambertMaterial({
 color: 0x00ffff, //颜色
  map:texture,
  transparent:true,
  depthTest:false,
  map: texture,
  side: THREE.DoubleSide
})
let colors = [0x00ffff,0xffd700]

// 创建顶点数组

let points1 = [
 new THREE.Vector3(100, 100, -100),
 new THREE.Vector3(-100, 100, -100),
 new THREE.Vector3(-100, -100, -100),
 new THREE.Vector3(100, -100, -100)
]
let points2 = [
 new THREE.Vector3(100, 100, 0),
 new THREE.Vector3(-100, 100, 0),
 new THREE.Vector3(-100, -100, 0),
 new THREE.Vector3(100, -100, 0)
]

const lines = [points1, points2]

const model = new THREE.Group()

async function  load(){
 let json = await loader.loadAsync('./line.json')
 let arr = json.data.attributes.position.array.splice(0,200)
 for(let i = 0; i < arr.length ; i+=3){
  
  let v3 = new THREE.Vector3(arr[i], arr[i+1], arr[i+2])
  points.push(v3)
 }
}

async function init(){
 // await load()
 // CatmullRomCurve3创建一条平滑的三维样条曲线
 for(let i =0; i < lines.length; i++){
  let curve = new THREE.CatmullRomCurve3(lines[i],true) // 曲线路径
  // 创建管道
  let tubeGeometry = new THREE.TubeGeometry(curve, 100, 1)

  let meshTube = new THREE.Mesh(tubeGeometry, material);
  meshTube.rotateX(Math.PI/2)
  meshTube.material = new THREE.MeshLambertMaterial({
    map:texture,
    transparent:true,
    depthTest:false,
    map: texture,
    side: THREE.DoubleSide
  })
  meshTube.material.color.set(colors[i]);
  model.add(meshTube)
 }
 
}
init()


function animate() {
 if(texture) texture.offset.x -= 0.01
 requestAnimationFrame(animate)
}

animate()

export default model








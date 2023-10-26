// 引入three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
//类型数组创建顶点数据
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);
// 创建属性缓冲区对象
const attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
// geometry.attributes.position = attribue;


const vector3s = [
    [new THREE.Vector3(0,20,0),new THREE.Vector3(0,0,50)]
]

for(let i = 0; i < 10; i++){
    let num = 20
    vector3s.push([new THREE.Vector3(0,20,0),new THREE.Vector3(num * i,0,50)])
    vector3s.push([new THREE.Vector3(0,20,0),new THREE.Vector3(-(num * i),0,50)])
}

const vector2s = [
    [new THREE.Vector2(0,0),new THREE.Vector2(0,50)]
]
// for(let i = 0; i < 10; i++){
//     let num = 20
//     vector2s.push([new THREE.Vector2(0,0), new THREE.Vector2(num * i,50)])
//     vector2s.push([new THREE.Vector2(0,0), new THREE.Vector2(-(num * i),50)])
// }

const model = new THREE.Group()
// model.rotateX(Math.PI/2)
vector3s.forEach(item => {
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
    let lineItem = new THREE.LineCurve3(item[0],item[1]);
    let points = lineItem.getPoints(100);
    geometry.setFromPoints(points);

    // 线条渲染模式
    const material = new THREE.LineBasicMaterial({
        color: 0xffff00 //线条颜色
    }); //材质对象
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    const line = new THREE.Line(geometry, material); //线条模型对象
    model.add(line)
})


// 添加fsu
const textureCube = new THREE.CubeTextureLoader()
    // .setPath('../../环境贴图/环境贴图0/')
    .setPath('../环境贴图/环境贴图4/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
textureCube.encoding = THREE.sRGBEncoding;//和renderer.outputEncoding一致

const loader = new GLTFLoader(); //创建一个GLTF加载器
function fsuLoad(){
    loader.load('../model/fsu.glb',(glb) => {
        const mesh = glb.scene
        console.log(mesh)
        // mesh.traverse(function(obj){
        //     if(obj.isMesh){
        //         //批量设置环境贴图
        //         obj.material = new THREE.MeshStandardMaterial({
        //             map:obj.material.map,
        //             metalness:1,
        //             roughness:0.5,
        //             color:obj.material.color,
        //             envMap:textureCube,
        //             envMapIntensity:1
        //         })
        //     }
        // })
        // mesh.rotateY(Math.PI/2)
        // mesh.position.y = 0
        model.position.y -= 10
        model.add(mesh);
        
    })
}
fsuLoad()

export default model;
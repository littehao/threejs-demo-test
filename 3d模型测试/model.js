// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
const textureCube = new THREE.CubeTextureLoader()
    // .setPath('../../环境贴图/环境贴图0/')
    .setPath('../环境贴图/环境贴图4/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
textureCube.encoding = THREE.sRGBEncoding;//和renderer.outputEncoding一致

const loader = new GLTFLoader(); //创建一个GLTF加载器

const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
loader.load('../model/footer.glb',function(glb){
    const mesh = glb.scene
    const box = new THREE.Box3().setFromObject(mesh)
    const v3 = new THREE.Vector3()
    // 获得包围盒长宽高尺寸，结果保存在参数三维向量对象v3中
    box.getSize(v3)
    const h = v3.y 
    mesh.position.y = -h
    model.add(mesh)
})


const AOCC = "../model/96s -logo.glb"
loader.load(AOCC, function (glb) { //gltf加载成功后返回一个对象
    // console.log('控制台查看gltf对象结构', gltf);
    console.log('场景3D模型数据', glb.scene);
    const mesh = glb.scene
    mesh.traverse(function(obj) {
        if (obj.isMesh) {//判断是否是网格模型
            // 重新设置材质的金属度和粗糙度属性
            obj.material.metalness = 0.8;//金属度
            obj.material.roughness = 1;//表面粗糙度
            // obj.material.envMap = textureCube
        }
    });
    const box = new THREE.Box3().setFromObject(mesh)
    const v3 = new THREE.Vector3()
    // 获得包围盒长宽高尺寸，结果保存在参数三维向量对象v3中
    box.getSize(v3)
    console.log('查看返回的包围盒尺寸', v3)
    const h = v3.y / 2 - 10
    const w = v3.x
    // mesh.position.y = -h
    model.add(mesh); //三维场景添加到model组对象中
    // const pos = model.getObjectByName('设备位置')
    // loadDevice(pos)
    // drawArcCurve(w, 0)
})

function loadDevice(pos){
  loader.load('.../model/192-glb/192A-logo.glb',function(glb){
    const mesh = glb.scene
    mesh.traverse(function(obj) {
      if (obj.isMesh) {//判断是否是网格模型
          // 重新设置材质的金属度和粗糙度属性
          obj.material.metalness = 0.8;//金属度
          obj.material.roughness = 1;//表面粗糙度
      }
  });
    mesh.position.copy(pos.position)
    model.add(mesh)
  })
}


function drawArcCurve(w, h) {
    // 创建圆弧线条模型
    var geometry = new LineGeometry() // 声明一个几何体对象BufferGeometry
    // 参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
    var R = w // 半径
    var arc = new THREE.ArcCurve(
      0,
      0,
      R,
      Math.PI / 2 + Math.PI / 6,
      Math.PI / 2 - Math.PI / 6
    )
    // getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
    var points = arc.getPoints(50) // 分段数50，返回51个顶点
    // setFromPoints方法从points中提取数据改变几何体的顶点位置数据.attributes.position
    const positions = []
    for (let i = 0; i < points.length; i++) {
      positions.push(points[i].x, points[i].y, 0)
    }
    geometry.setPositions(positions)
    // console.log(geometry.attributes.position);
    // 材质对象
    var material = new LineMaterial({
      linewidth: 2,
      color: 0xffffff // 线条颜色
    })
    // 线条模型对象
    material.resolution.set(window.innerWidth, window.innerHeight)
    var line = new Line2(geometry, material)
    line.rotateX(Math.PI / 2) // 绕x轴旋转90度

    var CircleLine = new THREE.Group() // 线模型和720符号父对象
    CircleLine.add(line)
    CircleLine.position.y -= h + 10 // 平移到产品的底部

    var loader = new FontLoader()
    // THREE.FontLoader加载字体
    loader.load('../three.js-r148/examples/fonts/helvetiker_bold.typeface.json', function(font) {
      var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      })
      // .generateShapes()：获得字符'720°'的轮廓顶点坐标
      var Shapes = font.generateShapes('720°', 10) // 10)控制字符大小
      var geometry = new THREE.ShapeGeometry(Shapes) // 通过多个多边形轮廓生成字体
      var textMesh = new THREE.Mesh(geometry, material)
      textMesh.position.z = R
      textMesh.position.x = -12
      CircleLine.add(textMesh)
    })
    model.add(CircleLine)
  }

export {
    model
} ;

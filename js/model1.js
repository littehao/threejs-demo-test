import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


const geometry = new LineGeometry();
// 顶点坐标构成的数组pointArr
const pointArr = [-100, 0, 0,
    -100, 100, 0,
    0, 0, 0,
    100, 100, 0,
    100, 0, 0,
]
// 几何体传入顶点坐标
geometry.setPositions(pointArr);
// 自定义的材质
const material = new LineMaterial({
    color: 0xdd2222,
    // 线宽度
    linewidth: 5,
});
// 把渲染窗口尺寸分辨率传值给材质LineMaterial的resolution属性
// resolution属性值会在着色器代码中参与计算
material.resolution.set(window.innerWidth, window.innerHeight);
const line = new Line2(geometry, material);



export default line;
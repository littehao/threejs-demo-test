import * as THREE from 'three';

// 创建一个地面
function createPlaneGeometryBasicMaterial() {
    const groundGeometry = new THREE.PlaneGeometry( 20000, 20000 )  //草地平面几何体

    const groundTexture = new THREE.TextureLoader().load('./dimian.jpg')  //加载草地材质
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping   //设置重复贴图
    groundTexture.repeat.set( 50, 50 )
    groundTexture.anisotropy = 16
    const groundMaterial = new THREE.MeshLambertMaterial({   //生成贴图的材质
        map: groundTexture 
    })

    const ground = new THREE.Mesh( groundGeometry, groundMaterial )   //生成草地

    ground.rotation.x = - 0.5 * Math.PI;
    ground.position.x = 0;
    ground.position.z = 0;
    ground.position.y = -15;
    return ground
}

// 将平面添加到场景中
const plane = createPlaneGeometryBasicMaterial();

const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./img.jpg');
const material = new THREE.MeshLambertMaterial({
    coor:0xffff00,
    map: texture,
});
const mesh = new THREE.Mesh( geometry, material );
mesh.name = 'Sphere'

const maxT = 30
const times = [0, 10, 20, maxT]
const values = [0, 0, 0, 100, 0, 0, 0, 0, 100, 0, 0, 0];
const posKf = new THREE.KeyframeTrack('Sphere.position',times, values)
const colorKf = new THREE.KeyframeTrack('Sphere.material.color',[0, 10, 20, 30],[
    0, 1, 0, 
    1, 0, 0,
    0, 0, 1, 
    1, 1, 1
])

const clip = new THREE.AnimationClip("test",maxT,[posKf,colorKf]);

const mixer = new THREE.AnimationMixer(mesh);
const clipAction = mixer.clipAction(clip); 
clipAction.play();
clipAction.time = 10;
// 循环执行的函数
let flag = true
const clock = new THREE.Clock();
function loop() {
    if(flag){
        mesh.rotateZ(0.1)
    }
    requestAnimationFrame(loop);
     //clock.getDelta()方法获得loop()两次执行时间间隔
     const frameT = clock.getDelta();
     // 更新播放器相关的时间
    mixer.update(frameT);
}
loop();

// 添加事件
function handleClick(id,fn){
    const btn = document.getElementById(id)
    btn.addEventListener('click', fn)
}

// 停止动画
handleClick('stopBtn',function(){
    flag = false
    clipAction.stop();
})
// 播放动画
handleClick('playBtn',function(){
    flag = true
    clipAction.play();
    if(clipAction.paused){
        clipAction.paused = false;
    } 
})
// 暂停动画
handleClick('pausedBtn',function(){
    flag = false
    clipAction.paused = true;
})
// 加速动画
handleClick('speedBtn',function(){
    clipAction.timeScale = 3;
})
// 关闭循环
handleClick('loopBtn1',function(){
    flag = false
    clipAction.loop = THREE.LoopOnce
})

// 下一步状态
handleClick('nextBtn',function(){
    clipAction.time += 0.1; 
})
// 重置
handleClick('resetBtn',function(){
    clipAction.reset();
})


export{ mesh, plane } 
// 引入Three.js
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { scene } from './scene.js'
/**
* 创建div元素(作为立方体标签)
*/
function createElementTag(name, obj){
  let innerHTML = ''
  if(name === '进门点位') innerHTML = '门口'
  if(name === '中间点位') innerHTML = '桌椅'
  if(name === '机柜前点位') innerHTML = '机柜'
  var div = document.createElement('div');
  div.innerHTML = innerHTML;
  div.style.padding = '5px 10px';
  div.style.color = '#fff';
  div.style.fontSize = '16px';
  div.style.position = 'absolute';
  div.style.backgroundColor = 'rgba(25,25,25,0.5)';
  div.style.borderRadius = '5px'
  var label = new CSS2DObject(div);
  div.style.pointerEvents = 'none';
  label.position.set(- (name.length * 2), -5, 0);
  return label
}

var S = 3; //精灵缩放倍数
const tagArr = []
function CreateCarTags(ztModel) {
  var tagNameArr = ['进门点位', '中间点位', '机柜前点位'];
  tagNameArr.forEach(function (name) {
    // 精灵模型+背景透明png贴图实现光点效果
    var spriteMaterial = new THREE.SpriteMaterial({
      // color:0xffff00,
      map: new THREE.TextureLoader().load("../imgs/光点.png"), //设置精灵纹理贴图
      transparent: true,
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = name
    sprite.scale.set(S, S, 1); //大小设置

    var tagObj = ztModel.getObjectByName(name);
    // sprite.position.set(0,-10,0)
    console.log(tagObj.position,name)
    tagObj.add(sprite);

    const label = createElementTag(name, tagObj)
    tagObj.add(label)
    
    tagArr.push(sprite);
  })


  // 设置标注精灵Sprite波动，提示用户点击
  var s = 0.0;
  var scale = S; //原来缩放倍数大小
  function waveAnimation() { //设置产品模型旋转动画        
    s += 0.01;
    tagArr.forEach(function (sprite) {
      if (s < 0.5) {
        sprite.scale.x = scale * (1 + s);
        sprite.scale.y = scale * (1 + s);
      } else if (s >= 0.5 && s < 1.0) {
        sprite.scale.x = scale * (2 - s);
        sprite.scale.y = scale * (2 - s);
      } else {
        s = 0.0;
      }
    })
    requestAnimationFrame(waveAnimation); //请求再次执行函数waveAnimation
  }
  waveAnimation();
}




export {
  CreateCarTags,
  tagArr
}
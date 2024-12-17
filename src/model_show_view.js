import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import * as three_load_gltf from "./three_load_gltf.js";

let scene, camera, renderer, show_model;
let show_model_group; // 全域的 show_model_group 變量

let modelList = ["test_cube", "test_cone"];
function init() {
  // 創建場景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); // 白色背景

  // 創建相機
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 創建渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-container").appendChild(renderer.domElement);

  // 初始化 three_load_gltf 模組並傳遞渲染器參數
  three_load_gltf.init({ renderer });

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 環境光
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 平行光
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  // 初始化 show_model_group，並添加到場景中
  show_model_group = new THREE.Group();
  show_model_group.name = "show_model_group";
  scene.add(show_model_group);

  // 窗口大小調整事件
  window.addEventListener("resize", onWindowResize, false);
}

function loadModel(url) {
  let modelName = url.split("/")[2].split(".")[0];

  // 確保清空 show_model_group 中的所有模型
  clearModel(scene);

  three_load_gltf
    .load_gltf_transform(url)
    .then((model) => {
      model.position.set(0, 0, 0);
      model.name = modelName;
      show_model_group.add(model); // 將模型添加到 show_model_group
      show_model = model;
    })
    .catch((error) => {
      console.error("Error loading GLB model:", error);
    });
}

function clearModel(scene) {
  if (show_model_group) {
    // 遍歷 show_model_group 中的所有對象並清除
    show_model_group.children.forEach((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
      show_model_group.remove(object);
    });
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (show_model) {
    show_model.rotation.y += 0.01;
  }
}

window.addEventListener("message", (event) => {
  if (event.data.modelName) {
    const modelName = event.data.modelName;
    if (scene) {
      clearModel(scene);
    }
    loadModel(`../model/${modelName}`);
  }
});

// 初始化並啟動動畫
init();
animate();

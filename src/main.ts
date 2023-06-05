import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

// Alpine JS
import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.store("state", {
  dancer: "big-vegas",
  dance: "default",
  tab: "dancer",
  get dancerImage() {
    return `/models/${this.dancer}/${this.dancer}.png`;
  },
  loadDancer: loadDancer,
  startDancing: startDancing,
});

Alpine.start();

// Three.js code
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
loader.load('giphy.gif' , function(texture)
            {
             scene.background = texture;  
            });
scene.add(new THREE.AxesHelper(5));

const light = new THREE.PointLight();
light.position.set(2.5, 7.5, 15);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

let mixer: THREE.AnimationMixer;
let modelReady = false;
let animationActions: THREE.AnimationAction[] = [];
let activeAction: THREE.AnimationAction;
let lastAction: THREE.AnimationAction;
const fbxLoader: FBXLoader = new FBXLoader();

function startDancing(dance: "default" | "capoeira") {
  animations[dance]();
}

function loadDancer(dancer: string) {
  scene.remove(scene.children[2]);
  animationActions = [];

  fbxLoader.load(
    `/models/${dancer}/${dancer}.fbx`,
    (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      mixer = new THREE.AnimationMixer(object);

      if (animationActions.length === 0) {
        const animationAction = mixer.clipAction(
          (object as THREE.Object3D).animations[0]
        );
        animationActions.push(animationAction);
      }
      activeAction = animationActions[0];

      scene.add(object);

      // add an animation from another file
      fbxLoader.load(
        `/models/${dancer}/${dancer}@capoeira.fbx`,
        (object) => {
          if (animationActions.length === 1) {
            const animationAction = mixer.clipAction(
              (object as THREE.Object3D).animations[0]
            );
            animationActions.push(animationAction);
          }

          modelReady = true;
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.log(error);
        }
      );
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

const animations = {
  default: function () {
    setAction(animationActions[0]);
  },
  capoeira: function () {
    setAction(animationActions[1]);
  },
};

const setAction = (toAction: THREE.AnimationAction) => {
  if (toAction != activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    //lastAction.stop()
    lastAction.fadeOut(1);
    activeAction.reset();
    activeAction.fadeIn(1);
    activeAction.play();
  }
};

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (modelReady) mixer.update(clock.getDelta());

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();

import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { importObjects } from '/objectDefinitions.js'
import { Lights }  from '/lights.js'
import dot from './assets/dot.png';

import ParticleSystem, {
  Body,
  Color,
  Emitter,
  Gravity,
  Life,
  Mass,
  Position,
  RadialVelocity,
  RandomDrift,
  Rate,
  Scale,
  Span,
  SphereZone,
  SpriteRenderer,
  Vector3D,
  ease,
} from 'three-nebula';




// Setup
// General
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create a loader and its manager
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();
textureLoader.gammaFactor = 2.2;
const loader = new GLTFLoader(manager)
      manager.onStart = () => {
        console.log('Loading started');
      };
      manager.onLoad = () => {
        console.log('Loading complete');
        const loadingScreen = document.querySelector('#loading-screen');
        console.log(loadingScreen.classList)
        loadingScreen.classList.add('hide-loading-screen');
      };
      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
      };
      manager.onError = (url) => {
        console.error(`Error loading file: ${url}`);
      };


//Predefine required objects
let moon

// Create an AnimationMixer instance
const clock = new THREE.Clock()
const mixer = new THREE.AnimationMixer( scene );

// Prepare Nebula
const system = new ParticleSystem();
const emitter = new Emitter();


//Set up the world  
function init() {

// Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Load imported gltf objects
importObjects.forEach((object) => {

  // load the object from the given url with the paramters from the object definition
  loader.load('assets/' + object.url + '/scene.gltf', 
  function ( gltf ) {

    if (object.material != undefined){
      gltf.scene.traverse ( (o) => {
          if (o.isMesh) {
            o.material = object.material;
          }
      });
    }

    scene.add( gltf.scene );

    if(object.animation != undefined){

    gltf.animations.push(object.animation)
    } else {
      gltf.scene.position.set(object.x, object.y, object.z)
    }
    if (object.importFunction != undefined) {
      object.importFunction(gltf, Lights.rocketEngineLight, Lights.rocketTopLight, emitter);
    }

    // Play the action
    gltf.animations.forEach((clip) => {
    mixer.clipAction(clip, gltf.scene).setLoop(THREE.LoopRepeat);
    mixer.clipAction(clip, gltf.scene).play();
    });
    
  }
  );  
});

//Add lights to scene
let lights = Object.values(Lights)
lights.forEach ((light)=>{
  scene.add(light);
})

// Helpers

//const lightHelper = new THREE.PointLightHelper(Lights.nameLight)
//scene.add(lightHelper)


// Add stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const x = THREE.MathUtils.randFloatSpread(400);
  const y = THREE.MathUtils.randFloatSpread(2000);
  const z = THREE.MathUtils.randFloatSpread(-100)-10;

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

moon = new THREE.Mesh(
  new THREE.SphereGeometry(30, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
moon.position.z = -250;
moon.position.y = 67;
moon.position.setX(120);


// Init particle system for rocket engine
emitter
    //emission rythm
    .setRate(new Rate(new Span(10, 15), new Span(0.01, 0.03)))
    .addInitializers([
      new Body(createSprite()),
      new Mass(4),
      //Length
      new Life(1, 1.5),
      //Spark area
      new Position(new SphereZone(1.5)),
      //direction
      new RadialVelocity(new Span(1, 2), new Vector3D(0, 1, 0), 1),
    ])
    .addBehaviours([
      //Spark path
      new RandomDrift(1, 1, .1, 0.8),
      //spark size and speed
      new Scale(new Span(0.001, 0.6), 0),
      new Gravity(0.8),
      new Color('#0000ff', ['#e97700', '#e9770c'], Infinity, ease.easeOutSine),
    ])
    .setPosition({ x: 22, y: -19, z: 350 })
    .emit();


system
    .addEmitter(emitter)
    .addRenderer(new SpriteRenderer(scene, THREE));

}

// Nebula functions
const createSprite = () => {
  var map = new THREE.TextureLoader().load(dot);
  var material = new THREE.SpriteMaterial({
    map: map,
    color: 0xff0000,
    blending: THREE.AdditiveBlending,
    fog: true,
  });
  return new THREE.Sprite(material);
};

// Handle window resize
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize( width, height );
}

// Scroll Animation for camera and three.js objects
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.rotation.y = t * -0.00001;
  camera.position.y = t * (t*-0.00053) * -0.085;
  camera.rotation.x = t * -0.00005;
}

document.body.onscroll = moveCamera;
moveCamera();

// General animation loop for all objects
function animate() {
  requestAnimationFrame(animate);

  if (mixer){
  mixer.update(clock.getDelta())
  }

  moon.rotation.y += 0.0012;

  renderer.render(scene, camera);
  system.update()
}

// Start app
init();
animate();


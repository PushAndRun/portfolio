import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module'


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { importObjects } from '/objectDefinitions.js'

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

import dot from '/statics/dot.png';


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

/*
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.75;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
*/

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


//Prepare objects for animation
let moon

// Create an AnimationMixer instance
const clock = new THREE.Clock()
const mixer = new THREE.AnimationMixer( scene );

// Prepare Nebula
const system = new ParticleSystem();
const emitter = new Emitter();

// Set color scheme
const scheme2 = {
main: 0xEEECDA,
secondary: 0xF08A5D,
third: 0xB83B5E,
fourth: 0x6A2C70
}

const scheme = {
  main: 0xFFF2CC,
  secondary: 0xBB8082,
  third: 0x6E7582,
  fourth: 0x408E91
  }



//Set up the world  
function init() {

importObjects.forEach((object) => {

  // load the object from the given url with the paramters from the object definition
  loader.load('statics/' + object.url + '/scene.gltf', (gltf) => {object.importFunction(gltf, scene, mixer)}),

  // called when loading is successful
  function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},

	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}

})


// Load the rocket with some special logic for scroll events 
loader.load(
	// resource URL
	'statics/rocket/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    gltf.scene.position.set(22, -13, -35)
    
    scene.add( gltf.scene );

    var model = gltf.scene;
    var newMaterial = new THREE.MeshStandardMaterial ( {color: "white", roughness: 0, metalness: 0, side: THREE.DoubleSide});
    model.traverse ( (o) => {
        if (o.isMesh) {
          o.material = newMaterial;
        }
    });

    gltf.scene.receiveShadow = true;
    gltf.scene.castShadow = true;
  
    
    window.addEventListener('scroll', () => {
      // Get the scroll position
      const scrollY = window.scrollY
      // Calculate a progress value between 0 and 1 based on your desired range
      const progress = Math.min(Math.max(scrollY / 10000, 0), 1)

      // Use the progress value to manipulate some properties of the model
      gltf.scene.position.y = (progress * 963 *(progress * 5)) -13 
      gltf.scene.position.x = (progress * 2) + 22 
      gltf.scene.rotation.y = progress * Math.PI 

      rocketEngineLight.position.y = (progress * 963 *(progress * 5))  -15 
      rocketEngineLight.position.x = (progress * 2) + 22 
      rocketEngineLight.intensity = progress * 3 + 0.5

      rocketTopLight.position.y = (progress * 963 *(progress * 5)) + 5
      rocketTopLight.position.x = (progress * 2) + 20 
      rocketTopLight.intensity = progress
      

      if (progress > 0.001){
      emitter.setPosition({ x: (progress * 2) + 22, y: (progress * 963 *(progress * 5)) -13, z: -35 })
      } else {
        emitter.setPosition({ x: 0, y: -200, z: 350 })
      } 

      renderer.render(scene, camera)
    })
	},

	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},

	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);



// General lightning
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.1;
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight("white", 0.4)
// Set its position and intensity
directionalLight.position.set(-100, 30, -20)
//directionalLight.distance = 300
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1048;
directionalLight.shadow.mapSize.height = 1048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 700;
directionalLight.shadow.camera.rotateY(120);
scene.add(directionalLight)
//const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
//scene.add( helper );

const pointLight2 = new THREE.PointLight("orange")
pointLight2.position.set(14, -9, -22)
pointLight2.intensity = 0.1
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight("red");
pointLight3.position.set(0, 8, -85);
pointLight3.intensity = 1;
pointLight3.distance = 35;
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight("white")
pointLight4.position.set(14, 12, -22)
pointLight4.intensity = 0.2
scene.add(pointLight4)

const hemisphereLight = new THREE.HemisphereLight(0xffffff, "lightblue")
hemisphereLight.intensity = 0.4
scene.add(hemisphereLight)


// Rocket lightning
const rocketEngineLight = new THREE.PointLight(0x3244a8)
rocketEngineLight.position.set(22, -17, -35)
rocketEngineLight.intensity = 0.5
rocketEngineLight.castShadow = true
scene.add(rocketEngineLight)

const rocketTopLight = new THREE.PointLight(0x6699ff)
rocketTopLight.position.set(0, 5, -20)
rocketTopLight.intensity = 0
rocketTopLight.castShadow = true
scene.add(rocketTopLight)



// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight3)
const lightHelper2 = new THREE.PointLightHelper(directionalLight)
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, lightHelper2)

// const controls = new OrbitControls(camera, renderer.domElement);

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

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');


scene.background = spaceTexture
// Avatar

//const jeffTexture = new THREE.TextureLoader().load('jeff.png');

//const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));

//scene.add(jeff);

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
moon.position.y = 15;
moon.position.setX(100);

//jeff.position.z = -5;
//jeff.position.x = 2;





// FILTER
const renderScene = new RenderPass(scene, camera);

const params = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0
};

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0);
bloomPass.threshold = 1.5;
bloomPass.strength = 0.4;
bloomPass.radius = 0;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const finalPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0);
finalPass.threshold = 0;
finalPass.strength = 0.4;
finalPass.radius = 0;

const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(finalPass);


// PARTICLES
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
  //composer.setSize( width, height );

}

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.rotation.y = t * -0.00001;
  camera.position.y = t * (t*-0.00053) * -0.085;
  camera.rotation.x = t * -0.00005;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  //bloomComposer.render();
  //finalComposer.render();
  
  if (mixer){
  mixer.update(clock.getDelta())
  }

  moon.rotation.y += 0.0012;

  // controls.update();
  renderer.render(scene, camera);
  system.update()
}

init();
animate();


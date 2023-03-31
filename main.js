import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module'


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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

// Create a loader and its manager
const manager = new THREE.LoadingManager();
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
const clock = new THREE.Clock()
let mixer

// Prepare Nebula
const system = new ParticleSystem();
const emitter = new Emitter();

// Set color scheme
const scheme2 = {
main: 0xFFF2CC,
secondary: 0xFFD966,
third: 0xF4B183,
fourth: 0xDFA67B
}

const scheme = {
  main: 0xFFF2CC,
  secondary: 0xBB8082,
  third: 0x6E7582,
  fourth: 0x046582
  }

function init() {

// Create an array of times for the keyframes (in seconds)
var times = [0, 0.2, 1];

// Create an array of values for the position.y track (in meters)
var positionValues = [ 0, 0, -5, 0, 0.75, -5, 0, 0, -5 ];

// Create an array of values for the scale.x track (no unit)
var scaleValues = [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ];


// Create a position.y track with linear interpolation
var positionTrack = new THREE.KeyframeTrack('.position', times ,positionValues ,THREE.InterpolateSmooth);

// Create a scale.x track with smooth interpolation
//var scaleTrack = new THREE.KeyframeTrack('.scale', times ,scaleValues ,THREE.InterpolateSmooth);


// Create an animation clip with all the tracks and a name and duration
var clip1 = new THREE.AnimationClip('Jump', -1 ,[positionTrack ]); //,scaleTrack

// POSITION - attribute, timings, positions (x, y, z)
//var positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 0.5, 2 ], [ 0, 20, -150, 0, 40, -150, 0, 20, -150 ] );

// SCALE
//var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// ROTATION
// Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

// set up rotation about x axis
//var xAxis = new THREE.Vector3( 1, 0, 0 );
//var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
//var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
//var quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

//Satellite animation
// Create an array of times for the keyframes (in seconds)
var times2 = [0, 15];

// Create an array of values for the position.y track (in meters)
var positionValues2 = [ -30, -100, -100, 150, 150, -40 ];

// Create a position.x track with linear interpolation
var positionTrack2 = new THREE.KeyframeTrack('.position', times2 ,positionValues2 ,THREE.InterpolateSmooth);

// set up rotation about x axis
var xAxis = new THREE.Vector3( 0.3, 0, 0 );
var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
var quaternionKF2 = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 10, 15 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

// Create an animation clip with all the tracks and a name and duration
var clip2 = new THREE.AnimationClip('satellite', -1 ,[positionTrack2, quaternionKF2]); //,scaleTrack

// SCALE
//var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// ROTATION
// Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported


// COLOR
//var colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );

// OPACITY
//var opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 0, 1 ] );

// create an animation sequence with the tracks
// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
//var clip1 = new THREE.AnimationClip( 'Action', 3, [  positionKF ] ); //add required KFs: quaternionKF, colorKF, opacityKF, scaleKF,


// Load a gltf resource
loader.load(
	// resource URL
	'statics/base/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    /*
    gltf.scene.position.y = -1

    
    // Add animation to scene
    gltf.animations.push(clip1)

		// Create an AnimationMixer instance
		mixer = new THREE.AnimationMixer( gltf.scene );

    // Play the action
    gltf.animations.forEach( ( clip ) => {
          
    mixer.clipAction( clip ).setLoop(THREE.LoopRepeat);
    mixer.clipAction( clip ).play();
    
  } );*/

  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial ( {color: scheme.main, side: THREE.DoubleSide, roughness: 0.3, metalness: 0});
  model.traverse ( (o) => {
      if (o.isMesh) {
        o.material = newMaterial;
      }
  });

  
    //if no animation is defined uncomment to set position
    gltf.scene.position.set(22, -13.5, -35)
    gltf.scene.receiveShadow = true;

    scene.add( gltf.scene );
  
    // Subscribe to scroll events -- CANNOT BE COMBINED WITH ANIMATIONS
    /*window.addEventListener('scroll', () => {
      // Get the scroll position
      const scrollY = window.scrollY
      // Calculate a progress value between 0 and 1 based on your desired range
      const progress = Math.min(Math.max(scrollY / 10000, 0), 1)
      // Use the progress value to manipulate some properties of your model
      gltf.scene.position.x = progress * 50 // Move up and down
      gltf.scene.position.y = progress * 30 // Move up and down
      gltf.scene.rotation.z = progress * Math.PI * 8 // Rotate around z-axis
      gltf.scene.rotation.y = progress * Math.PI * 8 // Rotate around z-axis
      renderer.render(scene, camera)
    })

*/

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


// Load a gltf resource
loader.load(
	// resource URL
	'statics/crystal/scene.gltf',

	function ( gltf ) {

  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial ( {color: scheme.fourth, roughness: 0, transparent: true, opacity: 0.99});
  model.traverse ( (o) => {
      if (o.isMesh) {
        o.material = newMaterial;
      }
  });

    gltf.scene.position.set(22, -13.5, -35)
    scene.add( gltf.scene );

	},
	
);

// Load a gltf resource
loader.load(
	// resource URL
	'statics/antenna/scene.gltf',

	function ( gltf ) {

  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial ( {color: scheme.third, side: THREE.DoubleSide, roughness: 0, metalness: 0});
  model.traverse ( (o) => {
      if (o.isMesh) {
        o.material = newMaterial;
      }
  });

    gltf.scene.position.set(22, -13.5, -35)
    scene.add( gltf.scene );

	},
	
);

loader.load(
	// resource URL
	'statics/chess/scene.gltf',

	function ( gltf ) {

  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial ( {color: 0xa271a2, side: THREE.DoubleSide, roughness: 0, metalness: 0});
  model.traverse ( (o) => {
      if (o.isMesh) {
        o.material = newMaterial;
      }
  });

    gltf.scene.position.set(22, -13.5, -35)
    scene.add( gltf.scene );

	},
	
);

loader.load(
	// resource URL
	'statics/house/scene.gltf',

	function ( gltf ) {

  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial ( {color: scheme.secondary, roughness: 0.8, metalness: 0});
  model.traverse ( (o) => {
      if (o.isMesh) {
        o.material = newMaterial;
      }
  });

    gltf.scene.position.set(22, -13.5, -35)
    scene.add( gltf.scene );

	},
	
);


// Load a gltf resource
loader.load(
	// resource URL
	'statics/rocket/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    /*
    gltf.scene.position.y = -1

    
    // Add animation to scene
    gltf.animations.push(clip1)

		// Create an AnimationMixer instance
		mixer = new THREE.AnimationMixer( gltf.scene );

    // Play the action
    gltf.animations.forEach( ( clip ) => {
          
    mixer.clipAction( clip ).setLoop(THREE.LoopRepeat);
    mixer.clipAction( clip ).play();
    
  } );*/
  
    //if no animation is defined uncomment to set position
    gltf.scene.position.set(22, -13, -35)
    
    scene.add( gltf.scene );

    var model = gltf.scene;
    var newMaterial = new THREE.MeshStandardMaterial ( {color: "white", roughness: 0, metalness: 0, side: THREE.DoubleSide});
    model.traverse ( (o) => {
        if (o.isMesh) {
          o.material = newMaterial;
        }
    });
  
    // Subscribe to scroll events -- CANNOT BE COMBINED WITH ANIMATIONS
    window.addEventListener('scroll', () => {
      // Get the scroll position
      const scrollY = window.scrollY
      // Calculate a progress value between 0 and 1 based on your desired range
      const progress = Math.min(Math.max(scrollY / 10000, 0), 1)

      // Use the progress value to manipulate some properties of your model
      gltf.scene.position.y = (progress * 963 *(progress * 5)) -13 // Move up and down
      gltf.scene.position.x = (progress * 2) + 22 // Move up and down
      gltf.scene.rotation.y = progress * Math.PI // Rotate around z-axis

      pointLight.position.y = (progress * 963 *(progress * 5))  -15 // Move up and down
      pointLight.position.x = (progress * 2) + 22 // Move up and down
      pointLight.intensity = progress * 3 + 0.5

      pointLight3.position.y = (progress * 963 *(progress * 5)) + 5// Move up and down
      pointLight3.position.x = (progress * 2) + 20 // Move up and down
      pointLight3.intensity = progress * 2
      

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



// Load a gltf resource
loader.load(
	// resource URL
	'statics/satellite/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    

    
    // Add animation to scene
    gltf.animations.push(clip2)

		// Create an AnimationMixer instance
		mixer = new THREE.AnimationMixer( gltf.scene );

    // Play the action
    gltf.animations.forEach( ( clip ) => {
          
    mixer.clipAction( clip ).setLoop(THREE.LoopRepeat);
    mixer.clipAction( clip ).play();
    
  } );
  
    //if no animation is defined uncomment to set position
    gltf.scene.position.set(22, 30, -40)
    gltf.scene.rotation.y = 10

    scene.add( gltf.scene );
  
    // Subscribe to scroll events -- CANNOT BE COMBINED WITH ANIMATIONS
   /* window.addEventListener('scroll', () => {
      // Get the scroll position
      const scrollY = window.scrollY
      // Calculate a progress value between 0 and 1 based on your desired range
      const progress = Math.min(Math.max(scrollY / 10000, 0), 1)
      // Use the progress value to manipulate some properties of your model
      gltf.scene.position.y = (progress * 963 *(progress * 5)) -13 // Move up and down
      gltf.scene.position.x = (progress * 2) + 22 // Move up and down
      gltf.scene.rotation.y = progress * Math.PI * 3 // Rotate around z-axis
      renderer.render(scene, camera)
    })*/


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






/*
// Load the model
loader.load('statics/cloud.fbx', (object) => {
  // Create an animation mixer
  mixer = new THREE.AnimationMixer(object)
  object.animations.push(clip1)

  // Traverse the object and find any animation clips
  object.traverse((child) => {
    //if (child.isMesh) {
    //  child.material = material2
    //}

    if (child.animations && child.animations.length > 0) {
      // Play each animation clip
      child.animations.forEach((clip) => {
        let action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        action.play();
      })
    }
    
  })

  // Add the object to the scene
  //Comment out if using animations here frame 0 sets the position
  //object.position.set(0, 20, -150)
  scene.add(object)

    // Subscribe to scroll events
    window.addEventListener('scroll', () => {
      // Get the scroll position
      const scrollY = window.scrollY
      // Calculate a progress value between 0 and 1 based on your desired range
      const progress = Math.min(Math.max(scrollY / 1000, 0), 1)
      // Use the progress value to manipulate some properties of your model
      /*object.position.y = progress * 10 // Move up and down
      object.rotation.z = progress * Math.PI * 2 // Rotate around z-axis
      object.scale.setScalar(1 + progress) // Scale up and down
      if (object.animations && object.animations.length > 0) {
        // If your model has animations, use the progress value to set the animation time
        const clip = object.animations[0] // Get the first animation clip
        const duration = clip.duration // Get its duration in seconds
        const mixer = new THREE.AnimationMixer(object) // Create an animation mixer for your model
        const action = mixer.clipAction(clip) // Create an animation action for your clip
        action.play() // Play the action 
        action.time = progress * duration // Set its time based on progress 
      }
      // Update your renderer on each scroll event 
      renderer.render(scene, camera)
    })
})


// Load the model
loader.load('statics/untitled.glb', (object) => {
  // Create an animation mixer
  mixer = new THREE.AnimationMixer(object)
  object.animations.push(clip1)

  // Traverse the object and find any animation clips
  object.traverse((child) => {

    
    
  })

  // Add the object to the scene
  //Comment out if using animations here frame 0 sets the position
  object.position.set(2, 0, -50)
  scene.add(object)

    // Subscribe to scroll events
    window.addEventListener('scroll', () => {
      // Get the scroll position
      const scrollY = window.scrollY
      // Calculate a progress value between 0 and 1 based on your desired range
      const progress = Math.min(Math.max(scrollY / 1000, 0), 1)
      // Use the progress value to manipulate some properties of your model
      object.rotation.z += progress * Math.PI * 0.02 // Rotate around z-axis
      // Update your renderer on each scroll event 
      renderer.render(scene, camera)
    })
})
*/


// Lights

// Create an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.3;
// Add it to the scene
scene.add(ambientLight)

// Create a directional light
//const directionalLight = new THREE.DirectionalLight(0x42f5e3)
// Set its position
//directionalLight.position.set(10, 50, 10)
// Enable shadows
//directionalLight.castShadow = true
// Add it to the scene
//scene.add(directionalLight)

// Create a point light
const pointLight = new THREE.PointLight(0x3244a8)
// Set its position
pointLight.position.set(22, -17, -35)
pointLight.intensity = 0.5
// Enable shadows
pointLight.castShadow = true
// Add it to the scene
scene.add(pointLight)

// Create a point light
const pointLight3 = new THREE.PointLight(0x6699ff)
// Set its position
pointLight3.position.set(0, 5, -20)
pointLight3.intensity = 0
// Enable shadows
pointLight3.castShadow = true
// Add it to the scene
scene.add(pointLight3)

// Create a point light
const pointLight2 = new THREE.PointLight("orange")
// Set its position
pointLight2.position.set(14, -9, -22)
pointLight2.intensity = 0.2
// Enable shadows
pointLight2.shadow = true
// Add it to the scene
//scene.add(pointLight2)


// Create a point light
const pointLight4 = new THREE.PointLight("white")
// Set its position
pointLight4.position.set(14, 12, -22)
pointLight4.intensity = 0.2
// Enable shadows
pointLight4.shadow = true
// Add it to the scene
scene.add(pointLight4)

// Create a directional light
//const directionalLight3 = new THREE.DirectionalLight(0xffffff)
// Set its position
//directionalLight3.position.set(10, -10, 100)
// Enable shadows
//directionalLight3.castShadow = true
// Add it to the scene
//scene.add(directionalLight3)


// Create a hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, "lightblue")
hemisphereLight.intensity = 0.4
// Add it to the scene
scene.add(hemisphereLight)

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight)
const lightHelper2 = new THREE.PointLightHelper(pointLight2)
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


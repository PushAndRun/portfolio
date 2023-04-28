import * as THREE from 'three';

export let Lights = {}

// General lightning
const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.1;
Lights.ambientLight = ambientLight;


const directionalLight = new THREE.DirectionalLight("white", 0.4)
directionalLight.position.set(-100, 30, -20)
//directionalLight.distance = 300
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1048;
directionalLight.shadow.mapSize.height = 1048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 700;
directionalLight.shadow.camera.rotateY(120);
Lights.directionalLight = directionalLight;

//const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
//scene.add( helper );

const orangePointLightOnBase = new THREE.PointLight("orange")
orangePointLightOnBase.position.set(14, -9, -22)
orangePointLightOnBase.intensity = 0.2
Lights.orangePointLightOnBase = orangePointLightOnBase;


const redAntennaPointLight = new THREE.PointLight("red");
redAntennaPointLight.position.set(0, 8, -85);
redAntennaPointLight.intensity = 1;
redAntennaPointLight.distance = 50;
Lights.redAntennaPointLight = redAntennaPointLight;

const nameLight = new THREE.PointLight("blue");
nameLight.position.set(-50, 10, -80);
nameLight.intensity = 0.9;
nameLight.distance = 0;
Lights.nameLight = nameLight;

// Accent lights
const pointLight4 = new THREE.PointLight("white")
pointLight4.position.set(14, 12, -22)
pointLight4.intensity = 0.1
Lights.pointLight4 = pointLight4;

const hemisphereLight = new THREE.HemisphereLight(0xffffff, "lightblue")
hemisphereLight.intensity = 0.4
Lights.hemisphereLight = hemisphereLight;


// Rocket lightning
const rocketEngineLight = new THREE.PointLight(0x3244a8)
rocketEngineLight.position.set(22, -17, -35)
rocketEngineLight.intensity = 0.5
rocketEngineLight.castShadow = true
Lights.rocketEngineLight = rocketEngineLight;


const rocketTopLight = new THREE.PointLight(0x6699ff)
rocketTopLight.position.set(0, 5, -20)
rocketTopLight.intensity = 0
rocketTopLight.castShadow = true
Lights.rocketTopLight = rocketTopLight;
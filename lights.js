import * as THREE from 'three';

// General lightning
export const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.1;


export const directionalLight = new THREE.DirectionalLight("white", 0.4)
// Set its position and intensity
directionalLight.position.set(-100, 30, -20)
//directionalLight.distance = 300
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1048;
directionalLight.shadow.mapSize.height = 1048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 700;
directionalLight.shadow.camera.rotateY(120);

//const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
//scene.add( helper );

export const pointLight2 = new THREE.PointLight("orange")
pointLight2.position.set(14, -9, -22)
pointLight2.intensity = 0.1


export const pointLight3 = new THREE.PointLight("red");
pointLight3.position.set(0, 8, -85);
pointLight3.intensity = 1;
pointLight3.distance = 35;


export const pointLight4 = new THREE.PointLight("white")
pointLight4.position.set(14, 12, -22)
pointLight4.intensity = 0.2


export const hemisphereLight = new THREE.HemisphereLight(0xffffff, "lightblue")
hemisphereLight.intensity = 0.4



// Rocket lightning
export const rocketEngineLight = new THREE.PointLight(0x3244a8)
rocketEngineLight.position.set(22, -17, -35)
rocketEngineLight.intensity = 0.5
rocketEngineLight.castShadow = true


export const rocketTopLight = new THREE.PointLight(0x6699ff)
rocketTopLight.position.set(0, 5, -20)
rocketTopLight.intensity = 0
rocketTopLight.castShadow = true

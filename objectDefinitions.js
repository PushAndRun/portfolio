import * as THREE from 'three';
import * as Animation from '/animations.js'



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

class ImportObject {
  constructor(url, material, x, y, z, animation, importFunction) {
    this.url = url;
    this.material = material;
    this.x = x;
    this.y = y;
    this.z = z;
    this.animation = animation;
    this.importFunction = importFunction;
  }
}

let base = new ImportObject(
  "base", 
  new THREE.MeshStandardMaterial({ color: scheme.main, roughness: 1, metalness: 0 }),
  22, -13.5, -35);

let antenna = new ImportObject(
  "antenna", 
  new THREE.MeshStandardMaterial({ color: scheme.third, side: THREE.DoubleSide, roughness: 0, metalness: 0 }),
  22, -13.5, -35);


let crystal = new ImportObject(
  "crystal", 
  new THREE.MeshStandardMaterial({ color: scheme.fourth, roughness: 0, transparent: true, opacity: 0.99 }),
  22, -13.5, -35)


let antenna2 = new ImportObject(
  "antenna2", 
  new THREE.MeshStandardMaterial({ color: scheme.third, side: THREE.DoubleSide, roughness: 0, metalness: 0 }),
  22, -13.5, -35);


let antennaLight = new ImportObject(
  "antennalight", 
  new THREE.MeshStandardMaterial({ color: "red", emissive: "red", emissiveIntensity: 1, roughness: 0, transparent: true, opacity: 0.8 }),
  22, -13.5, -35);

let gasBottles = new ImportObject(
  "gasbottles", 
  new THREE.MeshStandardMaterial({ color: scheme.fourth, roughness: 1, side: THREE.DoubleSide }),
  22, -13.5, -35);

let box = new ImportObject(
  "box", 
  new THREE.MeshStandardMaterial({ color: scheme.third, roughness: 0, transparent: true, opacity: 0.99 }),
  22, -13.5, -35);



let radarBase = new ImportObject(
  "radarbase", 
  new THREE.MeshStandardMaterial({ color: scheme.secondary, side: THREE.DoubleSide, roughness: 1 }),
  22, -13.5, -35);



let radarShield = new ImportObject(
  "radarshield", 
  new THREE.MeshStandardMaterial({ color: "white", roughness: 0, metalness: 0 }),
  -18.5, 0.5, -72,
  Animation.radarAnimation);


let house = new ImportObject(
  "house", 
  new THREE.MeshStandardMaterial({ color: scheme.secondary, roughness: 0.8, metalness: 0 }),
  22, -13.5, -35);


let satellite = new ImportObject(
  "satellite", 
  undefined,
  0,0,0,
  Animation.satelliteAnimation,
  (gltf) => {gltf.scene.rotation.y = 10}
  );

  let rocket = new ImportObject(
    "rocket", 
    new THREE.MeshStandardMaterial ( {color: "white", roughness: 0, metalness: 0, side: THREE.DoubleSide}),
    22, -13, -35,
    undefined,
    (gltf, rocketEngineLight, rocketTopLight, emitter) => {
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
  
        //renderer.render(scene, camera)
      })}
    );


export const importObjects = [base, crystal, antenna, antenna2, antennaLight, gasBottles, box, radarBase, radarShield, house, satellite, rocket];


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
  constructor(url, importFunction) {
    this.url = url;
    this.importFunction = importFunction;
  }
}

let base = new ImportObject("base", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.main, roughness: 1, metalness: 0 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.position.set(22, -13.5, -35)
  gltf.scene.receiveShadow = true;
  gltf.scene.castShadow = false;
  scene.add(gltf.scene);
});

let antenna = new ImportObject("antenna", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.third, side: THREE.DoubleSide, roughness: 0, metalness: 0 });

  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.position.set(22, -13.5, -35)
  scene.add(gltf.scene);

});

let crystal = new ImportObject("crystal", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.fourth, roughness: 0, transparent: true, opacity: 0.99 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.position.set(22, -13.5, -35)
  gltf.scene.receiveShadow = true;
  gltf.scene.castShadow = true;
  scene.add(gltf.scene);
});

let antenna2 = new ImportObject("antenna2", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.third, side: THREE.DoubleSide, roughness: 0, metalness: 0 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.position.set(22, -13.5, -35)
  scene.add(gltf.scene);
});


let antennaLight = new ImportObject("antennalight", (gltf, scene, mixer) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: "red", emissive: "red", emissiveIntensity: 1, roughness: 0, transparent: true, opacity: 0.8 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.position.set(22, -13.5, -35)
  scene.add(gltf.scene);
});


let gasBottles = new ImportObject("gasbottles", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.fourth, roughness: 1, side: THREE.DoubleSide });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.position.set(22, -13.5, -35)
  scene.add(gltf.scene);
});

let box = new ImportObject("box", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.third, roughness: 0, transparent: true, opacity: 0.99 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  gltf.scene.castShadow = true;
  gltf.scene.position.set(22, -13.5, -35)
  scene.add(gltf.scene);
});


let radarBase = new ImportObject("radarbase", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.secondary, side: THREE.DoubleSide, roughness: 1 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });
  gltf.scene.position.set(22, -13.5, -35)
  gltf.scene.receiveShadow = true;
  gltf.scene.castShadow = true;
  scene.add(gltf.scene);
});

let radarShield = new ImportObject("radarshield", (gltf, scene, mixer) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: "white", roughness: 0, metalness: 0 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });

  // Add animation to scene
  gltf.animations.push(Animation.radarAnimation)

  gltf.animations.forEach((clip) => {

    mixer.clipAction(clip, gltf.scene).setLoop(THREE.LoopRepeat);
    mixer.clipAction(clip, gltf.scene).play();

  });

  //gltf.scene.position.set(-18.5, 0.5, -72)
  gltf.scene.receiveShadow = true;
  gltf.scene.castShadow = true;
  scene.add(gltf.scene);
});


let house = new ImportObject("house", (gltf, scene) => {
  var model = gltf.scene;
  var newMaterial = new THREE.MeshStandardMaterial({ color: scheme.secondary, roughness: 0.8, metalness: 0 });
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = newMaterial;
    }
  });
  gltf.scene.receiveShadow = true;
  gltf.scene.castShadow = true;
  gltf.scene.position.set(22, -13.5, -35)
  scene.add(gltf.scene);
});


let satellite = new ImportObject("satellite", (gltf, scene, mixer) => {

  // Add animation to scene
  gltf.animations.push(Animation.satelliteAnimation
  )

  // Play the action
  gltf.animations.forEach((clip) => {

    mixer.clipAction(clip, gltf.scene).setLoop(THREE.LoopRepeat);
    mixer.clipAction(clip, gltf.scene).play();

  });

  gltf.scene.rotation.y = 10
  scene.add(gltf.scene);
});




export const importObjects = [base, crystal, antenna, antenna2, antennaLight, gasBottles, box, radarBase, radarShield, house, satellite];


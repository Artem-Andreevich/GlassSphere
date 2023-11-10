import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Stats from 'stats.js';
import * as dat from 'lil-gui';
import './style.css';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
camera.position.set(0,0,500);
const controls = new OrbitControls(camera, renderer.domElement);

const pointlight = new THREE.PointLight(0xffffff,1);
pointlight.position.set(200,200,200);
scene.add(pointlight);


function init() {




    let envmaploader = new THREE.PMREMGenerator(renderer);

    new RGBELoader().setPath('textures/').load('space.hdr', function(hdrmap) {
        let texture = new THREE.CanvasTexture(new FlakesTexture());
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        //repeat the wrapping 10 (x) and 6 (y) times
        texture.repeat.x = 10;
        texture.repeat.y = 6;
       
       let envmap = envmaploader.fromCubemap(hdrmap);
       const ballMaterial = {
        clearcoat: 1.0,
        cleacoatRoughness:0.1,
        metalness: 0.9,
        roughness:0.5,
        color: 0x8418ca,
        normalMap: texture,
        normalScale: new THREE.Vector2(0.15,0.15),
        envMap: envmap.texture
      };

      let ballGeo = new THREE.SphereGeometry(100,64,64);
      let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
      let ballMesh = new THREE.Mesh(ballGeo,ballMat);
      scene.add(ballMesh);
    });
    
    

    
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;



    animate(); // rendering loop
}


init();


function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

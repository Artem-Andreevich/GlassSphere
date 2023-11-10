import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Stats from 'stats.js';
import * as dat from 'lil-gui';
import './style.css';
import pol from '../dist/textures/pol.jpg'

const URL = 'textures/pol.jpg'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB1E1FF)
const canvas = document.querySelector('.canvas');

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const parameters = {
    color: '#13b8be',
};

const cursor = {
    x: 0,
    y: 0,
};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(2, 7, 10)


const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

scene.add(camera);


let envmaploader = new THREE.PMREMGenerator(renderer);

const glass = new RGBELoader().setPath('./textures/').load('222.hdr', function(hdrmap) { 
    let texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    //repeat the wrapping 10 (x) and 6 (y) times
    texture.repeat.x = 10;
    texture.repeat.y = 6;
   
   let envmap = envmaploader.fromCubemap(hdrmap);

   console.log (envmap.texture)


   const ballMaterial = {
    clearcoat: 1.0,
    metalness: 0.8,
    roughness: .1,
    color: "#333",
    // normalMap: texture,
    normalScale: new THREE.Vector2(0.01, 0.01),
    envMap: envmap.texture
  };

  let ballGeo = new THREE.SphereGeometry(2,32,16);
  let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
  let ballMesh = new THREE.Mesh(ballGeo,ballMat);
  ballMesh.castShadow = true
  ballMesh.receiveShadow = true
  ballMesh.position.set(0, 3, 2)
  scene.add(ballMesh);


  controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.enableDamping = true;

})

console.log(glass)
// new RGBELoader().setPath('textures/').load('222.hdr', function(hdrmap) {

//     let texture = new THREE.CanvasTexture(new FlakesTexture());
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
    
//     //repeat the wrapping 10 (x) and 6 (y) times
//     texture.repeat.x = 10;
//     texture.repeat.y = 6;
   
//    let envmap = envmaploader.fromCubemap(hdrmap);
//    const ballMaterial = {
//     clearcoat: 1.0,
//     metalness: 0.8,
//     roughness: .1,
//     color: "#333",
//     // normalMap: texture,
//     normalScale: new THREE.Vector2(0.01, 0.01),
//     envMap: envmap.texture
//   };

//   let ballGeo = new THREE.SphereGeometry(2,32,16);
//   let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
//   let ballMesh = new THREE.Mesh(ballGeo,ballMat);
//   ballMesh.castShadow = true
//   ballMesh.receiveShadow = true
//   ballMesh.position.set(0, 3, 2)
//   scene.add(ballMesh);

// });

    // TEXTURE
    const loader = new THREE.TextureLoader();
    const texture = loader.load( pol );
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set( 5, 10 );

    const wallTexture = loader.load('./textures/tex.jpg')
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.magFilter = THREE.NearestFilter;
    wallTexture.repeat.set( 1, 1 );

    const sphereTexture = loader.load('./textures/hrom.jpg')
    sphereTexture.wrapS = THREE.RepeatWrapping;
    sphereTexture.wrapT = THREE.RepeatWrapping;
    sphereTexture.magFilter = THREE.NearestFilter;
    sphereTexture.repeat.set( 1, 1 );

    // const glass = new THREE.CanvasTexture( new FlakesTexture())
    // glass.wrapS = THREE.RepeatWrapping;
    // glass.wrapT = THREE.RepeatWrapping;
    // glass.repeat.x = 10;
    // glass.repeat.y = 6;

    // const glassMat = {
    //     clearcoat: 1.0,
    //     clearcoatRoughness: 1.0,
    //     metalness: .9,
    //     roughness: .5,
    //     color: 0x8418ca,
    //     normalMap: glass,
    //     normalScale: new THREE.Vector2(0.15, 0.15)
    // }



    // CUBE
    // const geometry = new THREE.SphereGeometry(2, 32, 16);
    // const material = new THREE.MeshPhysicalMaterial({
    //     color: parameters.color,
    //     wireframe: true,
    //     color: '#222',
    //     emissive: 0x111111, 
    //     map: sphereTexture,
    // });
    // const material = new THREE.MeshPhysicalMaterial(glassMat)

    // const cube = new THREE.Mesh(geometry, material);
    // cube.castShadow = true
    // cube.receiveShadow = true
    // cube.position.y = 4.5
    // scene.add(cube);



    
    // PLANE
    {
        
        const planeGeo = new THREE.BoxGeometry(30, 30, 0.1)
        const planeMat = new THREE.MeshPhongMaterial({
            color: '#222',
            map: texture,
        })
        const plane = new THREE.Mesh( planeGeo, planeMat )
        plane.position.y = 0
        plane.receiveShadow = true
        plane.rotation.x = Math.PI * - .5;


        scene.add(plane)
    }
    {
        const planeGeo = new THREE.BoxGeometry(30, 10, 0.1)
        const planeMat = new THREE.MeshPhongMaterial({
            color: '#222',
            map: wallTexture,
        })
        const plane = new THREE.Mesh( planeGeo, planeMat )
        plane.receiveShadow = true
        plane.castShadow = true
        plane.position.set(15, 5, 0)
        plane.rotation.y = Math.PI * - .5;


        scene.add(plane)
    }
    {
        const planeGeo = new THREE.BoxGeometry(30, 10, 0.1)
        const planeMat = new THREE.MeshPhongMaterial({
            color: '#222',
            map: wallTexture,
        })
        const plane = new THREE.Mesh( planeGeo, planeMat )
        plane.receiveShadow = true
        plane.castShadow = true
        plane.position.set(-15, 5, 0)
        plane.rotation.y = Math.PI * - .5;


        scene.add(plane)
    }
    {
        const planeGeo = new THREE.BoxGeometry(30, 10, 0.1)
        const planeMat = new THREE.MeshPhongMaterial({
            color: '#222',
            map: wallTexture,
        })
        const plane = new THREE.Mesh( planeGeo, planeMat )
        plane.receiveShadow = true
        plane.castShadow = true

        plane.position.set(0, 5, -15)
        plane.rotation.y = Math.PI * - 1;


        scene.add(plane)
    }

    // LIGHT
    {
        const light = new THREE.DirectionalLight( '#fff',  1)
        light.castShadow = true
		light.position.set( 15, 25, 0 );
		light.target.position.set( -2, -5, -2 );
        scene.add( light );
        // scene.add( light.target );
        
        light.shadow.camera.near = 0.01
        light.shadow.camera.far = 200
        light.shadow.camera.zoom = .2

        light.shadow.camera.visible = true


        const pointLight = new THREE.PointLight(0xffffff, 3)
        pointLight.position.set(5, 15, 4)
        scene.add( pointLight )

        // const pointLightHelper = new THREE.PointLightHelper(pointLight)
        // scene.add( pointLightHelper )


        // const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        // scene.add(cameraHelper);

        // const helper = new THREE.DirectionalLightHelper( light );
		// scene.add( helper );

    }



renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2.25

renderer.render(scene, camera);

const clock = new THREE.Clock();


const tick = () => {
    stats.begin();
    const delta = clock.getDelta();
    // glass.rotation.y += delta * .4;

    controls.update();
    renderer.render(scene, camera);

    stats.end();
    window.requestAnimationFrame(tick);
};

tick();

// function render( time ) {

//     time = clock.getElapsedTime(); // convert to seconds
//     const delta = clock.getDelta() 
//     // console.log(clock.getElapsedTime())

//     const base = new THREE.Object3D();
//     const y = cube.position.y


//     {

//         const canvas = renderer.domElement;
//         camera.aspect = canvas.clientWidth / canvas.clientHeight;
//         camera.updateProjectionMatrix();

//     }


//         // u is a value that goes from 0 to 1 as we iterate the spheres
//         const ndx = .9
//         const sphereShadowBases = [...[40]]
//         const u = .2
//         // compute a position for there base. This will move
//         // both the sphere and its shadow
//         const speed = time * .9;
//         const angle = speed + u * Math.PI * 2 * ( ndx % 1 ? 1 : - 1 );
//         const radius = Math.sin( speed - ndx ) * 10;
//         base.position.set( Math.cos( angle ) * radius, 0, Math.sin( angle ) * radius );

//         // yOff is a value that goes from 0 to 1
//         const yOff = Math.abs( Math.sin( time * 2 + ndx ) );
//         // move the sphere up and down
//         cube.position.y = y + THREE.MathUtils.lerp( -0.3, 0.172, yOff );
//         // fade the shadow as the sphere goes up
//         // cube.material.opacity = THREE.MathUtils.lerp( 1, .25, yOff );
    


//     renderer.render( scene, camera );

//     requestAnimationFrame( render );

// }

// requestAnimationFrame( render );

window.addEventListener('resize', () => {
    // Обновляем размеры
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Обновляем соотношение сторон камеры
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Обновляем renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

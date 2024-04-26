import * as THREE from 'three'
import { LoadGLTFByPath } from './Helpers/ModelHelper.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

const container = document.createElement( 'div' );
let renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1
renderer.useLegacyLights  = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace


const scene = new THREE.Scene();
let camera;

document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
camera.position.set( 10, 10, 10 );


LoadGLTFByPath(scene)
  .catch((error) => {
    console.error('Error loading JSON scene:', error);
  });


renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

container.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 2;
controls.maxDistance = 50;
controls.target.set( 0, 0, - 0.2 );
controls.update();
window.addEventListener( 'resize', onWindowResize );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}
function render() {
  renderer.render( scene, camera );
}

    
import * as THREE from "three";
import { LoadGLTFByPath } from './Helpers/ModelHelper.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

const container2 = document.createElement( 'div' );
let renderer = new THREE.WebGLRenderer({
    antialias: true,
});

let isSpinning = false;

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


const scene2 = new THREE.Scene();
let camera, model;

document.body.appendChild( container2 );

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
camera.position.set( 10, 10, 10 );


LoadGLTFByPath(scene2)
    .catch((error) => {
        console.error('Error loading JSON scene:', error);
    });


renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);

container2.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
function render() {
    renderer.render( scene2, camera );
}
const handpose = window.handpose;
window.onload = () => {
    const video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(e => console.error('Не удалось инициализировать камеру:', e));

    handpose.load()
        .then(_model => {
            console.log("Handpose model loaded");
            model = _model;
            tick();
        })
        .catch(e => console.error('Не удалось загрузить модель Handpose:', e));
}

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function detectHands() {
    async function renderHand() {
        const predictions = await model?.estimateHands(video);
        if (predictions?.length > 0) {
            let prediction = predictions[0];
            // Обработка жестов
            const fingers = predictions[0].annotations.thumb.concat(predictions[0].annotations.indexFinger);
            const numFingers = fingers?.filter((point) => point[2] > 0.5).length;
            if (prediction.annotations.thumb[3][1] < prediction.annotations.thumb[0][1] &&
                prediction.annotations.indexFinger[3][1] < prediction.annotations.indexFinger[0][1] &&
                prediction.annotations.middleFinger[3][1] < prediction.annotations.middleFinger[0][1] &&
                prediction.annotations.ringFinger[3][1] < prediction.annotations.ringFinger[0][1] &&
                prediction.annotations.pinky[3][1] < prediction.annotations.pinky[0][1]) {
                // Остановка все пальцы подняты
            }
            else if (prediction.annotations.thumb[3][1] > prediction.annotations.indexFinger[3][1] &&
                prediction.annotations.ringFinger[3][1] > prediction.annotations.indexFinger[3][1]) {

                scene2.scale.multiplyScalar(1.05);
                console.log("+++")
                // жест мира
            }
            else if (prediction.annotations.pinky[3][1] > prediction.annotations.thumb[3][1] &&
                prediction.annotations.indexFinger[3][1] > prediction.annotations.thumb[3][1] &&
                prediction.annotations.middleFinger[3][1] > prediction.annotations.thumb[3][1] &&
                prediction.annotations.ringFinger[3][1] > prediction.annotations.thumb[3][1]) {

                scene2.scale.multiplyScalar(0.95);
                console.log("---")
                // палец вверх
            }

             else {
                scene2.rotation.y += 0.01;
                // жест окей
            }
        }

        requestAnimationFrame(renderHand);
    }

    renderHand();
}

const tick = () => {
    if (isSpinning) {
        // scene2.rotation.y += 0.2;
    }
    // console.log(isSpinning);

    controls.update();
    renderer.render(scene2, camera);
    window.requestAnimationFrame(tick);
};
tick();

async function main() {
    await setupCamera();
    detectHands();
}

main();

import * as THREE from 'three'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = '/public/models/scene.gltf'

export const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(scenePath, (gltf) => {
        scene.add(gltf.scene);
        resolve();
      }, undefined, (error) => {
        reject(error);
      });
    });
};
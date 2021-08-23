import { Color, Scene } from '../../../js/three/build/three.module.js';

function createScene() {
    const scene = new Scene();

    scene.background = new Color('cornsilk');

    return scene;
}

export { createScene };
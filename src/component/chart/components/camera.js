import { PerspectiveCamera } from '../../../js/three/build/three.module.js';

function createCamera() {
    const camera = new PerspectiveCamera(
        100, // fov = Field Of View
        1, // aspect ratio (dummy value)
        10, // near clipping plane
        10000, // far clipping plane
    );

    camera.position.set(0, 0, 750);

    return camera;
}

export { createCamera };
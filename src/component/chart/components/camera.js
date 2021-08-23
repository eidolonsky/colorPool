import { PerspectiveCamera } from '../../../js/three/build/three.module.js';

function createCamera() {
    const camera = new PerspectiveCamera(
        15, // fov = Field Of View
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        5000, // far clipping plane
    );

    camera.position.set(0, 0, 2000);

    return camera;
}

export { createCamera };
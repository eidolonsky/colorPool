import { PerspectiveCamera, OrthographicCamera } from '../../../js/three/build/three.module.js';

function createCamera() {
    // const camera = new PerspectiveCamera(
    //     100, // fov = Field Of View
    //     1, // aspect ratio (dummy value)
    //     10, // near clipping plane
    //     10000, // far clipping plane
    // );
    const camera = new OrthographicCamera(
        -128, // Camera frustum left plane.
        128, // Camera frustum right plane.
        128, //Camera frustum top plane.
        -128, //Camera frustum bottom plane.
        1, // Camera frustum near plane.
        1000, // Camera frustum far plane.
    );
    camera.position.set(0, 0, 700);

    return camera;
}

export { createCamera };
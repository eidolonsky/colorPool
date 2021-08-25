import { OrbitControls } from '../../../js/three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);

    controls.enableDamping = true;

    controls.tick = () => controls.update();
    controls.maxPolarAngle = Math.PI / 2;
    return controls;
}

export { createControls };
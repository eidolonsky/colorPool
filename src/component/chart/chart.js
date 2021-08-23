import { createCamera } from './components/camera.js';
import { createShape } from './components/shape.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createAxes } from './components/axes.js';
import { MathUtils } from '../../js/three/build/three.module.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;

class Chart {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);

        const light = createLights();
        const axes = createAxes();

        scene.add(axes);
        scene.add(createShape(0, 0, 0))
        scene.add(createShape(100, 100, 100))
        scene.add(createShape(200, 200, 200))


        scene.position.set(-120, -50, -5);

        scene.rotation.x = MathUtils.degToRad(25);
        scene.rotation.y = MathUtils.degToRad(10);
        scene.rotation.z = MathUtils.degToRad(0);

        const resizer = new Resizer(container, camera, renderer);
    }

    render() {
        // draw a single frame
        renderer.render(scene, camera);
    }
}

export { Chart };
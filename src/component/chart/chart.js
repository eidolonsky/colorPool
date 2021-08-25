import { createCamera } from './components/camera.js';
import { createMeshGroup } from './components/dots.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { MathUtils } from '../../js/three/build/three.module.js';

import { createControls } from './systems/control.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js'

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let loop;

class Chart {
    constructor(container, data) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        renderer.domElement.id = "chartCanvas";

        const controls = createControls(camera, renderer.domElement)
        const { ambientLight, mainLight } = createLights();
        const meshGroup = createMeshGroup(data);

        loop.updatables.push(controls, meshGroup);

        scene.add(ambientLight, mainLight, meshGroup);

        scene.position.set(0, 0, 0);

        scene.rotation.x = MathUtils.degToRad(5);
        // scene.rotation.y = MathUtils.degToRad(0);
        // scene.rotation.z = MathUtils.degToRad(5);

        const resizer = new Resizer(container, camera, renderer);
    }

    render() {
        // draw a single frame
        renderer.render(scene, camera);
    }
    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { Chart };
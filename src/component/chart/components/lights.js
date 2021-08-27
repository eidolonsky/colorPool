import { DirectionalLight, HemisphereLight } from '../../../js/three/build/three.module.js';

const createLights = () => {
    const ambientLight = new HemisphereLight(
        'white',
        'darkslategrey',
        10,
    );

    const mainLight = new DirectionalLight('white', 5);
    mainLight.position.set(10, 10, 10);

    return { ambientLight, mainLight };
}

export { createLights };
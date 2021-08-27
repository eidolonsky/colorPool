import { AxesHelper, MathUtils } from '../../../js/three/build/three.module.js';

const createAxes = () => {
    const axesHelper = new AxesHelper(255);

    return axesHelper;
}

export { createAxes };
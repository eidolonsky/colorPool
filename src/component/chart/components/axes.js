import { AxesHelper, MathUtils } from '../../../js/three/build/three.module.js';

function createAxes() {
    const axesHelper = new AxesHelper(255);

    return axesHelper;
}

export { createAxes };
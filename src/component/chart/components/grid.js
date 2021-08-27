import { GridHelper, MathUtils } from '../../../js/three/build/three.module.js';

const createGrid = () => {
    const gridHelper = new GridHelper(255);

    return gridHelper;
}

export { createGrid };
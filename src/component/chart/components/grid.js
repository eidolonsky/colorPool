import { Color, GridHelper, MathUtils } from '../../../js/three/build/three.module.js';

const createGrid = () => {
    const gridHelper = new GridHelper(255, 8, 0xAAAAAA, 0xAAAAAA);
    return gridHelper;
}

export { createGrid };
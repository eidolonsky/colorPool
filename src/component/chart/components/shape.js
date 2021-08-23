import { SphereGeometry, Mesh, MeshStandardMaterial, MathUtils, } from '../../../js/three/build/three.module.js';

function createShape(x, y, z) {
    const geometry = new SphereGeometry(20, 20, 20);

    const material = new MeshStandardMaterial({ color: 'purple' });

    const shape = new Mesh(geometry, material);

    shape.position.set(x, y, z);

    // cube.scale.set(1.25, 0.25, 0.5);



    return shape;
}

export { createShape };
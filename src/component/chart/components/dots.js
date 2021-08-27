import {
    SphereBufferGeometry,
    Group,
    MathUtils,
    Mesh,
    MeshStandardMaterial
} from '../../../js/three/build/three.module.js';
import { createAxes } from '../components/axes.js';
import { createGrid } from '../components/grid.js';

const createMeshGroup = (data) => {

    const group = new Group();

    const geometry = new SphereBufferGeometry(1.5, 5, 5);
    geometry.translate(-127.5, -127.5, -127.5)

    const axes = createAxes();
    const gridR = createGrid();
    const gridG = createGrid();
    const gridB = createGrid();

    axes.geometry.center();
    axes.scale.multiplyScalar(1.01)

    gridR.geometry.center();
    gridG.geometry.center();
    gridB.geometry.center();

    gridR.position.y = -127.5;

    gridG.rotation.x = MathUtils.degToRad(90);
    gridG.position.z = -127.5;

    gridB.rotation.z = MathUtils.degToRad(90);
    gridB.position.x = -127.5;

    group.add(gridR, gridG, gridB, axes);

    let counter = 0;
    for (const point of data) {
        let color = `rgb(${point[0]}, ${point[1]}, ${point[2]})`;
        const material = new MeshStandardMaterial({
            color: color,
        });

        const sphere = new Mesh(geometry, material)

        // let sphere = protoSphere.clone();
        // console.log(point[0])
        sphere.position.x = point[0];
        sphere.position.y = point[1];
        sphere.position.z = point[2];

        // sphere.scale.multiplyScalar(i * 0.1);

        group.add(sphere);
        counter++;
    }
    console.log(counter)

    group.scale.multiplyScalar(0.75);

    const radiansPerSecond = MathUtils.degToRad(5);

    group.tick = (delta) => {
        // group.rotation.z -= delta * radiansPerSecond;
        // group.rotation.x -= delta * radiansPerSecond;
        group.rotation.y -= delta * radiansPerSecond;
    };

    return group;
}

export { createMeshGroup };
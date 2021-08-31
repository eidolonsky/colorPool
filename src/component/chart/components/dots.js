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

    const axesOut = createAxes();
    const axesIn = createAxes();
    const gridRB = createGrid();
    const gridGR = createGrid();
    const gridBG = createGrid();

    axesOut.geometry.center();
    axesIn.geometry.center();
    axesOut.scale.multiplyScalar(1.001)
    axesIn.scale.multiplyScalar(0.999)

    gridRB.geometry.center();
    gridGR.geometry.center();
    gridBG.geometry.center();

    gridRB.position.y = -127.5;

    gridGR.rotation.x = MathUtils.degToRad(90);
    gridGR.position.z = -127.5;

    gridBG.rotation.z = MathUtils.degToRad(90);
    gridBG.position.x = -127.5;

    group.add(gridRB, gridGR, gridBG, axesOut, axesIn);

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

    group.scale.multiplyScalar(0.7);
    group.rotation.x = MathUtils.degToRad(15);
    group.rotation.y = MathUtils.degToRad(-45);
    group.rotation.z = MathUtils.degToRad(0);

    const radiansPerSecond = MathUtils.degToRad(2);

    group.tick = (delta) => {
        // group.rotation.z -= delta * radiansPerSecond;
        // group.rotation.x -= delta * radiansPerSecond;
        group.rotation.y -= delta * radiansPerSecond;
    };

    return group;
}

export { createMeshGroup };
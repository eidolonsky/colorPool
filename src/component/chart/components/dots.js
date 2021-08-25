import {
    SphereBufferGeometry,
    Group,
    MathUtils,
    Mesh,
    MeshStandardMaterial
} from '../../../js/three/build/three.module.js';
import { createAxes } from '../components/axes.js';

function createMeshGroup(data) {

    const group = new Group();

    const geometry = new SphereBufferGeometry(1.5, 5, 5);
    geometry.center()

    const axes = createAxes();

    group.add(axes);

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

    // group.scale.multiplyScalar(2);

    const radiansPerSecond = MathUtils.degToRad(5);

    group.tick = (delta) => {
        // group.rotation.z -= delta * radiansPerSecond;
        // group.rotation.x -= delta * radiansPerSecond;
        group.rotation.y -= delta * radiansPerSecond;
    };

    return group;
}

export { createMeshGroup };
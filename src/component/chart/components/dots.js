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

    const geometry = new SphereBufferGeometry(0.5, 5, 5);

    const material = new MeshStandardMaterial({
        color: 'indigo',
    });
    const axes = createAxes();
    const protoSphere = new Mesh(geometry, material);

    group.add(protoSphere, axes);

    for (let i = 0; i < 255; i += 5) {
        const sphere = protoSphere.clone();

        sphere.position.x = Math.floor(Math.random() * i);
        sphere.position.y = Math.floor(Math.random() * i);
        sphere.position.z = Math.floor(Math.random() * i);

        sphere.scale.multiplyScalar(i * 0.1);

        group.add(sphere);
    }

    group.scale.multiplyScalar(2);

    const radiansPerSecond = MathUtils.degToRad(30);

    group.tick = (delta) => {
        // group.rotation.z -= delta * radiansPerSecond;
        // group.rotation.x -= delta * radiansPerSecond;
        group.rotation.y -= delta * radiansPerSecond;
    };

    return group;
}

export { createMeshGroup };
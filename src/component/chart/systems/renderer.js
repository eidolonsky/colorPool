import { WebGLRenderer } from '../../../js/three/build/three.module.js';

function createRenderer() {
    const renderer = new WebGLRenderer({ 
        antialias: true,
        alpha: true
    });

    renderer.physicallyCorrectLights = true;
    renderer.setClearColor( 0xffffff, 0 );
    
    return renderer;
}

export { createRenderer };

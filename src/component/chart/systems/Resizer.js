class Resizer {
    constructor(container, camera, renderer) {
        // Set the camera's aspect ratio
        let h = $("#image").height(),
            w = h;

        camera.aspect = w / h;

        // update the camera's frustum
        camera.updateProjectionMatrix();

        // update the size of the renderer AND the canvas
        console.log(container)
        console.log(w, h);
        renderer.setSize(w, h);

        // set the pixel ratio (for mobile devices)
        // renderer.setPixelRatio(window.devicePixelRatio);
    }
}

export { Resizer };
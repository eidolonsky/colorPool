const genPalette = (c) => {
    for (let i = 0; i < 5; i++) {
        // console.log(c[i][0])
        let regexNum = /^\d+$/;
        if (regexNum.test(c[i][0])) {
            let hex = ("000000" + rgbToHex(c[i][0], c[i][1], c[i][2])).slice(-6);
            $("#palette").append(
                    '<div class="palette-box flex" style="background-color:' +
                    "#" +
                    hex +
                    "; border-color:" +
                    "#" +
                    hex +
                    30 +
                    ';"/>' +
                    "#" +
                    hex.toUpperCase() +
                    "</div>"
                )
                .css("width", $("#canvas").width());


        }
    }
};

const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
};

export { genPalette, rgbToHex }
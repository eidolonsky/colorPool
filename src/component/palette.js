import { copyColor } from "./utils.js";

const genPalette = (c) => {
    for (let i = 0; i < 5; i++) {
        // console.log(c[i][0])
        let regexNum = /^\d+$/;
        if (regexNum.test(c[i][0])) {
            let hex = ("000000" + rgbToHex(c[i][0], c[i][1], c[i][2])).slice(-6).toUpperCase();
            console.log(`<div class="palette-box flex" style="background-color: #${hex};"><p>#${hex}</p></div>`)
            $("#palette").append(
                    `<div class="palette-box flex" style="background-color: #${hex};"><p>#${hex}</p></div>`
                )
                .css("width", $("#canvas").width());
        }
    }
    $(".palette-box p").click((e) => {
        let that = e.currentTarget;
        copyColor(that)
        $("#copyAlert2").remove()

        $(that).hide()
        $(that).parent().append("<p id='copyAlert2'>Copied!</p>")

        setTimeout(() => {
            $("#copyAlert2").remove()
            $(that).show()
        }, 500)
    })
};

const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
};

export { genPalette, rgbToHex }
import { copyColor, rgbToHex } from "./utils.js";

const genPalette = (c) => {
    for (let i = 0; i < 5; i++) {
        let regexNum = /^\d+$/;
        if (regexNum.test(c[i][0])) {
            let hex = rgbToHex(c[i]).toUpperCase();
            if (c[i][3] === 255) {
                hex = hex.slice(0, -2)
            }
            $("#palette").append(
                    `<div class="palette-box flex" style="background-color: #${hex};"><p>#${hex}</p></div>`
                )
                .css("width", $("#canvas").width() >= $("#canvas").height() ? $("#canvas").width() : "100%");
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

export { genPalette }
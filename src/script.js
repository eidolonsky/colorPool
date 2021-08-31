import { kMeans } from "./component/kmeans.js"
import { genPalette, rgbToHex } from "./component/palette.js"
import { drawZoom, findPos, windowToCanvas } from "./component/zoom.js"
import { styleRestore, copyColor, genChart } from "./component/utils.js"

let drag = $("#image")[0];
let data = [],
    file;

drag.addEventListener("dragenter", (e) => {
    e.preventDefault();
})

drag.addEventListener("dragover", (e) => {
    e.preventDefault();
    $("#image")
        .css("background-color", "#0195E630")
        .css("border", "10px dashed #0195E6");
    $("#image label").css("color", "#0195E6")
})

drag.addEventListener("dragleave", (e) => {
    e.preventDefault();
    $("#image")
        .css("background-color", "rgb(255, 255, 255, 0.85)")
        .css("border", "none");
    $("#image label").css("color", "rgb(179, 178, 178)")
})

drag.addEventListener("drop", (e) => {
    e.preventDefault();
    $("#image")
        .css("background-color", "rgb(255, 255, 255, 0.85)")
        .css("border", "none");
    $("#image label").css("color", "rgb(179, 178, 178)")
    file = Array.from(e.dataTransfer.files)[0];
    loadFile(file);
})

$("#file-input").change((e) => {
    file = e.target.files[0];
    loadFile(file);
});

const loadFile = (d) => {
    $(".canvas-container").css("grid", "'image chart' 'intro intro'");
    $("#chart").css("grid-area", "chart");

    let reader = new FileReader();
    reader.onload = (e) => {
        fileOnload(e)
            .then((d) => {
                genPalette(kMeans(d))
            })
            .then(() => { genChart(data) })
    };
    reader.readAsDataURL(d);
}

let canvas = $("#canvas")[0],
    ctx = canvas.getContext("2d");

const fileOnload = (e) => {

    return new Promise((resolve, reject) => {
        if (e) {
            styleRestore();
            let $img = $("<img>", { src: e.target.result });
            $img.on("load", (e) => {
                let w,
                    h,
                    cLength = Math.floor($(window).height() / 200) * 100,
                    cwidth = cLength > 550 ? 550 : cLength,
                    cheight = cLength > 550 ? 550 : cLength,
                    scale = 5,
                    img = e.currentTarget,
                    cPoint = {};

                console.log(cLength)

                if (img.naturalWidth / img.naturalHeight >= 1) {
                    w = cwidth;
                    h = (img.naturalHeight / img.naturalWidth) * cwidth;
                } else {
                    h = cheight;
                    w = (img.naturalWidth / img.naturalHeight) * cheight;
                }
                canvas.width = w / scale;
                canvas.height = h / scale;
                ctx.drawImage(img, 0, 0, w / scale, h / scale);

                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let oData = imgData.data;

                ctx.clearRect(0, 0, w / scale, h / scale)
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h)

                data = []
                for (let i = 0; i < oData.length; i = i + 4) {
                    data.push(oData.slice(i, i + 3));
                }

                setTimeout(() => {
                    resolve(data);
                }, 0);

                $("#canvas").click((e) => {
                    let pos = findPos(e.currentTarget);
                    let x = e.pageX - pos.x;
                    let y = e.pageY - pos.y;

                    let iData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    let tData = iData.data;
                    let i = (y * iData.width + x) * 4;

                    let hex = (
                        "000000" + rgbToHex(tData[i], tData[i + 1], tData[i + 2])
                    ).slice(-6);

                    $("#output")
                        .html(
                            `<p>
                                <span id="hex" title="Click to copy">
                                    HEX: #${hex.toUpperCase()}
                                </span>
                                </br>
                                <span id="rgb" title="Click to copy">
                                    RGB: ${tData[i]}, ${tData[i + 1]}, ${tData[i + 2]}
                                </span>
                            </p>`
                        )
                        .css("background-color", "#" + hex)
                        .css("color", "white")
                        .css("text-shadow", "-1px 0 rgb(0, 0, 0), 0 1px rgb(0, 0, 0), 1px 0 rgb(0, 0, 0), 0 -1px rgb(0, 0, 0)");

                    $("#hex, #rgb").click((e) => {
                        copyColor(e.currentTarget)

                        $("#output p").hide()
                        $("#output").append("<p id='copyAlert'>Copied!</p>")

                        setTimeout(() => {
                            $("#copyAlert").remove()
                            $("#output p").show()
                        }, 500)
                    })
                });

                let zscale = 2;

                $("#canvas").mousewheel((e) => {
                    e.preventDefault();

                    zscale += e.deltaY * -0.5;

                    zscale = Math.min(Math.max(1.05, zscale), 10);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, w, h);

                    drawZoom(cPoint, ctx, zscale);
                })

                $("#canvas").mousemove((e) => {
                    cPoint = windowToCanvas(e.clientX, e.clientY);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, w, h);

                    drawZoom(cPoint, ctx, zscale);
                });
            });
        } else reject("Image Error");
    });
};
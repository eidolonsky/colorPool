import { kMeans } from "./component/kmeans.js"
import { genPalette, rgbToHex } from "./component/palette.js"
import { drawZoom, findPos, windowToCanvas } from "./component/zoom.js"
import { Chart } from "./component/chart/chart.js"

let drag = $("#image")[0];
let data = [],
    file;

drag.addEventListener("dragenter", (e) => {
    e.preventDefault();
})

drag.addEventListener("dragover", (e) => {
    e.preventDefault();
    $("#image")
        .css("border-color", "#0195E6")
        .css("background-color", "#0195E620");
})

drag.addEventListener("dragleave", (e) => {
    e.preventDefault();
    $("#image")
        .css("border-color", "rgba(99, 87, 87, 0.3)")
        .css("background-color", "#ffffff");
})

drag.addEventListener("drop", (e) => {
    e.preventDefault();
    $("#image")
        .css("border-color", "rgba(99, 87, 87, 0.3)")
        .css("background-color", "#ffffff");
    file = Array.from(e.dataTransfer.files)[0];
    loadFile(file);
})

$("#file-input").change(function(e) {
    file = e.target.files[0];
    loadFile(file);
});

const loadFile = (d) => {
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

const styleRestore = () => {
    $("#palette").empty();

    $("#image p").hide();

    $("#output")
        .html("colorPool")
        .css("background-color", "white")
        .css("color", "rgb(100, 185, 255)");

    if ($("#chartCanvas").length) {
        $("#chart").empty()
        $("#chart").hide()
    }
}

let canvas = $("#canvas")[0],
    ctx = canvas.getContext("2d");

const fileOnload = (e) => {

    return new Promise((resolve, reject) => {
        if (e) {
            styleRestore();
            let $img = $("<img>", { src: e.target.result });
            $img.on("load", function() {
                let w,
                    h,
                    cLength = Math.floor($(window).height() / 200) * 100,
                    cwidth = cLength > 500 ? 500 : cLength,
                    cheight = cLength > 500 ? 500 : cLength,
                    scale = 10,
                    img = this,
                    cPoint = {};
                if (this.naturalWidth / this.naturalHeight >= 1) {
                    w = cwidth;
                    h = (this.naturalHeight / this.naturalWidth) * cwidth;
                } else {
                    h = cheight;
                    w = (this.naturalWidth / this.naturalHeight) * cheight;
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

                $("#canvas").click(function(e) {
                    let pos = findPos(this);

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


                    // $("#hex").click((e) => {
                    //     console.log("called", e.currentTarget)
                    //     copyColor(e.currentTarget)

                    //     $("#output p").hide().add("<p id='copyAlert'>Copied!</p>")

                    //     setTimeout(() => {
                    //         $("#copyAlert").remove()
                    //         $("#output p").show()
                    //     }, 1000)
                    // })
                    $("#hex, #rgb").click((e) => {
                        console.log("called", e.currentTarget)
                        copyColor(e.currentTarget)

                        $("#output p").hide()
                        $("#output").append("<p id='copyAlert'>Copied!</p>")

                        setTimeout(() => {
                            $("#copyAlert").remove()
                            $("#output p").show()
                        }, 500)
                    })
                });

                $("#canvas").mousemove(function(e) {
                    let pos = findPos(this);
                    let x = e.pageX - pos.x;
                    let y = e.pageY - pos.y;
                    cPoint = windowToCanvas(e.clientX, e.clientY);
                    // var cPoint = { x: x, y: y };
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, w, h);
                    // calORect(cPoint);
                    drawZoom(cPoint, ctx);
                });
            });
        } else reject("Image Error");
    });
};

const genChart = (data) => {
    const container = $('#chart')[0];
    const chart = new Chart(container, data);
    $("#chart")
        .css("display", "flex")
        .css("background", "-webkit-linear-gradient( #676767 0%, #000000bb 70%, #434343 100%)")
    chart.start();
}

const copyColor = (d) => {
    let $temp = $("<textarea>");
    $("body").append($temp);

    let t = $(d).text()

    let reg = /\w{3}:\s/g;
    let tReg = t.replace(reg, "");

    $temp.val(tReg).select()
    document.execCommand("copy");
    $temp.remove();
}
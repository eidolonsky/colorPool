import { kMeans } from "./component/kmeans.js"
import { genPalette, rgbToHex } from "./component/palette.js"
import { drawZoom, findPos, windowToCanvas } from "./component/zoom.js"
import { genChart } from "./component/chart.js"

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
        $("#chart").hide();
        $("#image p").hide();
        $("#image")
            .css("border-color", "rgba(99, 87, 87, 0.3)")
            .css("background-color", "#ffffff");
        $("#output")
            .html("Pick Color")
            .css("border-color", "rgba(99, 87, 87, 0.3)");
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
                    cwidth = 450,
                    cheight = 300,
                    img = this,
                    cPoint = {};
                if (this.naturalWidth / this.naturalHeight >= 1) {
                    w = cwidth;
                    h = (this.naturalHeight / this.naturalWidth) * cwidth;
                } else {
                    h = cheight;
                    w = (this.naturalWidth / this.naturalHeight) * cheight;
                }
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);

                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let oData = imgData.data;

                // console.log(oData.slice(0, 3))
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

                    let i = (y * imgData.width + x) * 4;
                    let hex = (
                        "000000" + rgbToHex(oData[i], oData[i + 1], oData[i + 2])
                    ).slice(-6);
                    $("#output")
                        .html(
                            "<p>HEX: #" +
                            hex.toUpperCase() +
                            "</br>" +
                            "RGB: " +
                            oData[i] +
                            "," +
                            oData[i + 1] +
                            "," +
                            oData[i + 2] +
                            "</p>"
                        )
                        .css("border-color", "#" + hex);
                    $("#image")
                        .css("border-color", "#" + hex);
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
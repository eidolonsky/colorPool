import { kMeans } from "./component/kmeans.js"
import { genPalette, rgbToHex } from "./component/palette.js"
import { drawZoom, calORect, findPos } from "./component/zoom.js"
import { genChart } from "./component/chart.js"

$("#file-input").change(function(e) {
    $("#palette").empty();
    $("#chart").hide()
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        fileOnload(e)
            .then((d) => {
                genPalette(kMeans(d))
            })
            .then(() => { genChart(data) })
    };
    reader.readAsDataURL(file);
});

let data = [];

let canvas = $("#canvas")[0],
    ctx = canvas.getContext("2d");

const fileOnload = (e) => {
    return new Promise((resolve, reject) => {
        if (e) {
            let $img = $("<img>", { src: e.target.result });
            $img.on("load", function() {
                let w,
                    h,
                    csize = 450,
                    img = this,
                    cPoint = {};
                if (this.naturalWidth / this.naturalHeight >= 1) {
                    w = csize;
                    h = (this.naturalHeight / this.naturalWidth) * csize;
                } else {
                    h = csize;
                    w = (this.naturalWidth / this.naturalHeight) * csize;
                }
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);

                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let oData = imgData.data;

                // console.log(oData.slice(0, 3))

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
                });

                $("#canvas").mousemove(function(e) {
                    let pos = findPos(this);
                    let x = e.pageX - pos.x;
                    let y = e.pageY - pos.y;

                    cPoint = { x: x, y: y };
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, w, h);
                    calORect(cPoint);
                    drawZoom(cPoint, ctx);
                });
            });
        } else reject("Image Error");
    });
};
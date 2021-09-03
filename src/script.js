import { fileOnload } from "./component/loadFile.js"
import { kMeans } from "./component/kmeans.js"
import { genPalette } from "./component/palette.js"
import { genChart } from "./component/utils.js"

let drag = $("#image")[0],
    file;

drag.addEventListener("dragenter", (e) => {
    e.preventDefault();
})

drag.addEventListener("dragover", (e) => {
    e.preventDefault();
    $("#image")
        .css("background-color", "rgb(1, 149, 230, 0.85)")
        .css("border", "10px dashed rgb(1, 149, 230)");
    $("#image label").css("color", "rgb(1, 149, 230)")
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

    const isImage = (file) => file['type'].includes('image');

    if (file.isImage) {
        loadFile(file)
    } else alert("Please upload an image file.");
})

$("#file-input").change((e) => {
    file = e.target.files[0];
    loadFile(file);
});

const loadFile = (d) => {
    if ($("#media-check").is(':visible')) {
        $(".canvas-container").css("grid", "'image' 'chart' 'intro'");
    } else {
        $(".canvas-container").css("grid", "'image chart' 'intro intro'");
    }

    $("#chart").css("grid-area", "chart");

    let reader = new FileReader();
    reader.onload = (e) => {
        fileOnload(e)
            .then((d) => {
                genPalette(kMeans(d))
                genChart(d)
            })
            // .then((d) => {  })
    };
    reader.readAsDataURL(d);
}
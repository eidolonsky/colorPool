import { Chart } from "./chart/chart.js"

const styleRestore = () => {
    $("#palette").empty();

    $("#image p, #image label").hide();

    $("#chart").css("display", "flex")

    $("#output")
        .html("colorPool")
        .css("background-color", "white")
        .css("color", "rgb(57, 136, 255)")
        .css("text-shadow", "-1px 0 rgb(57, 136, 255, 0.5), 0 1px rgb(57, 136, 255, 0.5), 1px 0 rgb(57, 136, 255, 0.5), 0 -1px rgb(57, 136, 255, 0.5)");

    if ($("#chartCanvas").length) {
        $("#chart").empty()
        $("#chart").hide()
    }
}

const copyColor = (d) => {
    let $temp = $("<textarea>");
    $("body").append($temp);

    let t = $(d).text()

    let reg = /\w{3}:\s/g;
    let tReg = t.replace(reg, "").replace("#", "");

    $temp.val(tReg).select()
    document.execCommand("copy");
    $temp.remove();
}

const genChart = (d) => {
    $("#chart")
        .css("display", "flex")
        .css("background", "-webkit-linear-gradient( #676767 0%, #000000 70%, #434343 100%)");
    const container = $('#chart')[0];
    const chart = new Chart(container, d);

    chart.start();
}

const rgbToHex = (rgba) => {
    return rgba.map(
            (x) => x.toString(16).length === 1 ? ("0" + x.toString(16)) : x.toString(16))
        .reduce((x, y) => (x + y));
};

export { styleRestore, copyColor, genChart, rgbToHex }
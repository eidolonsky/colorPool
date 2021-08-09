var centroids = []
    // var data = [];
$("#file-input").change(function(e) {
    var file = e.target.files[0]
    var reader = new FileReader();
    reader.onload = fileOnload;
    reader.readAsDataURL(file);
    // console.log('d1: ' + fileOnload())
    // kMeans(data)
});

var canvas = $("#canvas")[0];
var context = canvas.getContext("2d");

function fileOnload(e) {

    var $img = $("<img>", { src: e.target.result });
    $img.on("load", function() {
        var w, h, csize = 500;

        if (this.naturalWidth / this.naturalHeight >= 1) {
            w = csize;
            h = (this.naturalHeight / this.naturalWidth) * csize;
        } else {
            h = csize;
            w = (this.naturalWidth / this.naturalHeight) * csize;
        }
        canvas.width = w;
        canvas.height = h;
        context.drawImage(this, 0, 0, w, h);
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var oData = imgData.data;
        console.log(oData.slice(0, 3))
        console.log(typeof oData.slice(0, 3))
        var data = [];
        for (var i = 0; i < oData.length; i = i + 4) {
            data.push(oData.slice(i, i + 3))
        }
        console.log('d0: ' + data[0])
        console.log(typeof data[0])
        $("#canvas").on("click", function(e) {
            var pos = findPos(this);
            var x = e.pageX - pos.x;
            var y = e.pageY - pos.y;

            // show color in hex & rgb
            var i = (y * imgData.width + x) * 4
            var hex = ("000000" + rgbToHex(oData[i], oData[i + 1], oData[i + 2])).slice(-6)
            $('#output').html("<p>HEX: #" + hex + "</br>" + "RGB: " + oData[i] + "," + oData[i + 1] + "," + oData[i + 2] + "</p>").css("background-color", "#" + hex)
        })

        $("#palette-container").empty()
        console.log(data)
        kMeans(data)
        genPalette(centroids)
    });
}

function findPos(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

// function kMeans(data, k = 5) {
//     var means = [];
//     var assignments = [];
//     var dataExtremes;
//     var dataRange;

//     function kmeans() {

//         dataExtremes = getDataExtremes(data);
//         dataRange = getDataRanges(dataExtremes);
//         means = initMeans(k);

//         makeAssignments();
//         run()
//         console.log(colorArr.toString())

//     }

//     function getDataRanges(extremes) {
//         var ranges = [];

//         for (var dimension in extremes) {
//             ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
//         }
//         console.log("ranges: " + ranges)
//         return ranges;
//     }

//     function getDataExtremes(data) {

//         var extremes = [];

//         for (var i in data) {
//             var point = data[i];
//             for (var dimension in point) {
//                 if (!extremes[dimension]) {
//                     extremes[dimension] = { min: 1000, max: 0 };
//                 }

//                 if (point[dimension] < extremes[dimension].min) {
//                     extremes[dimension].min = point[dimension];
//                 }

//                 if (point[dimension] > extremes[dimension].max) {
//                     extremes[dimension].max = point[dimension];
//                 }
//             }
//         }
//         console.log("extremes: " + extremes)
//         return extremes;

//     }

//     function initMeans(k) {

//         while (k--) {
//             var mean = [];

//             for (var dimension in dataExtremes) {
//                 mean[dimension] = dataExtremes[dimension].min + (Math.random() * dataRange[dimension]);
//             }

//             means.push(mean);
//         }
//         console.log("means: " + means)
//         return means;

//     };

//     function makeAssignments() {

//         for (var i in data) {
//             var point = data[i];
//             var distances = [];

//             for (var j in means) {
//                 var mean = means[j];
//                 var sum = 0;

//                 for (var dimension in point) {
//                     var difference = point[dimension] - mean[dimension];
//                     difference *= difference;
//                     sum += difference;
//                 }

//                 distances[j] = Math.sqrt(sum);
//             }

//             assignments[i] = distances.indexOf(Math.min.apply(null, distances));
//         }

//     }

//     function moveMeans() {

//         makeAssignments();

//         var sums = Array(means.length);
//         var counts = Array(means.length);
//         var moved = false;

//         for (var j in means) {
//             counts[j] = 0;
//             sums[j] = Array(means[j].length);
//             for (var dimension in means[j]) {
//                 sums[j][dimension] = 0;
//             }
//         }

//         for (var point_index in assignments) {
//             var mean_index = assignments[point_index];
//             var point = data[point_index];
//             var mean = means[mean_index];

//             counts[mean_index]++;

//             for (var dimension in mean) {
//                 sums[mean_index][dimension] += point[dimension];
//             }
//         }

//         for (var mean_index in sums) {
//             // console.log(counts[mean_index]);
//             if (0 === counts[mean_index]) {
//                 sums[mean_index] = means[mean_index];
//                 console.log("Mean with no points");
//                 console.log(sums[mean_index]);

//                 for (var dimension in dataExtremes) {
//                     sums[mean_index][dimension] = dataExtremes[dimension].min + (Math.random() * dataRange[dimension]);
//                 }
//                 continue;
//             }

//             for (var dimension in sums[mean_index]) {
//                 sums[mean_index][dimension] /= counts[mean_index];
//             }
//         }

//         if (means.toString() !== sums.toString()) {
//             moved = true;
//         }

//         means = sums;
//         return moved;

//     }

//     function run() {
//         var x, y, z;
//         var moved = moveMeans();

//         if (moved) {
//             run()
//         } else {
//             colorArr = []
//             for (var i in means) {
//                 var point = means[i];
//                 colorArr.push(point.map(x => Math.round(x) > 255 ? 255 : Math.round(x)))
//                 x = point[0];
//                 y = point[1];
//                 z = point[2];
//                 console.log(`!!!: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}`)
//             }
//         }

//     }

//     kmeans();
// }

const kMeans = (data, k = 5) => {
    const cent = [
        [0, 0, 0],
        [51, 51, 51],
        [105, 105, 105],
        [156, 156, 156],
        [255, 255, 255]
    ];
    const distances = Array.from({ length: data.length }, () =>
        Array.from({ length: k }, () => 0)
    );
    const classes = Array.from({ length: data.length }, () => -1);
    let itr = true;

    while (itr) {
        itr = false;

        for (let d in data) {
            for (let c = 0; c < k; c++) {
                distances[d][c] = Math.hypot(
                    ...Object.keys(data[0]).map(key => data[d][key] - cent[c][key])
                );
            }
            const m = distances[d].indexOf(Math.min(...distances[d]));
            if (classes[d] !== m) itr = true;
            classes[d] = m;
        }

        for (let c = 0; c < k; c++) {
            centroids[c] = Array.from({ length: data[0].length }, () => 0);
            const size = data.reduce((acc, _, d) => {
                if (classes[d] === c) {
                    acc++;
                    for (let i in data[0]) {
                        centroids[c][i] += data[d][i]
                    };
                }
                return acc;
            }, 0);
            console.log(size)
            for (let i in data[0]) {
                centroids[c][i] = Math.round(Number(centroids[c][i] / size));
            }
        }

    }
    centroids.forEach(x => x > 255 ? 255 : x)
        // document.write(centroids[0] + '</br>' + centroids)
    console.log(centroids)
};
const genPalette = (c) => {
    for (var i = 0; i < 5; i++) {
        console.log(c[i][0])
        if (/^\d+$/.test(c[i][0])) {
            var hex = ("000000" + rgbToHex(c[i][0], c[i][1], c[i][2])).slice(-6)
            $("#palette-container").append('<div class="palette-box" style="background-color:' + '#' + hex + '; border-color:' + '#' + hex + 30 + ';"/></div>')
        }
    }
}
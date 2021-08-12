var centroids = [];
$("#file-input").change(function(e) {
    $("#palette").empty()
    var file = e.target.files[0]
    var reader = new FileReader();
    reader.onload = (e) => {
        fileOnload(e).then((d) => {
            console.log(d)
            kMeans(d)
            genPalette(centroids)
        })
    };
    reader.readAsDataURL(file);
});

var canvas = $("#canvas")[0];
var context = canvas.getContext("2d");

const fileOnload = (e) => {
    return new Promise((resolve, reject) => {
        if (e) {
            var $img = $("<img>", { src: e.target.result });
            $img.on("load", function() {
                var w, h, csize = 300;

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
                var data = [];
                for (var i = 0; i < oData.length; i = i + 4) {
                    data.push(oData.slice(i, i + 3))
                }

                setTimeout(() => {
                    resolve(data)
                }, 0)


                $("#canvas").on("click", function(e) {
                    var pos = findPos(this);
                    var x = e.pageX - pos.x;
                    var y = e.pageY - pos.y;

                    // show color in hex & rgb
                    var i = (y * imgData.width + x) * 4
                    var hex = ("000000" + rgbToHex(oData[i], oData[i + 1], oData[i + 2])).slice(-6)
                    $('#output').html("<p>HEX: #" + hex.toUpperCase() + "</br>" + "RGB: " + oData[i] + "," + oData[i + 1] + "," + oData[i + 2] + "</p>").css("background-color", "#" + hex)
                })
            });
        } else reject('Image Error')
    })
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

const kMeans = (data, k = 5) => {
    let l = data.length;
    let sData = sortRGB(data)
    let cent = [];
    for (var i = 0; i < k; i++) {
        cent.push(sData[(l * i * 2 + l) / k / 2])
    }
    console.log(cent)

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

            for (let i in data[0]) {
                centroids[c][i] = Math.round(Number(centroids[c][i] / size));
                console.log(centroids[c][i])
            }
        }

    }
    centroids.forEach(x => x > 255 ? 255 : x)
    console.log(centroids)
    return centroids;
};
const genPalette = (c) => {
    for (var i = 0; i < 5; i++) {
        console.log(c[i][0])
        var regexNum = /^\d+$/;
        if (regexNum.test(c[i][0])) {
            var hex = ("000000" + rgbToHex(c[i][0], c[i][1], c[i][2])).slice(-6)
            $("#palette").append('<div class="palette-box" style="background-color:' + '#' + hex + '; border-color:' + '#' + hex + 30 + ';"/>' + '#' + hex.toUpperCase() + '</div>')
        }
    }
}

const rgbToHsl = (c) => {
    var r = c[0] / 255,
        g = c[1] / 255,
        b = c[2] / 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return new Array(h * 360, s * 100, l * 100);
}

const sortRGB = (d) => {
    return d.map(function(c, i) {
        return { color: rgbToHsl(c), index: i };
    }).sort(function(c1, c2) {
        return c1.color[0] - c2.color[0];
    }).map(function(t) {
        return d[t.index];
    });
}
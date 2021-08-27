let centroids = []

const kMeans = (data, k = 5) => {
    let l = data.length;
    let sData = sortRGB(data);
    let cent = [];
    for (let i = 0; i < k; i++) {
        cent.push(sData[(l * i * 2 + l) / k / 2]);
    }
    // console.log(cent)

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
                    ...Object.keys(data[0]).map((key) => data[d][key] - cent[c][key])
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
                        centroids[c][i] += data[d][i];
                    }
                }
                return acc;
            }, 0);

            for (let i in data[0]) {
                centroids[c][i] = Math.round(Number(centroids[c][i] / size));
                // console.log(centroids[c][i])
            }
        }
    }
    centroids.forEach((x) => (x > 255 ? 255 : x));
    // console.log(centroids)
    return centroids;
};

const rgbToHsl = (c) => {
    let r = c[0] / 255,
        g = c[1] / 255,
        b = c[2] / 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
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
};

const sortRGB = (d) => {
    return d
        .map((c, i) => {
            return { color: rgbToHsl(c), index: i };
        })
        .sort((c1, c2) => {
            return c1.color[0] - c2.color[0];
        })
        .map((t) => {
            return d[t.index];
        });
};

export { kMeans }
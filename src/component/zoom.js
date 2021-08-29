// http://www.zhangjikai.com/demo/html5-magnifying-glass/image.html

let oRadius = 50,
    oRect = {},
    scaleZoom;

const drawZoom = (d, ctx, scale) => {
    oRect.x = d.x - oRadius;
    oRect.y = d.y - oRadius;
    oRect.width = oRadius * 2;
    oRect.height = oRadius * 2;

    scaleZoom = {
        x: d.x - oRect.width * scale / 2,
        y: d.y - oRect.height * scale / 2,
        width: oRect.width * scale,
        height: oRect.height * scale
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(d.x, d.y, oRadius, 0, Math.PI * 2, false);
    ctx.clip();

    ctx.drawImage(
        canvas,
        oRect.x,
        oRect.y,
        oRect.width,
        oRect.height,
        scaleZoom.x,
        scaleZoom.y,
        scaleZoom.width,
        scaleZoom.height
    )

    ctx.restore();
}

const windowToCanvas = (x, y) => {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left, y: y - bbox.top }
}

const findPos = (obj) => {
    let curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return { x: curleft, y: curtop };
    }
};


export { drawZoom, findPos, windowToCanvas }
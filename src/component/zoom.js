let
    oRadius = 55,
    oRect = {},
    scale = 5,
    scaleZoom;

const calORect = (point) => {
    oRect.x = point.x - oRadius;
    oRect.y = point.y - oRadius;
    oRect.width = oRadius * 2;
    oRect.height = oRadius * 2;
}

const drawZoom = (d, ctx) => {
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

export { drawZoom, calORect, findPos }
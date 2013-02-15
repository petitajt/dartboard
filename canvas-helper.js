function normalizeAngle(angle) {
    angle %= 2 * Math.PI;
    if(angle < 0)
        angle += 2 * Math.PI;
    return angle;
}

CanvasRenderingContext2D.prototype.textArc = function (str, centerX, centerY, radius, startAngle, endAngle, padLeft, padRight, antiClockWise) {
    if(antiClockWise) {
        endAngle += padLeft;
        endAngle += padRight;
    }
    else {
        endAngle -= padLeft;
        endAngle -= padRight;
    }

    startAngle = normalizeAngle(startAngle);
    endAngle = normalizeAngle(endAngle);

    var angle = 0;

    if(antiClockWise) {
        if(startAngle > endAngle)
            angle = startAngle - endAngle;
        else
            angle = 2*Math.PI - (endAngle - startAngle);
    }
    else {
        if(endAngle > startAngle)
            angle = endAngle - startAngle;
        else
            angle = 2*Math.PI - (startAngle - endAngle);
    }

    var len = str.length;
    this.save();

    this.translate(centerX, centerY);
    this.rotate(Math.PI / 2 + startAngle);

    var mult = 1;
    if(antiClockWise)
        mult = -1;

    this.rotate(mult * angle / (2*len));
    this.rotate(mult * padLeft);

    this.textAlign = "center";
    for(var n = 0; n < len; n++) {
        this.save();
        this.translate(0, -1 * radius);
        this.fillText(str[n], 0, 0);
        this.strokeText(str[n], 0, 0);
        this.restore();
        this.rotate(mult * angle / len);
    }
    this.restore();
};



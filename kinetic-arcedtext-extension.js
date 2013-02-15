(function() {
    Kinetic.ArcedText = function(config) {
        this._initArcedText(config);
    }

    Kinetic.ArcedText.prototype = {
        _initArcedText: function(config) {
            this.setDefaultAttrs({
                space: 3,
                radius: 0,
                start: Math.PI,
                end: 0,
                anti: false,
                stroke: 'transparent',
                strokeWidth: 0,
                fontStyle: 'normal',
                fontSize: '1em',
                fontFamilt: 'sans',
                text: '',
                padLeft: 0,
                padRight: 0,
            });

            Kinetic.Shape.call(this, config);
            this.ShapeType = "ArcedText";
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var ctx = canvas.getContext('2d');
            var fontStyle = this.getFontStyle();
            var fontSize = this.getFontSize();
            var fontFamily = this.getFontFamily();

            ctx.font = fontStyle + " " + fontSize + "px " + fontFamily;
            ctx.fillStyle = this.getFill();
            ctx.strokeStyle = this.getStroke();
            ctx.lineWidth = this.getStrokeWidth();

            ctx.textArc(this.getText(), this.getX(), this.getY(), this.getRadius(), this.getStart(), this.getEnd(), this.getPadLeft(), this.getPadRight(), this.getAnti());
        },
    };
    Kinetic.Global.extend(Kinetic.ArcedText, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.ArcedText, ['radius', 'start', 'end', 'anti', 'space', 'fontStyle', 'fontSize', 'fontFamily', 'text', 'padLeft', 'padRight']);
})()

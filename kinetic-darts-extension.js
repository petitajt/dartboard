(function() {
    Kinetic.DartSlice = function(config) {
        this._initDartSlice(config);
    }

    Kinetic.DartSlice.prototype = {
        _initDartSlice: function(config) {
            this.setDefaultAttrs({
                position: 0,
                state: 0,
            });

            Kinetic.Shape.call(this, config);
            this.ShapeType = "DartSlice";
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var position = this.getPosition() - 1;
            var state = this.getState();
            var angle_rad = 2 * Math.PI / 20;
            var startAngle = normalizeAngle(Math.PI*(1.5) + angle_rad * (position - 1/2));
            var endAngle = normalizeAngle(startAngle + angle_rad);

            var width = 0;
            var radius = 0;
            var W = canvas.width;
            var H = canvas.height;

            switch(state) {
                case 0:
                    width = 20;
                    radius = H/2;
                break;
                case 1:
                    width = H/4 - 50;
                    radius = H/2 - 20;
                break;
                case 2:
                    width = 20;
                    radius = H/4 + 30;
                break;
                case 3:
                    width = H/4 - 30;
                    radius = H/4 + 10;
                break;
            }
            radius -= 25;


            var ctx = canvas.getContext();
            var innerRadius = radius - width;
            var centerX = W/2;
            var centerY = H/2;
            var newX = centerX + (innerRadius)*Math.cos(endAngle);
            var newY = centerY + (innerRadius)*Math.sin(endAngle);

            ctx.beginPath();
            // outer arc
            ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);

            // right border
            ctx.lineTo(newX, newY);
            // inner arc
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);

            ctx.closePath();
            canvas.fillStroke(this);
        },
    };
    Kinetic.Global.extend(Kinetic.DartSlice, Kinetic.Shape);
    Kinetic.Node.addGettersSetters(Kinetic.DartSlice, ['position', 'state']);

    Kinetic.DartRing = function(config) {
        this._initDartRing(config);
    }

    Kinetic.DartRing.prototype = {
        _initDartRing: function(config) {
            Kinetic.DartSlice.call(this, config);
            this.ShapeType = "DartRing";
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var position = this.getPosition();
            var state = this.getState();
            var startAngle = 0;
            var endAngle = 2 * Math.PI;

            var width = 20;
            var radius = 40;
            var innerRadius = radius - width;
            var centerX = canvas.width/2;
            var centerY = canvas.height/2;

            var ctx = canvas.getContext();
            ctx.save();

            if(state == 1) {
                ctx.beginPath();
                // outer circle
                ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
                canvas.fillStroke(this);
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = "#000000";

                // inner circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle, false);
                ctx.fill();
                ctx.restore();
            }
            else {
                ctx.beginPath();
                ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle, false);
                canvas.fillStroke(this);
            }
        },
    };
    Kinetic.Global.extend(Kinetic.DartRing, Kinetic.DartSlice);

})()

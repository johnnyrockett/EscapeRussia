/*
* I need to store points, walls, and places where textures will go
* I'll need to be able to calculate the intersection with walls
* This probably means that I'll need the equation of the wall.
*/

function Structure(coords, synthetic) {
    this.color = 0xFFFFFF;

    this.coords = [];
    this.walls = [];
    var wallIndex = 0;
    for (var coord of coords) {
        this.coords.push(coord[0] == undefined ? coord : new Vector(coord[0], coord[1]));
        if (wallIndex != coords.length-1) {
            this.walls.push([wallIndex, ++wallIndex]);
        } else this.walls.push([coords.length-1, 0]);
    }

    if (!synthetic) {
        this.wallNormals = [];
        for (var wall of this.walls) {
            var p1 = this.coords[wall[0]];
            var p2 = this.coords[wall[1]];
            this.wallNormals.push(Vector.subtract(p2, p1).rotate(Math.PI/2).normalize());
        }
        this.pointNormals = [];
        for (var i=0; i < this.walls.length; i++) {
            for (var wall of this.walls[i]) {
                if (this.pointNormals[wall] == undefined) {
                    this.pointNormals[wall] = [];
                }
                this.pointNormals[wall].push(this.wallNormals[i]);
            }
        }
        var total = new Vector(0, 0);
        for (var coord of this.coords) {
            total.add(coord);
        }
        total.divide(this.coords.length);
        this.addOffset(total.negative());
    }
}

Structure.prototype = {
	toGraphic: function() {
        this.graphic = new PIXI.Graphics();
        this.graphic.position = player.position;
        // this.graphic.position.x = this.offset.x;
        // this.graphic.position.y = this.offset.y;
        return this.graphic;
    },
    animate: function() {
        this.graphic.clear();
        this.graphic.beginFill(this.color, 1.0);
        this.graphic.lineStyle(0, this.color, 1.0);
        var path = [];
        for (var point of this.coords) {
            point.print(path);
        }

        // container.mask = this.graphic;
        this.graphic.drawPolygon(path);
        this.graphic.endFill();
    },
    getPath: function() {
        return this.coords;
    },
    getInstance: function(x, y) {
        offset = new Vector(x, y);
        var clonePoints = [];
        for (var point of this.coords) {
            clonePoints.push(Vector.add(point, offset));
        }
        var clone = new Structure(clonePoints, true);
        clone.color = this.color;
        clone.offset = new Vector(0, 0);
        clone.wallNormals = this.wallNormals;
        clone.pointNormals = this.pointNormals;
        return clone;
    },
    addOffset: function(x, y) {
        if (x != 0 || y != 0) {
            var offset = new Vector(x, y);
            if (this.offset != undefined)
                this.offset.add(offset);
            for (var coord of this.coords) {
                coord.add(offset);
            }
        }
    },
    reset: function() {
        if (this.offset != undefined) {
            var resetOffset = this.offset.negative();
            this.addOffset(resetOffset.x, resetOffset.y);
            this.offset = new Vector(0, 0);
        }
    },
    getIntersection: function (point, perspective) {
        // var newPoint = null;
        for (var w=0; w < this.walls.length; w++) {
            var wall = this.walls[w];

            var p1 = Vector.add(perspective, this.coords[wall[0]]);
            var p2 = Vector.add(perspective, this.coords[wall[1]]);
            var x1 = 0, y1 = 0, x2 = point.x, y2 = point.y, x3 = p1.x, y3 = p1.y, x4 = p2.x, y4 = p2.y;

            denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

            // Lines are parallel
            if (denominator === 0) {
                continue;
            }

            let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
            let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

            // is the intersection along the segments
            var tolerance = 0; // 0.000000001;
            if (ua < tolerance || ua > 1 - tolerance || ub < tolerance || ub > 1 - tolerance) {
                continue;
            }

            // Return a object with the x and y coordinates of the intersection
            var x = x1 + ua * (x2 - x1);
            var y = y1 + ua * (y2 - y1);
            if (point.edgePoint != undefined && point.edgePoint.equals(x, y, 0.0001)) {
                // console.log(point.edgePoint);
                continue;
            }
            point.set(x, y);
            // newPoint = new Vector(x, y);
        }
        // console.log(closest);
        return point;
    }
}

function slope(x1, y1, x2, y2) {
        if (x1 == x2) return false;
        return (y1 - y2) / (x1 - x2);
}
function yInt(x1, y1, x2, y2) {
        if (x1 === x2) return y1 === 0 ? 0 : false;
        if (y1 === y2) return y1;
        return y1 - this.slope(x1, y1, x2, y2) * x1 ;
}
function getXInt(x1, y1, x2, y2) {
        var slope;
        if (y1 === y2) return x1 == 0 ? 0 : false;
        if (x1 === x2) return x1;
        return (-1 * ((slope = this.slope(x1, y1, x2, y2)) * x1 - y1)) / slope;
}

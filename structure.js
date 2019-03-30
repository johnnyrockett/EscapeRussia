/*
* I need to store points, walls, and places where textures will go
* I'll need to be able to calculate the intersection with walls
* This probably means that I'll need the equation of the wall.
*/

function Structure(coords, walls, normals) {
    this.coords = coords;
    this.walls = walls;
    if (normals != undefined)
    {
        this.normals = [];
        for (var i=0; i < this.walls.length; i++) {
            for (var wall of this.walls[i]) {
                if (this.normals[wall] == undefined) {
                    this.normals[wall] = [];
                }
                this.normals[wall].push(new Vector(normals[i][0], normals[i][1]));
            }
        }
        // var total = new Vector(0, 0);
        // for (var coord of this.coords) {
        //     total.add(coord);
        // }
        // total.divide(this.coords.length);
        // this.addOffset(total.negative());
    }
}

Structure.prototype = {
	toGraphic: function(position) {
        this.graphic = new PIXI.Graphics();
        // this.graphic.position = position;
        return this.graphic;
    },
    animate: function() {
        this.graphic.clear();
        this.graphic.beginFill(0xFFFFFF, 1.0);
        this.graphic.lineStyle(0, 0xFFFFFF, 1.0);
        var path = [];
        for (var point of this.coords) {
            point.print(path);
        }

        this.graphic.drawPolygon(path);
        this.graphic.endFill();
    },
    getInstance: function(x, y) {
        var offset = new Vector(x, y);
        var clonePoints = [];
        for (var point of this.coords) {
            clonePoints.push(Vector.add(point, offset));
        }
        var clone = new Structure(clonePoints, this.walls);
        clone.normals = this.normals;
        return clone;
    },
    addOffset: function(x, y) {
        if (x != 0 || y != 0) {
            for (var coord of this.coords) {
                coord.add(new Vector(x, y));
            }
            // console.log(this.coords);
        }
    },
    getIntersection: function (point, perspective) {
        for (var wall of this.walls) {
            var p1 = this.coords[wall[0]];
            var p2 = this.coords[wall[1]];
            var x1 = perspective.x, y1 = perspective.y, x2 = point.x, y2 = point.y, x3 = p1.x, y3 = p1.y, x4 = p2.x, y4 = p2.y;

            denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

            // Lines are parallel
            if (denominator === 0) {
                continue;
            }

            let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
            let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

            // is the intersection along the segments
            var tolerance = 0.0001;
            if (ua <= tolerance || ua >= 1 - tolerance || ub <= tolerance || ub >= 1 - tolerance) {
                continue;
            }

            // Return a object with the x and y coordinates of the intersection
            point.x = x1 + ua * (x2 - x1);
            point.y = y1 + ua * (y2 - y1);
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

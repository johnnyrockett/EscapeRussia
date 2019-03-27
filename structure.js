/*
* I need to store points, walls, and places where textures will go
* I'll need to be able to calculate the intersection with walls
* This probably means that I'll need the equation of the wall.
*/

function Structure(coords, walls) {
    this.coords = coords;
    this.walls = walls;
}

Structure.prototype = {
	toGraphic: function() {
        var graphic = new PIXI.Graphics();
		graphic.beginFill(0xFFFFFF, 1.0);
        graphic.lineStyle(0, 0xFFFFFF, 1.0);
        var path = [];
        for (var point of this.coords) {
            point.print(path);
        }

        graphic.drawPolygon(path);
        graphic.endFill();
        return graphic;
    },
    getIntersection: function (point) {
        for (var wall of this.walls) {
            var p1 = this.coords[wall[0]];
            var p2 = this.coords[wall[1]];
            var x1 = 0, y1 = 0, x2 = point.x, y2 = point.y, x3 = p1.x, y3 = p1.y, x4 = p2.x, y4 = p2.y;

            denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

            // Lines are parallel
            if (denominator === 0) {
                continue;
            }

            let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
            let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

            // is the intersection along the segments
            if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
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
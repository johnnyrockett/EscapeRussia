
var levels = [];

var box = new Structure([[100, 0], [100, 100], [200, 100], [200, 0]]);
var diamond = new Structure([[0, 0], [50, 50], [100, 0], [50, -50]]);
var star = new Structure([[9, 40], [32, 60], [24, 91], [52, 74], [78, 91], [71, 60], [94, 41], [64, 38], [52, 9], [40, 38]]);

levels.push({
    structures: [
        box.getInstance(0, 200),
        box.getInstance(200, 100),
        diamond.getInstance(100, -100),
        star.getInstance(-100, -50),
        star.getInstance(-500, -25)
    ],
    npcs: [

    ]
});
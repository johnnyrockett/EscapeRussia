var levels = [];

var box = new Structure([[100, 0], [100, 100], [200, 100], [200, 0]]);
var diamond = new Structure([[0, 0], [50, 50], [100, 0], [50, -50]]);
var star = new Structure([[9, 40], [32, 60], [24, 91], [52, 74], [78, 91], [71, 60], [94, 41], [64, 38], [52, 9], [40, 38]]);

var wu = 100
var levelMainPart = new Structure([[0,0], [3*wu, 0], [3*wu, 12*wu], [13*wu, 12*wu], [13*wu, 9*wu], [11*wu, 9*wu], [11*wu, 5*wu], [15*wu, 5*wu], [15*wu, 11*wu], [22*wu, 11*wu], [22*wu, 14*wu], [25*wu, 14*wu], [25*wu, 11*wu], [29*wu, 11*wu], [29*wu, 8*wu], [25*wu, 8*wu], [25*wu, 6*wu], [31*wu, 6*wu], [31*wu, 10*wu], [40*wu, 10*wu], [40*wu, 8*wu], [45*wu, 8*wu], [45*wu, -1*wu], [49*wu, -1*wu], [49*wu, -10*wu],[38*wu, -10*wu], [38*wu, -1*wu], [42*wu, -1*wu], [42*wu, 5*wu], [40*wu, 5*wu], [40*wu, 3*wu], [35*wu, 3*wu], [35*wu, -3*wu], [25*wu, -3*wu], [25*wu, -13*wu], [22*wu, -13*wu], [22*wu, -3*wu], [17*wu, -3*wu], [17*wu, -9*wu], [9*wu, -9*wu], [9*wu, -15*wu], [6*wu, -15*wu], [6*wu, -6*wu], [9*wu, -6*wu], [9*wu, -3*wu], [0, -3*wu], [0,0], 
[wu, -wu], [wu, -2*wu], [10*wu, -2*wu], [10*wu, -7*wu], [7*wu, -7*wu], [7*wu, -14*wu], [8*wu, -14*wu], [8*wu, -8*wu], [16*wu, -8*wu], [16*wu, -2*wu], [23*wu, -2*wu], [23*wu, -12*wu], [24*wu, -12*wu], [24*wu, -2*wu], [34*wu, -2*wu], [34*wu, 4*wu], [39*wu, 4*wu], [39*wu, 6*wu], [43*wu, 6*wu], [43*wu, -2*wu], [39*wu, -2*wu], [39*wu, -9*wu], [48*wu, -9*wu], [48*wu, -2*wu], [44*wu, -2*wu], [44*wu, 7*wu], [39*wu, 7*wu], [39*wu, 9*wu], [32*wu, 9*wu], [32*wu, 5*wu], [24*wu, 5*wu], [24*wu, 9*wu], [28*wu, 9*wu], [28*wu, 10*wu], [24*wu, 10*wu], [24*wu, 13*wu], [23*wu, 13*wu], [23*wu, 10*wu], [16*wu, 10*wu], [16*wu, 4*wu], [10*wu, 4*wu], [10*wu, 10*wu], [12*wu, 10*wu], [12*wu, 11*wu], [4*wu, 11*wu], [4*wu, -1*wu], [wu, -1*wu] ]);


var levelLoopUpRight = new Structure([[0,0], [7*wu, 0], [7*wu, -5*wu], [0, -5*wu]]);//, [0,0], [wu, -wu],  [wu, -4*wu],  [6*wu, -4*wu],  [6*wu, -wu], [wu, -wu]]);
var levalLoopRightSideLow = new Structure([[0,0], [5*wu, 0], [5*wu, -3*wu], [0, -3*wu]]);//, [0, 0], [wu, -wu], [wu, -2*wu], [4*wu, -2*wu], [4*wu, -1*wu], [wu, -1*wu]]);
var levelLoopRightSideCenter = new Structure([[0,0], [9*wu, 0], [9*wu, -5*wu], [0, -5*wu]]);//, [0,0], [wu, -wu], [wu, -4*wu], [8*wu, -4*wu], [8*wu, -wu], [wu, -wu]]);
var levelLoopLeftSideSmall = new Structure([[0,0], [4*wu, 0], [4*wu, -5*wu], [0, -5*wu]]);//, [0, 0], [wu, -wu], [wu, -4*wu], [3*wu, -4*wu], [3*wu, -wu], [wu, -wu]]);
var levelLoopLeftSideBig = new Structure([[0,0], [0, 11*wu], [4*wu, 11*wu], [4*wu, 4*wu], [12*wu, 4*wu], [12*wu, 10*wu], [18*wu, 10*wu], [18*wu, 0]]);//, [0, 0], [wu, wu], [17*wu, wu], [17*wu, 9*wu], [13*wu, 9*wu], [13*wu, 3*wu], [3*wu, 3*wu], [3*wu, 10*wu], [wu, 10*wu], [wu, wu]]);

var levelTwoMainPart = new Structure([[0,0], [2*wu, 0], [2*wu, 6*wu], [9*wu, 6*wu], [9*wu, 8*wu], [16*wu, 8*wu], [16*wu, 10*wu], [28*wu, 10*wu], [28*wu, 0], [32*wu, 0], [32*wu, -3*wu], [5*wu, -3*wu], [5*wu, -6*wu], [15*wu, -6*wu], [15*wu, -9*wu], [2*wu, -9*wu], [2*wu, -3*wu], [0, -3*wu], [0, 0], 
    [wu, -wu], [wu, -2*wu], [3*wu, -2*wu], [3*wu, -8*wu], [14*wu, -8*wu], [14*wu, -7*wu], [4*wu, -7*wu], [4*wu, -2*wu], [31*wu, -2*wu], [31*wu, -wu], [27*wu, -wu], [27*wu, 9*wu], [17*wu, 9*wu], [17*wu, 7*wu], [10*wu, 7*wu], [10*wu, 5*wu], [3*wu, 5*wu], [3*wu, -wu], [wu, -wu]]);

var levelTwoSmallLoop = new Structure([[0,0], [0, 5*wu], [6*wu, 5*wu], [6*wu, 3*wu], [14*wu, 3*wu], [14*wu, 0]]);

var levelTwoBigLoop = new Structure([[0, 0], [14*wu, 0], [14*wu, 1*wu], [7*wu, wu], [7*wu, 2*wu], [15*wu, 2*wu], [15*wu, -7*wu], [8*wu, -7*wu], [8*wu, -3*wu], [0, -3*wu]]);

var h = 30;

var v = 20;

var introLoop = new Structure([[0,0], [h*wu, 0], [h*wu, -v*wu], [0, -v*wu], [0, 0,], [wu, -wu], [wu, (-v+1)*wu], [(h-1)*wu, (-v+1)*wu], [(h-1)*wu, -wu], [wu, -wu]]);

function createNPC(x, y, rotation, viewDistance, FOV) {

    // move the sprite to the center of the screen
    var position = {x: x, y: y};

    return {
        position: position,
        rotation: rotation,
        viewDistance: viewDistance,
        FOV: FOV
    };
}
      

function Level(structures, npcs, endGoals) {
    this.structures = structures;
    this.npcs = npcs;
    this.endGoals = endGoals;
}

Level.prototype = {
	getGraphics: function() {
        this.structureElements = [];
        for (var structure of this.structures) {
            var graphic = structure.toGraphic();
            this.structureElements.push(graphic);
        }

        for (var goal of this.endGoals) {
            goal.color = 0x0000FF;
            var graphic = goal.toGraphic();
            this.structureElements.push(graphic);
        }

        this.npcElements = [];
        for (var npc of this.npcs) {

            var npcSprite = new PIXI.Sprite(PIXI.loader.resources.player.texture);
            // center the sprite's anchor point
            npcSprite.anchor.x = 0.5;
            npcSprite.anchor.y = 0.5;

            // move the sprite to the center of the screen
            npcSprite.offset = new Vector(npc.position).negative();

            var position = Vector.add(new Vector(player.position), new Vector(npc.position));
            npcSprite.position.x = position.x;
            npcSprite.position.y = position.y;
            npcSprite.rotation = npc.rotation;

            npcSprite.viewDistance = npc.viewDistance;
            npcSprite.FOV = npc.FOV;

            this.npcElements.push(npcSprite);
        }
        return { structures: this.structureElements, npcs: this.npcElements };
    }
};

levels.push( new Level(
    [
        introLoop.getInstance(0, 0)
    ],

    [

    ],

    [
        star.getInstance(0, -2*wu)
    ])
);

levels.push( new Level(
    [
        levelTwoMainPart.getInstance(9.8*wu, 1.7*wu), 
        levelTwoSmallLoop.getInstance(9*wu, 3.3*wu), 
        levelTwoBigLoop.getInstance(18*wu, 6.2*wu)
    ],

    [
        createNPC(12*wu, -6*wu, Math.PI, 5*wu, Math.PI/2),
        createNPC(16*wu, 4.2*wu, Math.PI, 5*wu, Math.PI/2),
        createNPC(23*wu, 8.2*wu, Math.PI, 4*wu, Math.PI/2),
        createNPC(24.8*wu, 2*wu, 3*Math.PI/2, 4*wu, Math.PI/2),
        createNPC(12*wu, 0, Math.PI, 4*wu, Math.PI/2)
    ],

    [
        star.getInstance(28*wu, 0)
    ])
);

levels.push( new Level(
    [
        levelMainPart.getInstance(0,-10*wu),
        levelLoopUpRight.getInstance(20.15*wu,-17.1*wu),
        levelLoopRightSideCenter.getInstance(5.23*wu,-10*wu),
        levelLoopLeftSideBig.getInstance(-10*wu,-6.2*wu),
        levelLoopLeftSideSmall.getInstance(-10.3*wu, -16*wu),
        levalLoopRightSideLow.getInstance(12*wu,-5*wu)
        
    ],
    [
        createNPC(-2*wu, -2*wu, Math.PI, 2*wu, Math.PI/2),
        createNPC(-1*wu, -13*wu, 0, 2.4*wu, Math.PI/8),
        createNPC(4*wu, -2*wu, Math.PI, 2*wu, Math.PI/4),
        createNPC(1.2*wu, -13*wu, Math.PI, 2.4*wu, Math.PI/8),
        createNPC(-7.75*wu, -14.5*wu, Math.PI/2, 2.4*wu, Math.PI/4),
        createNPC(-16*wu, -23*wu, Math.PI/2, 2.4*wu, Math.PI/4),
        createNPC(-2*wu, -2*wu, Math.PI, 2*wu, Math.PI/2),

        createNPC(-21*wu, -13*wu, 0, 2*wu, Math.PI/2),
        createNPC(-12*wu, -1*wu, Math.PI, 2*wu, Math.PI/2),
        createNPC(11*wu, -7*wu, Math.PI, 2*wu, Math.PI/2),
        createNPC(17*wu, -14*wu, Math.PI, 2*wu, Math.PI/2),
        createNPC(24*wu, -14*wu, Math.PI, 2*wu, Math.PI/2)
    ],
    [
        star.getInstance(0, -22*wu)
    ])
);


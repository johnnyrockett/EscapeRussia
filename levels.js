var levels = [];

var box = new Structure([[100, 0], [100, 100], [200, 100], [200, 0]]);
var diamond = new Structure([[0, 0], [50, 50], [100, 0], [50, -50]]);
var star = new Structure([[9, 40], [32, 60], [24, 91], [52, 74], [78, 91], [71, 60], [94, 41], [64, 38], [52, 9], [40, 38]]);

var wu = 100;
var levelMainPart = new Structure([[0,0], [3*wu, 0], [3*wu, 12*wu], [13*wu, 12*wu], [13*wu, 9*wu], [11*wu, 9*wu], [11*wu, 5*wu], [15*wu, 5*wu], [15*wu, 11*wu], [22*wu, 11*wu], [22*wu, 14*wu], [25*wu, 14*wu], [25*wu, 11*wu], [29*wu, 11*wu], [29*wu, 8*wu], [25*wu, 8*wu], [25*wu, 6*wu], [31*wu, 6*wu], [31*wu, 10*wu], [40*wu, 10*wu], [40*wu, 8*wu], [45*wu, 8*wu], [45*wu, -1*wu], [49*wu, -1*wu], [49*wu, -10*wu],[38*wu, -10*wu], [38*wu, -1*wu], [42*wu, -1*wu], [42*wu, 5*wu], [40*wu, 5*wu], [40*wu, 3*wu], [35*wu, 3*wu], [35*wu, -3*wu], [25*wu, -3*wu], [25*wu, -13*wu], [22*wu, -13*wu], [22*wu, -3*wu], [17*wu, -3*wu], [17*wu, -9*wu], [9*wu, -9*wu], [9*wu, -15*wu], [6*wu, -15*wu], [6*wu, -6*wu], [9*wu, -6*wu], [9*wu, -3*wu], [0, -3*wu], [0,0], 
[wu, -wu], [wu, -2*wu], [10*wu, -2*wu], [10*wu, -7*wu], [7*wu, -7*wu], [7*wu, -14*wu], [8*wu, -14*wu], [8*wu, -8*wu], [16*wu, -8*wu], [16*wu, -2*wu], [23*wu, -2*wu], [23*wu, -12*wu], [24*wu, -12*wu], [24*wu, -2*wu], [34*wu, -2*wu], [34*wu, 4*wu], [39*wu, 4*wu], [39*wu, 6*wu], [43*wu, 6*wu], [43*wu, -2*wu], [39*wu, -2*wu], [39*wu, -9*wu], [48*wu, -9*wu], [48*wu, -2*wu], [44*wu, -2*wu], [44*wu, 7*wu], [39*wu, 7*wu], [39*wu, 9*wu], [32*wu, 9*wu], [32*wu, 5*wu], [24*wu, 5*wu], [24*wu, 9*wu], [28*wu, 9*wu], [28*wu, 10*wu], [24*wu, 10*wu], [24*wu, 13*wu], [23*wu, 13*wu], [23*wu, 10*wu], [16*wu, 10*wu], [16*wu, 4*wu], [10*wu, 4*wu], [10*wu, 10*wu], [12*wu, 10*wu], [12*wu, 11*wu], [4*wu, 11*wu], [4*wu, -1*wu], [wu, -1*wu] ]);


var levelLoopUpRight = new Structure([[0,0], [7*wu, 0], [7*wu, -5*wu], [0, -5*wu]]);//, [0,0], [wu, -wu],  [wu, -4*wu],  [6*wu, -4*wu],  [6*wu, -wu], [wu, -wu]]);
var levalLoopRightSideLow = new Structure([[0,0], [5*wu, 0], [5*wu, -3*wu], [0, -3*wu]]);//, [0, 0], [wu, -wu], [wu, -2*wu], [4*wu, -2*wu], [4*wu, -1*wu], [wu, -1*wu]]);
var levelLoopRightSideCenter = new Structure([[0,0], [9*wu, 0], [9*wu, -5*wu], [0, -5*wu]]);//, [0,0], [wu, -wu], [wu, -4*wu], [8*wu, -4*wu], [8*wu, -wu], [wu, -wu]]);
var levelLoopLeftSideSmall = new Structure([[0,0], [4*wu, 0], [4*wu, -5*wu], [0, -5*wu]]);//, [0, 0], [wu, -wu], [wu, -4*wu], [3*wu, -4*wu], [3*wu, -wu], [wu, -wu]]);
var levelLoopLeftSideBig = new Structure([[0,0], [0, 11*wu], [4*wu, 11*wu], [4*wu, 4*wu], [12*wu, 4*wu], [12*wu, 10*wu], [18*wu, 10*wu], [18*wu, 0]]);//, [0, 0], [wu, wu], [17*wu, wu], [17*wu, 9*wu], [13*wu, 9*wu], [13*wu, 3*wu], [3*wu, 3*wu], [3*wu, 10*wu], [wu, 10*wu], [wu, wu]]);


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
      
/*
var wallHor = new Structure(
    [new Vector(100, 0), new Vector(100, 100), new Vector(wallSegment + 100, 100), new Vector(wallSegment+100, 0)], [[0,1], [1,2], [2,3], [3,0]], false);

var wallGapFiller = new Structure(
    [new Vector(0,0), new Vector(wallSeperation + 1, 0), new Vector(wallSeperation + 1, 101), new Vector(0, 101)], [[0,1], [1,2], [2,3], [3,0]], false);
    
*/

function Level(structures, npcs) {
    this.structures = structures;
    this.npcs = npcs;
}

Level.prototype = {
	getGraphics: function() {
        if (this.structureElements == undefined) {
            this.structureElements = [];
            for (var structure of this.structures) {
                var graphic = structure.toGraphic();
                this.structureElements.push(graphic);
            }

            this.npcElements = [];
            for (var npc of this.npcs) {

                var npcSprite = new PIXI.Sprite(PIXI.loader.resources.player.texture);
                // center the sprite's anchor point
                npcSprite.anchor.x = 0.5;
                npcSprite.anchor.y = 0.5;
    
                // move the sprite to the center of the screen
                npcSprite.position = npc.position;
                npcSprite.rotation = npc.rotation;
    
                npcSprite.offset = Vector.subtract(new Vector(player.position), new Vector(npc.position));
                npcSprite.viewDistance = npc.viewDistance;
                npcSprite.FOV = npc.FOV;

                this.npcElements.push(npcSprite);
            }
        }
        return { structures: this.structureElements, npcs: this.npcElements };
    }
};

levels.push( new Level(
    [
        levelMainPart.getInstance(0,-10*wu),
        levelLoopUpRight.getInstance(20.15*wu,-17.1*wu),
        levelLoopRightSideCenter.getInstance(5.23*wu,-10*wu),
        levelLoopLeftSideBig.getInstance(-10*wu,-6.2*wu),
        levelLoopLeftSideSmall.getInstance(-10.3*wu, -16*wu),
        levalLoopRightSideLow.getInstance(12*wu,-5*wu)
        // wallGapFiller.getInstance(0, 350),
        // wallGapFiller.getInstance(-2*wallSegment + 600, -wallSegment + 300),
        // wallGapFiller.getInstance(-2*wallSegment + 600, -wallSegment + 400),
        // wallVert.getInstance(-wallSeperation, -100),
        // wallVert.getInstance(-4*wallSeperation - 1000, -wallSegment -250),
        // wallVert.getInstance(wallSeperation, -100),
        // wallHor.getInstance(-wallSeperation - 550, -wallSegment + 200),
        // wallHor.getInstance(-wallSeperation - 550, -wallSegment + 450),
        // wallHor.getInstance(350, -wallSegment + 200),
        // star.getInstance(-200, 148),
        // star.getInstance(-250, -250),

        //box.getInstance(0, 200),
        //box.getInstance(200, 100),
        //diamond.getInstance(100, -100),
        //star.getInstance(-100, -50),
        //star.getInstance(-500, -25)
    ],
    [
        createNPC(-100, 100, Math.PI, 200, Math.PI/2),
        createNPC(0, 100, 0, 700, Math.PI/8),
    ])
);
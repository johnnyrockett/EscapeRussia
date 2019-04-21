var levels = [];

var box = new Structure([[100, 0], [100, 100], [200, 100], [200, 0]]);
var diamond = new Structure([[0, 0], [50, 50], [100, 0], [50, -50]]);
var star = new Structure([[9, 40], [32, 60], [24, 91], [52, 74], [78, 91], [71, 60], [94, 41], [64, 38], [52, 9], [40, 38]]);

var wallSegment = 1000;
var wallSeperation = 100;

var wallVert = new Structure([[100,0], [100, wallSegment], [200, wallSegment], [200, 0]]);
var wallHor = new Structure([[100,0], [100, 100], [wallSegment + 100, 100], [wallSegment + 100, 0]]);
var wallGapFiller = new Structure([[0,0], [wallSeperation + 1, 0], [wallSeperation + 1, 101], [0, 101]]);

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
        wallGapFiller.getInstance(0, 350),
        wallGapFiller.getInstance(-2*wallSegment + 600, -wallSegment + 300),
        wallGapFiller.getInstance(-2*wallSegment + 600, -wallSegment + 400),
        wallVert.getInstance(-wallSeperation, -100),
        wallVert.getInstance(-4*wallSeperation - 1000, -wallSegment -250),
        wallVert.getInstance(wallSeperation, -100),
        wallHor.getInstance(-wallSeperation - 550, -wallSegment + 200),
        wallHor.getInstance(-wallSeperation - 550, -wallSegment + 450),
        wallHor.getInstance(350, -wallSegment + 200),
        star.getInstance(-200, 148),
        star.getInstance(-250, -250),

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
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{ backgroundColor : 0x100000});

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoDensity = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create a texture from an image path
PIXI.loader
.add('player', "images/playerWGun.png")
.add('bullet', "images/bullet.png")
.add('grass', "images/grass.png")
.load(setup)

var carrotTex;
var player;
var tilingSprite;
var structures = [];
var npcs = [];

function setup() {
    // var texture = PIXI.Texture.from('images/playerWGun.png');
    carrotTex = PIXI.loader.resources.bullet.texture;
    var grass = PIXI.loader.resources.grass.texture;

    // create a new Sprite using the texture
    player = new PIXI.Sprite(PIXI.loader.resources.player.texture);
    // center the sprite's anchor point
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;

    // move the sprite to the center of the screen
    player.position.x = window.innerWidth/2;
    player.position.y = window.innerHeight/2;

    player.offset = new Vector(0, 0);

    npc = new PIXI.Sprite(PIXI.loader.resources.player.texture);
    // center the sprite's anchor point
    npc.anchor.x = 0.5;
    npc.anchor.y = 0.5;

    // move the sprite to the center of the screen
    npc.position.x = 100;
    npc.position.y = 100;
    npc.offset = Vector.subtract(new Vector(player.position), new Vector(npc.position));

    console.log(npc.offset);
    // stage.addChild(npc);

    npcs.push(npc);

    tilingSprite = new PIXI.TilingSprite(grass, window.innerWidth, window.innerHeight);
    stage.addChild(tilingSprite);

    var box = new Structure(
        [new Vector(100, 0), new Vector(100, 100), new Vector(200, 100), new Vector(200, 0)],
        [[0, 1], [1, 2], [2, 3], [3, 0]], false);
    var diamond = new Structure(
        [new Vector(0, 0), new Vector(50, 50), new Vector(100, 0), new Vector(50, -50)],
        [[0, 1], [1, 2], [2, 3], [3, 0]], false);

    var star = new Structure(
        [new Vector(9, 40), new Vector(32, 60), new Vector(24, 91), new Vector(52, 74), new Vector(78, 91), new Vector(71, 60), new Vector(94, 41), new Vector(64, 38), new Vector(52, 9), new Vector(40, 38)],
        [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]]
    );

    var nook = new Structure(
        [new Vector(0, 0), new Vector(-10, 50), new Vector(50, 0), new Vector(110, 50), new Vector(100, 0), new Vector(50, -50)],
        [[0,1], [1,2], [3,4], [4,5], [5, 0]]
    );

    structures.push(box.getInstance(0, 0));
    structures.push(box.getInstance(200, 100));
    structures.push(diamond.getInstance(100, -100));
    structures.push(star.getInstance(-100, -50));
    structures.push(star.getInstance(-500, -25));
    // structures.push(nook.getInstance(-100, 150));


    // //Make a horrizontal coridoor
    // structures.push(new Structure( [new Vector(200, 50), new Vector(50, 50), new Vector(200, 90), new Vector(50, 90)],
    //                                 [[0,1], [2,3] ],
    //                                 [[0, -1], [0,1]]));

    // //Make a vertical corridoor
    // structures.push(new Structure( [new Vector(100, 100), new Vector(75, 100), new Vector(100, 400), new Vector(75, 400)],
    //                                 [[0,2], [1,3] ],
    //                                 [[-1, 0], [1,0]]));


    for (var structure of structures) {
        var graphic = structure.toGraphic();
        stage.addChild(graphic);
    }

    stage.addChild(player);
    for (var npc of npcs) {
        stage.addChild(npc);
    }

    stage.interactive = true;
    animate();
}

stage.on("mousedown", function(e){
  shoot(player.rotation, {
    x: player.position.x +Math.cos(player.rotation)*20,
    y: player.position.y +Math.sin(player.rotation)*20
  });
})

keys = {};

function downListener(event) {
    keys[event.key] = true;
}
function upListener(event) {
    keys[event.key] = false;
}

window.addEventListener(
    "keydown", downListener, false
);
window.addEventListener(
    "keyup", upListener, false
);

var bullets = [];
var bulletSpeed = 20;

function shoot(rotation, startPosition){
  var bullet = new PIXI.Sprite(carrotTex);
  bullet.position.x = startPosition.x;
  bullet.position.y = startPosition.y;
  bullet.anchor.x = 0.5;
  bullet.anchor.y = 0.5;
  bullet.rotation = rotation;
  stage.addChild(bullet);
  bullets.push(bullet);
}

function rotateToPoint(mx, my, px, py){
  var self = this;
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  //var degrees = angle * 180/ Math.PI;
  return angle;
}

function updateView(object)
{
    if (object.triangle == undefined) {
        object.triangle = new PIXI.Graphics();

        stage.addChild(object.triangle);
    }

    var origin = object.position;

    object.triangle.clear();
    object.triangle.beginFill(0xFF0000, 0.2);
    object.triangle.lineStyle(0, 0xFF0000, 0.2);
    object.triangle.x = origin.x;
    object.triangle.y = origin.y;
    // console.log(object.rotation);

    var FOV = Math.PI/4; // 90 degree FOV
    var viewDistance = 500;

    // Currently doesn't work with any other value because of instances where I use the lookAt vector as the point

    var vecs = [];

    var vec = new Vector(viewDistance, 0);

    // var lookAt = vec.rotate(object.rotation).normalize();

    var left = vec.rotate(object.rotation - FOV / 2);
    var right = vec.rotate(object.rotation + FOV / 2);

    vecs.push(left);
    vecs.push(right);
    var samples = 5;
    for (var i=1; i < samples; i++) {
        vecs.push(vec.rotate(object.rotation - FOV / 2 + (FOV * (i/(samples+1) ))));
    }

    for (var structure of structures) {
        // console.log(Vector.cross(left, structure.coords[0]), Vector.cross(right, structure.coords[0]));
        for (var p=0; p < structure.coords.length; p++) {
            var vec = Vector.add(structure.coords[p], object.offset);
            if (vec.length() < viewDistance && left.cross(vec) > 0 && right.cross(vec) < 0) {
                var nDirection1 = vec.dot(structure.pointNormals[p][0]) >= 0;
                var nDirection2 = vec.dot(structure.pointNormals[p][1]) >= 0;
                var direction = vec.cross(Vector.add(structure.pointNormals[p][0], structure.pointNormals[p][1]).normalize()) > 0;
                // Push the point if it has a face that is in our direction
                if ( !nDirection1 || !nDirection2) {
                    vecs.push(vec.clone());

                    // Push the edge if it also has a face in the other direction
                    if ((nDirection1 || nDirection2)) {
                        var nextEdge =vec.clone().multiply(viewDistance/ vec.length());
                        nextEdge.edgePoint = vec;
                        nextEdge.edgeSide = direction;
                        vecs.push(nextEdge);
                    }
                }
            }
        }
    }

    // If it isn't behind any walls
    for (var vec of vecs) {
        for (var structure of structures) {
            var newVec = structure.getIntersection(vec, object.offset);
            if (newVec != null)
                vec = newVec;
        }
    }


    // After I find all of my vecs, or points, I should sort them based on their angle
    vecs = vecs.sort(function (a, b) {
        var angle = a.cross(b);
        if (Math.abs(angle) < 0.00000001){
            if (a.edgeSide != undefined)
                return a.edgeSide;
            if (b.edgeSide != undefined)
                return b.edgeSide;
        }
        return angle;
    });

    // left.print(path);
    // right.print(path);

    path = [0, 0];

    for (var vec of vecs) {
        // console.log(vec);
        vec.print(path);
    }

    object.triangle.drawPolygon(path);
    // console.log(path);
    object.triangle.endFill();
}

function outside(position) {
    return position.x < 0 || position.x > window.innerWidth || position.y < 0 || position.y > window.innerHeight;
}

var movementSpeed = 3;

function evaluateControls() {
    var offsetX = 0;
    var offsetY = 0;
    if (keys["d"])
        offsetX -= movementSpeed;
    if (keys["s"])
        offsetY -= movementSpeed;
    if (keys["a"])
        offsetX += movementSpeed;
    if (keys["w"])
        offsetY += movementSpeed;

    if (offsetX != 0 || offsetY != 0) {
        var offset = new Vector(offsetX, offsetY);
        var newPosition = Vector.add(player.position, offset);
        // Check to see if this movement is valid
        // var intersection = newPosition.clone();
        // for (var structure of structures) {
        //     intersection = structure.getIntersection(intersection, {x:0, y:0});
        //     if (newPosition.equals(intersection.x, intersection.y))
        //         return;
        // }

        tilingSprite.tilePosition.x += offsetX;
        tilingSprite.tilePosition.y += offsetY;
        for (var structure of structures) {
            structure.addOffset(offsetX, offsetY);
        }
    }
}

function animate() {

  evaluateControls();

  player.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, player.position.x, player.position.y);
  updateView(player);
  for (var npc of npcs) {
      updateView(npc);
  }

  for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
    if (outside(bullets[b].position)) {
        stage.removeChild(bullets[b]);
    }
  }

  // update structures
  for (var structure of structures) {
      structure.animate();
  }
  // render the container
  renderer.render(stage);
  requestAnimationFrame(animate);
}
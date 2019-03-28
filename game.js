var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{ backgroundColor : 0x100000});

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoDensity = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create a texture from an image path
var texture = PIXI.Texture.from('images/playerWGun.png');
var carrotTex = PIXI.Texture.from('images/bullet.png');
var grass = PIXI.Texture.from('images/grass.png');

// create a new Sprite using the texture
var player = new PIXI.Sprite(texture);
// center the sprite's anchor point
player.anchor.x = 0.5;
player.anchor.y = 0.5;

// move the sprite to the center of the screen
player.position.x = window.innerWidth/2;
player.position.y = window.innerHeight/2;

var tilingSprite = new PIXI.TilingSprite(grass, window.innerWidth, window.innerHeight);
stage.addChild(tilingSprite);

var structures = [];
structures.push(new Structure(
    [new Vector(200, 100), new Vector(300, 100), new Vector(300, 200), new Vector(200, 200)],
    [[0, 1], [1, 2], [2, 3], [3, 0]],
    [[0, -1], [1, 0], [0, 1], [-1, 0]]));
for (var structure of structures) {
    var graphic = structure.toGraphic();
    graphic.position = player.position;
    stage.addChild(graphic);
}

stage.addChild(player);

stage.interactive = true;

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

    object.triangle.clear();
    object.triangle.beginFill(0xFF0000, 0.2);
    object.triangle.lineStyle(0, 0xFF0000, 0.2);
    object.triangle.x = object.position.x;
    object.triangle.y = object.position.y;
    // console.log(object.rotation);

    var FOV = Math.PI/5; // 90 degree FOV
    var viewDistance = 500;

    var vecs = [];

    var vec = new Vector(viewDistance, 0);

    var left = vec.rotate(object.rotation - FOV / 2)
    var right = vec.rotate(object.rotation + FOV / 2)

    vecs.push(left);
    vecs.push(right);

    for (var structure of structures) {
        // console.log(Vector.cross(left, structure.coords[0]), Vector.cross(right, structure.coords[0]));
        for (var p=0; p < structure.coords.length; p++) {
            var point = structure.coords[p];
            if (left.cross(point) > 0 && right.cross(point) < 0) {
                vecs.push(point.clone());
                // If we are looking tangent to the edge (all signs should be the same)
                // console.log(point.cross(structure.normals[p][0]), point.cross(structure.normals[p][1]));
                // var sign;
                // for (var normal of structure.normals[p]) {
                //     if (sign) {
                //         var newSign = point.cross(normal) > 0;
                //     }
                // }
                var n1 = point.cross(structure.normals[p][0]) > 0;
                var n2 = point.cross(structure.normals[p][1]) > 0;
                if ( n1 == n2 ) {
                    var nextEdge =point.clone().multiply(viewDistance/ point.length());
                    nextEdge.edgeSide = n1;
                    vecs.push(nextEdge);
                }
            }
        }
    }

    // If it isn't behind any walls
    for (var vec of vecs) {
        for (var structure of structures) {
            vec = structure.getIntersection(vec);
        }
    }


    // After I find all of my vecs, or points, I should sort them based on their angle
    vecs = vecs.sort(function (a, b) {
        var angle = a.cross(b);
        if (Math.abs(angle) < 0.00001){
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
    if (keys["d"])
        tilingSprite.tilePosition.x -= movementSpeed;
    if (keys["s"])
        tilingSprite.tilePosition.y -= movementSpeed;
    if (keys["a"])
        tilingSprite.tilePosition.x += movementSpeed;
    if (keys["w"])
        tilingSprite.tilePosition.y += movementSpeed;
}

// start animating
animate();
function animate() {

  evaluateControls();

  // just for fun, let's rotate mr rabbit a little
  player.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, player.position.x, player.position.y);
  updateView(player);

  for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
    if (outside(bullets[b].position)) {
        stage.removeChild(bullets[b]);
    }
  }
  // render the container
  renderer.render(stage);
  requestAnimationFrame(animate);
}
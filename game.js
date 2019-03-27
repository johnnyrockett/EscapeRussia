var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{ backgroundColor : 0x100000});

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create a texture from an image path
var texture = PIXI.Texture.fromImage('images/playerWGun.png');
var carrotTex = PIXI.Texture.fromImage('images/bullet.png');
var grass = PIXI.Texture.fromImage('images/grass.png');

// create a new Sprite using the texture
var player = new PIXI.Sprite(texture);

// center the sprite's anchor point
player.anchor.x = 0.5;
player.anchor.y = 0.5;

// move the sprite to the center of the screen
player.position.x = window.innerWidth/2;
player.position.y = window.innerHeight/2;

var tilingSprite = new PIXI.extras.TilingSprite(grass, window.innerWidth, window.innerHeight);
stage.addChild(tilingSprite);

// var background = new PIXI.Graphics();
// background.beginFill(0x229922);
// background.drawRect(0,0,window.innerWidth,window.innerHeight);
// background.endFill();
// stage.addChild(background);

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

    var vecs = [new Vector(0, 0)];

    var vec = new Vector(viewDistance, 0);

    vecs.push(vec.rotate(object.rotation + FOV / 2));
    vecs.push(vec.rotate(object.rotation - FOV / 2));

    // left.print(path);
    // right.print(path);

    path = [];

    var offset = new Vector(object.position);

    for (var vec of vecs) {
        vec.print(path);
    }

    console.log(path);


    // var triangleWidth = 100,
    //     triangleHeight = triangleWidth,
    //     triangleHalfway = triangleWidth/2;

    // draw triangle
    // var path = [20, 50, 100, 150, 0, 0];
    object.triangle.drawPolygon(path);
    // console.log(path);
    object.triangle.endFill();

    // object.triangle.moveTo(triangleWidth, 0);
    // object.triangle.lineTo(triangleHalfway, triangleHeight);
    // object.triangle.lineTo(0, 0);
    // object.triangle.lineTo(triangleHalfway, 0);
    // object.triangle.endFill();
    // object.triangle.rotation = player.rotation;
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
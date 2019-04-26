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
var currentLevel = -1;

var levelElements = [];

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
    player.viewDistance = 500;
    player.FOV = Math.PI/4;

    tilingSprite = new PIXI.TilingSprite(grass, window.innerWidth, window.innerHeight);
    stage.addChild(tilingSprite);
    stage.addChild(player);

    stage.interactive = true;
    animate();
    loadLevel(0);
}

function loadLevel(index) {
    // take all of the current level's elements off of the stage
    if (levels[currentLevel] != undefined) {
        for (var element of levels[currentLevel].structureElements) {
            stage.removeChild(element);
        }
        for (var element of levels[currentLevel].npcElements) {
            stage.removeChild(element.triangle);
            stage.removeChild(element);
        }
    }

    // add all of the new elements to the stage
    currentLevel = index;
    if (levels[currentLevel] != undefined) {
        for (var structure of levels[currentLevel].structures) {
            structure.reset();
        }
        for (var goal of levels[currentLevel].endGoals) {
            goal.reset();
        }
        var elements = levels[currentLevel].getGraphics();
        for (var structure of elements.structures) {
            stage.addChild(structure);
        }
        for (var npc of elements.npcs) {
            stage.addChild(npc);
        }
    }
}

stage.on("mousedown", function(e){
  shoot(player.rotation, {
    x: player.position.x +Math.cos(player.rotation)*20,
    y: player.position.y +Math.sin(player.rotation)*20
  });
})

keys = {};

function downListener(event) {
    keys[event.key.toLowerCase()] = true;
}
function upListener(event) {
    keys[event.key.toLowerCase()] = false;
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

    // Currently doesn't work with any other value because of instances where I use the lookAt vector as the point

    var vecs = [];

    var vec = new Vector(object.viewDistance, 0);

    // var lookAt = vec.rotate(object.rotation).normalize();

    var left = vec.rotate(object.rotation - object.FOV / 2);
    var right = vec.rotate(object.rotation + object.FOV / 2);

    vecs.push(left);
    vecs.push(right);
    var samples = 30;
    for (var i=1; i < samples; i++) {
        vecs.push(vec.rotate(object.rotation - object.FOV / 2 + (object.FOV * (i/(samples+1) ))));
    }

    if (levels[currentLevel] != undefined) {
        for (var structure of levels[currentLevel].structures) {
            // console.log(Vector.cross(left, structure.coords[0]), Vector.cross(right, structure.coords[0]));
            for (var p=0; p < structure.coords.length; p++) {
                // if (object.offset.x != 0)
                //     console.log(object.offset);
                var vec = Vector.add(structure.coords[p], object.offset);
                if (vec.length() < object.viewDistance && left.cross(vec) > 0 && right.cross(vec) < 0) {
                    var nDirection1 = vec.dot(structure.pointNormals[p][0]) >= 0;
                    var nDirection2 = vec.dot(structure.pointNormals[p][1]) >= 0;
                    var direction = vec.cross(Vector.add(structure.pointNormals[p][0], structure.pointNormals[p][1]).normalize()) > 0;
                    // Push the point if it has a face that is in our direction
                    if ( !nDirection1 || !nDirection2) {
                        vecs.push(vec.clone());

                        // Push the edge if it also has a face in the other direction
                        if ((nDirection1 || nDirection2)) {
                            var nextEdge =vec.clone().multiply(object.viewDistance/ vec.length());
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
            for (var structure of levels[currentLevel].structures) {
                var newVec = structure.getIntersection(vec, object.offset);
                if (newVec != null)
                    vec = newVec;
            }
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

    object.triangle.path = [0, 0];

    for (var vec of vecs) {
        // console.log(vec);
        vec.print(object.triangle.path);
    }

    object.triangle.drawPolygon(object.triangle.path);
    // console.log(path);
    object.triangle.endFill();
}

function outside(position) {
    return position.x < 0 || position.x > window.innerWidth || position.y < 0 || position.y > window.innerHeight;
}

function isPlayerWithin(path) {
    var x = player.position.x, y = player.position.y;

    var inside = false;
    for (var i = 0, j = path.length - 1; i < path.length; j = i++) {
        var xi = path[i].x, yi = path[i].y;
        var xj = path[j].x, yj = path[j].y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

var movementSpeed = 4.5;
var npcMovementSpeed = 3;
var rotationSpeed = Math.PI/25;

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
    if (keys[" "] && levels[currentLevel] != undefined) {
        for (var npc of levels[currentLevel].npcElements) {
            var distance = Vector.subtract(new Vector(player.position), new Vector(npc.position)).length();
            if (distance < 30) {
                stage.removeChild(npc.triangle);
                stage.removeChild(npc);
                levels[currentLevel].npcElements.splice(levels[currentLevel].npcElements.indexOf(npc), 1);
            }
        }
    }
    // if (keys["c"]){
    //     for (var npc of levels[currentLevel].npcElements) {
    //         updateView(npc);
    //         var adjustedPath = [];
    //         var npcPosition = new Vector(npc.position);
    //         for (var i=0; i < 50; i+=2) {
    //             adjustedPath.push(Vector.add(npcPosition, new Vector(npc.triangle.path[i], npc.triangle.path[i+1])));
    //         }
    //         if (isPlayerWithin(adjustedPath))
    //             console.log("Close enough");
    //             //remove enemy from stack or set position to very far away.
    //     }
    // }

    if (offsetX != 0 || offsetY != 0) {
        var offset = new Vector(offsetX, offsetY);

        if (levels[currentLevel] != undefined) {
            var collisionSensitivity = 10;
            var vec = new Vector(collisionSensitivity, 0);
            var sensors = [];
            sensors.push(vec);

            // var lookAt = vec.rotate(object.rotation).normalize();

            var samples = 10;
            for (var i=1; i < samples; i++) {
                sensors.push(vec.rotate(Math.PI * 2 / (i/(samples+1) )));
            }

            for (var sensor of sensors) {
                // Check to see if this movement is valid
                var intersection = sensor.clone();
                for (var structure of levels[currentLevel].structures) {
                    intersection = structure.getIntersection(intersection, offset);
                    // console.log(intersection, offset);
                    if (!sensor.equals(intersection.x, intersection.y, 0.0000000001)) {
                        // console.log(intersection);
                        return;
                    }
                }
            }

            for (var structure of levels[currentLevel].structures) {
                structure.addOffset(offset.x, offset.y);
            }
            for (var goal of levels[currentLevel].endGoals) {
                goal.addOffset(offset.x, offset.y);
                var path = []
                var playerPos = new Vector(player.position);
                for (var coord of goal.getPath()) {
                    path.push(Vector.add(playerPos, coord));
                }
                if (isPlayerWithin(path)) {
                    loadLevel(currentLevel+1);
                    return;
                }
            }

            for (var npc of levels[currentLevel].npcElements) {
                npc.position.x += offset.x;
                npc.position.y += offset.y;
                npc.offset.subtract(offset);
            }
        }

        tilingSprite.tilePosition.x += offset.x;
        tilingSprite.tilePosition.y += offset.y;
    }
}

let text = new PIXI.Text('Escape from Russia',{fontFamily : 'Arial', fontSize: 90, fill : 0xffffff, align : 'center'});
let tutorial = new PIXI.Text('Use WASD to move and press Space when near an enemy to take them out.',{fontFamily : 'Arial', fontSize: 50, fill : 0xffffff, align : 'center'});
let tutorial2 = new PIXI.Text('Get to the Star to advance, and avoid enemy lines of sight.',{fontFamily : 'Arial', fontSize: 50, fill : 0xffffff, align : 'center'});
let winText = new PIXI.Text('Congragulations! \n You Win',{fontFamily : 'Arial', fontSize: 90, fill : 0xffffff, align : 'center'});

function moveAlongPath(npc) {
    if (npc.path == undefined)
        return;

    if (!npc.currentVec) {
        if (npc.path[npc.pathIndex] != undefined) {
            npc.currentVec = npc.path[npc.pathIndex].clone();
        } else if (npc.pathIndex < npc.path.length*2) {
            npc.currentVec = Vector.negative(npc.path[npc.path.length - (npc.pathIndex - npc.path.length) - 1])
        } else {
            npc.pathIndex = 0;
            npc.currentVec = npc.path[npc.pathIndex].clone();
        }
    }

    npc.rotation = npc.currentVec.toAngles();

    var movementVec;
    if (npc.currentVec.length() < npcMovementSpeed) {
        movementVec = npc.currentVec;
        npc.currentVec = null;
        npc.pathIndex++;
    } else {
        movementVec = npc.currentVec.clone().normalize().multiply(npcMovementSpeed);
        npc.currentVec.subtract(movementVec);
    }

    npc.position.x += movementVec.x;
    npc.position.y += movementVec.y;
    npc.offset.subtract(movementVec);
}

function animate() {

    evaluateControls();



    player.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, player.position.x, player.position.y);
    updateView(player);
    if (levels[currentLevel] != undefined) {
        for (var npc of levels[currentLevel].npcElements) {
            moveAlongPath(npc);

            updateView(npc);
            var adjustedPath = [];
            var npcPosition = new Vector(npc.position);
            for (var i=0; i < npc.triangle.path.length-1; i+=2) {
                adjustedPath.push(Vector.add(npcPosition, new Vector(npc.triangle.path[i], npc.triangle.path[i+1])));
            }
            if (isPlayerWithin(adjustedPath))
                loadLevel(currentLevel);
        }

        // update structures
        for (var structure of levels[currentLevel].structures) {
            structure.animate();
        }

        for (var goal of levels[currentLevel].endGoals) {
            goal.animate();
        }
    }

    for(var b=bullets.length-1;b>=0;b--){
        bullets[b].position.x += Math.cos(bullets[b].rotation)*bulletSpeed;
        bullets[b].position.y += Math.sin(bullets[b].rotation)*bulletSpeed;
        if (outside(bullets[b].position)) {
            stage.removeChild(bullets[b]);
        }
    }

    if( currentLevel == 0) {
        text.anchor.set(-.2,-.8);
        tutorial.anchor.set(-.08,-13);
        tutorial2.anchor.set(-.1,-15);
        stage.addChild(text);
        stage.addChild(tutorial);
        stage.addChild(tutorial2);
    } else  {
        stage.removeChild(text);
        stage.removeChild(tutorial);
        stage.removeChild(tutorial2);
    }

    if( currentLevel == 3) {
        winText.anchor.set(-.8, -.7);
        stage.addChild(winText);
    } else {
        stage.removeChild(winText);
    }
    

    // render the container
    renderer.render(stage);
    requestAnimationFrame(animate);
}
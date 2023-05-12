var canvas = document.getElementById("myCanvas");
canvas.width = 1000;
canvas.height = 750;
var ctx = canvas.getContext("2d");
var objects = [];
canvas.addEventListener("click", returnclick);
var holearray = [];
let select = document.getElementById("mct");
let btn = document.getElementById("btn");
let clearbtn = document.getElementById("clear");
clearbtn.addEventListener("click", clear);
document.addEventListener("keyup", initialize());
btn.addEventListener("click", makeRandom, initialize);
let bhm = 0;
let xL = 0;
let yL = 0;

function initialize() {
  bm = +document.getElementById("bm").value;
  bvx = +document.getElementById("bvx").value;
  bvy = +document.getElementById("bvy").value;
  br = +document.getElementById("br").value;
  return [bm, br, bvx, bvy];
}

// Make Obj at mouse location
function returnclick(event) {
  var [m, r, vx, vy] = initialize();
  var x = event.clientX - canvas.offsetLeft;
  var y = event.clientY - canvas.offsetTop;
  document.getElementById("by").value = y;
  document.getElementById("bx").value = x;
  objects.push(new Object(x, y, vx, vy, m, r));
}

function makeRandom() {
  console.log("1");
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  var vx = Math.random() * 4;
  var vy = Math.random() * 4;
  var m = Math.random() * 100;
  var r = m / 2;
  objects.push(new Object(x, y, vx, vy, m, r));
}

function clear() {
  objects = [];
}
// for (var i = 0; i < 500; i++) {
//   var x = Math.random() * canvas.width;
//   var y = Math.random() * canvas.height;
//   var vx = Math.random() * 4 - 2;
//   var vy = Math.random() * 4 - 2;
//   var m = Math.random() * 20;
//   var r = m / 2;
//   objects.push(new Object(x, y, vx, vy, m, r));
// }

function applyParameters() {
  parameterAttractionFroce = +document.getElementById("pAF").value;
  parameterAirFriction = +document.getElementById("pAf").value;
  parameterCollisonResponse = +document.getElementById("pCr").value;
  parameterViscosity = +document.getElementById("pV").value;
  GravityCoeffcient = +document.getElementById("GC").value;
  return [
    parameterAttractionFroce,
    parameterAirFriction,
    parameterCollisonResponse,
    parameterViscosity,
    GravityCoeffcient,
  ];
}
objects.push(new Object(100, 325, 4, 0, 20, 10));
objects.push(new Object(900, 325, -4, 0, 20, 10));
// create Obj
function Object(x, y, vx, vy, m, r) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = m;
  this.r = r;
}

//calc Ff

function Ff(m, v) {
  [
    parameterAttractionFroce,
    parameterAirFriction,
    parameterCollisonResponse,
    parameterViscosity,
    GravityCoeffcient,
  ] = applyParameters();
  var F = 0;

  F = m * parameterAirFriction; // F coefficent x mass
  if (v > 0) {
    F *= -1;
  }
  if (Math.abs(F) > Math.abs(v)) {
    F = -v;
  }
  if (v == 0) {
    F = 0;
  }

  return F;
}

function areColliding(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  var distance = Math.sqrt(dx ** 2 + dy ** 2);
  return distance <= obj1.r + obj2.r + 0.5;
}

function GF(obj1, obj2) {
  [
    parameterAttractionFroce,
    parameterAirFriction,
    parameterCollisonResponse,
    parameterViscosity,
    GravityCoeffcient,
  ] = applyParameters();

  var G =
    (GravityCoeffcient * obj1.m * obj2.m) /
    Math.sqrt((bhx - ballx) ** 2 + (bhy - bally) ** 2) ** 2;
  var D = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
  return [G, D];
}

function update() {
  [
    parameterAttractionFroce,
    parameterAirFriction,
    parameterCollisonResponse,
    parameterViscosity,
    GravityCoeffcient,
  ] = applyParameters();

  for (var i = 0; i < objects.length; i++) {
    objects[i].update();
    for (var j = i + 1; j < objects.length; j++) {
      if (areColliding(objects[i], objects[j])) {
        var Pinitialx =
          objects[i].vx * objects[i].m + objects[j].vx * objects[j].m;
        var Pinitialy =
          objects[i].vy * objects[i].m + objects[j].vy * objects[j].m;
        var v1fx =
          (Pinitialx - objects[j].m * (objects[i].vx - objects[j].vx)) /
          (objects[i].m + objects[j].m);
        var v2fx =
          (Pinitialx - objects[i].m * (objects[j].vx - objects[i].vx)) /
          (objects[i].m + objects[j].m);
        var v1fy =
          (Pinitialy - objects[j].m * (objects[i].vy - objects[j].vy)) /
          (objects[i].m + objects[j].m);
        var v2fy =
          (Pinitialy - objects[i].m * (objects[j].vy - objects[i].vy)) /
          (objects[i].m + objects[j].m);
        objects[i].vx = v1fx * parameterCollisonResponse;
        objects[i].vy = v1fy * parameterCollisonResponse;
        objects[j].vx = v2fx * parameterCollisonResponse;
        objects[j].vy = v2fy * parameterCollisonResponse;

        var dx = objects[i].x - objects[j].x;
        var dy = objects[i].y - objects[j].y;
        var distance = Math.sqrt(dx ** 2 + dy ** 2);
        var overlap = objects[i].r + objects[j].r - distance;
        var miratio = objects[i].m / objects[j].m;
        var mjratio = objects[j].m / objects[i].m;
        if (overlap > 2) {
          var angle = Math.atan2(dx, dy);
          objects[i].x += (Math.sin(angle) * distance) / miratio + objects[i].r;
          objects[j].x -= (Math.sin(angle) * distance) / mjratio + objects[j].r;
          objects[i].y += (Math.cos(angle) * distance) / miratio;
          objects[j].y -= (Math.cos(angle) * distance) / mjratio;
        }
      }
      [G, D] = GF(objects[i], objects[j]);
    }
  }
}

//update Obj position
Object.prototype.update = function () {
  //safety
  if (this.x <= 0 + this.r) {
    this.x = 0 + this.r;
    this.vx *= -1;
  }
  if (this.x >= canvas.width - this.r) {
    this.x = canvas.width - this.r;
    this.vx *= -1;
  }
  if (this.y <= 0 + this.r) {
    this.y = 0 + this.r;
    this.vy *= -1;
  }
  if (this.y >= canvas.height - this.r) {
    this.y = canvas.height - this.r;
    this.vy *= -1;
  }

  this.x += this.vx + Ff(this.m, this.vx);
  this.y += this.vy + Ff(this.m, this.vy);
};

//animate objects
Object.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < objects.length; i++) {
    objects[i].draw();
    //objects[i].update();
  }

  update();
}

animate();

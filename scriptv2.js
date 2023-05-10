var canvas = document.getElementById("myCanvas");
canvas.width = 1000;
canvas.height = 800;
var ctx = canvas.getContext("2d");
var objects = [];
canvas.addEventListener("click", returnclick);
var holearray = [];
//document.addEventListener("keyup", initialize);
let btn = document.getElementById("btn");
btn.addEventListener("click", initialize);
let bhm = 0;
let xL = 0;
let yL = 0;
function initialize() {
  bhm = +document.getElementById("bhm").value;
  xL = +document.getElementById("lx").value;
  yL = +document.getElementById("ly").value;
  holearray.push(new gravityWell(xL, yL, bhm));
}

function returnclick(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  var vx = Math.random() * 4 - 2;
  var vy = Math.random() * 4 - 2;
  objects.push(new Object(x, y, vx, vy));
}

function Object(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
}

Object.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};

function gravityWell(x, y, mass) {
  this.x = x;
  this.y = y;
  this.mass = mass;
}

gravityWell.prototype.GF = function () {};

gravityWell.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
};
const middlehole = holearray.push(new gravityWell(500, 400, 1000));
// //
// Object.prototype.update = function () {
//     var dx = canvas.width / 2 - this.x;
//     var dy = canvas.height / 2 - this.y;
//     var distance = Math.sqrt(dx * dx + dy * dy);
//     var acceleration = distance / 1000;
//     this.vx += (dx / distance) * acceleration;
//     this.vy += (dy / distance) * acceleration;
//     this.x += this.vx;
//     this.y += this.vy;
//   };

// MAIN ANIMATION LOOP

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < holearray.length; i++) {
    holearray[i].draw();
  }
}

animate();

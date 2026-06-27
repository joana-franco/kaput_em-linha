let positions = [];
let movements = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0, 0, 255);
  strokeWeight(3);
  noFill();
  strokeCap(ROUND);
  strokeJoin(ROUND);
}

function draw() {
  clear();

  let mouseIn =
    mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

  if (mouseIn) {
    positions.push({
      mouseX,
      mouseY,
      pmouseX,
      pmouseY,
    });
  }

  if (positions.length > 20 || !mouseIn) {
    positions.shift();
  }

  beginShape();
  for (let i = 0; i < positions.length; i++) {
    curveVertex(positions[i].mouseX, positions[i].mouseY);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

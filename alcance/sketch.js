let stickman;
let canvasSize;
let margin = 0;
let baseUnit = 40;
let strokeWidthValue = baseUnit * 0.1;
let traceGraphics;
let positionGraphics;

function setup() {
  createCanvas(600, 600);
  
  traceGraphics = createGraphics(width, height);
  traceGraphics.angleMode(DEGREES);
  traceGraphics.strokeWeight(strokeWidthValue);
  traceGraphics.background(0);
  
  positionGraphics = createGraphics(width, height);
  positionGraphics.angleMode(DEGREES);
  positionGraphics.strokeWeight(strokeWidthValue);
  positionGraphics.background(0);

  stickman = new Stickman();
}

function draw() {
  positionGraphics.clear();
  stickman.update();
  stickman.display(traceGraphics, true);
  stickman.display(positionGraphics, false);
  image(traceGraphics, 0, 0);
  image(positionGraphics, 0, 0);
}

class Stickman {
  constructor() {
    this.seed = random(1000);
    this.pos = createVector(width / 2, height / 2);
    this.headSize = baseUnit * 0.8;
    this.torsoLength = baseUnit * 3;
    this.shoulderSize = baseUnit * 0.4;
    this.armLength = baseUnit * 1.4;
    this.hipSize = baseUnit * 0.5;
    this.legLength = baseUnit * 1.9;
  }
  
  update() {
    this.t = frameCount * 0.002 + this.seed;
  }

  display(g, hasTrace) {
    g.push();
    g.translate(this.pos.x, this.pos.y);

    let torsoAngle = map(noise(this.t), 0, 1, -180, 180);

    g.push();
    g.rotate(torsoAngle);
    g.translate(0, -this.torsoLength / 2);
    
    g.stroke(hasTrace ? color(map(noise(this.t + 982437), 0, 1, 180, 255)) : color(0));
    g.noFill();
    g.ellipse(0, 0, this.headSize);

    g.line(0, baseUnit * 0.45, 0, this.torsoLength);

    g.line(-this.shoulderSize, baseUnit * 0.8, this.shoulderSize, baseUnit * 0.8);
    this.drawArm(g, -this.shoulderSize, this.headSize, 1);
    this.drawArm(g, this.shoulderSize, this.headSize, -1);

    g.line(-this.hipSize, this.torsoLength, this.hipSize, this.torsoLength);
    this.drawLeg(g, -this.hipSize, this.torsoLength, 1);
    this.drawLeg(g, this.hipSize, this.torsoLength, -1);

    g.pop();
    g.pop();
  }

  drawArm(g, x, y, side) {
    g.push();
    g.translate(x, y);

    let shoulderAngle = map(sin(this.t + side), -1, 1, 10, 140);
    let elbowAngle = map(sin(this.t * 0.8 + side * 10), -1, 1, -30, 140);

    g.rotate(shoulderAngle * side);

    g.line(0, 0, 0, this.armLength);

    g.translate(0, this.armLength);
    g.rotate(elbowAngle * side);

    g.line(0, 0, 0, this.armLength);

    g.pop();
  }

  drawLeg(g, x, y, side) {
    g.push();
    g.translate(x, y);

    let hipAngle = map(sin(this.t + side * 5), -1, 1, -30, 90);
    let kneeAngle = map(sin(this.t * 0.9 + side * 20), -1, 1, 0, 120);

    g.rotate(hipAngle * side);

    g.line(0, 0, 0, this.legLength);

    g.translate(0, this.legLength);
    g.rotate(kneeAngle);

    g.line(0, 0, 0, this.legLength);

    g.pop();
  }
}

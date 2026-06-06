let stickmen = [];
let canvasSize;
let margin = 0;
let baseUnit = 20;
let strokeWidthValue = baseUnit * 0.1;
let vignette;

function setup() {
  createCanvas(600, 1000);
  angleMode(DEGREES);
  pixelDensity(2);
  strokeWeight(strokeWidthValue);
  background(0);

  let total = Math.round(20);
  for (let i = 0; i < total; i++) {
    stickmen.push(new Stickman());
  }

  setVignette();
}

function draw() {
  background(0, 20);
  for (let sm of stickmen) {
    sm.update();
    sm.display();
  }
  image(vignette, 0, 0, width, height);
}

class Stickman {
  constructor() {
    this.noiseSeed = random(1000);
    this.reset();
  }

  reset() {
    this.pos = createVector(
      random(margin, width - margin),
      random(-height , -100)
    );
    this.fallSpeed = random(2, 3);
    this.headSize = baseUnit * 0.8;
    this.torsoLength = baseUnit * 3;
    this.armLength = baseUnit * 1.5;
    this.legLength = baseUnit * 2;
  }

  update() {
    this.pos.y += this.fallSpeed;
    if (this.pos.y > height + 100) {
      this.reset();
    }
    this.pos.x += map(noise(frameCount * 0.001 + this.noiseSeed), 0, 1, -1, 1);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);

    noStroke();
    fill(255);
    ellipse(0, 0, this.headSize);

    let t = frameCount * 0.05 + this.noiseSeed;
    let torsoAngle = map(sin(t), -1, 1, -360, 360);

    push();
    translate(0, 0);
    rotate(torsoAngle);

    stroke(255);
    line(0, 0, 0, this.torsoLength);

    this.drawArm(0, this.headSize, 1);
    this.drawArm(0, this.headSize, -1);

    this.drawLeg(0, this.torsoLength, 1);
    this.drawLeg(0, this.torsoLength, -1);

    pop();
    pop();
  }

  drawArm(x, y, side) {
    push();
    translate(x, y);

    let t = frameCount * 0.3 + this.noiseSeed * side;

    let shoulderAngle = map(sin(t + side), -1, 1, 10, 140);
    let elbowAngle = map(sin(t * 0.8 + side * 10), -1, 1, -30, 140);

    rotate(shoulderAngle * side);

    line(0, 0, 0, this.armLength);

    translate(0, this.armLength);
    rotate(elbowAngle * side);

    line(0, 0, 0, this.armLength);

    pop();
  }

  drawLeg(x, y, side) {
    push();
    translate(x, y);

    let t = frameCount * 0.25 + this.noiseSeed;

    let hipAngle = map(sin(t + side * 5), -1, 1, -20, 80);
    let kneeAngle = map(sin(t * 0.9 + side * 20), -1, 1, 0, 110);

    rotate(hipAngle * side);

    line(0, 0, 0, this.legLength);

    translate(0, this.legLength);
    rotate(kneeAngle);

    line(0, 0, 0, this.legLength);

    pop();
  }
}

function setVignette() {
  vignette = createGraphics(width / 4, height / 4);
  vignette.noStroke();
  let w = vignette.width;
  let h = vignette.height;
  vignette.background(0);
  for (let i = 0; i < 50; i++) {
    vignette.erase(15);
    vignette.ellipse(
      w * 0.5,
      h * 0.5,
      map(i, 0, 50, 0, w),
      map(i, 0, 50, 0, h)
    );
  }
}

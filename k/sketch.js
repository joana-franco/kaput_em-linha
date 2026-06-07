let size = 100;
let margin = 200;
let bg = 0;
let ac = 255;
let smoothOffset = 0;

let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bg);

  noFill();
  stroke(ac);
  strokeWeight(3);
  angleMode(DEGREES);

  shapes.push({
    shape: new Shape(1 * size),
    p1: { x: 0, y: -0.5 * size },
    p2: { x: 0.2 * size, y: 0 },
    p3: { x: 0, y: -0.5 * size },
    r1: 0,
    r2: 0,
    r3: 90,
  });

  shapes.push({
    shape: new Shape(0.8 * size),
    p1: { x: 0.5 * size, y: 0.2 * size },
    p2: { x: 1.9 * size, y: 0 },
    p3: { x: 0, y: 0 },
    r1: 45,
    r2: 135,
    r3: -38,
  });

  shapes.push({
    shape: new Shape(0.8 * size),
    p1: { x: 0.5 * size, y: 0.2 * size },
    p2: { x: 1.9 * size, y: 0 },
    p3: { x: 0, y: 0 },
    r1: 135,
    r2: 225,
    r3: 38,
  });

  shapes.push({
    shape: new Shape(0.7 * size),
    p1: { x: 0.5 * size, y: -0.5 * size },
    p2: { x: 1.2 * size, y: 0 },
    p3: { x: size, y: -0.5 * size },
    r1: 90,
    r2: 0,
    r3: 90,
  });

  shapes.push({
    shape: new Shape(0 * size),
    p1: { x: 0.5 * size, y: -0.8 * size },
    p2: { x: 0, y: 0 },
    p3: { x: size, y: 0.5 * size },
    r1: 0,
    r2: 0,
    r3: 0,
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bg);

  let targetOffset = map(mouseX, margin, width - margin, 0, 1, true);

  smoothOffset = lerp(smoothOffset, targetOffset, 0.3);

  let t = map(
    mouseX,
    margin,
    width - margin,
    margin,
    width - margin - size,
    true
  );

  translate(t, height * 0.5);

  shapes.forEach((s) => {
    s.shape.display(s.p1, s.p2, s.p3, s.r1, s.r2, s.r3, smoothOffset);
  });
}

class Shape {
  constructor(w) {
    this.w = w;
    if (w == 0) this.isCircle = true;
  }

  display(p1, p2, p3, r1, r2, r3, offset) {
    push();

    let x, y, r;
    if (offset < 0.3) {
      let t = map(offset, 0, 0.3, 0, 1, true);
      x = lerp(p1.x, p2.x, t);
      y = lerp(p1.y, p2.y, t);
      r = lerp(r1, r2, t);
    } else if (offset < 0.4) {
      x = p2.x;
      y = p2.y;
      r = r2;
    } else {
      let t = map(offset, 0.4, 1, 0, 1, true);
      x = lerp(p2.x, p3.x, t);
      y = lerp(p2.y, p3.y, t);
      r = lerp(r2, r3, t);
    }

    translate(x, y);
    rotate(r);
    if (this.isCircle) {
      circle(0, 0, size / 12)
    } else {
      line(0, 0, this.w, 0);
    }

    pop();
  }
}

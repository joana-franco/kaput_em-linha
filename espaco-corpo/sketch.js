let points = [];
let size = 400;
let figure;
let smoothOffset = 0;
let vignette;

let bg = 255;
let ac = 0;

let cx, cy;

function preload() {
  figure = loadImage(
    "https://raw.githubusercontent.com/joana-franco/p5js-file-host/refs/heads/main/figure.svg"
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cx = size * 0.5;
  cy = size * 0.5;

  noStroke();
  fill(ac);

  setBuffer();
  setVignette();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setBuffer();
  setVignette();
}

function draw() {
  background(bg);

  let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
  let targetOffset = constrain(map(mouseSpeed, 0, 1, 1, 0), 0, 1);
  smoothOffset = lerp(smoothOffset, targetOffset, 0.04);

  push();

  let marginX = (width - cx * 2) * 0.5;
  let marginY = (height - cy * 2) * 0.5;

  translate(marginX, marginY);

  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    circle(p.x + p.dx * p.r * smoothOffset, p.y + p.dy * p.r * smoothOffset, 3);
  }

  pop();

  image(vignette, 0, 0, width + 1, height + 5);
}

function setBuffer() {
  points = [];
  let buffer = createGraphics(size, size);
  buffer.background(255);
  buffer.image(figure, 0, 0, size, size);
  buffer.loadPixels();

  let targetPoints = size * 4;
  let attempts = 0;
  let maxAttempts = 20000;

  while (points.length < targetPoints && attempts++ < maxAttempts) {
    let x = floor(random(size));
    let y = floor(random(size));

    let idx = 4 * (y * size + x);
    let brightness = buffer.pixels[idx];

    if (brightness < 200) {
      let ang = atan2(y - cy, x - cx);
      points.push({
        x,
        y,
        dx: cos(ang),
        dy: sin(ang),
        r: random(width * 0.5),
      });
    }
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
      map(i, 0, 50, size / 10, w),
      map(i, 0, 50, size / 10, h)
    );
  }
}

let points = [];
let size = 4;
let margin = 200;
let figure;
let smoothOffset = 0;
let vignette;

let bg = 0;
let ac = 255;

function preload() {
	figure = loadImage("https://raw.githubusercontent.com/joana-franco/p5js-file-host/refs/heads/main/figure.svg");
	loadStrings("https://raw.githubusercontent.com/joana-franco/p5js-file-host/refs/heads/main/figure.svg", parseSVGOutline);
}

function parseSVGOutline(lines) {
	let svgString = join(lines, "\n");
	let parser = new DOMParser();
	let svgDoc = parser.parseFromString(svgString, "image/svg+xml");
	let pathEl = svgDoc.querySelector("path");

	if (pathEl) {
		let length = pathEl.getTotalLength();
		let numOutlinePoints = 150;

		for (let i = 0; i < numOutlinePoints; i++) {
			let percent = i / (numOutlinePoints - 1);
			let pt = pathEl.getPointAtLength(percent * length);
			points.push({
				pos: createVector(pt.x * size, pt.y * size),
				ang: map(i, 0, numOutlinePoints, -90, 360 - 90),
				rad: random(size * 100),
			});
		}
	}
}

function setup() {
	let canvasWidth = 100 * size;
	let canvasHeight = 100 * size;
	createCanvas(canvasWidth + margin * 2, canvasHeight + margin * 2);

	background(bg);
	noStroke();
	fill(ac);
	angleMode(DEGREES);

	let buffer = createGraphics(canvasWidth, canvasHeight);
	buffer.background(255);

	buffer.push();
	buffer.translate(0, 0);
	buffer.image(figure, 0, 0, canvasWidth, canvasHeight);
	buffer.pop();

	let numInsidePoints = 200 * size;
	let pointsFound = 0;
	let attempts = 0;
	let maxAttempts = 20000;

	while (pointsFound < numInsidePoints && attempts < maxAttempts) {
		attempts++;
		let randomX = random(buffer.width);
		let randomY = random(buffer.height);
		let pixelColor = buffer.get(randomX, randomY);

		if (pixelColor[0] < 200) {
			points.push({
				pos: createVector(randomX, randomY),
				ang: atan2(randomY - canvasHeight / 2, randomX - canvasWidth / 2),
				rad: random(size * 100),
			});
			pointsFound++;
		}
	}

	vignette = createGraphics(width / 4, height / 4);
	vignette.loadPixels();
	for (let i = 0; i < vignette.pixels.length; i += 4) {
		let x = (i / 4) % vignette.width;
		let y = i / 4 / vignette.height;
		let d = dist(vignette.width / 2, vignette.height / 2, x, y);
		vignette.pixels[i] = bg;
		vignette.pixels[i + 1] = bg;
		vignette.pixels[i + 2] = bg;
		vignette.pixels[i + 3] = map(d, 0, vignette.width / 2, -200, 255);
	}
	vignette.updatePixels();
}

function draw() {
	background(bg);

	push();
	translate(margin, margin);
	let mousespeed = dist(mouseX, mouseY, pmouseX, pmouseY);
	let targetOffset = map(mousespeed, 0, 1, 1, 0, true);
	smoothOffset = lerp(smoothOffset, targetOffset, 0.03);
	for (let i = 0; i < points.length; i++) {
		let p = points[i].pos;
		let a = points[i].ang;
		let r = points[i].rad;
		circle(p.x + cos(a) * r * smoothOffset, p.y + sin(a) * r * smoothOffset, 3);
	}
	pop();

	image(vignette, 0, 0, width, height);
}

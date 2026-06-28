let stickman;

let unidade = 60;
let peso = 2;

let c = 0;
let bg = 255;

let activeSegment = null;

function setup() {
  createCanvas(700, 700);
  angleMode(DEGREES);
  stickman = new Stickman();
}

function draw() {
  background(bg);

  stickman.update();
  stickman.display();

  const hovered = stickman.pickSegment(mouseX, mouseY);

  if (hovered) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  activeSegment = stickman.pickSegment(mouseX, mouseY);
}

function mouseReleased() {
  activeSegment = null;
}

function mouseDragged() {
  if (!activeSegment) return;
  activeSegment.drag(mouseX, mouseY);
}

class Stickman {
  constructor() {
    this.segmentos = {
      pescoco: new Segmento(null, unidade * 0.7, [90, 90], 90),
      tronco: new Segmento(null, unidade * 2.7, [-30, 30], 0),

      ombroEsq: new Segmento(null, unidade * 0.4, [45, 135], 90),
      bracoEsq: new Segmento(null, unidade * 1.4, [-120, 60], -60),
      antebracoEsq: new Segmento(null, unidade * 1.4, [-180, 180], 0, true),

      ombroDir: new Segmento(null, unidade * 0.4, [-45, -135], -90),
      bracoDir: new Segmento(null, unidade * 1.4, [-60, 120], 60),
      antebracoDir: new Segmento(null, unidade * 1.3, [-180, 180], 0, true),

      ancaEsq: new Segmento(null, unidade * 0.5, [45, 135], 90),
      coxaEsq: new Segmento(null, unidade * 1.9, [30, -120], -90),
      pernaEsq: new Segmento(null, unidade * 1.9, [-180, 180], 0, true),

      ancaDir: new Segmento(null, unidade * 0.5, [-45, -135], -90),
      coxaDir: new Segmento(null, unidade * 1.9, [-30, 120], 90),
      pernaDir: new Segmento(null, unidade * 1.9, [-180, 180], 0, true),
    };

    const s = this.segmentos;

    s.tronco.relativo = s.pescoco;

    s.ombroEsq.relativo = s.pescoco;
    s.bracoEsq.relativo = s.ombroEsq;
    s.antebracoEsq.relativo = s.bracoEsq;

    s.ombroDir.relativo = s.pescoco;
    s.bracoDir.relativo = s.ombroDir;
    s.antebracoDir.relativo = s.bracoDir;

    s.ancaEsq.relativo = s.tronco;
    s.coxaEsq.relativo = s.ancaEsq;
    s.pernaEsq.relativo = s.coxaEsq;

    s.ancaDir.relativo = s.tronco;
    s.coxaDir.relativo = s.ancaDir;
    s.pernaDir.relativo = s.coxaDir;
  }

  update() {
    const segs = Object.values(this.segmentos);
    for (const s of segs) s.update();
  }

  display() {
    const segs = Object.values(this.segmentos);

    for (const s of segs) s.display();
  }

  pickSegment(x, y) {
    const segs = Object.values(this.segmentos);

    let best = null;
    let bestDist = 999999;

    for (const s of segs) {
      const d = dist(x, y, s.end.x, s.end.y);
      if (d < 4 && d < bestDist) {
        best = s;
        bestDist = d;
      }
    }

    return best;
  }
}

class Segmento {
  constructor(
    relativo,
    tamanho,
    amplitude = [-180, 180],
    angulo = 0,
    limite = false
  ) {
    this.relativo = relativo;
    this.tamanho = tamanho;
    this.amplitude = amplitude;
    this.selectedAngle = angulo;
    this.limite = limite;
  }

  update() {
    let start, baseAngle;

    if (this.relativo) {
      start = this.relativo.end;
      baseAngle = this.relativo.angle;
    } else {
      start = { x: width / 2, y: height * 0.25 };
      baseAngle = 0;
    }

    this.start = start;
    this.angle = baseAngle + this.selectedAngle;

    this.end = {
      x: start.x + cos(this.angle) * this.tamanho,
      y: start.y + sin(this.angle) * this.tamanho,
    };
  }

  drag(mx, my) {
    let baseAngle = this.relativo ? this.relativo.angle : 0;
    let targetAngle = atan2(my - this.start.y, mx - this.start.x);
    let angle = targetAngle - baseAngle;
    angle = (angle + 360) % 360;
    if (angle > 180) angle -= 360;
    const minA = Math.min(...this.amplitude);
    const maxA = Math.max(...this.amplitude);
    this.selectedAngle = constrain(angle, minA, maxA);
  }

  display() {
    push();

    const hovering = dist(mouseX, mouseY, this.end.x, this.end.y) < 4;

    stroke(c);
    strokeWeight(peso);
    fill(c);

    line(this.start.x, this.start.y, this.end.x, this.end.y);

    fill(this.limite ? bg : c);
    circle(this.end.x, this.end.y, peso * 4);

    if (hovering) {
      noFill();
      stroke(0, 0, 255);
      circle(this.end.x, this.end.y, peso * 8);
    }

    stroke(c);
    if (!this.relativo) {
      fill(bg);
      ellipse(this.start.x, this.start.y, unidade * 0.8);
    } else {
      fill(c);
      circle(this.start.x, this.start.y, peso * 4);
    }

    pop();
  }
}

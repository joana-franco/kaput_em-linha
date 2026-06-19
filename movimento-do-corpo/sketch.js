let stickman;

let unidade = 40;
let peso = 2;
let margem = unidade * 6;

let c = 255;
let bg = 0;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  strokeWeight(peso);
  stroke(c);
  background(bg);

  stickman = new Stickman();
}

function draw() {
  background(bg);
  stickman.update();
  stickman.display();
}

class Stickman {
  constructor() {
    this.segmentos = {
      pescoco: new Segmento(null, unidade * 0.7, [-360, 540]),
      tronco: new Segmento(null, unidade * 2.7, [-60, 60]),
      ombroEsq: new Segmento(null, unidade * 0.4, [60, 120]),
      bracoEsq: new Segmento(null, unidade * 1.4, [-120, 60]),
      antebracoEsq: new Segmento(null, unidade * 1.4, [-130, 130], true),
      ombroDir: new Segmento(null, unidade * 0.4, [-60, -120]),
      bracoDir: new Segmento(null, unidade * 1.4, [-60, 120]),
      antebracoDir: new Segmento(null, unidade * 1.4, [-130, 130], true),
      ancaEsq: new Segmento(null, unidade * 0.5, [60, 120]),
      coxaEsq: new Segmento(null, unidade * 1.9, [30, -130]),
      pernaEsq: new Segmento(null, unidade * 1.9, [-130, 130], true),
      ancaDir: new Segmento(null, unidade * 0.5, [-60, -120]),
      coxaDir: new Segmento(null, unidade * 1.9, [130, -30]),
      pernaDir: new Segmento(null, unidade * 1.9, [-130, 130], true),
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
    this.t = frameCount * 0.01;
    for (const segmento of Object.values(this.segmentos)) {
      segmento.update();
    }
    this.centerStickman();
  }

  centerStickman() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const segmentos = Object.values(this.segmentos);

    for (const s of segmentos) {
      minX = Math.min(minX, s.start.x, s.end.x);
      maxX = Math.max(maxX, s.start.x, s.end.x);
      minY = Math.min(minY, s.start.y, s.end.y);
      maxY = Math.max(maxY, s.start.y, s.end.y);
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const canvasCenterX = width / 2;
    const canvasCenterY = height / 2;

    this.offset = {
      x: canvasCenterX - cx,
      y: canvasCenterY - cy,
    };
  }

  display() {
    for (const segmento of Object.values(this.segmentos)) {
      segmento.update();
      segmento.display(this.offset);
    }
  }
}

class Segmento {
  constructor(relativo, tamanho, amplitude = [0, 0], limite = false) {
    this.relativo = relativo;
    this.tamanho = tamanho;
    this.amplitude = amplitude;
    this.seed = random(1000);
    this.limite = limite;
  }

  update() {
    const amplitude = Math.max(...this.amplitude) - Math.min(...this.amplitude);
    const frequencia = 1 / max(amplitude, 1);
    const n = frameCount * frequencia * 0.5 + this.seed;

    if (this.relativo) {
      this.start = { ...this.relativo.end };
      this.angle =
        map(noise(n), 0, 1, this.amplitude[0], this.amplitude[1]) +
        this.relativo.angle;
    } else {
      this.start = {
        x: map(noise(n * 2 + 9999), 0, 1, 0, unidade * 2),
        y: map(noise(n * 2 + 999999), 0, 1, 0, unidade * 2),
      };
      this.angle = map(noise(n), 0, 1, this.amplitude[0], this.amplitude[1]);
    }

    this.rotation = {
      x: cos(this.angle) * this.tamanho,
      y: sin(this.angle) * this.tamanho,
    };

    this.end = {
      x: this.start.x + this.rotation.x,
      y: this.start.y + this.rotation.y,
    };
  }

  display(offset = { x: 0, y: 0 }) {
    line(
      this.start.x + offset.x,
      this.start.y + offset.y,
      this.end.x + offset.x,
      this.end.y + offset.y
    );

    fill(this.limite ? bg : c);
    circle(this.end.x + offset.x, this.end.y + offset.y, peso * 3.5);

    if (this.relativo) {
      fill(c);
      circle(this.start.x + offset.x, this.start.y + offset.y, peso * 3.5);
    } else {
      fill(bg);
      ellipse(this.start.x + offset.x, this.start.y + offset.y, unidade * 0.8);
    }
  }
}

let unidade = 40;
let peso = 2;
let segmentos = [];
let margem = unidade * 4;

let c = 255;
let bg = 0;

function setup() {
  createCanvas(600, 600);
  noFill();
  stroke(c);
  strokeWeight(peso);
  angleMode(DEGREES);

  segmentos.push(new Segmento(unidade * 0.8, [1, 2], [0, 180])); // pescoço
  segmentos.push(new Segmento(unidade * 2.7, [2, 3], [0, 180])); // tronco
  segmentos.push(new Segmento(unidade * 0.4, [2, 4], [160, 200])); // ombros
  segmentos.push(new Segmento(unidade * 1.4, [4, 5])); // braços
  segmentos.push(new Segmento(unidade * 1.4, [5, 0])); // antebraços
  segmentos.push(new Segmento(0, [null, 1], [0, 0])); // cabeça
  segmentos.push(new Segmento(unidade * 0.4, [2, 6], [-20, 20])); // ombros
  segmentos.push(new Segmento(unidade * 1.4, [6, 7])); // braços
  segmentos.push(new Segmento(unidade * 1.4, [7, 0])); // antebraços
  segmentos.push(new Segmento(unidade * 0.5, [3, 8], [160, 200])); // ancas
  segmentos.push(new Segmento(unidade * 1.9, [8, 9])); // coxas
  segmentos.push(new Segmento(unidade * 1.9, [9, 0], [-45, 225])); // pernas
  segmentos.push(new Segmento(unidade * 0.5, [3, 10], [-20, 20])); // ancas
  segmentos.push(new Segmento(unidade * 1.9, [10, 11])); // coxas
  segmentos.push(new Segmento(unidade * 1.9, [11, 0], [-45, 225])); // pernas
}

function draw() {
  background(bg);

  let starts = [];
  let ends = [];

  segmentos.forEach((s) => {
    s.update();
    s.display();
    starts.push({ seg: s, id: s.pontos[0], pos: s.start });
    ends.push({ seg: s, id: s.pontos[1], pos: s.end });
  });

  for (let e = 0; e < ends.length; e++) {
    for (let s = 0; s < starts.length; s++) {
      if (starts[s].id !== ends[e].id) continue;
      let distancia = distPoints(starts[s].pos, ends[e].pos);
      if (distancia < unidade * 2) {
        starts[s].seg.snap = ends[e].pos;
      }
    }
  }
}

class Segmento {
  constructor(tamanho, pontos, amplitude = [-90, 270]) {
    this.tamanho = tamanho;
    this.pontos = pontos;
    this.amplitude = amplitude;
    this.seed = random(1000);
    this.snap = null;
  }

  update() {
    let n = frameCount * 0.003 + this.seed;

    this.angle = map(noise(n), 0, 1, this.amplitude[0], this.amplitude[1]);
    this.position = {
      x: map(noise(n + 9999), 0, 1, margem, width - margem),
      y: map(noise(n + 999999), 0, 1, unidade, height - margem),
    };
    this.rotation = {
      x: cos(this.angle) * this.tamanho,
      y: sin(this.angle) * this.tamanho,
    };
    if (this.snap) {
      let d = dist(this.start.x, this.start.y, this.snap.x, this.snap.y);
      if (d > peso * 2) {
        this.start.x = lerp(this.start.x, this.snap.x, 0.2);
        this.start.y = lerp(this.start.y, this.snap.y, 0.2);
      } else {
        this.start.x = this.snap.x;
        this.start.y = this.snap.y;
      }
    } else {
      this.start = {
        x: this.position.x,
        y: this.position.y,
      };
    }
    this.end = {
      x: this.start.x + this.rotation.x,
      y: this.start.y + this.rotation.y,
    };
  }

  display() {
    noFill();

    if (this.pontos[0] == null) {
      fill(bg);
      ellipse(this.start.x, this.start.y, unidade * 0.8);
    } else {
      line(this.start.x, this.start.y, this.end.x, this.end.y);
      fill(this.pontos[1] == 0 ? bg : c);
      circle(this.end.x, this.end.y, peso * 3.5);
      fill(this.pontos[0] == 0 ? bg : c);
      circle(this.start.x, this.start.y, peso * 3.5);
    }
  }
}

function distPoints(a, b) {
  return dist(a.x, a.y, b.x, b.y);
}

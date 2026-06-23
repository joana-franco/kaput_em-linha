let unidade = 40;
let peso = 2;
let segmentos;
const c = 0;
const bg = 255;
let mouseSuave = 0;
let suavizacao = 0.5;

function setup() {
  createCanvas(600, 600);
  noFill();
  stroke(c);
  strokeWeight(peso);
  angleMode(DEGREES);

  criarSegmentos();
  posicionarSegmentosIniciais();
}

function criarSegmentos() {
  segmentos = {
    pescoco: new Segmento(null, unidade * 0.7),
    ombroEsq: new Segmento(null, unidade * 0.4, 180),
    bracoEsq: new Segmento(null, unidade * 1.4, 110),
    antebracoEsq: new Segmento(null, unidade * 1.4, 110, true),
    ombroDir: new Segmento(null, unidade * 0.4, 0),
    bracoDir: new Segmento(null, unidade * 1.4, 70),
    antebracoDir: new Segmento(null, unidade * 1.4, 70, true),
    tronco: new Segmento(null, unidade * 2.7),
    ancaEsq: new Segmento(null, unidade * 0.5, 180),
    coxaEsq: new Segmento(null, unidade * 1.9),
    pernaEsq: new Segmento(null, unidade * 1.9, 90, true),
    ancaDir: new Segmento(null, unidade * 0.5, 0),
    coxaDir: new Segmento(null, unidade * 1.9),
    pernaDir: new Segmento(null, unidade * 1.9, 90, true),
  };

  segmentos.tronco.relativo = segmentos.pescoco;
  segmentos.ombroEsq.relativo = segmentos.pescoco;
  segmentos.bracoEsq.relativo = segmentos.ombroEsq;
  segmentos.antebracoEsq.relativo = segmentos.bracoEsq;
  segmentos.ombroDir.relativo = segmentos.pescoco;
  segmentos.bracoDir.relativo = segmentos.ombroDir;
  segmentos.antebracoDir.relativo = segmentos.bracoDir;
  segmentos.ancaEsq.relativo = segmentos.tronco;
  segmentos.coxaEsq.relativo = segmentos.ancaEsq;
  segmentos.pernaEsq.relativo = segmentos.coxaEsq;
  segmentos.ancaDir.relativo = segmentos.tronco;
  segmentos.coxaDir.relativo = segmentos.ancaDir;
  segmentos.pernaDir.relativo = segmentos.coxaDir;
}

function posicionarSegmentosIniciais() {
  const lista = Object.values(segmentos);
  const intervalo = width / lista.length;

  let i = 0;
  for (const seg of lista) {
    seg.inicial = {
      x: i,
      y: height / 4 + unidade * 2,
    };
    i += intervalo;
  }

  segmentos.pescoco.inicial = {
    x: width / 2,
    y: height / 4,
  };
}

function draw() {
  background(bg);
mouseSuave = lerp(mouseSuave, mouseX, suavizacao);
  for (const seg of Object.values(segmentos)) {
    seg.update(mouseSuave);
    seg.display();
  }
}

class Segmento {
  constructor(relativo, tamanho, angulo = 90, limite = false) {
    this.relativo = relativo;
    this.tamanho = tamanho;
    this.angulo = angulo;
    this.limite = limite;
  }

  update(mouseSuave) {
    this.start = { ...this.inicial };

    const distancia = dist(mouseSuave, 0, width / 2, 0);
    const maxima = dist(0, 0, width / 2, 0) - 10;
    const centro = unidade * 3;

    if (this.relativo) {
      const rel = this.relativo.end;
      this.start = {
        x: map(distancia, maxima, centro, this.inicial.x, rel.x, true),
        y: map(distancia, maxima, centro, this.inicial.y, rel.y, true),
      };
    }

    const ang = map(distancia, maxima, centro, 90, this.angulo, true);

    this.rotacao = {
      x: cos(ang) * this.tamanho,
      y: sin(ang) * this.tamanho,
    };

    this.end = {
      x: this.start.x + this.rotacao.x,
      y: this.start.y + this.rotacao.y,
    };
  }

  display() {
    line(this.start.x, this.start.y, this.end.x, this.end.y);

    fill(this.limite ? bg : c);
    circle(this.end.x, this.end.y, peso * 3.5);

    if (this.relativo) {
      fill(c);
      circle(this.start.x, this.start.y, peso * 3.5);
    } else {
      fill(bg);
      ellipse(this.start.x, this.start.y, unidade * 0.8);
    }
  }
}

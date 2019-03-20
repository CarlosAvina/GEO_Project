class Figura {
  constructor(tipo, arrCoordenadas) {
    this.tipo = tipo;
    this.coordenadas = arrCoordenadas;
  }

  static PIXEL() {
    return 0;
  }
  static LINEA() {
    return 1;
  }
  static POLILINEA() {
    return 2;
  }
  static POLIGONO() {
    return 3;
  }
}
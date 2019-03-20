class DrawHandler {
    

    constructor(canvasCtx, arrFiguras) {
        this.canvasCtx = canvasCtx;
        this.figuras = arrFiguras;
    }

    dibujarFiguras() {
        for (const figura of this.figuras) {
            switch (figura.tipo) {
                case Figura.PIXEL():
                    this.dibujarPixel(figura);
                    break;
                case Figura.LINEA():
                    this.dibujarLinea(figura);
                    break;
                case Figura.POLILINEA():
                    this.dibujarPolilinea(figura);
                    break;
                case Figura.POLIGONO():
                    this.dibujarPoligono(figura);
                    break;
                default:
                    break;
            }
        }
    }
    dibujarPixel(pixel) {
        this.canvasCtx.fillStyle = 'black';
        this.canvasCtx.fillRect(pixel.coordenadas[0].x , pixel.coordenadas[0].y , 1, 1);
    }
    dibujarLinea(linea) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(linea.coordenadas[0].x, linea.coordenadas[0].y);
        this.canvasCtx.lineTo(linea.coordenadas[1].x, linea.coordenadas[1].y);
        this.canvasCtx.stroke();
    }
    dibujarPolilinea(polilinea) {
        for (let i = 0; i < polilinea.coordenadas.length - 1; i++) {
            sliderElement = document.getElementById('sliderElement');
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(polilinea.coordenadas[i].x , polilinea.coordenadas[i].y);
            this.canvasCtx.lineTo(polilinea.coordenadas[i + 1].x, polilinea.coordenadas[i + 1].y);
            this.canvasCtx.stroke();
            
        }
    }
    dibujarPoligono(poligono) {
        for (let i = 0; i < poligono.coordenadas.length; i++) {
            if (i < poligono.coordenadas.length - 1) {
                this.canvasCtx.strokeStyle = 'white';
                this.canvasCtx.shadowColor="white";
                this.canvasCtx.shadowBlur = 10;
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(poligono.coordenadas[i].x, poligono.coordenadas[i].y);
                this.canvasCtx.lineTo(poligono.coordenadas[i + 1].x, poligono.coordenadas[i + 1].y);
                this.canvasCtx.stroke();
                this.canvasCtx.shadowBlur = 2;
                this.canvasCtx.shadowColor="white";
                this.canvasCtx.shadowBlur = 10;
                this.canvasCtx.strokeStyle = 'white';
            }
            else {
                this.canvasCtx.shadowColor="white";
                this.canvasCtx.shadowBlur = 10;
                this.canvasCtx.strokeStyle = 'white';
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(poligono.coordenadas[i].x, poligono.coordenadas[i].y);
                this.canvasCtx.lineTo(poligono.coordenadas[0].x, poligono.coordenadas[0].y);
                this.canvasCtx.stroke();
                this.canvasCtx.shadowColor="white";
                this.canvasCtx.shadowBlur = 10;
                this.canvasCtx.strokeStyle = 'white';
            }
        }
    }
}
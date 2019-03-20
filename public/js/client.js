var socket = io('http://localhost:3000');

var sliderElement = document.getElementById('sliderElement');
var canvas;
var canvasContext;
var listaOpciones;

var opcion = 1;

var numClic = 0;
var numClic2 = 0;
var numClic3 = 0;
var x1 = 0;
var y1 = 0;
var xf = 0;
var yf = 0;

var figuras = [];
var figurasCargadas = [];

window.onload = function () {
    canvas = document.getElementById('canvasId');
    canvasContext = canvas.getContext('2d');
   
    canvas.style.border = '10px solid';
    canvas.style.borderColor = '#FFFFFF';
    canvas.style.borderRadius = '20px';

    var background = new Image();
    // background.src = "../images/map_campestre.jpg"

    background.onload = function(){
        canvasContext.drawImage(background,0,0,canvas.width,canvas.height);
        // background.onload= drawImageScaled.bind(null, background, canvasContext);
    }
    (function() {

        var hamburger = {
          navToggle: document.querySelector('.nav-toggle'),
          nav: document.querySelector('nav'),
      
          doToggle: function(e) {
            e.preventDefault();
            this.navToggle.classList.toggle('expanded');
            this.nav.classList.toggle('expanded');
          }
        };
      
        hamburger.navToggle.addEventListener('click', function(e) { 
            hamburger.doToggle(e); 
        });
        hamburger.nav.addEventListener('click', function(e) { 
            hamburger.doToggle(e); 
        });
      
    }());

   /*  function drawImageScaled(background, canvasContext) {
        var canvas = canvasContext.canvas ;
        var hRatio = canvas.width  / background.width;
        var vRatio =  canvas.height / background.height;
        var ratio  = Math.min ( hRatio, vRatio );
        var centerShift_x = ( canvas.width - background.width*ratio ) / 2;
        var centerShift_y = ( canvas.height - background.height*ratio ) / 2;  
        canvasContext.clearRect(0,0,canvas.width, canvas.height);
        canvasContext.drawImage(background, 0,0, background.width, background.height,centerShift_x,centerShift_y,background.width*ratio, background.height*ratio);  
    } */
    
    listaOpciones = document.getElementById('listaOpciones');
/*     Resetear(); */

    // al hacer click en el menu de opciones se guarda la polilinea, en caso que se estuviera trazando una
    listaOpciones.addEventListener('click', function (evt) {
        if (coordenadasPolilinea.length > 0) {
            figuras.push(new Figura(Figura.POLILINEA(), coordenadasPolilinea));
            coordenadasPolilinea = [];
        }
    });

    canvas.addEventListener('click', function (evt) {
        var mousePosition = calculatePaddlePosition(evt);

        switch (opcion) {
            case 1: pixel(mousePosition.x, mousePosition.y);
                break;
            case 2: linea(mousePosition.x, mousePosition.y);
                break;
            case 3: polilinea(mousePosition.x, mousePosition.y);
                break;
            case 4: poligono(mousePosition.x, mousePosition.y);
                break;
            default: console.log("Error, estas bien menso");
        }

        console.log(figuras);
    });

    // para manejar el evento click derecho en el canvas
    canvas.addEventListener('contextmenu', function (evt) {
        evt.preventDefault();

        var mousePosition = calculatePaddlePosition(evt);

        if (opcion == 4  && numClic3 > 0) {
            numClic3 = -1;
            poligono(mousePosition.x, mousePosition.y)
        }

        return false;
    });
}

function calculatePaddlePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    };
}

function createRectangle(x, y, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

var DibujarElemnto = function(event){
    var texto = "3:129,70.5;761,70.5;762,415.5;759,420.5;756,423.5;750,423.5;731,425.5;730,466.5;587,691.5;439,612.5;324,551.5;325,538.5;127,483.5;"
    var coords;
    var lineasTexto = texto.split("\n");
    for (const lineaTexto of lineasTexto) {
        if (lineaTexto != "") {
            coords = [];
            var d1 = lineaTexto.split(":");
            var tipoFigura = parseInt(d1[0]);
            var coordenadas = d1[1].split(";");

            for (const coordenada of coordenadas) {
                if (coordenada) { // si coordenada no es null o undefined o una cadena vacia (p. ej. "")
                    var x = parseFloat(coordenada.split(",")[0]);
                    var y = parseFloat(coordenada.split(",")[1]);
                    coords.push(new Coordenada(x, y));
                }
            }
            figurasCargadas.push(new Figura(tipoFigura, coords));
        }
    }
    var drawHandler = new DrawHandler(canvasContext, figurasCargadas);
    drawHandler.dibujarFiguras();
}


//OPCIONES
// Funcion que lee el archivo de figuras y las dibuja en el canvas
var Abrir = function (event) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var texto = e.target.result;
        console.log(texto);
        var coords;
        var lineasTexto = texto.split("\n"); // leemos cada linea de texto por separado y las almacenamos en un arreglo

        for (const lineaTexto of lineasTexto) {
            if (lineaTexto != "") {
                coords = [];
                var d1 = lineaTexto.split(":");
                var tipoFigura = parseInt(d1[0]);
                var coordenadas = d1[1].split(";");

                for (const coordenada of coordenadas) {
                    if (coordenada) { // si coordenada no es null o undefined o una cadena vacia (p. ej. "")
                        var x = parseFloat(coordenada.split(",")[0]);
                        var y = parseFloat(coordenada.split(",")[1]);
                        coords.push(new Coordenada(x, y));
                    }
                }

                figurasCargadas.push(new Figura(tipoFigura, coords));
            }
        }
        // console.log(figurasCargadas);
        var drawHandler = new DrawHandler(canvasContext, figurasCargadas);
        drawHandler.dibujarFiguras();
    };

    reader.readAsText(event.target.files[0]);
}

var Resetear = function () {
    createRectangle(0, 0, canvas.width, canvas.height, 'ghostwhite');
    figuras = [];
    figurasCargadas = [];
}

var Guardar = function () {
    let nombreArchivo = prompt('Escribe el nombre del archivo');

    var writer = p5.prototype.createWriter(`${nombreArchivo}.dat`);
    var figuraStr;

    for (const figura of figuras) {
        figuraStr = `${figura.tipo}:`;
        for (const coordenada of figura.coordenadas) {
            figuraStr += `${coordenada.x},${coordenada.y};`;
        }
        writer.print(figuraStr);
        figuraStr = "";
    }
    writer.close();
}

//FIGURAS
var pixel = function (x, y) {
    var coordenadas = [];

    createRectangle(x, y, 1, 1, 'black');

    coordenadas.push(new Coordenada(x, y));
    figuras.push(new Figura(Figura.PIXEL(), coordenadas));
}

var coordenadasLinea = [];
var linea = function (x, y) {
    if (numClic == 0) {
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        numClic = 1;

        coordenadasLinea.push(new Coordenada(x, y));
    }
    else {
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        numClic = 0;

        coordenadasLinea.push(new Coordenada(x, y));
        figuras.push(new Figura(Figura.LINEA(), coordenadasLinea));
        coordenadasLinea = [];
    }
}

var coordenadasPolilinea = [];
var polilinea = function (x, y) {
    if (numClic2 == 0) {
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        numClic2 = + 1;

        coordenadasPolilinea.push(new Coordenada(x, y));
    }
    else {
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        numClic2 = + 1;
        xf = x;
        yf = y;

        coordenadasPolilinea.push(new Coordenada(x, y));
    }
}

var coordenadasPoligono = [];
var poligono = function (x, y) {
    if (numClic3 == 0) // comienza el trazo del poligono
    {
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.strokeStyle = 'white';
        canvasContext.shadowColor="white";
        canvasContext.shadowBlur = 10;
        numClic3 = + 1;
        x1 = x;
        y1 = y;

        coordenadasPoligono.push(new Coordenada(x, y));
    }
    else if (numClic3 == -1) // termina el trazo del poligono (doble click)
    {
        canvasContext.closePath();
        canvasContext.stroke();
        canvasContext.strokeStyle = 'white';
        canvasContext.shadowColor="white";
        canvasContext.shadowBlur = 10;
        canvas
        numClic3 = 0;

        // coordenadasPoligono.push(new Coordenada(x, y));
        figuras.push(new Figura(Figura.POLIGONO(), coordenadasPoligono));
        coordenadasPoligono = [];
    }
    else {
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
        canvasContext.strokeStyle = 'white';
        canvasContext.shadowColor="white";
        canvasContext.shadowBlur = 10;
        numClic3 = + 1;
        coordenadasPoligono.push(new Coordenada(x, y));
    }
}

//OPCIONES
var opcion1 = function () {
    opcion = 1;
    numClic2 = 0;
    document.getElementById('btnPixel').classList.add('active');
    document.getElementById('btnLinea').classList.remove('active');
    document.getElementById('btnPolilinea').classList.remove('active');
    document.getElementById('btnPoligono').classList.remove('active');
}
var opcion2 = function () {
    opcion = 2;
    numClic2 = 0;
    document.getElementById('btnPixel').classList.remove('active');
    document.getElementById('btnLinea').classList.add('active');
    document.getElementById('btnPolilinea').classList.remove('active');
    document.getElementById('btnPoligono').classList.remove('active');
}
var opcion3 = function () {
    opcion = 3;
    numClic2 = 0;
    document.getElementById('btnPixel').classList.remove('active');
    document.getElementById('btnLinea').classList.remove('active');
    document.getElementById('btnPolilinea').classList.add('active');
    document.getElementById('btnPoligono').classList.remove('active');
}
var opcion4 = function () {
    opcion = 4;
    numClic2 = 0;
    document.getElementById('btnPixel').classList.remove('active');
    document.getElementById('btnLinea').classList.remove('active');
    document.getElementById('btnPolilinea').classList.remove('active');
    document.getElementById('btnPoligono').classList.add('active');
}

//COMUNICACIÓN CON EL SERVER
function Edificios(){
    var datos = new Filtro();
    enviarDatos(datos.EDIFICIOS());
}

function Facultades(){
    var datos = new Filtro();
    enviarDatos(datos.FACULTADES());
}

function AreasComun(){
    var datos = new Filtro();
    enviarDatos(datos.AULASCOMUN());
}

function Entretenimiento(){
    var datos = new Filtro();
    enviarDatos(datos.ENTRETENIMIENTO());
}

function enviarDatos(data){
    var json = JSON.stringify(data);
    socket.emit('action', json);
}

socket.on('figura', function(data) {
    console.log(String(data));
});
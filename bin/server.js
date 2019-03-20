var io = require('socket.io')();
var fs = require('fs');

var ruta = '/Users/rmfigueroa/Documents/GEO_Project/public/files/';

io.sockets.on('connection', function(socket){
    console.log('Hola amigo ' + socket.id);

    socket.on('action', function(data){
        var obj = JSON.parse(data);

        for(var i = 0;i < obj.length;i++) {
            var readFile = fs.readFileSync(ruta + obj[i], 'utf-8');
            console.log(readFile);

            socket.emit('figura', readFile);
        }
    });
});

module.exports = io;
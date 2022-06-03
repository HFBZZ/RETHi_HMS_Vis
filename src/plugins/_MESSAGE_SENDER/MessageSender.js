// var dgram = require('dgram');

// var server = dgram.createSocket('udp4');

// server.on('error', function(err) {
//     console.log(err);
//     server.close();
// });

// var socket = new WebSocket("ws://localhost:8889/ws");

export default function SendMessage(msg, field_to_modify) {
    console.log("Function wants to send message:", msg, "to update", field_to_modify);

    // socket.send(field_to_modify + ":" + msg);

    // var dgram = require('dgram');

    // var server = dgram.createSocket('udp4');

    // server.on('error', function(err) {
    //     console.log(err);
    //     server.close();
    // });
    
    // server.send(msg, port, 'localhost', function (err) {
    //     if (err) {
    //         console.log("ERROR SENDING MESSAGE");
    //     }
    //     else {
    //         console.log("Message: '", msg, "' sent to port", port);
    //     }
    // });
}
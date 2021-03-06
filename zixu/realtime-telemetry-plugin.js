/**
 * Basic Realtime telemetry plugin using websockets.
 */
function RealtimeTelemetryPlugin() {
    return function (openmct) {
        //var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
        var socket = new WebSocket("ws://localhost:8888/ws");
        var listener = {};

        socket.onmessage = function (event) {
            point = JSON.parse(event.data);
            // console.log(point)
            if (listener[point.id]) {
                listener[point.id](point);
            }
        };

        socket.onopen = function (event) {
            console.log("opened",event)
        };

        socket.onclose = function (event) {
            console.log("closed",event)
        };

        var provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'example.telemetry';
            },
            subscribe: function (domainObject, callback) {
                listener[domainObject.identifier.key] = callback;
                socket.send('subscribe ' + domainObject.identifier.key);
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key];
                    socket.send('unsubscribe ' + domainObject.identifier.key);
                };
            }
        };

        openmct.telemetry.addProvider(provider);
    }
}

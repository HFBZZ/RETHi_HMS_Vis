/**
 * Basic historical telemetry plugin.
 */

function HistoricalTelemetryPlugin() {
    return function install(openmct) {
        var provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'example.telemetry';
            },
            request: function (domainObject, options) {
                var url = 'http://localhost:9999/history/'
                    + domainObject.identifier.key
                    + '?start=' + options.start 
                    + '&end=' + options.end;
                console.log(url, options, domainObject.identifier.key)
                return http.get(url)
                    .then(function (resp) {
                        // console.log(resp)
                        return resp.data.data;
                    });
            }
        };

        openmct.telemetry.addProvider(provider);
    }
}

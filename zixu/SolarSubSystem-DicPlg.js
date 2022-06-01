function getDictionary() {
    return http.get('http://localhost:8080/zixu/dictionary2.json')
        .then(function (result) {
            return result.data;
        });
}

var objectProvider = {
    get: function (identifier) {
        return getDictionary().then(function (dictionary2) {
            if (identifier.key === 'spacecraft2') {
                return {
                    identifier: identifier,
                    name: dictionary2.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                var measurement = dictionary2.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'Solarsub',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'Solarsub:spacecraft2'
                };
            }
        });
    }
};

var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'Solarsub' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getDictionary()
            .then(function (dictionary2) {
                return dictionary2.measurements.map(function (m) {
                    return {
                        namespace: 'Solarsub',
                        key: m.key
                    };
                });
            });
    }
};

var SolarDictionaryPlugin = function (openmct) {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'Solarsub',
            key: 'spacecraft2'
        });

        openmct.objects.addProvider('Solarsub', objectProvider);

        openmct.composition.addProvider(compositionProvider);

        openmct.types.addType('Solarsub', {
            name: 'Solar Sub-System Telemetry Point',
            description: 'Solar sub system for the habitat',
            cssClass: 'icon-telemetry'
        });
    };
};
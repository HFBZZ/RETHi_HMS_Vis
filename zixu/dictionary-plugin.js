function getDictionary() {
    return http.get('http://localhost:8080/zixu/dictionary.json')
        .then(function (result) {
            return result.data;
        });
}

function getSubsystems() {
    return http.get('http://localhost:8080/zixu/subsystems.json')
        .then(function (result) {
            return result.data;
        });
}

// var subsystemObjProvider = {
//     get: function (identifier) {
//         return getSubsystems().then(function (arr) {
//             if (arr.map(function (m) {return m.name;}).includes(identifier.key)) {
//                 console.log("FOUND SUBSYSTEM: " + identifier.key);
//                 return {
//                     identifier: identifier,
//                     name: identifier.key,
//                     type: 'folder',
//                     location: 'example.taxonomy:spacecraft'
//                 };
//             }
//         });
//     }
// }

var objectProvider = {
    get: function (identifier) {
        return getSubsystems().then(function (arr) {
            return getDictionary().then(function (dictionary) {
                if (identifier.key === 'spacecraft') {
                    return {
                        identifier: identifier,
                        name: dictionary.name,
                        type: 'folder',
                        location: 'ROOT'
                    };
                } 
                else if (arr.map(function (m) {return m.name;}).includes(identifier.key)) {
                    console.log("FOUND SUBSYSTEM: " + identifier.key);
                    return {
                        identifier: identifier,
                        name: identifier.key,
                        type: 'folder',
                        location: 'example.taxonomy:spacecraft'
                    };
                }
                else {
                    var measurement = dictionary.measurements.filter(function (m) {
                        return m.key === identifier.key;
                    })[0];
                    var subsystem = measurement.name.split('/')[0];
                    return {
                        identifier: identifier,
                        name: measurement.name,
                        type: 'example.telemetry',
                        telemetry: {
                            values: measurement.values
                        },
                        location: 'example.taxonomy:spacecraft'
                    };
                }
            });
        });
    }
};

var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.key === 'spacecraft' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getSubsystems()
            .then(function (arr) {
                return arr.map(function (m) {
                    return {
                        namespace: 'example.taxonomy',
                        key: m.name
                    };
                })
            });
    }
};

var innerCompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.key != 'spacecraft' &&
               domainObject.identifier.namespace === 'example.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getDictionary()
            .then(function (dictionary) {
                return dictionary.measurements.filter(element => element.name.startsWith(domainObject.identifier.key)).map(function (m) {
                    return {
                        namespace: 'example.taxonomy',
                        key: m.key
                    };
                });
            });
    }
};

var DictionaryPlugin = function (openmct) {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'example.taxonomy',
            key: 'spacecraft'
        });

        openmct.objects.addProvider('example.taxonomy', objectProvider);
        // openmct.objects.addProvider('example.taxonomy:spacecraft', subsystemObjProvider);

        openmct.composition.addProvider(compositionProvider);
        openmct.composition.addProvider(innerCompositionProvider);

        console.log("INSTALLING");

        openmct.types.addType('example.telemetry', {
            name: 'Example Telemetry Point',
            description: 'Example telemetry point from our happy tutorial.',
            cssClass: 'icon-telemetry'
        });
    };
};

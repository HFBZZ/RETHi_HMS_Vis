function getDictionary() {
    return http.get('http://localhost:8080/zixu/dictionary.json')
        .then(function (result) {
            return result.data;
        });
}

function getSubsystemHierarchy() {
    return getDictionary().then(function (dictionary) {
        console.log(dictionary);
        var subsystem = {};
        dictionary.measurements.forEach(telem => {
            var folders = telem.name.split('/');
            var currfolder = subsystem;
            for(var i = 0; i < folders.length; i++) {
                if (currfolder[folders[i]] == null) {
                    currfolder[folders[i]] = {};
                }
                currfolder = currfolder[folders[i]]
            }
        });
        console.log("Subsystem Hierarchy:");
        console.log(subsystem);
        return subsystem;
    });
}

var objectProvider = {
    get: function (identifier) {
        return getDictionary().then(function (dictionary) {
            if (identifier.key === 'habitat') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } 
            else if (isNaN(identifier.key)) {
                console.log("FOUND SUBFOLDER: " + identifier.key);
                var pathname = identifier.key.split('/');
                return {
                    identifier: identifier,
                    name: pathname[pathname.length - 1],
                    type: 'folder',
                    location: 'habitat.taxonomy'
                };
            }
            else {
                var measurement = dictionary.measurements.find(entry => entry.key === identifier.key);
                var pathname = measurement.name.split('/');
                return {
                    identifier: identifier,
                    name: pathname[pathname.length - 1],
                    type: 'habitat.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'habitat.taxonomy'
                };
            }
        });
    }
};

var rootCompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.key === 'habitat' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getSubsystemHierarchy().then(function (hierarchy) {
            return getDictionary().then(function (dictionary) {
                return Object.keys(hierarchy).map(function (subfolder) {
                    var thisKey = subfolder;
                    if (Object.keys(hierarchy[subfolder]).length == 0) {
                        thisKey = dictionary.measurements.find(element => element.name == subfolder).key;
                    }
                    return {
                        namespace: 'habitat.taxonomy',
                        key: thisKey
                    };
                })
            });
        });
    }
};

var folderCompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.key != 'habitat' &&
               domainObject.identifier.namespace === 'habitat.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return getSubsystemHierarchy().then(function (hierarchy) {
            return getDictionary().then(function (dictionary) {
                var parentFolders = domainObject.identifier.key.split('/');
                var thisFolder = hierarchy;
                for(var i = 0; i < parentFolders.length; i++) {
                    thisFolder = thisFolder[parentFolders[i]]
                }
                console.log(thisFolder);
                return Object.keys(thisFolder).map(function (subfolder) {
                    var thisKey = domainObject.identifier.key + '/' + subfolder;
                    if (Object.keys(thisFolder[subfolder]).length == 0) {
                        thisKey = dictionary.measurements.find(element => element.name == domainObject.identifier.key + '/' + subfolder).key;
                    }
                    return {
                        namespace: 'habitat.taxonomy',
                        key: thisKey
                    };
                });
            });
        });
    }
}

var DictionaryPlugin = function (openmct) {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'habitat.taxonomy',
            key: 'habitat'
        });

        getSubsystemHierarchy().then(function (hier) {
            console.log("GETTING HIERARCHY");
        });

        openmct.objects.addProvider('habitat.taxonomy', objectProvider);

        openmct.composition.addProvider(rootCompositionProvider);
        openmct.composition.addProvider(folderCompositionProvider);

        console.log("INSTALLING");

        openmct.types.addType('habitat.telemetry', {
            name: 'Habitat Telemetry Point',
            description: 'Telemetry point for some habitat object.',
            cssClass: 'icon-telemetry'
        });
    };
};

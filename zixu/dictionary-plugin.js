/* 
 * Returns a Promise to retreive the dictionary of telemetry from the dictionary.json file.
 */
function getDictionary() {
    return http.get('http://localhost:8080/zixu/dictionary6-2.json')
        .then(function (result) {
            return result.data;
        });
}

/*
 * Returns a Promise to generate a heirarchy of folders and files from the dictionary file.
 * 
 * Example Hierarchy
 * { 
 *    mainFolder1:{ 
 *        subFolder1: {
 *            innerFile1: {}
 *        }, 
 *        subFolder2: {
 *            innerFile2: {}, 
 *            innerFile3: {}
 *        }, 
 *        subFile1: {}
 *    }, 
 *    mainFile1: {}
 * } 
 */
function getSubsystemHierarchy() {
    return getDictionary().then(function (dictionary) {
        console.log(dictionary);
        var subsystem = {};
        // Add each telemetry object to the heirarchy
        dictionary.measurements.forEach(telem => {
            var folders = telem.name.split('/');
            // Iterate down the folders of the current file path
            var currfolder = subsystem;
            for(var i = 0; i < folders.length; i++) {
                // Create an empty subfolder/file if it doesn't already exist
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

/*
 * Specifies the objects, and whether to classify them as folders or telemetry points. 
 */
var objectProvider = {
    get: function (identifier) {
        // Returns a Promise
        return getDictionary().then(function (dictionary) {
            // Specifies the habitat folder in ROOT
            if (identifier.key === 'habitat') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } 
            // Specifies all subfolders (not in ROOT)
            else if (isNaN(identifier.key)) {
                console.log("FOUND SUBFOLDER: " + identifier.key);
                // Makes the display name the most local portion of the pathname
                var pathname = identifier.key.split('/');
                return {
                    identifier: identifier,
                    name: pathname[pathname.length - 1],
                    type: 'folder',
                    location: 'example.taxonomy'
                };
            }
            // Specifies all telemetry
            else {
                var measurement = dictionary.measurements.find(entry => entry.key === identifier.key);
                // Makes the display name the most local portion of the pathname
                var pathname = measurement.name.split('/');
                return {
                    identifier: identifier,
                    name: pathname[pathname.length - 1],
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'example.taxonomy'
                };
            }
        });
    }
};

/*
 * Specifies which objects to place directly under the habitat folder in ROOT.
 */
var rootCompositionProvider = {
    // Applies to only the habitat folder in ROOT as the only parent folder
    appliesTo: function (domainObject) {
        return domainObject.identifier.key === 'habitat' &&
               domainObject.type === 'folder';
    },
    // Specifies all folders and telemetry points to put inside the habitat folder
    load: function (domainObject) {
        return getSubsystemHierarchy().then(function (hierarchy) {
            return getDictionary().then(function (dictionary) {
                // Add all top-level files and folders
                return Object.keys(hierarchy).map(function (subfolder) {
                    // Sets the key as the full path up to the subfolder (assuming it is a folder and not a file)
                    var thisKey = subfolder;
                    // If the object has no subfolders in the hierarchy, then it is a file, so we should edit the key accordingly
                    if (Object.keys(hierarchy[subfolder]).length == 0) {
                        thisKey = dictionary.measurements.find(element => element.name == subfolder).key;
                    }
                    return {
                        namespace: 'example.taxonomy',
                        key: thisKey
                    };
                })
            });
        });
    }
};

/*
 * Specifies which objects to place directly under each folder.
 */
var folderCompositionProvider = {
    // Applies to any folder besides the habitat folder in ROOT
    appliesTo: function (domainObject) {
        return domainObject.identifier.key != 'habitat' &&
               domainObject.identifier.namespace === 'example.taxonomy' &&
               domainObject.type === 'folder';
    },
    // Specifies all folders and telemetry points to put inside the each non-habitat folder
    load: function (domainObject) {
        return getSubsystemHierarchy().then(function (hierarchy) {
            return getDictionary().then(function (dictionary) {
                var parentFolders = domainObject.identifier.key.split('/');
                // Navigate down to the the current folder in the hierarchy
                var thisFolder = hierarchy;
                for(var i = 0; i < parentFolders.length; i++) {
                    thisFolder = thisFolder[parentFolders[i]]
                }
                // Add all files and folders that are this folder's children in the hierarchy
                return Object.keys(thisFolder).map(function (subfolder) {
                    // Sets the key as the full path up to the subfolder (assuming it is a folder and not a file)
                    var thisKey = domainObject.identifier.key + '/' + subfolder;
                    // If the object has no subfolders in the hierarchy, then it is a file, so we should edit the key accordingly
                    if (Object.keys(thisFolder[subfolder]).length == 0) {
                        thisKey = dictionary.measurements.find(element => element.name == domainObject.identifier.key + '/' + subfolder).key;
                    }
                    return {
                        namespace: 'example.taxonomy',
                        key: thisKey
                    };
                });
            });
        });
    }
}

/*
 * Creates the domainObjects and composes them hierarchically
 */
var DictionaryPlugin = function (openmct) {
    return function install(openmct) {
        // Creates the habitat folder in the root directory
        openmct.objects.addRoot({
            namespace: 'example.taxonomy',
            key: 'habitat'
        });

        // Specifies the objects
        openmct.objects.addProvider('example.taxonomy', objectProvider);

        // Specifies the composition of the objects in the file tree
        openmct.composition.addProvider(rootCompositionProvider);
        openmct.composition.addProvider(folderCompositionProvider);

        openmct.types.addType('example.telemetry', {
            name: 'Habitat HMS Telemetry Point',
            description: 'Example telemetry point from our happy tutorial.',
            cssClass: 'icon-telemetry'
        });
    };
};

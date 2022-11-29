import ThreshAlert from './components/ThreshAlert.vue';
import Vue from 'vue';
import ConvertToDataID from '../_MESSAGE_SENDER/NameDataIDConverter'

/* 
 * Returns a Promise to retreive the dictionary of telemetry from the dictionary.json file.
 */
function getDictionary() {
    return http.get('http://localhost:8080/zixu/dictionary6-3.json')
        .then(function (result) {
            return result.data;
        });
}

/* 
 * Subscribes to a domainObject with the specified data_id (including .0 or whatever desired index of the signal size).
 * This runs the function specified by callback(datum) every time the data is updated.
 */
function SubscribeToSpecifiedDomainObj(callback, specifiedKey) {
    return getDictionary().then(function (dictionary) {
        var measurement = dictionary.measurements.find(entry => entry.key === specifiedKey);
        var pathname = measurement.name.split('/');
        // Specifies the domainObject to retrieve
        openmct.telemetry.subscribe({
            identifier: {
                namespace: 'example.taxonomy',
                key: specifiedKey
            },
            name: pathname[pathname.length - 1],
            type: 'example.telemetry',
            telemetry: {
                values: measurement.values
            },
            location: 'example.taxonomy'
            }, callback);
        
        console.log("Subscribed");
    });
}

export default function ThreshAlertPlugin(options) {
    return function install(openmct) {
        openmct.types.addType('threshAlert', {
            name: 'Threshold Alert Widget',
            description: 'A widget that pops up an alert when a threshold is crossed',
            creatable: true,
            cssClass: "icon-minus",
            initialize: function (domainObject) {
                domainObject.target = 'temperature';
                domainObject.threshold = 0;
                domainObject.message = "ALERT: This is an alert!";
            },
            form: [
                {
                    "key": "target",
                    "name": "Target Threshold Telemetry",
                    "control": "textfield",
                    property: [
                        'target'
                    ],
                    "cssClass": "l-input-lg"
                },
                {
                    "key": "threshold",
                    "name": "Threshold Value",
                    "control": 'numberfield',
                    required: true,
                    "cssClass": 'l-inline',
                    property: [
                        'threshold'
                    ],
                },
                {
                    "key": "alert",
                    "name": "Alert Message",
                    "control": "textfield",
                    property: [
                        'message'
                    ],
                    "cssClass": "l-input-lg"
                },
            ]
        });

        // openmct.objectViews.addProvider(new ButtonViewProvider(openmct));

        openmct.objectViews.addProvider({
            name: "demo-provider",
            key: "thresh-alert",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'threshAlert';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {
                        vm = new Vue(ThreshAlert);
                        vm.$data.internalDomainObj = domainObject;
                        container.appendChild(vm.$mount().$el);
                        // Tracking the target telemetry
                        var set_pt_data_id = ConvertToDataID(domainObject.target) + ".0";
                        SubscribeToSpecifiedDomainObj(function (datum) {
                            if (datum.value >= domainObject.threshold) {
                                vm.$data.alertMsg = domainObject.message;
                            }
                        }, set_pt_data_id);
                    },
                    destroy: function (container) {
                        vm.$destroy();
                    }
                };
            }
        });
    }
}
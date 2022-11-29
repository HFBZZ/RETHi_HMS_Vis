import Thermostat from './components/Thermostat.vue';
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

export default function ThermostatPlugin(options) {
    return function install(openmct) {
        openmct.types.addType('thermostat', {
            name: 'Thermostat Controller',
            description: 'A mechanism for controlling temperature',
            creatable: true,
            cssClass: "icon-minus",
            initialize: function (domainObject) {
                domainObject.label = 'Thermostat';
                domainObject.target = 'temperature_set_point';
                domainObject.tracking = 'temperature';
                domainObject.step = 0.5;
                domainObject.bonus_width = 0;
                domainObject.units = "°C"
            },
            form: [
                {
                    "key": "target",
                    "name": "Target Telemetry",
                    "control": "textfield",
                    property: [
                        'target'
                    ],
                    "cssClass": "l-input-lg"
                },
                {
                    "key": "tracking",
                    "name": "Tracked Telemetry",
                    "control": "textfield",
                    property: [
                        'tracking'
                    ],
                    "cssClass": "l-input-lg"
                },
                {
                    "key": "step_size",
                    "name": "Step Size",
                    "control": 'numberfield',
                    required: true,
                    "cssClass": 'l-inline',
                    property: [
                        'step'
                    ],
                },
                {
                    "key": "bonus_width",
                    "name": "Bonus Width",
                    "control": 'numberfield',
                    required: true,
                    "cssClass": 'l-inline',
                    property: [
                        'bonus_width'
                    ],
                },
                {
                    "key": "units",
                    "name": "Units",
                    "control": "textfield",
                    property: [
                        'units'
                    ],
                    "cssClass": "l-input-sm"
                },
            ]
        });

        openmct.objectViews.addProvider({
            name: "demo-provider",
            key: "thermostat",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'thermostat';
            },
            view: function (domainObject) {
                var vm;              

                return {
                    show: function (container) {
                        vm = new Vue(Thermostat);
                        vm.$data.set_point = domainObject.setpoint;
                        vm.$data.internalDomainObj = domainObject;
                        container.appendChild(vm.$mount().$el);
                        // Set up real-time updating of the set point
                        var set_pt_data_id = ConvertToDataID(domainObject.target + "_response") + ".0";
                        SubscribeToSpecifiedDomainObj(function (datum) {
                            if (!vm.$data.is_editing && !vm.$data.is_updating) {
                                vm.$data.set_point = datum.value;
                            }
                            vm.$data.mode = Math.max(Math.min( datum.value - vm.$data.temp, 1), -1);
                        }, set_pt_data_id);
                        // Set up real-time updating of the tracked telemetry (temperature)
                        var tracked_data_id = ConvertToDataID(domainObject.tracking) + ".0";
                        SubscribeToSpecifiedDomainObj(function (datum) {
                            vm.$data.temp = datum.value;
                            if (Math.floor(domainObject.step) == domainObject.step) {
                                vm.$data.decimal_places = 0;
                            }
                            else {
                                vm.$data.decimal_places = domainObject.step.toString().split('.')[1].length || 0;
                            }
                        }, tracked_data_id);
                    },
                    destroy: function (container) {
                        vm.$destroy();
                    }
                };
            }
        });
    }
}
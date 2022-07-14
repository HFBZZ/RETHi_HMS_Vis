import Button from './components/Thermostat.vue';
import Vue from 'vue';

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
                domainObject.setpoint = 0;
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
                        vm = new Vue(Button);
                        vm.$data.internalDomainObj = domainObject;
                        container.appendChild(vm.$mount().$el);
                    },
                    destroy: function (container) {
                        vm.$destroy();
                    }
                };
            }
        });
    }
}
import Switch from './components/Switch.vue';
import Vue from 'vue';

export default function ButtonPlugin(options) {
    return function install(openmct) {
        openmct.types.addType('telemSwitch', {
            name: 'Telemetry Control Switch',
            description: 'A switch to toggle some value in the database',
            creatable: true,
            cssClass: "icon-minus",
            initialize: function (domainObject) {
                domainObject.label = 'Custom Switch';
                domainObject.target = 'thermal_set_point';
            },
            form: [
                {
                    "key": "swtch_txt",
                    "name": "Switch Text",
                    "control": "textfield",
                    property: [
                        'label'
                    ],
                    "cssClass": "l-input-lg"
                },
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
            key: "test-switch",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'telemSwitch';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {
                        vm = new Vue(Switch);
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
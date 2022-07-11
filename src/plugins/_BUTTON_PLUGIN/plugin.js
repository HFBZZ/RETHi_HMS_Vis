import Button from './components/Button.vue';
import Vue from 'vue';

export default function ButtonPlugin(options) {
    return function install(openmct) {
        openmct.types.addType('testButton', {
            name: 'Telemetry Control Button',
            description: 'A field and a button to update some value in the database',
            creatable: true,
            cssClass: "icon-minus",
            initialize: function (domainObject) {
                domainObject.label = 'Custom Button';
                domainObject.target = 'thermal_set_point';
                domainObject.inputWidth = '40';
            },
            form: [
                {
                    "key": "btn_txt",
                    "name": "Button Text",
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
                {
                    "key": "input_width",
                    "name": "Input Width",
                    "control": "textfield",
                    property: [
                        'inputWidth'
                    ],
                    "cssClass": "l-input-sm"
                },
            ]
        });

        // openmct.objectViews.addProvider(new ButtonViewProvider(openmct));

        openmct.objectViews.addProvider({
            name: "demo-provider",
            key: "test-button",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'testButton';
            },
            view: function (domainObject) {
                var vm;
                document.documentElement.style.setProperty('--input-field-width', domainObject.inputWidth);

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
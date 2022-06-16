import BasicDelay from './components/BasicDelay.vue';
import Vue from 'vue';

export default function DelayTracker(options) {
    return function install(openmct) {
        openmct.types.addType('delayTracker', {
            name: 'Communication Delay Tracker',
            description: 'Tracks the delay between Mars and Earth given a date',
            creatable: true,
            cssClass: "icon-minus",
            initialize: function (domainObject) {
                domainObject.date = "1/1/2021";
                domainObject.dateType = "current";
                domainObject.format = "m,s";
            },
            form: [
                {
                    "key": "dateType",
                    "name": "Date",
                    control: 'select',
                    options: [
                        {
                            name: 'Current Date',
                            value: "Current"
                        },
                        {
                            name: 'Custom Date',
                            value: "Custom"
                        }
                    ],
                    property: [
                        'dateType'
                    ],
                    cssClass: 'l-inline',
                },
                {
                    "key": "date_txt",
                    "name": "Custom Date (mm/dd/yyyy)",
                    "control": "textfield",
                    property: [
                        'date'
                    ],
                    "cssClass": "l-input-lg"
                },
                {
                    "key": "delay-format",
                    "name": "Delay Format",
                    control: 'select',
                    options: [
                        {
                            name: 'minutes and seconds',
                            value: "m,s"
                        },
                        {
                            name: 'mm:ss',
                            value: "m:s"
                        },
                        {
                            name: 'seconds',
                            value: "s"
                        },
                    ],
                    property: [
                        'format'
                    ],
                    cssClass: 'l-inline',
                },
            ]
        });

        // openmct.objectViews.addProvider(new ButtonViewProvider(openmct));

        openmct.objectViews.addProvider({
            name: "demo-provider",
            key: "delay-tracker",
            cssClass: "icon-packet",
            canView: function (d) {
                return d.type === 'delayTracker';
            },
            view: function (domainObject) {
                var vm;

                return {
                    show: function (container) {
                        vm = new Vue(BasicDelay);                  
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
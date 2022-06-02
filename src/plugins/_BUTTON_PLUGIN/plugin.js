import ButtonViewProvider from './ButtonViewProvider';

import Button from './components/Button.vue';
import Vue from 'vue';

export default function ButtonPlugin(options) {
    return function install(openmct) {
        openmct.types.addType('testButton', {
            name: 'Test Button',
            description: 'A clickable object',
            creatable: true,
            cssClass: "icon-minus"
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

                return {
                    show: function (container) {
                        vm = new Vue(Button);
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
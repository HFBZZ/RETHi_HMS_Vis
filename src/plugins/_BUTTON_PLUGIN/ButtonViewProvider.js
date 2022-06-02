import Button from './components/Button.vue';
import Vue from 'vue';

export default function ButtonViewProvider(openmct) {
    return {
        key: 'testButton.view',
        name: 'Test Button',
        cssClass: "icon-minus",
        canView(domainObject) {
            return domainObject.type === 'testButton';
        },

        view: function (domainObject) {
            let component;

            return {
                show: function (element) {
                    component = new Vue({
                        el: element,
                        components: {
                            Button
                        },
                        provide: {
                            openmct,
                            domainObject
                        },
                        template: '<testButton />'
                    });
                },
                destroy: function () {
                    component.$destroy();
                    component = undefined;
                }
            };
        }
    };
}
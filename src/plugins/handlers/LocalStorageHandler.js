import LocalStorage from '@/plugins/classes/LocalStorage.js';

export default {
    install(Vue, options) {
        Vue.mixin({
            mounted() {
                LocalStorage.app = this;
            }
        });

        LocalStorage.options = options;

        Vue.prototype.$localStorage = LocalStorage;
    },
};
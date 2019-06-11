import Loading from '@/plugins/classes/Loading.js';

export default {
    install(Vue, options) {
        Vue.mixin({
            mounted() {
                Loading.app = this;
            }
        });

        Loading.options = options;

        Vue.prototype.$loading = Loading;
    },
};
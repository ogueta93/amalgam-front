import Battle from '@/plugins/classes/Battle';

export default {
    install(Vue, options) {
        Vue.mixin({
            mounted() {
                Battle.app = this;
            }
        });

        Battle.options = options;

        Vue.prototype.$battle = Battle;
    },
};
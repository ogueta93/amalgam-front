import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import BootstrapVue from 'bootstrap-vue';

Vue.use(VueAxios, Axios);
Vue.use(BootstrapVue);

/** App Components */
import App from '@/App.vue'
import Router from '@/router';
import Config from '@/config';

/** Plugins */
import WebScoketPlugin from '@/plugins/handlers/WebSocketHandler';
import LocalStoragePlugin from '@/plugins/handlers/LocalStorageHandler';
import LoadingPlugin from '@/plugins/handlers/LoadingHandler';

Vue.use(WebScoketPlugin);
Vue.use(LocalStoragePlugin);
Vue.use(LoadingPlugin);

/** i18n */
import i18n from './i18n';

Vue.config.productionTip = false;

const vue = new Vue({
    el: "#app",
    router: Router,
    i18n: i18n,
    render: h => h(App),

    data() {
        return {
            config: Config,
            locale: navigator.languages[0],
            lang: navigator.languages[1],
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    },
    mounted: function()
    {
        i18n.locale = this.lang,
        this.$webSocket.start();
    }
});

window.app = vue;

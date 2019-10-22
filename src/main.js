import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

/** App Components */
import App from '@/App.vue'
import Router from '@/router';

/** Plugins */
import WebScoketPlugin from '@/plugins/handlers/WebSocketHandler';
import LocalStoragePlugin from '@/plugins/handlers/LocalStorageHandler';
import LoadingPlugin from '@/plugins/handlers/LoadingHandler';
import BattlePlugin from '@/plugins/handlers/BattleHandler';

Vue.use(WebScoketPlugin);
Vue.use(LocalStoragePlugin);
Vue.use(LoadingPlugin);
Vue.use(BattlePlugin);

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
            locale: navigator.languages[0],
            lang: navigator.languages[1],
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            isBrowser: !(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
            pwaMode: window.matchMedia('(display-mode: fullscreen)').matches
        };
    },
    mounted() {
        i18n.locale = this.lang;
        this.$webSocket.start();

        if (this.pwaMode) {
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute('content', 'width=device-width, height='+ window.innerHeight +', initial-scale=1.0');

            window.addEventListener("orientationchange", () => {
                window.setTimeout(() => {
                    viewport.setAttribute('content', 'width=device-width, height='+ window.innerHeight +', initial-scale=1.0');
                }, 200);
            });
        }
    }
});

window.app = vue;

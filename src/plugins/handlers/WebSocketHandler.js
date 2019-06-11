import WebSocket from '@/plugins/classes/WebSocket.js';

export default {
    install(Vue, options) {
        Vue.mixin({
            mounted() {
                WebSocket.app = this;
            }
        });

        WebSocket.options = options;

        Vue.prototype.$webSocket = WebSocket;
    },
};
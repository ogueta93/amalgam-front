import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';

const READY_STATE_OPENED = 1;

export default {
    app: null,
    options: null,

    socket: null,
    webSocketUrl: process.env.VUE_APP_WEBSOCKET_URL,
    regexGameRoute: /^\/game/i,
    token: JSON.parse(window.localStorage.getItem('token')),
    repeatMs: 500,
    heartBeatMs: 10000,

    wsEvents: {},

    utils: {
        utoa: (str) => {
            return window.btoa(unescape(encodeURIComponent(str)));
        }
    },

    start() {
        this.socket = new WebSocket(this.webSocketUrl);
        this.__setSocketLogic();
    },
    checkConnectionStatus() {
        return this.socket && this.socket.readyState === READY_STATE_OPENED;
    },

    sendAction(action, content) {
        this.__sendWsAction(action, null, content);
    },
    sendComplexAction(action, name, content, callback, callbackError) {
        if (!(callback instanceof Function)) {
            throw 'callback must be a Function';
        }

        this.__sendWsAction(action, name, content, callback, callbackError);
    },
    setEvent(action, name, callback, callbackError) {
        this.$setWsEvent(action, name, callback, callbackError);
    },

    __setSocketLogic() {
        var that = this;
        // Connection opened
        this.socket.onopen = () => {
            if (that.regexGameRoute.test(that.app.$router.currentRoute.fullPath)) {
                that.sendAction(ACTION.CHECK_SECURE_CONNECTION_ACTION, {});
            }

            setInterval(() => {
                that.__heartBeat();
            }, that.heartBeatMs);
        };

        this.socket.onclose = () => {
            console.log(this, 'Connection close');
        };

        this.socket.onerror = () => {
            console.log(this, 'Connection error');
        };

        // Listen for messages
        this.socket.onmessage = (event) => {
            var data = JSON.parse(atob(event.data));

            if (data.t) {
                that.token = data.t;
                that.app.$localStorage.setData('token', that.token);
            }

            data.c.forEach((element) => {
                if (element.e)
                {
                    that.$wsEmit(element.ra, element.e, true);
                } else {
                    that.$wsEmit(element.ra, element.m);
                }    
            });

            console.log('Message from server ', data);
        };
    },
    __heartBeat() {
        if (!this.socket) return;
        if (this.socket.readyState !== 1) return;
        this.sendAction(ACTION.HEART_BEAT, {});
    },
    __sendWsAction(action, name, content, callback, callbackError) {
        var data = {};
        data.a = action;

        callback = callback || function(){};

        this.$setWsEvent(action, name, callback, callbackError, true);

        if (content !== undefined && content instanceof Object) {
            data.c = content;
        }

        if (this.token !== null) {
            data.t = this.token.token;
        }

        data.ev = {
            l: this.app.$root.locale
        };

        this.__processSendMessage(data);
    },
    __processSendMessage(data) {
        if (this.checkConnectionStatus()) {
            this.__sendMessage(data);
        } else {
            this.__trySending(data);
        }
    },
    __sendMessage(data) {
        console.log('message send', data);
        this.socket.send(this.utils.utoa(JSON.stringify(data)));
    },
    __trySending(data) {
        var that = this;

        var connectionIntervarl = setInterval(() => {
            console.log('reconneting', data);
            if (that.checkConnectionStatus()) {
                clearInterval(connectionIntervarl);
                that.__processSendMessage(data);
            } else {
                that.start();
            }
        }, this.repeatMs);
    },

    $setWsEvent(action, name, callback, callbackError, once) {
        var that = this;

        var callbackEvent = (response, error) => {
            if (error) {
                if (callbackError instanceof Function) {
                    callbackError(response);
                } else if (callbackError === true) {
                    callback(response, error);            
                } else {
                    that.app.$root.$emit(EVENT.ERROR_EVENT, response);
                }
            } else {
                callback(response, false);
            }
        };

        if (once !== undefined && once === true) {
            this.$wsOnce(action, name, callbackEvent);
        } else {
            this.$wsOn(action, name, callbackEvent);
        }
    },
    $wsOn(name, identifier, fn) {
        var event = {
            fn: fn,
            identifier: identifier
        };

        if (this.wsEvents[name] !== undefined) {
            var finded = false;

            this.wsEvents[name].forEach((wsEvent) => {
                if (wsEvent.identifier === event.identifier) {
                    finded = true;
                    return;
                }
            });

            if (!finded){
                this.wsEvents[name].push(event);
            }
        } else {
           this.wsEvents[name] = [event];
        }
    },
    $wsOnce(name, identifier, fn) {
        var that = this;

        var onceFn = function() {
            fn.apply(that, arguments);
            that.$wsOff(name, identifier);
        };

        this.$wsOn(name, identifier, onceFn);
    },
    $wsEmit(name) {
        var that = this;
        var params = Array.prototype.slice.call(arguments);

        params = params.filter((element, index) => {
            return index !== 0;
        });

        var wsEvent = this.wsEvents[name];
        if (wsEvent) {
            wsEvent.forEach((event) => {
                event.fn.apply(that, params);
                return;
            });
        }
    },
    $wsOff(name, identifier) {
        if (identifier === undefined) {
            delete this.wsEvents[name];
        } else if (this.wsEvents[name] !== undefined) {    
            var events = this.wsEvents[name].filter((wsEvent) => {
                return wsEvent.identifier !== identifier;
            });

            if (events.length) {
                this.wsEvents[name] = events;
            } else {
                delete this.wsEvents[name];
            }
        }
    }
};
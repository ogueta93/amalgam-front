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

    wsEvents: {},

    utils: {
        utoa: function(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        }
    },

    start: function() {
        this.socket = new WebSocket(this.webSocketUrl);
        this.__setSocketLogic();
    },
    checkConnectionStatus: function() {
        return this.socket && this.socket.readyState === READY_STATE_OPENED;
    },

    sendAction: function(action, content) {
        this.__sendWsAction(action, null, content);
    },
    sendComplexAction: function(action, name, content, callback, callbackError) {
        if (!(callback instanceof Function)) {
            throw 'callback must be a Function';
        }

        this.__sendWsAction(action, name, content, callback, callbackError);
    },
    setEvent: function(action, name, callback, callbackError) {
        this.$setWsEvent(action, name, callback, callbackError);
    },

    __setSocketLogic: function() {
        var that = this;
        // Connection opened
        this.socket.onopen = function(event) {
            if (that.regexGameRoute.test(that.app.$router.currentRoute.fullPath)) {
                that.sendAction(ACTION.CHECK_SECURE_CONNECTION_ACTION, {});
            }
        };

        this.socket.onclose = function(event) {
            console.log(this, 'Connection close');
        };

        this.socket.onerror = function(event) {
            console.log(this, 'Connection error');
        };

        // Listen for messages
        this.socket.onmessage = function (event) {
            var data = JSON.parse(atob(event.data));

            if (data.t) {
                that.token = data.t;
                that.app.$localStorage.setData('token', that.token);
            }

            data.c.forEach(function(element) {
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
    __sendWsAction: function(action, name, content, callback, callbackError) {
        var data = {};
        data.a = action;

        var callback = callback || function(){};

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
    __processSendMessage: function(data) {
        if (this.checkConnectionStatus()) {
            this.__sendMessage(data);
        } else {
            this.__trySending(data);
        }
    },
    __sendMessage: function(data) {
        console.log('message send', data);
        this.socket.send(this.utils.utoa(JSON.stringify(data)));
    },
    __trySending: function(data) {
        var that = this;

        var connectionIntervarl = setInterval(function() {
            console.log('reconneting', data);
            if (that.checkConnectionStatus()) {
                clearInterval(connectionIntervarl);
                that.__processSendMessage(data);
            } else {
                that.start();
            }
        }, this.repeatMs);
    },

    $setWsEvent: function(action, name, callback, callbackError, once) {
        var that = this;

        var callbackEvent = function(response, error) {
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
    $wsOn: function(name, identifier, fn) {
        var event = {
            fn: fn,
            identifier: identifier
        };

        if (this.wsEvents[name] !== undefined) {
            var finded = false;

            this.wsEvents[name].forEach(function(wsEvent) {
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
    $wsOnce: function(name, identifier, fn) {
        var that = this;

        var onceFn = function() {
            fn.apply(that, arguments);
            that.$wsOff(name, identifier);
        };

        this.$wsOn(name, identifier, onceFn);
    },
    $wsEmit: function(name) {
        var that = this;
        var params = Array.prototype.slice.call(arguments);

        params = params.filter(function(element, index) {
            return index !== 0;
        })

        var wsEvent = this.wsEvents[name];
        if (wsEvent) {
            wsEvent.forEach(function(event) {
                event.fn.apply(that, params);
                return;
            });
        }
    },
    $wsOff: function(name, identifier) {
        if (identifier === undefined) {
            delete this.wsEvents[name];
        } else if (this.wsEvents[name] !== undefined) {    
            var events = this.wsEvents[name].filter(function(wsEvent) {
                return wsEvent.identifier !== identifier
            });

            if (events.length) {
                this.wsEvents[name] = events;
            } else {
                delete this.wsEvents[name];
            }
        }
    }
}
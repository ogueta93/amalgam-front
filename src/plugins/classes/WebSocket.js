import EVENT_CONSTANTS from '@/constants/Event';

export default {
    app: null,
    options: null,

    socket: null,
    connected: false,
    token: JSON.parse(window.localStorage.getItem('token')),
    repeatMs: 100,

    wsEvents: {},

    utils: {
        utoa: function(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        }
    },

    start: function() {
        this.socket = new WebSocket(this.app.config.webSocketUrl);

        this.setSocketLogic();
    },
    setSocketLogic: function() {
        var that = this;
        // Connection opened
        this.socket.addEventListener('open', function (event) {
            console.log('Connection start now');
            that.connected = true;
        });

        // Listen for messages
        this.socket.addEventListener('message', function (event) {
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
        });
    },

    sendAction: function(action, content) {
        this.sendWsAction(action, null, content);
    },
    sendComplexAction: function(action, name, content, callback, callbackError) {
        if (!(callback instanceof Function)) {
            throw 'callback must be a Function';
        }

        this.sendWsAction(action, name, content, callback, callbackError);
    },
    sendWsAction: function(action, name, content, callback, callbackError) {
        var data = {};
        data.a = action;

        if (callback instanceof Function) {
            this.setWsEvent(action, name, callback, callbackError, true);
        }

        if (content !== undefined && content instanceof Object) {
            data.c = content;
        }

        if (this.token !== null) {
            data.t = this.token.token;
        }

        data.ev = {
            l: this.app.$root.locale
        };

        if (this.connected) {
            this.sendMessage(data);
        } else {
            this.trySending(data);
        }
    },
    setEvent: function(action, name, callback, callbackError) {
        this.setWsEvent(action, name, callback, callbackError);
    },
    setWsEvent: function(action, name, callback, callbackError, once) {
        var that = this;

        var callbackEvent = function(response, error) {
            if (error) {
                if (callbackError instanceof Function) {
                    callbackError(response);
                } else if (callbackError === true) {
                    callback(response, error);            
                } else {
                    that.app.$root.$emit(EVENT_CONSTANTS.ERROR_EVENT, response);
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
    sendMessage: function(data) {
        console.log(data);
        this.socket.send(this.utils.utoa(JSON.stringify(data)));
    },
    trySending: function(data) {
        var that = this;

        var connectionIntervarl = setInterval(function() {
            console.log('reconneting', data);
            if (that.connected) {
                console.log('ok reconnecting', data);
                that.sendMessage(data);
                clearInterval(connectionIntervarl);
            }
        }, this.repeatMs);
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
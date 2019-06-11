export default {
    app: null,
    options: null,
    data: window.localStorage,

    getLocalStorage: function() {
        return this.data;
    },
    getData: function(key) {
        var data = window.localStorage.getItem(key);

        return data === null ? data : JSON.parse(data);
    },
    setData: function(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    },
    removeData: function(key) {
        localStorage.removeItem(key);
    },

    getUser: function() {
        return this.getData('token').user;
    }
}
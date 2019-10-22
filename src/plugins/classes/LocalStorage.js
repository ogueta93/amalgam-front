export default {
    app: null,
    options: null,
    data: window.localStorage,

    getLocalStorage() {
        return this.data;
    },
    getData(key) {
        var data = window.localStorage.getItem(key);

        return data === null ? data : JSON.parse(data);
    },
    setData(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    },
    removeData(key) {
        localStorage.removeItem(key);
    },

    getUser() {
        return this.getData('token').user;
    }
}
export default {
    app: null,
    options: null,
    data: null,

    /** Battle properties */

    setData: function(data) {
        this.data = data;
    },
    getData: function() {
        return this.data;
    },
    getPhase: function() {
        return this.data.progress.main.phase;
    },
}
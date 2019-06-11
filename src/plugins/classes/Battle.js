export default {
    app: null,
    options: null,
    data: null,
    battle: null

    /** Battle properties */

    setData: function(data) {
        this.data = data;

        this.setProperties();
    },
    setProperties: function() {
        var that = this;

        this.battle = {
            id: that.data.id
        };
    }
}
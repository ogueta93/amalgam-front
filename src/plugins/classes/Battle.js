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
    getId: function() {
        return this.data.id;
    },
    getPhase: function() {
        return this.data.progress.main.phase;
    },
    getCardsSelected: function(userId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return [];
        }

        var cardsSelected = this.data.progress.main.cardsSelection.filter(function(obj) {
            return obj.userId === userId;
        })

        return cardsSelected.length !== undefined ? cardsSelected[0].cards : [];
    },
    getInitialTurn: function(userId) {
        if (this.data.progress.main.cointThrow === undefined) {
            return [];
        }

        var initialTurn;
        this.data.progress.main.cointThrow.forEach(function(obj, index) {
            if (obj.userId === userId) {
                initialTurn = index === 0 ? 1 : 2;
                return;
            }
        });

        return initialTurn;
    }
}
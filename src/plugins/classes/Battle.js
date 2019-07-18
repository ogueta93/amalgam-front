export default {
    app: null,
    options: null,
    data: null,

    /** Battle properties */

    setData: function(data) {
        this.data = data;
        this.vitaminizeCards();
        this.vitaminizeInBoardCards();
    },
    vitaminizeCards: function() {
        if (this.data.progress.main.cardsSelection === undefined) {
            return;
        }
        
        this.data.progress.main.cardsSelection.forEach(function(obj) {
            obj.cards.forEach(function(element, index, array) {
                array[index].selectedInbattle = false;
            });
        });
    },
    vitaminizeInBoardCards: function() {
        if (this.data.progress.battleField === undefined) {
            return;
        }
        
        this.data.progress.battleField.board.forEach(function(row) {
            row.forEach(function(field, index, array) {
                if (field.card !== undefined) {
                    array[index].card.recentlyPlaced = false;
                    array[index].card.recentlyCaptured = false;
                }
            });
        });
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

        var cardsSelected = [];
        this.data.progress.main.cardsSelection.forEach(function(obj) {
            if (obj.userId === userId) {
                cardsSelected = obj.cards.filter(function(element) {
                    return !element.placed;
                });
                return;
            }
        });

        return cardsSelected.length ? cardsSelected : [];
    },
    getCardsCapturedByUserId: function(userId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return [];
        }

        var cardsCaptured = [];
        this.data.progress.main.cardsSelection.forEach(function(obj) {
            obj.cards.forEach(function(card) {
                if ((obj.userId === userId) && !card.captured) {
                    cardsCaptured.push(card);
                } else if ((obj.userId !== userId) && card.captured) {
                    cardsCaptured.push(card);
                }
            });
        });

        return cardsCaptured.length ? cardsCaptured : [];
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
    },
    getRival: function(playerId) {
        var rival = this.data.users.filter(function(obj){
            return obj.user.id !== playerId;
        });

        return rival.length ? rival[0].user : null;
    },
    getBoard: function() {
        if (this.data.progress.battleField === undefined) {
            return [];
        }

        return this.data.progress.battleField.board;
    },
    getCurrentTurn: function() {
        if (this.data.progress.turns === undefined) {
            return null;
        }
        
        var turns = this.data.progress.turns;
        return turns[turns.length - 1];
    },
    getPlayerOwnership: function(userCardId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return null;
        }

        var userId = null;
        this.data.progress.main.cardsSelection.forEach(function(obj) {
            obj.cards.forEach(function(element) {
               if (element.userCardId === userCardId) {
                   userId = obj.userId;
                   return;
               }
            });
        });

        var user = this.data.users.filter(function(obj) {
            return obj.user.id === userId;
        });

        return user.length ? user[0].user : null;
    },
    getLastMovement: function() {
        if (this.data.progress.turns === undefined) {
            return null;
        }

        var lasTurn = this.data.progress.turns[this.data.progress.turns.length - 1].completed === true ? 
            this.data.progress.turns[this.data.progress.turns.length - 1] : this.data.progress.turns[this.data.progress.turns.length - 2];
        
        return lasTurn.movement;
    },
    getLastCardsCaptured: function() {
        var lastMovement = this.getLastMovement();
        if (!lastMovement) {
            return null;
        }

        var cardsCaptured = [];
        if (lastMovement.cardsCaptured.length) {
            cardsCaptured = cardsCaptured.concat(lastMovement.cardsCaptured);

            if (lastMovement.combo !== undefined) {
                lastMovement.combo.forEach(function(obj) {
                    cardsCaptured = cardsCaptured.concat(obj.cardsCaptured);
                });
            }
        }

        return cardsCaptured.length ? cardsCaptured : null;
    },
    getBattleResults: function() {
        return this.data.progress.main.battleResult !== undefined ? this.data.progress.main.battleResult : null;
    },
    checkUserShowColor: function(userId) {
        if (this.data.progress.main.cointThrow === undefined) {
            return false;
        }

        var userShowColor = this.data.progress.main.cointThrow.filter(function(obj){
            return (obj.userId === userId) && obj.checked;
        });

        return userShowColor.length ? true : false;
    },
    isPlayerTurn: function(playerId) {
        var turn = this.getCurrentTurn();
        if (!turn) {
            return false;
        }

        return turn.userId === playerId ? true : false;
    },
    isFinished: function() {
        return this.data.progress.main.battleResult !== undefined ? true : false;
    }
}
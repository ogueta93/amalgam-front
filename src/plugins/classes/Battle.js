
import PLAYER_BATTLE_STATUS from '@/constants/PlayerBattleStatus';
import BATTLE_REWARD_TYPE from '@/constants/BattleRewardType';


export default {
    app: null,
    options: null,
    data: null,

    /** Battle properties */

    setData(data) {
        this.data = data;
        this.vitaminizeCards();
        this.vitaminizeInBoardCards();
    },
    vitaminizeCards() {
        if (this.data.progress.main.cardsSelection === undefined) {
            return;
        }
        
        this.data.progress.main.cardsSelection.forEach((obj) => {
            obj.cards.forEach((element, index, array) => {
                array[index].selectedInbattle = false;
            });
        });
    },
    vitaminizeInBoardCards() {
        if (this.data.progress.battleField === undefined) {
            return;
        }
        
        this.data.progress.battleField.board.forEach((row) => {
            row.forEach((field, index, array) => {
                if (field.card !== undefined) {
                    array[index].card.recentlyPlaced = false;
                    array[index].card.recentlyCaptured = false;
                }
            });
        });
    },
    getData() {
        return this.data;
    },
    getId() {
        return this.data.id;
    },
    getPhase() {
        return this.data.progress.main.phase;
    },
    getCardsSelectionByUserId(userId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return [];
        }
    
        var cardsSelection = [];
        this.data.progress.main.cardsSelection.forEach((obj) => {
            if (obj.userId === userId) {
                cardsSelection = obj.cards;
                return;
            }
        });

        return cardsSelection.length ? cardsSelection : [];
    },
    getCardsSelected(userId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return [];
        }

        var cardsSelected = [];
        this.data.progress.main.cardsSelection.forEach((obj) => {
            if (obj.userId === userId) {
                cardsSelected = obj.cards.filter((element) => {
                    return !element.placed;
                });
                return;
            }
        });

        return cardsSelected.length ? cardsSelected : [];
    },
    getCardsCapturedByUserId(userId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return [];
        }

        var cardsCaptured = [];
        this.data.progress.main.cardsSelection.forEach((obj) => {
            obj.cards.forEach((card) => {
                if ((obj.userId === userId) && !card.captured) {
                    cardsCaptured.push(card);
                } else if ((obj.userId !== userId) && card.captured) {
                    cardsCaptured.push(card);
                }
            });
        });

        return cardsCaptured.length ? cardsCaptured : [];
    },
    getInitialTurn(userId) {
        if (this.data.progress.main.cointThrow === undefined) {
            return [];
        }

        var initialTurn;
        this.data.progress.main.cointThrow.forEach((obj, index) => {
            if (obj.userId === userId) {
                initialTurn = index === 0 ? 1 : 2;
                return;
            }
        });

        return initialTurn;
    },
    getRival(playerId) {
        var rival = this.data.users.filter((obj) => {
            return obj.user.id !== playerId;
        });

        return rival.length ? rival[0].user : null;
    },
    getBoard() {
        if (this.data.progress.battleField === undefined) {
            return [];
        }

        return this.data.progress.battleField.board;
    },
    getCurrentTurn() {
        if (this.data.progress.turns === undefined) {
            return null;
        }
        
        var turns = this.data.progress.turns;
        return turns[turns.length - 1];
    },
    getPlayerOwnership(userCardId) {
        if (this.data.progress.main.cardsSelection === undefined) {
            return null;
        }

        var userId = null;
        this.data.progress.main.cardsSelection.forEach((obj) => {
            obj.cards.forEach((element) => {
               if (element.userCardId === userCardId) {
                   userId = obj.userId;
                   return;
               }
            });
        });
        if (userId === null) {
            this.data.progress.battleField.board.forEach((row) => {
                row.forEach((field) => {
                    if (field.card !== undefined && field.card.userCardId === userCardId) {
                        userId = field.userId;
                        return;
                    }
                });
            });
        }

        var user = this.data.users.filter((obj) => {
            return obj.user.id === userId;
        });

        return user.length ? user[0].user : null;
    },
    getLastMovement() {
        if (this.data.progress.turns === undefined) {
            return null;
        }

        var lasTurn = this.data.progress.turns[this.data.progress.turns.length - 1].completed === true ? 
            this.data.progress.turns[this.data.progress.turns.length - 1] : this.data.progress.turns[this.data.progress.turns.length - 2];
        
        return lasTurn.movement;
    },
    getLastCardsCaptured() {
        var lastMovement = this.getLastMovement();
        if (!lastMovement) {
            return null;
        }

        var cardsCaptured = [];
        if (lastMovement.cardsCaptured.length) {
            cardsCaptured = cardsCaptured.concat(lastMovement.cardsCaptured);

            if (lastMovement.combo !== undefined) {
                lastMovement.combo.forEach((obj) => {
                    cardsCaptured = cardsCaptured.concat(obj.cardsCaptured);
                });
            }
        }

        return cardsCaptured.length ? cardsCaptured : null;
    },
    getBattleResults() {
        return this.data.progress.main.battleResult !== undefined ? this.data.progress.main.battleResult : null;
    },
    getPlayerBattleStatus(userId) {
        var battleResult = this.getBattleResults();
        if (battleResult === null) {
            return null;
        }

        var result;
        var winner = battleResult.winner !== undefined ? battleResult.winner : null;

        if (winner === null) {
            result = PLAYER_BATTLE_STATUS.DRAW;
        } else {
           result = winner.user.id === userId ? PLAYER_BATTLE_STATUS.WINNER : PLAYER_BATTLE_STATUS.LOSER;
        }

        return result;
    },
    getRewardType() {
        var battleResult = this.getBattleResults();
        
        return battleResult !== null ? battleResult.winner.rewardType : null;
    },
    getRewardedCards(userId) {
        var rewardType = this.getRewardType();
        var rival = this.getRival(userId);
        var rewardedCards = this.getCardsSelectionByUserId(rival.id);
     
        if (rewardType === BATTLE_REWARD_TYPE.PERFECT_REWARD) {
            return rewardedCards;
        }

        rewardedCards = rewardedCards.filter((obj) => {
            return obj.captured;
        });

        return rewardedCards;
    },
    getRewardExpiredTime() {
        var battleResult = this.getBattleResults();
        if (battleResult === null) {
            return null;
        }

        var date = new Date(battleResult.winner.rewardExpiredTime);
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    },
    checkUserShowColor(userId) {
        if (this.data.progress.main.cointThrow === undefined) {
            return false;
        }

        var userShowColor = this.data.progress.main.cointThrow.filter((obj) => {
            return (obj.userId === userId) && obj.checked;
        });

        return userShowColor.length ? true : false;
    },
    isPlayerTurn(playerId) {
        var turn = this.getCurrentTurn();
        if (!turn) {
            return false;
        }

        return turn.userId === playerId ? true : false;
    },
    isFinished() {
        return this.data.progress.main.battleResult !== undefined ? true : false;
    }
}
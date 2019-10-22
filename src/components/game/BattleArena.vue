<template>
    <div class="battle-arena-content">
        <div class="battle-arena-main">
            <div :class="['rival-points', playerColorClass]">
                {{playerCapturedCount}}
            </div>
            <div class="battle-arena-board">
                <div v-for="(row, index) in board" :key="index" class="board-row">
                    <div v-for="(obj, indexField) in row" :key="indexField" :class="['board-field', {'has-card-selected': cardSelected}]" @click="placeCard(index, indexField)">
                        <gameCard v-if="Object.keys(obj).length > 0" :ref="'cardInBoard-' + obj.card.userCardId" :key="obj.card.userCardId" :card="obj.card" :battlePhase="battlePhase" :inBoard="true"></gameCard>
                    </div>
                </div>
                <div v-if="battleAnnouncement.anouncement" class="battle-arena-announcement">
                    <battleAnnouncement :announcement="battleAnnouncement.anouncement" :extra="battleAnnouncement.extra"></battleAnnouncement>
                </div>
                <div v-if="!playerInteract" class="battle-arena-no-interact"></div>
            </div>
            <div :class="['rival-points', rivalColorClass]">
                {{rivalCapturedCount}}
            </div>
        </div>
        <div v-if="playerCards.length" class="battle-arena-player-deck">
            <gameCard v-for="card in playerCards" :key="card.userCardId" :card="card" :battlePhase="battlePhase"></gameCard>
        </div>
    </div>
</template>

<script>
import ANNOUNCEMENT from '@/constants/Announcement';
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';
import BATTLE_PHASE from '@/constants/BattlePhase';
import PLAYER_BATTLE_STATUS from '@/constants/PlayerBattleStatus';

import gameCard from '@/components/game/deck/GameCard';
import battleAnnouncement from '@/components/game/BattleAnnouncement';

export default {
    name : 'battleArenaComponent',
    props: {
        battleData: {
            type: Object,
            required: true
        },
    },
    components: {
        gameCard,
        battleAnnouncement
    },
    data() {
        return {
            battlePhase: BATTLE_PHASE.BATTLE_PHASE,
            battleId: null,

            player: this.$localStorage.getUser(),
            playerColorClass: null,
            rival: null,
            rivalColorClass: null,

            playerInteract: false,
            playerTurn: false,
            playerCards: [],
            playerBattleStatus: null,
            playerCapturedCount: null,
            rivalCapturedCount: null,
            board: [],
            currentTurn: null,
            cardSelected: null,

            processingTurn: true,
            queueData: null,

            lastTurn: {
                playerCards: {},
                board: {}
            },
            battleAnnouncement: {
                anouncement: null,
                extra: {}
            }
        }
    },
    mounted() {
        /** Initial module instance */
        this.$root.$on(EVENT.BATTLE_ANNOUNCEMENT_END, this.callBackBattleAnnouncementEnd);
        this.$root.$on(EVENT.BATTLE_ARENA_PLAY_CARD, this.callBackBattleArenaPlayCard)
        this.$root.$on(EVENT.BATTLE_QUEUE_DATA, this.callBackProcessQueueData);

        this.$webSocket.setEvent(ACTION.BATTLE_MOVEMENT_ACTION, this.$options.name, this.callBackBattleMovement);

        this.initBattleTurn();
    },
    destroyed() {
        this.$root.$off(EVENT.BATTLE_ANNOUNCEMENT_END);
        this.$root.$off(EVENT.BATTLE_ARENA_PLAY_CARD);
        this.$root.$off(EVENT.BATTLE_QUEUE_DATA);

        this.$webSocket.$wsOff(ACTION.BATTLE_MOVEMENT_ACTION, this.$options.name);
    },
    methods: {
        initBattleTurn() {
            this.setBattleArena();
            this.setColors();
            this.announcePlayerStartTurn();
        },
        announcePlayerStartTurn() {
            var extra = {
                nickName: this.playerTurn ? this.player.nickName : this.rival.nickName,
                color: this.playerTurn ? this.playerColorClass : this.rivalColorClass
            };
            this.setBattleAnnouncement(ANNOUNCEMENT.TURN_STARTED, extra);
        },
        announceBattleResults() {
            this.playerBattleStatus = this.$battle.getPlayerBattleStatus(this.player.id);

            var extra = {
                result: this.playerBattleStatus
            };
            this.setBattleAnnouncement(ANNOUNCEMENT.BATTLE_RESULT, extra);
        },
        placeCard(row, field) {
            if (!this.cardSelected || Object.keys(this.board[row][field]).length > 0) {
                return;
            }

            var data = {
                battleId: this.battleId,
                userCardId: this.cardSelected.userCardId,
                coordinates: {row: row, field: field}
            };

            this.playerInteract = false;
            this.$webSocket.sendAction(ACTION.BATTLE_MOVEMENT_ACTION, data);
        },
        playerLastAction() {
            switch (this.playerBattleStatus) {
                case PLAYER_BATTLE_STATUS.WINNER:
                    this.$root.$emit(EVENT.BATTLE_FIELD_FIND_BATTLE);
                    break;
                default:
                    this.playerInteract = true;
                    break;
            }
        },
        setBattleCounters() {
            this.playerCapturedCount = this.$battle.getCardsCapturedByUserId(this.player.id).length;
            this.rivalCapturedCount = this.$battle.getCardsCapturedByUserId(this.rival.id).length;
        },
        processTurn(data) {
            this.processingTurn = true;

            this.setLastTurn();
            this.$battle.setData(data);
            this.setNewTurn();
        },
        setBattleArena() {
            this.$battle.setData(this.battleData);

            this.battleId = this.$battle.getId();
            this.rival = this.$battle.getRival(this.player.id);
            this.playerCards = this.$battle.getCardsSelected(this.player.id);
            this.board = this.$battle.getBoard();

            this.setBattleCounters();
            this.setTurnOrder();
        },
        setTurnOrder() {
            this.currentTurn = this.$battle.getCurrentTurn();
            this.playerTurn = this.$battle.isPlayerTurn(this.player.id);
        },
        setColors() {
            var playerTurnOrder = this.$battle.getInitialTurn(this.player.id);

            this.playerColorClass = playerTurnOrder === 1 ? 'primary' : 'secondary';
            this.rivalColorClass =  playerTurnOrder === 1 ? 'secondary' : 'primary';
        },
        setBattleAnnouncement(type, extra) {
            this.battleAnnouncement.anouncement = type;
            this.battleAnnouncement.extra = extra;
        },
        setLastTurn() {
            this.lastTurn.playerCards = this.playerCards;
            this.lastTurn.board = this.board;
        },
        setNewTurn() {
            var that = this;

            this.playerCards = this.$battle.getCardsSelected(this.player.id);
            this.board = this.$battle.getBoard();

            this.showCardMovement(() => {
                that.setBattleCounters();
                that.setTurnOrder();
                if (!that.$battle.isFinished()) {
                    that.announcePlayerStartTurn();
                } else {
                    that.announceBattleResults();
                }
            });
        },
        showCardMovement(callBack) {
            var that = this;
            var lastMovement = this.$battle.getLastMovement();

            this.board.forEach((row) => {
                row.forEach((field, index, array) => {
                    if (field.card !== undefined && field.card.userCardId === lastMovement.card.userCardId) {
                        array[index].card.recentlyPlaced = true;
                    }
                });
            });

            this.$nextTick(() => {
                var placedCard = that.$refs['cardInBoard-' + lastMovement.card.userCardId];
                placedCard[0].$el.addEventListener('animationend', () => {
                    that.showCardsCaptured(callBack);
                });
            });
        },
        showCardsCaptured(callBack) {
            var that = this;
            var cardsCaptured = this.$battle.getLastCardsCaptured();

            if (cardsCaptured) {
                var exampleCapturedId;

                cardsCaptured.forEach((cardCaptured) => {
                    that.board.forEach((row) => {
                        row.forEach((field, index, array) => {
                            if (field.card !== undefined && field.card.userCardId === cardCaptured.userCardId) {
                                array[index].card.recentlyCaptured = true;
                                if (!exampleCapturedId) {
                                    exampleCapturedId = cardCaptured.userCardId;
                                }
                            }
                        });
                    });
                });

                this.$nextTick(() => {
                    var capturedCards = that.$refs['cardInBoard-' + exampleCapturedId];
                    capturedCards[0].$el.addEventListener('animationend', () => {
                        callBack();
                    });
                });
            } else {
                callBack();
            }
        },

        callBackBattleAnnouncementEnd() {
            this.processingTurn = false;
            this.setBattleAnnouncement(null, {});

            if (!this.$battle.isFinished()) {
                if (this.playerTurn) {
                    this.playerInteract = true;
                }
                if (this.queueData) {
                    this.$root.$emit(EVENT.BATTLE_QUEUE_DATA);
                }
            } else {
                this.playerLastAction();
            }
        },
        callBackBattleArenaPlayCard(userCardId) {
            this.playerCards.forEach((obj, index, array) => {
                if (obj.userCardId !== userCardId && obj.selectedInbattle) {
                    array[index].selectedInbattle = false;
                    return;
                }
            });

            var card = this.playerCards.filter((obj) => {
                return (obj.userCardId === userCardId) && obj.selectedInbattle;
            });

            this.cardSelected = card.length ? card[0] : null;
        },
        callBackBattleMovement(response) {
            if (!this.queueData && !this.processingTurn) {
                this.processTurn(response);
            } else {
                this.queueData = response;
            }
        },
        callBackProcessQueueData() {
            var data = this.queueData;
            this.queueData = null;

            this.processTurn(data);
        }
    }
};
</script>

<style lang="scss" scoped>
/* BattleArena customization */
$primary-color: #1a73e8;
$secondary-color: #e8391a;

.battle-arena-content {
    display: flex;
    height: 100%;
    width: 100%;
    flex-flow: column;
    justify-content: space-evenly;
    align-items: center;

    .battle-arena-main {
        position: relative;
        display: flex;
        height: 80%;
        width: 80%;
        justify-content: space-evenly;
        align-items: center;

        .player-points, .rival-points {
            display: flex;
            height: 100%;
            width: 5%;
            align-items: center;
            justify-content: center;
            font-family: 'Audiowide', cursive;
            font-size: 8rem;

            &.primary {
                color: $primary-color;
            }
            &.secondary {
                color: $secondary-color;
            }
        }

        .battle-arena-board {
            position: relative;
            display: flex;
            height: 650px;
            width: 620px;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            align-content: center;
            padding: 100px;
            border: 5px solid black;

            background: black;

            .board-row {
                display: flex;
                height: 150px;
                width: 420px;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                margin: 0 0 10px 0;

                background: grey;

                .board-field {
                    display: flex;
                    height: 150px;
                    width: 140px;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid blue;

                    &.has-card-selected {
                        cursor: pointer;
                    }
                }
            }

            .battle-arena-announcement {
                position: absolute;
                height: 100%;
                width: 100%;
            }


            .battle-arena-no-interact {
                position: absolute;
                height: 100%;
                width: 100%;
                z-index: 2;
                cursor: wait;
            }
        }
    }

    .battle-arena-player-deck {
        display: flex;
        height: 20%;
        width: auto;
        align-items: center;
        justify-content: space-evenly;

        background: black;
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {
    .battle-arena-content {
        .battle-arena-main {
            .player-points, .rival-points {
                font-size: 6rem;
            }

            .battle-arena-board {
                height: 450px;
                width: 420px;
                margin: 0 0 10px 0;

                .board-row {
                    display: flex;
                    height: 115px;
                    width: 420px;

                    .board-field {
                        height: 115px;
                        width: 140px;
                    }
                }
            }
        }
    }
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .battle-arena-content {
        .battle-arena-main {
            .player-points, .rival-points {
                font-size: 4rem;
            }

            .battle-arena-board {
                height: 210px;
                width: 220px;
                margin: 0 0 10px 0;

                .board-row {
                    display: flex;
                    height: 60px;
                    width: 210px;

                    .board-field {
                        height: 60px;
                        width: 70px;
                    }
                }
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .battle-arena-content {
        .battle-arena-main {
            .player-points, .rival-points {
                font-size: 4rem;
            }

            .battle-arena-board {
                height: 210px;
                width: 220px;
                margin: 0 0 10px 0;

                .board-row {
                    display: flex;
                    height: 60px;
                    width: 210px;

                    .board-field {
                        height: 60px;
                        width: 70px;
                    }
                }
            }
        }
    }
}
/* End BattleArena customization */
</style>
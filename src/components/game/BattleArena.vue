<template>
    <div class="battle-arena-content">
        <div v-if="playerCards.length" class="battle-arena-player-deck">
            <gameCard v-for="card in playerCards" :key="card.userCardId" :card="card" :battlePhase="battlePhase"></gameCard>
        </div>
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
        <div v-if="rivalCards.length" class="battle-rival-deck">
            <gameCard v-for="card in rivalCards" :key="card.userCardId" :card="card" :faceDown="true"></gameCard>
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
            rivalCards: [],
            playerCapturedCount: null,
            rivalCapturedCount: null,
            board: [],
            currentTurn: null,
            cardSelected: null,

            processingTurn: true,
            queueData: null,

            lastTurn: {
                playerCards: {},
                rivalCards: {},
                board: {}
            },
            battleAnnouncement: {
                anouncement: null,
                extra: {}
            }
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$root.$on(EVENT.BATTLE_ANNOUNCEMENT_END, this.callBackBattleAnnouncementEnd);
        this.$root.$on(EVENT.BATTLE_ARENA_PLAY_CARD, this.callBackBattleArenaPlayCard)
        this.$root.$on(EVENT.BATTLE_QUEUE_DATA, this.callBackProcessQueueData);

        this.$webSocket.setEvent(ACTION.BATTLE_MOVEMENT_ACTION, this.$options.name, this.callBackBattleMovement);

        this.initBattleTurn();
    },
    destroyed: function() {
        this.$root.$off(EVENT.BATTLE_ANNOUNCEMENT_END);
        this.$root.$off(EVENT.BATTLE_ARENA_PLAY_CARD);
        this.$root.$off(EVENT.BATTLE_QUEUE_DATA);

        this.$webSocket.$wsOff(ACTION.BATTLE_MOVEMENT_ACTION, this.$options.name);
    },
    methods: {
        initBattleTurn: function() {
            this.setBattleArena();
            this.setColors();
            this.announcePlayerStartTurn();
        },
        announcePlayerStartTurn: function() {
            var extra = {
                nickName: this.playerTurn ? this.player.nickName : this.rival.nickName,
                color: this.playerTurn ? this.playerColorClass : this.rivalColorClass
            };
            this.setBattleAnnouncement(ANNOUNCEMENT.TURN_STARTED, extra);
        },
        announceBattleResults: function() {
            this.playerBattleStatus = this.$battle.getPlayerBattleStatus(this.player.id);

            var extra = {
                result: this.playerBattleStatus
            };
            this.setBattleAnnouncement(ANNOUNCEMENT.BATTLE_RESULT, extra);
        },
        placeCard: function(row, field) {
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
        playerLastAction: function() {
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
        setBattleArena: function() {
            this.$battle.setData(this.battleData);

            this.battleId = this.$battle.getId();
            this.rival = this.$battle.getRival(this.player.id);
            this.playerCards = this.$battle.getCardsSelected(this.player.id);
            this.rivalCards = this.$battle.getCardsSelected(this.rival.id);
            this.board = this.$battle.getBoard();

            this.setBattleCounters();
            this.setTurnOrder();
        },
        setTurnOrder() {
            this.currentTurn = this.$battle.getCurrentTurn();
            this.playerTurn = this.$battle.isPlayerTurn(this.player.id);
        },
        setColors: function() {
            var playerTurnOrder = this.$battle.getInitialTurn(this.player.id);

            this.playerColorClass = playerTurnOrder === 1 ? 'primary' : 'secondary';
            this.rivalColorClass =  playerTurnOrder === 1 ? 'secondary' : 'primary';
        },
        setBattleAnnouncement: function(type, extra) {
            this.battleAnnouncement.anouncement = type;
            this.battleAnnouncement.extra = extra;
        },
        setLastTurn: function() {
            this.lastTurn.playerCards = this.playerCards;
            this.lastTurn.rivalCards = this.rivalCards;
            this.lastTurn.board = this.board;
        },
        setNewTurn: function() {
            var that = this;

            this.playerCards = this.$battle.getCardsSelected(this.player.id);
            this.rivalCards = this.$battle.getCardsSelected(this.rival.id);
            this.board = this.$battle.getBoard();

            this.showCardMovement(function() {
                that.setBattleCounters();
                that.setTurnOrder();
                if (!that.$battle.isFinished()) {
                    that.announcePlayerStartTurn();
                } else {
                    that.announceBattleResults();
                }
            });
        },
        showCardMovement: function(callBack) {
            var that = this;
            var lastMovement = this.$battle.getLastMovement();

            this.board.forEach(function(row) {
                row.forEach(function(field, index, array) {
                    if (field.card !== undefined && field.card.userCardId === lastMovement.card.userCardId) {
                        array[index].card.recentlyPlaced = true;
                    }
                });
            });

            this.$nextTick(function() {
                var placedCard = that.$refs['cardInBoard-' + lastMovement.card.userCardId];
                placedCard[0].$el.addEventListener('animationend', function() {
                    that.showCardsCaptured(callBack);
                });
            });
        },
        showCardsCaptured: function(callBack) {
            var that = this;
            var cardsCaptured = this.$battle.getLastCardsCaptured();

            if (cardsCaptured) {
                var exampleCapturedId;

                cardsCaptured.forEach(function(cardCaptured) {
                    that.board.forEach(function(row) {
                        row.forEach(function(field, index, array) {
                            if (field.card !== undefined && field.card.userCardId === cardCaptured.userCardId) {
                                array[index].card.recentlyCaptured = true;
                                if (!exampleCapturedId) {
                                    exampleCapturedId = cardCaptured.userCardId;
                                }
                            }
                        });
                    });
                });

                this.$nextTick(function() {
                    var capturedCards = that.$refs['cardInBoard-' + exampleCapturedId];
                    capturedCards[0].$el.addEventListener('animationend', function() {
                        callBack();
                    });
                });
            } else {
                callBack();
            }
        },

        callBackBattleAnnouncementEnd: function() {
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
        callBackBattleArenaPlayCard: function(userCardId) {
            this.playerCards.forEach(function(obj, index, array) {
                if (obj.userCardId !== userCardId && obj.selectedInbattle) {
                    array[index].selectedInbattle = false;
                    return;
                }
            });

            var card = this.playerCards.filter(function(obj) {
                return (obj.userCardId === userCardId) && obj.selectedInbattle;
            });

            this.cardSelected = card.length ? card[0] : null;
        },
        callBackBattleMovement: function(response) {
            if (!this.queueData && !this.processingTurn) {
                this.processTurn(response);
            } else {
                this.queueData = response;
            }
        },
        callBackProcessQueueData: function() {
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
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;

    .battle-arena-player-deck, .battle-rival-deck  {
        display: flex;
        height: 100%;
        width: 10%;
        flex-flow: column;
        align-items: center;
        justify-content: space-evenly;

        background: black;
    }
    .player-points, .rival-points {
        display: flex;
        height: 100%;
        width: 5%;
        align-items: center;
        justify-content: center;
        font-family: 'Audiowide', cursive;
        font-size: 8em;

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

        background: black;
    }

    .battle-arena-no-interact {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 2;
        cursor: wait;
    }
}
/* End BattleArena customization */
</style>
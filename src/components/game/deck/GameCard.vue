<template>
    <div v-if="!faceDown" 
    :class="['game-card ' + card.type.name, cardBattleColorClass, {selected: card.selected}, {'selected-in-battle': card.selectedInbattle}, 
    {battleCard: battleCardClass}, {'playable-card': isPlayableCard}, {'recently-placed': card.recentlyPlaced}, {'recentlyCaptured': card.recentlyCaptured}]" 
    @click="cardAction">
        <div class="game-card-content">
            <div :class="['game-card-header', {hidden: hiddenHeaderClass}]">
                <div class="game-card-name">{{card.name}}</div>
                <div class="game-card-id">{{card.id}}</div>
            </div>
            <!--<div :class="['game-card-body', {'hidden-header': hiddenHeaderClass}]" :style="{backgroundImage: 'url('+require('@/assets/img/card/'+card.id+'.png')+')'}">-->
            <div :class="['game-card-body', {'hidden-header': hiddenHeaderClass}]">
                <div class="game-card-body-top">{{card.top}}</div>
                <div class="game-card-body-middle">
                    <div class="game-card-body-left">{{card.left}}</div>
                    <div class="game-card-body-right">{{card.right}}</div>
                </div>
                <div class="game-card-body-bottom">{{card.bottom}}</div>
            </div>
        </div>
        <div v-if="debug" class="debug">
            <div class="add-button" @click="debubAddCard(card.id)">
                <i class="fas fa-plus add-caracter"></i>
                <i class="fas fa-check check-caracter"></i>
            </div>
        </div>
    </div>
    <div v-else :class="['game-card common', cardBattleColorClass, {battleCard: battleCardClass}]">
       <div class="game-card-content">
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';
import BATTLE_PHASE from '@/constants/BattlePhase';

export default {
    name : 'gameCardComponent',
    props: {
        card: {
            type: Object,
            required: true
        },
        battlePhase: {
            type: Number,
            required: false
        },
        faceDown: {
            type: Boolean,
            required: false,
            default: false
        },
        inBoard: {
            type: Boolean,
            required: false
        },
        debug: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            playerInfo: null,
            cardBattleColorClass: null,
            hiddenHeaderClass: false,
            battleCardClass: false,
            isPlayableCard: false,
            debugAddingCard: false
        }
    },
    mounted: function() {
        /** Initial module instance */
        if (this.battlePhase === BATTLE_PHASE.BATTLE_PHASE && !this.faceDown) {
            this.playerInfo = this.$battle.getPlayerOwnership(this.card.userCardId);

            this.cardBattleColorClass = this.getCardBattleColor();
            this.isPlayableCard = this.getCardOwnership() && !this.inBoard;
            this.hiddenHeaderClass = true;
            this.battleCardClass = true;
        }
        else if (this.faceDown) {
            this.cardBattleColorClass = this.getCardBattleColorWithOutRefence();
            this.battleCardClass = true;
        }
    },
    updated: function() {
        /** after render */
    },
    watch: {
        'card.captured': function() {
            this.cardBattleColorClass = this.getCardBattleColor();
        },
    },
    methods: {
        cardAction: function() {
            if (this.battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE) {
                this.setToplay();
            }
            if (this.battlePhase === BATTLE_PHASE.BATTLE_PHASE) {
                this.playCard();
            }
        },
        debubAddCard: function(id) {
            if (this.debugAddingCard) {
                return;
            }
            this.debugAddingCard = true;

            var data = {
                id: this.card.id
            };
            this.$webSocket.sendComplexAction(ACTION.DEBUG_ADD_CARD_ACTION, this.$options.name, data, this.callBackDebugAddCard);
        },
        setToplay: function() {
            this.card.selected = !this.card.selected;
            this.$root.$emit(EVENT.BATTLE_DECK_SELECTION, this.card.userCardId);
        },
        playCard: function() {
            if (this.isPlayableCard && this.$battle.isPlayerTurn(this.playerInfo.id)) {
                this.card.selectedInbattle = !this.card.selectedInbattle;
                this.$root.$emit(EVENT.BATTLE_ARENA_PLAY_CARD, this.card.userCardId);
            }
        },
        getCardBattleColor: function() {
            var playerTurn = this.$battle.getInitialTurn(this.playerInfo.id);

            if (playerTurn === 1 && !this.card.captured) {
                return 'primary';
            } else if (playerTurn === 2 && this.card.captured) {
                return 'primary';
            } else {
                return 'secondary';
            }
        },
        getCardBattleColorWithOutRefence: function() {
            var hostUserId = this.$localStorage.getUser().id;
            var hostPlayerTurn = this.$battle.getInitialTurn(hostUserId);

            if (hostPlayerTurn === 1) {
                return 'secondary';
            } else {
                return 'primary';
            }
        },
        getCardOwnership: function() {
            return this.playerInfo.id === this.$localStorage.getUser().id;
        },

        callBackDebugAddCard: function(response) {
            var that = this;

            var addButton = this.$el.querySelector('.add-button');
            addButton.classList.add('success-adding');

            addButton.addEventListener('animationend', function() {
                addButton.classList.remove('success-adding');
                that.debugAddingCard = false;
            });            
        }
    }
};
</script>

<style lang="scss" scoped>
/* Card customization */
$card-text-color: #ffdf32;
$card-border-color: #ffef99;
$card-selected-color:  rgba(255, 0, 0, 0.8);
$card-selected-in-battle-color:  rgba(251, 255, 0, 0.8);

$primary-battle-color: #508cda;
$secondary-battle-color: #ea4d32;
$common-card-color: #5a4646;

$add-button-color: #508cda;
$add-button-success-color: #3cbd82;

.game-card {
    position: relative;
    width: 125px;
    height: 175px;
    padding: 5px;
    margin: 5px;
    user-select: none;
    cursor:  pointer;

    &.selected {
        box-shadow: 0px 0px 0px 3px $card-selected-color;
    }
    &.selected-in-battle {
        box-shadow: 0px 0px 0px 5px $card-selected-in-battle-color;
        margin-left: 75px;
    } 
    
    &.battleCard {
        width: 140px;
        height: 150px;
        padding: 8px;

        .game-card-content {
            .game-card-body {
                font-size: 1.1em;
            }
        }

        &.playable-card:hover {
            margin-left: 75px;
        }
        &.recently-placed {
            animation: recentlyPlaced 0.5s linear;
        }
        &.recentlyCaptured {
            animation: recentlyCaptured 1s linear;
        }
    }

    .game-card-content {
        width: 100%;
        height: 100%;
        background: black;
        border: 1px solid $card-border-color;
        font-family: 'Press Start 2P', cursive;
        color: $card-text-color;

        .game-card-header {
            display: flex;
            height: 15%;
            width: 100%;
            margin-right: auto;
            padding: 5px;
            border-bottom: 1px solid $card-border-color;
            font-size: 10px;

            .game-card-name {
                margin-right: auto;
            }
            
            .game-card-name::first-letter {
                text-transform: uppercase;
            }

            &.hidden {
                display: none;
            }
        }
        
        .game-card-body {
            height: 85%;
            padding: 5px;
            font-size: 12px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;

            .game-card-body-top {
                display: flex;
                height: 20%;
                justify-content: center;
            }

            .game-card-body-middle {
                display: flex;
                height: 60%;
                align-items: center;

                .game-card-body-left {
                    margin-right: auto;
                }
            }

            .game-card-body-bottom {
                display: flex;
                height: 20%;
                align-items: flex-end;
                justify-content: center;
            }

            &.hidden-header {
                height: 100%;
            }
        }
    }

    .debug {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        top:0;
        left: 0;
        justify-content: center;
        align-items: center;
        border: none;
        cursor: default;
        overflow: hidden;
        opacity:0;
        transition: opacity 0.3s ease-out;

        &:hover {
            visibility: visible;
            opacity: 1;
        }

        .add-button {
            display: flex;
            height: 30px;
            width: 30px;
            align-items: center;
            justify-content: center;
            padding: 2px;
            color: white;
            border-radius: 5px;
            cursor: pointer;

            .add-caracter {
                display: none;
            }

            .check-caracter {
                display: none;
            }

            &:hover {
                transform: scale(1.5);
            }

            &:not(.success-adding) {
                background-color: $add-button-color;

                .add-caracter {
                    display: block;
                }
            }

            &.success-adding {
                animation: success-adding-debug 0.5s linear;

                .check-caracter {
                    display: block;
                }
            }
        }
    }

    &.primary {
        .game-card-content{
            background: $primary-battle-color !important;
        }
        
        .game-card-header {
            background: $primary-battle-color !important;
        }
    }

    &.secondary {
        .game-card-content {
            background: $secondary-battle-color !important;
        }
        
        .game-card-header {
            background: $secondary-battle-color !important;
        }
    }

    &.common {
        background: $common-card-color;
        
        .game-card-header {
            background: $common-card-color;
        }
    }
}

@keyframes success-adding-debug {
    from {background-color: $add-button-color;}
    to {background-color: $add-button-success-color;}
}

@keyframes recentlyPlaced {
    0% {
        transform: translate(0, -50px);
        opacity: 0;
    }
    100% {
        transform: translate(0, 0);
        opacity: 1;
    }
}

@keyframes recentlyCaptured {
    25% {
        transform: rotateY(180deg) rotateZ(45deg);
    }

    50% {
        transform: rotateY(360deg) rotateZ(90deg);
    }

    75% {
        transform: rotateY(180deg) rotateZ(45deg);
    }

    100% {
        transform: rotateY(0deg) rotateZ(0deg);
    }
}
/* End Card customization */
</style>
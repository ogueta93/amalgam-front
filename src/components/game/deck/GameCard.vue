<template>
    <div :class="['game-card ' + card.type.name, {selected: card.selected}]" @click="cardAction">
        <div class="game-card-content">
            <div class="game-card-header">
                <div class="game-card-name">{{card.name}}</div>
                <div class="game-card-id">{{card.id}}</div>
            </div>
            <!--<div class="game-card-body" :style="{backgroundImage: 'url('+require('@/assets/img/card/'+card.id+'.png')+')'}"> -->
            <div class="game-card-body">
                <div class="game-card-body-top">{{card.top}}</div>
                <div class="game-card-body-middle">
                    <div class="game-card-body-left">{{card.left}}</div>
                    <div class="game-card-body-right">{{card.right}}</div>
                </div>
                <div class="game-card-body-bottom">{{card.bottom}}</div>
            </div>
        </div>
    </div>
</template>

<script>
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
        }
    },
    data() {
        return {
        }
    },
    watch: {
        'card.selected': function() {
            this.$el.classList.toggle('selected');
        },
    },
    mounted: function() {
        /** Initial module instance */
    },
    updated: function() {
        /** after render */
    },
    methods: {
        cardAction: function() {
            if (this.battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE) {
                this.setToplay();
            }
        },
        setToplay: function() {
            this.card.selected = !this.card.selected;
            this.$root.$emit(EVENT.BATTLE_DECK_SELECTION, this.card.userCardId);
        }
    }
};
</script>

<style lang="scss">
/* Card customization */
$card-text-color: #ffdf32;
$card-border-color: #ffef99;
$card-selected-color:  rgba(255, 0, 0, 0.8);

$common-card-color: #5a4646;

.game-card {
    width: 125px;
    height: 175px;
    padding: 5px;
    margin: 5px;
    user-select: none;
    cursor:  pointer;

    &.selected {
        box-shadow: 0px 0px 0px 3px $card-selected-color;
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
        }
    }

    &.common {
        background: $common-card-color;
        
        .game-card-header {
            background: $common-card-color;
        }
    }
}
/* End Card customization */
</style>
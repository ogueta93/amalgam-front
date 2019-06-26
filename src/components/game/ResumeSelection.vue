<template>
    <div class="game-resume-content">
        <div class="game-content">
            <div class="game-content-header">
                <div class="game-header-title">{{ $t("resumeSelection.headerTitle") }}</div>
            </div>
            <div class="game-content-body">
                <div class="game-body-content">
                    <div v-if="cardsToShow.length" class="resume-content">
                        <div v-for="card in cardsToShow" :key="card.userCardId" :class="['resume-item', card.type.name]">
                            <div class="resume-item-property">
                                {{card.id}}
                            </div>
                            <div class="resume-item-property name">
                                {{card.name}}
                            </div>
                            <div class="resume-item-property">
                                {{card.top}}
                            </div>
                            <div class="resume-item-property">
                                {{card.right}}
                            </div>
                            <div class="resume-item-property">
                                {{card.bottom}}
                            </div>
                            <div class="resume-item-property">
                                {{card.left}}
                            </div>
                            <div v-if="card.count > 1" class="resume-item-count">
                                <span class="count-container">{{card.count}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="resume-actions-content" :class="[{'active': cardsSelected.length === 5}]">
            <div class="accept-selection-button" @click="setCardsSelection()">
                {{ $t("resumeSelection.acceptSelectionButton") }}
            </div>
        </div>
    </div>
</template>

<script>
import BATTLE_TYPE from '@/constants/BattleType';
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';
import LOADING from '@/constants/Loading';

export default {
    name : 'resumeSelectionComponent',
    data() {
        return {
            cardsToShow: [],
            cardsSelected: []
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$root.$on(EVENT.BATTLE_DECK_RESUME_SELECTION, this.callbackDeckResumeSelection);
    },
    destroyed: function() {
        this.$root.$off(EVENT.BATTLE_DECK_RESUME_SELECTION);
    },
    updated: function() {
        /** after render */
    },
    methods: {
        setCardsSelection: function() {
            this.$loading.start(LOADING.RESUME_SELECTION_LOADING);

            var data = {
                battleId: this.$battle.getId(),
                cardsSelected: this.cardsSelected
            };
            this.$webSocket.sendAction(ACTION.SET_CARDS_SELECTION, data);
        },

        callbackDeckResumeSelection: function(data) {
            var that = this;
            this.cardsSelected = data;

            var cardsToShow = [];
            this.cardsSelected.forEach(function(obj) {
                var finded = cardsToShow.filter(function(element) {
                    return element.id === obj.id;
                });

                if (finded.length) {
                    var count = that.cardsSelected.filter(function(element) {
                        return element.id === obj.id;
                    });

                    cardsToShow.forEach(function(element, index, array) {
                        if (element.id === obj.id) {
                            array[index].count = count.length;
                            return;
                        }
                    });
                } else {
                    obj.count = 1;
                    cardsToShow.push(obj);
                }
            });

            this.cardsToShow = cardsToShow;
        }
    }
};
</script>

<style lang="scss" scoped>
/* ResumeSelection customization */
    $card-text-color: #ffdf32;
    $counter-background-color: #1a73e8;
    $button-backround-color: #1a73e8;

    $common-card-color: #5a4646;

    .game-resume-content {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: space-around;

        .game-content {
            width: 80%;
        }

        .resume-actions-content {
            display: flex;
            width: 0;
            height: 100%;
            flex-direction: row;
            justify-content: center;
            overflow: hidden;
            transition: width .25s ease-out;
            
            &.active {
                width: 15%;
                overflow: auto;
            }

            .accept-selection-button {
                display: flex;
                width: 100%;
                height: 15%;
                align-items: center;
                justify-content: center;
                padding: 20px;
                color: white;
                font-family: 'Audiowide', cursive;
                background: $button-backround-color;
                box-shadow: 0 10px 6px -6px rgba(0, 0, 0, 0.6);
                cursor: pointer;
            }
        }
    }

    .resume-content {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: space-around;
        user-select: none;

        .resume-item {
            position: relative;
            display: flex;
            height: 25px;
            width: 100%;
            flex-direction: column;
            flex-wrap: wrap;
            align-items: center;
            font-size: 0.8em;
            font-family: 'Press Start 2P', cursive;

            &.common {
                box-shadow: 0 15px 6px -6px $common-card-color;
            }

            .resume-item-property {
                &.name {
                    text-transform: capitalize;
                }
            }
            .resume-item-count {
                position: absolute;
                top: -20px;
                left: 0;
                display: flex;
                height: 100%;
                width: 100%;
                flex-direction: row-reverse;
                
                .count-container {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: $counter-background-color;
                    color: white;
                    font-size: 1.2em;
                    font-family: 'Audiowide', cursive;
                    border-radius: 20px;
                }
            }
        }
    }
/* End ResumeSelection customization */
</style>
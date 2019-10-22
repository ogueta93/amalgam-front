<template>
    <div class="game-content">
        <div class="game-content-header">
            <div class="game-header-title">{{ $t("deck.deckTitle") }}</div>
            <div class="game-header-controls">
                <i type="dark" @click="toggleFilters" class="fas fa-bars side-bar-button"></i>
            </div>
        </div>
        <div class="game-content-deck">
            <div class="deck-filters">
                <div class="deck-filters-content">
                    <form id="deck-search-form" name="form" @submit.prevent="onSubmit">
                        <div class="input-group-flex inline">
                            <input class="input-form-flex sm" type="text" v-model="filters.cardName" :placeholder="this.$i18n.t('deck.deckCardNameFilter')">
                            <select class="input-form-flex margin-left sm" v-model="filters.cardType">
                                <option v-for="option in typeCardOptions" v-bind:key="option.value" v-bind:value="option.value">
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="deck-filters-bottom">
                    <div @click="getUserCards" class="fa-button">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <div class="deck-cards">
                <div v-if="cards.length" class="deck-cards-content">
                    <gameCard v-for="card in cards" :key="card.userCardId" :card="card" :battlePhase="battlePhase" :shopMode="shopMode"></gameCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gameCard from '@/components/game/deck/GameCard';

import BATTLE_PHASE from '@/constants/BattlePhase';
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';

export default {
    name : 'deckComponent',
    props: {
        battlePhase: {
            type: Number,
            required: false
        },
        shopMode: {
            type: Boolean,
            required: false,
        }
    },
    components: {
        gameCard
    },
    data() {
        return {
            cards: [],
            cardsSelected: [],
            filters: {
                cardName: "",
                cardType: 0,
            },
            loadingName: 'deckLoading',
            typeCardOptions: [
                { value: 0, text: this.$i18n.t('cardType.none') },
                { value: 1, text: this.$i18n.t('cardType.common') },
                { value: 2, text: this.$i18n.t('cardType.rare')  },
                { value: 3, text: this.$i18n.t('cardType.legendary') },
                { value: 4, text: this.$i18n.t('cardType.unique') },
            ]
        }
    },
    mounted() {
        /** Initial module instance */
        this.getUserCards();

        if (this.battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE) {
            this.$root.$on(EVENT.BATTLE_DECK_SELECTION, this.callbackToggleDeckSelection);
        }

        if (this.shopMode) {
            this.$root.$on(EVENT.SHOP_DECK_SELECTION, this.callbackToggleShopSelection);
        }
    },
    destroyed() {
        this.$root.$off(EVENT.BATTLE_DECK_SELECTION, this.callbackToggleDeckSelection);
        this.$root.$off(EVENT.SHOP_DECK_SELECTION, this.callbackToggleDeckSelection);
    },
    methods: {
        onSubmit(evt) {
            this.getUserCards();
        },
        toggleFilters() {
            document.querySelector('.deck-filters').classList.toggle('show-filters');
            document.querySelector('.deck-cards').classList.toggle('show-filters');
        },
        getUserCards() {
            document.activeElement.blur();

            var filters = {
                cardName: this.filters.cardName,
                cardType: this.filters.cardType
            };

            if (this.battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE || this.shopMode) {
                filters.battleMode = true;
            }   

            this.$webSocket.sendComplexAction(ACTION.GET_USER_CARDS_ACTION, this.$options.name, filters, this.callBackGetUserCards);
            this.$loading.start(this.loadingName);
        },

        callBackGetUserCards(response) {
            var that = this;
            var cards = response;

            if (this.battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE || this.shopMode) {
                cards.forEach((obj, index, array) => {
                    var cardSelected = that.cardsSelected.filter((element) => {
                        return element.userCardId === obj.userCardId;
                    });

                    if (cardSelected.length > 0) {
                        array[index].selected = true;
                    } else {
                        array[index].selected = false;
                    }
                });
            }

            this.cards = cards;
            this.$loading.end(this.loadingName);
            this.toggleFilters();
        },
        callbackToggleDeckSelection(userCardId) {
            var that = this;

            var cardsFiltered = this.cardsSelected.filter((obj) => {
                return obj.userCardId === userCardId;
            });

            if (this.cardsSelected.length === 5 && !(cardsFiltered.length > 0)) {
                this.cards.forEach((obj, index) => {
                    if (obj.userCardId === userCardId) {
                        that.cards[index].selected = false;
                        return;
                    }
                });
                
                this.$root.$emit(EVENT.ERROR_EVENT, {message: 'battleDeckSelectionLimit', phase: 2});
                return;
            }

            if (cardsFiltered.length > 0) {
                this.cardsSelected = this.cardsSelected.filter((obj) => {
                    return obj.userCardId !== userCardId;
                });
            } else {
                var cardSelected = this.cards.filter((obj) => {
                    return obj.userCardId === userCardId;
                });
            
                this.cardsSelected.push(cardSelected[0]);
            }

            this.$root.$emit(EVENT.BATTLE_DECK_RESUME_SELECTION, this.cardsSelected);
        },

        callbackToggleShopSelection(userCardId) {
            var that = this;

            var cardsFiltered = this.cardsSelected.filter((obj) => {
                return obj.userCardId === userCardId;
            });
            
            if (cardsFiltered.length > 0) {
                this.cardsSelected = this.cardsSelected.filter((obj) => {
                    return obj.userCardId !== userCardId;
                });
            } else {
                var cardSelected = this.cards.filter((obj) => {
                    return obj.userCardId === userCardId;
                });
            
                this.cardsSelected.push(cardSelected[0]);
            }

            this.$root.$emit(EVENT.SHOP_DECK_RESUME_SELECTION, this.cardsSelected);
        }
    }
};
</script>

<style lang="scss" scoped>
/* Deck customization */
$button-color: #1a73e8;

.game-content {
    .game-content-header {
        .game-header-title {
            font-size: 1.2rem;
        }
    }
} 

.game-content-deck {
    height: 90%;
    width: 100%;
    border: 1px solid $game-content-border-color;

    .deck-filters {
        display: flex;
        flex-direction: column;
        height: 0%;
        width: 100%;
        overflow: hidden;
        transition: height .25s ease-out;
        font-size: 1rem;

        .deck-filters-content {
            height: 80%;
            width: 100%;
        }

        .deck-filters-bottom {
            display: flex;
            flex: 1;
            width: 100%;
            align-items: flex-end;
            justify-content: center;

            .fa-button {
                display: flex;
                height: 30px;
                width: 40px;
                align-items: center;
                justify-content: center;
                padding: 2px;
                color: white;
                background-color: $button-color;
                border-radius: 5px;
                cursor: pointer;
            }
        }

        .marging-element {
            margin: 5px;
        }

        &.show-filters {
            height: 30%;
            overflow-y: auto;
            padding: 10px;
            border-bottom: 1px solid #e0c56e;
        }
    }
    .deck-cards {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        padding: 10px;
        transition: height .25s ease-out;

        &.show-filters {
            height: 70%;
        }

        .deck-cards-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {

}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .game-content-deck {
        .deck-filters {
            &.show-filters {
                height: 100%;
                border-bottom: none;
            }
        }
        .deck-cards {
            &.show-filters {
                height: 0%;
                overflow: hidden;
                padding: 0;
            }
        }
    }

    .game-content {
        .game-content-header {
            height: 20%;
        }
    }

    .game-content-deck {
        height: 80%;
    }
}
/* End Deck customization */
</style>
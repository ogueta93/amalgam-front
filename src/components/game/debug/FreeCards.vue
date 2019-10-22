<template>
    <div class="game-content">
        <div class="game-content-header">
            <div class="game-header-title">{{ $t("freeCards.title") }}</div>
            <div class="game-header-controls">
                <i type="dark" @click="toggleFilters" class="fas fa-bars side-bar-button"></i>
            </div>
        </div>
        <div class="game-content-freeCards">
            <div class="freeCards-filters">
                <div class="freeCards-filters-content">
                    <form id="freeCards-search-form" name="form" @submit.prevent="onSubmit">
                        <div class="input-group-flex inline">
                            <div class="include-label sm">
                                <div class="input-label">{{ $t('freeCards.cardNameFilter') }}</div>
                                <input class="input-form-flex" type="text" v-model="filters.cardName">
                            </div>
                             <div class="include-label sm">
                                <div class="input-label">{{ $t('freeCards.cardTypeFilter') }}</div>
                                <select class="input-form-flex margin-left" v-model="filters.cardType">
                                    <option v-for="option in typeCardOptions" v-bind:key="option.value" v-bind:value="option.value">
                                        {{ option.text }}
                                    </option>
                                </select>
                            </div>                            
                        </div>
                    </form>
                </div>
                <div class="freeCards-filters-bottom">
                    <div @click="getCards" class="fa-button">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <div class="freeCards-cards">
                <div v-if="cards.length" class="freeCards-cards-content">
                    <gameCard v-for="card in cards" :key="card.id" :card="card" :debug="true"></gameCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gameCard from '@/components/game/deck/GameCard';

import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';

export default {
    name : 'freeCardsComponent',
    props: {
    },
    components: {
        gameCard
    },
    data() {
        return {
            cards: [],
            filters: {
                cardName: "",
                cardType: 0,
            },
            loadingName: 'freeCardsLoading',
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
        this.getCards();
    },
    destroyed() {
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            
            this.getCards();
        },
        toggleFilters() {
            document.querySelector('.freeCards-filters').classList.toggle('show-filters');
            document.querySelector('.freeCards-cards').classList.toggle('show-filters');
        },
        getCards() {
            document.activeElement.blur();

            var filters = {
                cardName: this.filters.cardName,
                cardType: this.filters.cardType
            };

            this.$webSocket.sendComplexAction(ACTION.GET_GAME_CARDS_ACTION, this.$options.name, filters, this.callBackGetCards);
            this.$loading.start(this.loadingName);
        },

        callBackGetCards(response) {
            var that = this;
            this.cards = response;

            this.$loading.end(this.loadingName);
            this.toggleFilters();
        }
    }
};
</script>

<style lang="scss" scoped>
/* freeCards customization */
$button-color: #1a73e8;
$header-background-color: #ff2907;

.game-content {
    .game-content-header {
        background-color: $header-background-color;
        .game-header-title {
            font-size: 1.2rem;
        }
    }
} 

.game-content-freeCards {
    height: 90%;
    width: 100%;
    border: 1px solid $game-content-border-color;

    .freeCards-filters {
        display: flex;
        flex-direction: column;
        height: 0%;
        width: 100%;
        overflow: hidden;
        transition: height .25s ease-out;
        font-size: 1rem;

        .freeCards-filters-content {
            height: 80%;
            width: 100%;
        }

        .freeCards-filters-bottom {
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
    .freeCards-cards {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        padding: 10px;
        transition: height .25s ease-out;

        &.show-filters {
            height: 70%;
        }

        .freeCards-cards-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
    }
}

@media (max-width: 768px) {
    .game-content-freeCards {
        .freeCards-filters {
            &.show-filters {
                height: 100%;
                border-bottom: none;
            }
        }
        .freeCards-cards {
            &.show-filters {
                height: 0%;
                overflow: hidden;
                padding: 0;
            }
        }
    }
}

@media (max-width: 768px) and (orientation: landscape) {
    .game-content {
        .game-content-header {
            height: 20%;
        }
    }

    .game-content-freeCards {
        height: 80%;
    }
}
/* End freeCards customization */
</style>
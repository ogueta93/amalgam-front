<template>
    <div class="shop-content">
        <div class="boosters-content">
            <booster v-for="booster in boosters" :key="booster.id" :booster="booster" :shopMode="true"></booster>
        </div>
        <div class="cart-content">
            <div class="game-content">
                <div class="game-content-header">
                    <div class="game-header-title">{{ $t("shop.headerTitle") }}</div>
                </div>
                <div class="game-content-body">
                    <div class="game-body-content">
                        <div class="resume-cart">
                            <div :class="['purchase-element', purchase.name]" v-for="purchase in purchases" :key="purchase.id" >
                                <div class="purchase-name">
                                    {{purchase.name}}
                                </div>
                                <div class="purchase-commands">
                                    <div v-if="purchase.limitReached !== true" class="purchase-plus" @click="addBooster(purchase.id)">
                                        <i class="fas fa-plus-circle"></i>
                                    </div>
                                    <div class="purchase-quantity">
                                        {{purchase.quantity}}
                                    </div>
                                     <div class="purchase-remove" @click="removeBooster(purchase.id)">
                                        <i class="fas fa-minus-circle"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-actions-content">
                <div :class="['accept-selection-button', {'show': purchases.length}]" @click="toogleBuyScreen()">
                    {{ $t("shop.buyButtom") }}
                </div>
            </div>
        </div>
        <div :class="['buy-screen-content', {'show': buyScreen}]">
            <div class="close-buy-screen" @click="toogleBuyScreen()">
                <i class="fas fa-times-circle"></i>
            </div>
            <div class="deck-card-selection">
                <deck v-if="!resetDeck" :shopMode="true"></deck>
            </div>
            <div class="resume-cart-count">
                <div :class="['cards-count', {'not-enough': userCardSelectedToPay.length !== totalCost}]">
                    {{userCardSelectedToPay.length}} / {{totalCost}} {{ $t("shop.cards") }}
                </div>
                <div :class="['cart-finish-button', {show: userCardSelectedToPay.length === totalCost}]" @click="finishPurchase">
                    {{ $t("shop.finishCartButton") }}
                </div>
            </div>
        </div>
        <div :class="['daily-free-booster', {'available': dailyFreeBooster}]">
            <div class="daily-free-booster-text">
                {{ $t("shop.msgFreeBooster") }}
            </div>
            <div class="daily-free-booster-icon" @click="getDailyFreeBooster()">
                <i v-if="!dailyFreeBooster" class="fas fa-times"></i>
                <i v-else class="fas fa-trophy"></i>
            </div>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';
import BOOSTER_TYPE from '@/constants/BoosterTypeConstant';
import CONFIRMATION_TYPE from '@/constants/ConfirmationType';

import booster from '@/components/game/shop/Booster';
import deck from '@/components/game/Deck';

export default {
    name : 'shopComponent',
    components: {
        booster,
        deck
    },
    data() {
        return {
            boosters: [],
            shopCart: [],
            purchases: [],
            userCardSelectedToPay: [],
            totalCost: 0,
            buyScreen: false,
            resetDeck: false,
            dailyFreeBooster: false,
        }
    },
    mounted() {
        this.$root.$on(EVENT.ADD_BOOSTER, this.callBackAddBooster);
        this.$root.$on(EVENT.SHOP_DECK_RESUME_SELECTION, this.callBackShopDeckResumeSelection);

        this.getBoosters();
        this.checkUserDailyFreeBooster();
    },
    destroyed() {
        this.$root.$off(EVENT.ADD_BOOSTER);
        this.$root.$off(EVENT.SHOP_DECK_RESUME_SELECTION);
    },
    methods: {
        getBoosters() {
            this.$webSocket.sendComplexAction(ACTION.GET_AVAILABLE_BOOSTERS, this.$options.name, {}, this.callBackGetBoosters);
        },
        addBooster(id) {            
            var booster = this.boosters.filter((obj) => {
                return obj.id === id;
            });

            this.shopCart.push(booster[0]);
            
            this.reloadPurchases();
        },
        removeBooster(id) {
            for (var index = this.shopCart.length -1; index >= 0; index--) {
                if (this.shopCart[index].id === id) {
                    this.shopCart.splice(index, 1);
                    break;
                } 
            }

            this.reloadPurchases();
        },
        reloadPurchases() {
            var that = this;

            this.purchases = [];

            var boosterTypes = this.getBoosterTypesInCart();
            boosterTypes.forEach((id) => {
                var purchase = that.shopCart.filter((obj) => {
                    return obj.id === id;
                });
                
                if (purchase.length) {
                    var single = purchase[0];
                    that.purchases.push({id: single.id, name: single.name, cost: single.cost, quantity: purchase.length})
                }
            });

            this.setLimitWinRowBoosters();
            this.totalCost = this.getTotalCost();
        },
        finishPurchase() {
            var purchases = {
                purchases: [],
                userCardIdsToPay: []
            };

            this.purchases.forEach((obj) => {
                purchases.purchases.push({id: obj.id, quantity: obj.quantity});
            });

            this.userCardSelectedToPay.forEach((obj) => {
                purchases.userCardIdsToPay.push(obj.userCardId);
            });

            this.$webSocket.sendComplexAction(ACTION.PURCHASE_BOOSTERS_ACTION, this.$options.name, purchases, this.callBackFinishPurchase);
        },
        checkUserDailyFreeBooster() {
            this.$webSocket.sendComplexAction(ACTION.CHECK_USER_DAILY_BOOSTER_ACTION, this.$options.name, {}, this.callBackCheckDailyBooster);
        },
        toogleBuyScreen() {
            this.buyScreen = !this.buyScreen;
        },
        setLimitWinRowBoosters() {
            var rowBoosterInPurchase = this.purchases.filter((obj) => {
                return obj.id === BOOSTER_TYPE.SPECIAL || obj.id === BOOSTER_TYPE.LEGENDARY;
            });

            rowBoosterInPurchase.forEach((obj) => {
                obj.limitReached = true;
            });
            
            this.boosters.forEach((obj) => {
                if(obj.id === BOOSTER_TYPE.SPECIAL || obj.id === BOOSTER_TYPE.LEGENDARY) {
                    if (rowBoosterInPurchase.length) {
                        obj.limitReached = true;
                    } else {
                        obj.limitReached = false;
                    }
                }
            });
        },
        getBoosterTypesInCart() {
            var boosterTypes = [];

            this.shopCart.forEach((obj) => {
                if (!boosterTypes.includes(obj.id)) {
                    boosterTypes.push(obj.id); 
                }
            });

            return boosterTypes;
        },
        getDailyFreeBooster() {
            if (!this.dailyFreeBooster) {
                return false;
            }

            this.$webSocket.sendComplexAction(ACTION.GET_DAILY_FREE_BOOSTER, this.$options.name, {}, this.callBackGetDailyFreeBooster);
        },
        getTotalCost() {
            var totalCost = 0;

            this.purchases.forEach((obj) => {
                totalCost += obj.cost * obj.quantity
            });

            return totalCost;
        },
        callBackGetBoosters(response) {
            var boosters = response;
            boosters.forEach((obj) => {
                obj.limitReached = false;
            });
            
            this.boosters = boosters;
        },
        callBackAddBooster(boosterComponent) {
            var booster = boosterComponent.booster;
            
            this.addBooster(booster.id);
            boosterComponent.correctlyAdded = true;
        },
        callBackShopDeckResumeSelection(cards) {
            this.userCardSelectedToPay = cards;
        },
        callBackFinishPurchase(response) {
            this.toogleBuyScreen();
            this.$root.$emit(EVENT.CONFIRMATION_EVENT, CONFIRMATION_TYPE.PURCHASE_HAS_FINISHED);

            var that = this;
            this.resetDeck = true;
            this.$nextTick(() => {
                that.resetDeck = false;
                that.shopCart = [];
                that.userCardSelectedToPay = [];
                that.reloadPurchases();
            });
        },
        callBackCheckDailyBooster(response) {
            this.dailyFreeBooster = response;
        },
        callBackGetDailyFreeBooster(response) {
            this.$root.$emit(EVENT.CONFIRMATION_EVENT, CONFIRMATION_TYPE.PURCHASE_HAS_FINISHED);
            this.checkUserDailyFreeBooster();
        }
    }
};
</script>

<style lang="scss" scoped>
/* ShopComponent customization */
$normal-booster-dark-color: #5a4646;
$special-booster-dark-color: #a330bf;
$legendary-booster-dark-color: #D4AF37;

$add-button-color: #508cda;
$add-button-success-color: #3cbd82;
$remove-button-color: #dc3545;

$add-free-booster-button-shadow-color: #ffe48df5;

.shop-content {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;

    .boosters-content {
        display: flex;
        height: 50%;
        width: 80%;
        justify-content: space-evenly;
        align-items: center;
    }

    .cart-content {
        display: flex;
        height: 40%;
        width: 50%;
        justify-content: space-between;
        align-content: center;

        .game-content {
            width: 70%;

            .game-content-header {
                height: 15%;
            }
            
            .game-content-body {
                height: 85%;

                .resume-cart {
                    display: flex;
                    height: 100%;
                    width: 100%;
                    padding: 20px;
                    flex-direction: column;
                    justify-content: space-around;

                    .purchase-element {
                        display: flex;
                        height: 50px;
                        width: 100%;
                        align-items: center;
                        font-family: 'Audiowide', cursive;
                        border: solid 3px;
                        border-radius: 10px;

                        &.normalBooster {
                            border-color: $normal-booster-dark-color;
                        }

                        &.specialBooster {     
                            border-color: $special-booster-dark-color;
                        }

                        &.legendaryBooster {
                            border-color: $legendary-booster-dark-color;
                        }

                        .purchase-commands {
                            display: flex;
                            height: 100%;
                            width: 20%;
                            justify-content: center;
                            align-items: center;

                            .purchase-plus {
                                display: flex;
                                height: 100%;
                                width: 30%;
                                justify-content: center;
                                align-items: center;
                                color: $add-button-success-color;
                                font-size: 1.2rem;
                                cursor: pointer;
                            }

                            .purchase-quantity {
                                display: flex;
                                height: 100%;
                                width: 40%;
                                justify-content: center;
                                align-items: center;
                                font-size: 1.3rem;
                            }

                            .purchase-remove {
                                display: flex;
                                height: 100%;
                                width: 30%;
                                justify-content: center;
                                align-items: center;
                                color: $remove-button-color;
                                font-size: 1.2rem;
                                cursor: pointer;
                            }
                        }

                        .purchase-name {
                            display: flex;
                            height: 100%;
                            width: 80%;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
            }
        }

        .cart-actions-content {
            display: flex;
            height: 100%;
            width: 20%;
            justify-content: center;
            align-items: center;

            .accept-selection-button {
                display: flex;
                height: 0px;
                width: 100%;
                justify-content: center;
                align-items: center;
                background: $add-button-color;
                color: white;
                font-family: 'Audiowide', cursive;
                box-shadow: 0 12px 6px -6px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                overflow: hidden;
                transition: height ease-out 0.3s;

                &.show {
                    height: 50px;
                    overflow: auto;
                }
            }
        }
    }

    .buy-screen-content {
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        opacity: 0;
        z-index: 1;
        left: -100%;
        transition: left ease-out 0.5s, opacity ease-out 0.5s;
                
        &.show {
            left: 0;
            opacity: 1;
            background: rgba(0, 0, 0, 0.3);
            transition: left ease-out 0.5s, opacity ease-out 0.5s;
        }

        .close-buy-screen {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            height: 50px;
            width: 50px;
            color: black;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            cursor: pointer;
        }

        .deck-card-selection {
            display: flex;
            height: 80%;
            width: 80%;
        }

        .resume-cart-count {
            display: flex;
            height: 10%;
            width: 80%;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: flex-end;
            font-family: 'Audiowide', cursive;

            .cards-count {
                display: flex;
                height: 50%;
                width: 20%;
                justify-content: center;
                align-items: center;
                font-size: 1.4rem;

                &.not-enough {
                    color: red;
                }
            }

            .cart-finish-button {
                display: flex;
                height: 0;
                width: 20%;
                justify-content: center;
                align-items: center;
                background: $add-button-color;
                color: white;
                box-shadow: 0 12px 6px -6px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                overflow: hidden;
                transition: height ease-out 0.3s;
                font-size: 1.2rem;

                &.show {
                    height: 40%;
                    overflow: auto;
                }
            }
        }
    }

    .daily-free-booster {
        position: absolute;
        top: 20px;
        right: 30px;
        display: flex;
        height: 100px;
        width: 200px;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

         &.available {
             cursor: pointer;
             .daily-free-booster-icon {
                background: $add-button-success-color;
                box-shadow: 0 14px 6px -6px $add-free-booster-button-shadow-color;
            }
        }

        .daily-free-booster-text {
            display: flex;
            width: 100%;
            height: 20%;
            justify-content: center;
            align-items: center;
            font-family: 'Audiowide', cursive;
        }

        .daily-free-booster-icon {
            display: flex;
            width: 40%;
            height: 60%;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            color: white;
            background: $remove-button-color;
            font-size: 2rem;

            &:hover {
                transform: scale(1.2);
            }
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {
    .shop-content {
        .daily-free-booster {
            top: 0;
            right: 5px;
            height: 75px;
            width: 150px;

            .daily-free-booster-text {
                font-size: 0.8rem;
            }

            .daily-free-booster-icon {
                font-size: 1.5rem;
            }
        }

        .cart-content {
            .game-content {
                .game-content-body {
                    .resume-cart {
                        .purchase-element {
                            height: 30px;
                            border: solid 3px;

                            .purchase-name {
                                width: 70%;
                                font-size: 0.7rem;
                            }

                            .purchase-commands {
                                width: 30%;
                                .purchase-plus {
                                    font-size: 0.8rem;
                                }

                                .purchase-quantity {
                                    font-size: 0.9rem;
                                }

                                .purchase-remove {
                                    font-size: 0.8rem;
                                }
                            }
                        }
                    }
                }
            }
            
            .cart-actions-content {
                .accept-selection-button {                  
                    &.show {
                        height: 40px;
                        font-size: 1rem;
                    }
                }
            }
        }
        
        .buy-screen-content {
            .resume-cart-count {
                .cart-finish-button {
                    font-size: 0.8rem;
                }
            }
        }
    }
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .shop-content {
        .daily-free-booster {
            top: 0;
            right: 5px;
            height: 50px;
            width: 100px;

            .daily-free-booster-text {
                font-size: 0.5rem;
            }

            .daily-free-booster-icon {
                font-size: 1rem;
            }
        }

        .cart-content {
            .game-content {
                .game-content-header {
                    .game-header-title {
                        font-size: 0.8rem;
                    }
                }

                .game-content-body {
                    background-color: inherit;
                    .resume-cart {
                        padding: 10px;
                        .purchase-element {
                            height: 25px;
                            border: solid 2px;

                            .purchase-name {
                                width: 70%;
                                font-size: 0.5rem;
                            }

                            .purchase-commands {
                                width: 30%;
                                .purchase-plus {
                                    font-size: 0.6rem;
                                }

                                .purchase-quantity {
                                    font-size: 0.7rem;
                                }

                                .purchase-remove {
                                    font-size: 0.6rem;
                                }
                            }
                        }
                    }
                }
            }
            
            .cart-actions-content {
                .accept-selection-button {                  
                    &.show {
                        height: 20px;
                        font-size: 0.8rem;
                    }
                }
            }
        }
        
        .buy-screen-content {
            .resume-cart-count {
                .cards-count {
                    font-size: 0.6rem;
                }

                .cart-finish-button {
                    font-size: 0.4rem;
                }
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .shop-content {
        .daily-free-booster {
            top: 0;
            right: -20px;
            height: 50px;
            width: 100px;

            .daily-free-booster-text {
                font-size: 0.5rem;
            }

            .daily-free-booster-icon {
                font-size: 1rem;
            }
        }

        .cart-content {
            .game-content {
                .game-content-header {
                    .game-header-title {
                        font-size: 0.8rem;
                    }
                }

                .game-content-body {
                    background-color: inherit;
                    .resume-cart {
                        padding: 10px;
                        .purchase-element {
                            height: 25px;
                            border: solid 2px;

                            .purchase-name {
                                width: 70%;
                                font-size: 0.5rem;
                            }

                            .purchase-commands {
                                width: 30%;
                                .purchase-plus {
                                    font-size: 0.6rem;
                                }

                                .purchase-quantity {
                                    font-size: 0.7rem;
                                }

                                .purchase-remove {
                                    font-size: 0.6rem;
                                }
                            }
                        }
                    }
                }
            }
            
            .cart-actions-content {
                .accept-selection-button {                  
                    &.show {
                        height: 20px;
                        font-size: 0.8rem;
                    }
                }
            }
        }
        
        .buy-screen-content {
            .resume-cart-count {
                .cards-count {
                    font-size: 0.6rem;
                }

                .cart-finish-button {
                    font-size: 0.4rem;
                }
            }
        }
    }
}
/* End ShopComponent customization */
</style>
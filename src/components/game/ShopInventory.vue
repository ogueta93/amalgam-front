<template>
    <div class="shop-inventory-content">
        <div class="shop-inventory">
            <div class="boosters-inventory-content">
                <div class="game-content">
                    <div class="game-content-header">
                        <div class="game-header-title">{{ $t("shopInventory.headerTitle") }}</div>
                    </div>
                    <div class="game-content-body">
                        <div class="game-body-content">
                            <booster v-for="booster in userBoosters" :key="booster.id" :booster="booster" :openMode="true"></booster>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="['open-booster-content', {'show': show}]">
                <div class="open-booster-title">
                    {{$t('shopInventory.openBoosterTitle')}}
                </div>
                <div class="open-booster-cards">
                    <gameCard v-for="card in userCards" :key="card.userCardId" :card="card" :openedMode="true"></gameCard>
                </div>
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
import gameCard from '@/components/game/deck/GameCard';

export default {
    name : 'shopInventoryComponent',
    components: {
        booster,
        gameCard
    },
    data() {
        return {
            userBoosters: [],
            userCards: [],
            currentComponent: null,
            show: null
        }
    },
    mounted: function() {
        this.$root.$on(EVENT.OPEN_BOOSTER, this.openBoosterEvent);

        this.getUserBoosters();
    },
    destroyed: function() {
        this.$root.$off(EVENT.OPEN_BOOSTER);
    },
    methods: {
       getUserBoosters: function() {
            this.$webSocket.sendComplexAction(ACTION.GET_USER_BOOSTERS_ACTION, this.$options.name, {}, this.callbackGetUserBoosters);
       },

       openBoosterEvent: function(component) {
           this.currentComponent = component;
           var data = {id: this.currentComponent.booster.id};

           if (this.show === null) {
                this.$webSocket.sendComplexAction(ACTION.OPEN_USER_BOOSTER_ACTION, this.$options.name, data, this.callBackOpenUserBooster);
           } else {
               var that = this;
               this.show = false;

               this.$el.querySelector('.open-booster-content').addEventListener('transitionend', function transitionEnd(event) {
                   that.$webSocket.sendComplexAction(ACTION.OPEN_USER_BOOSTER_ACTION, that.$options.name, data, that.callBackOpenUserBooster);
                   this.removeEventListener('transitionend', transitionEnd);
               });
           }
       },

       callbackGetUserBoosters: function(response) {
           var that = this;
           this.userBoosters = [];
           var boosters = response;

            boosters.forEach(function(obj) {
                var userBoosterType = that.userBoosters.filter(function(element) {
                    return obj.boosterType.id === element.id;
                });

                if (userBoosterType.length) {
                    userBoosterType[0].quantity++;
                } else {
                    that.userBoosters.push({...obj.boosterType, ...{quantity: 1}});
                }
            });
       },
       callBackOpenUserBooster: function(response) {
           this.userCards = response;
           this.show = true;
           this.currentComponent.canOpen = true;
           
           this.getUserBoosters();
       },
    }
};
</script>

<style lang="scss" scoped>
/* ShopInventoryComponent customization */
.shop-inventory-content {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;

    .shop-inventory {
        display: flex;
        width: 80%;
        height: 80%;
        flex-direction: row-reverse;
        justify-content: space-around;
        align-items: center;

        .boosters-inventory-content {
            display: flex;
            width: 20%;
            height: 100%;
            justify-content: center;
            background: yellow;
            align-items: center;

            .game-content {
                .game-content-body {
                    .game-body-content {
                        display: flex;
                        width: 100%;
                        height: 100%;
                        flex-direction: column;
                        justify-content: space-evenly;
                        align-items: center;
                    }
                }
            }
        }

        .open-booster-content {
            display: flex;
            width: 70%;
            height: 100%;
            justify-content: space-between;
            align-items: center;
            flex-flow: column;
            opacity: 0;
            transition: opacity 1s ease-out;

            &.show {
                opacity: 1;
            }

            .open-booster-title {
                display: flex;
                height: 30%;
                width: 100%;
                justify-content: center;
                align-items: flex-end;
                font-family: 'Audiowide', cursive;
                font-size: 2.5rem;
            }

            .open-booster-cards {
                display: flex;
                height: 70%;
                width: 100%;
                justify-content: space-evenly;
                align-items: center;
            }
        }
    }
}
/* End ShopInventoryComponent customization */
</style>
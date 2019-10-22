<template>
    <div>
        <div :class="['booster-content', booster.name, {'correct-added-animation': correctlyAdded}, {'open-mode': openMode}]">
            <div v-if="shopMode && (!booster.available || booster.limitReached)" class="not-available">
                <div class="not-available-text">
                    <span v-if="booster.available && (booster.id === BOOSTER_TYPE.SPECIAL || booster.id === BOOSTER_TYPE.LEGENDARY)">
                        {{ $t('error.messages.canNotBuyMoreThanOneRowBoosterError') }}
                    </span>
                    <span v-else-if="!booster.available && (booster.id === BOOSTER_TYPE.SPECIAL || booster.id === BOOSTER_TYPE.LEGENDARY)">
                        {{ $t('error.messages.' + booster.msg, {leftCount: booster.leftCount}) }}
                    </span>
                </div>
            </div>
            <div v-if="openMode" class="booster-user-quantity">
                {{booster.quantity}}
            </div>
            <div class="booster-header">
                {{booster.name}}
            </div>
            <div class="booster-body">
            </div>
            <div v-if="shopMode" class="booster-bottom">
                <div class="cards-cost">
                    <i class="fas fa-caret-down"></i>
                    <div class="card-cost-text">
                        {{booster.cost}}
                    </div>
                </div>
                <div v-if="booster.winRowCost" class="cards-win-row-cost">
                    {{booster.winRowCost}}
                </div>
            </div>
            <div class="booster-add-button">
                <div v-if="shopMode" class="add-button" @click="addBooster">
                    <i v-if="correctlyAdded" class="fas fa-check"></i>
                    <i v-else class="fas fa-plus"></i>
                </div>
                <div v-if="openMode" class="open-button" @click="openBooster">
                   <i class="fas fa-box-open"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';

import BOOSTER_TYPE from '@/constants/BoosterTypeConstant';

export default {
    name : 'boosterComponent',
    props: {
        booster: {
            type: Object,
            required: true
        },
        shopMode: {
            type: Boolean,
            required: false
        },
        openMode: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            BOOSTER_TYPE: BOOSTER_TYPE,
            canAdd: true,
            canOpen: true,
            correctlyAdded: false
        }
    },
    mounted() {
        /** Initial module instance */
    },
    updated() {
        /** after render */
    },
    watch: {
        correctlyAdded(value) {
            if (value === false) {
                return;
            }

            var that = this;
            var animation = this.$el.querySelector('.booster-content');
            animation.addEventListener("animationend", () => {
                that.canAdd = true;
                that.correctlyAdded = false;
            });
        }
    },
    methods: {
        addBooster() {
            if (this.canAdd) {
                this.canAdd = false;
                this.$root.$emit(EVENT.ADD_BOOSTER, this);
            }
        },
        openBooster() {
            if (this.canOpen) {
                this.canOpen = false;
                this.$root.$emit(EVENT.OPEN_BOOSTER, this);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
/* BoosterComponent customization */
$cards-cost-color: #ff7a00de;
$card-wins-row-background-color: #2abb8f;

$normal-booster-dark-color: #5a4646;
$normal-booster-light-color: #dabaaa;

$special-booster-dark-color: #a330bf;
$special-booster-light-color: #a330bf4f;

$legendary-booster-dark-color: #D4AF37;
$legendary-booster-light-color: #ffe48dd1;

$add-button-color: #508cda;
$add-button-success-color: #3cbd82;

$booster-user-quantity-background-color: #ad41ff;

.booster-content {
    position: relative;
    height: 300px;
    width: 230px;
    border: solid 5px;
    border-radius: 0 60px 0 60px;
    box-shadow: 0 14px 6px -6px rgba(0, 0, 0, 0.3);
    font-family: 'Audiowide', cursive;

    &.open-mode {
        height: 170px;
        width: 150px;

        .booster-header {
            padding: 5px;
            font-size: 0.7rem;
            justify-content: flex-start;
        }

        .booster-body {
            display: flex;
            height: 80%;
            width: 100%;
            justify-content: center;
            align-items: center;
        }

        .booster-user-quantity {
            position: absolute;
            display: flex;
            top: -5px;
            right: -5px;
            width: 30px;
            height: 30px;
            justify-content: center;
            align-items: center;
            border-radius: 30px;
            background: $booster-user-quantity-background-color;
            color: white;
            font-size: 1.1rem;
        }
    }

    .not-available {
        position: absolute;
        display: flex;
        top: -5px;
        left: -5px;
        height: calc(100% + 10px);
        width: calc(100% + 10px);
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.3);
        border: solid black 5px;
        border-radius: 0 60px 0 60px;
        opacity: 0;
        z-index: 1;

        &:hover {
            opacity: 1;
        }

        .not-available-text {
            padding: 20px;
            color: white;
            text-transform: capitalize;
            font-size: 0.8rem;
        }
    }

    .booster-add-button {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        transition: opacity ease-out 0.3s;

        &:hover {
            opacity: 1;
        }

        .add-button {
            display: flex;
            height: 50px;
            width: 50px;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            background: $add-button-color;
            color: white;
            cursor: pointer;
        }

         .open-button {
            display: flex;
            height: 50px;
            width: 50px;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            background: $add-button-success-color;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }

    .booster-header {
        display: flex;
        height: 20%;
        width: 100%;
        justify-content: center;
        align-items: center;
        border-bottom: solid 5px; 

        font-size: 0.9rem;
    }
    .booster-body {
        display: flex;
        height: 60%;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .booster-bottom {
        display: flex;
        height: 20%;
        width: 100%;
        justify-content: space-evenly;
        align-items: center;
        font-size: 0.9rem;

        .cards-cost {
            position: relative;
            display: flex;
            width: 60px;
            height: 40px;
            justify-content: center;
            align-items: center;
            font-size: 5.5rem;
            color: $cards-cost-color;

            .card-cost-text {
                position: absolute;
                top: 0;
                left: 0;
                width: 60px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.8rem;
                color: white;
            }
        }

        .cards-win-row-cost {
            display: flex;
            width: 35px;
            height: 35px;
            justify-content: center;
            align-items: center;
            background: $card-wins-row-background-color;
            border-radius: 50%;
            font-size: 0.8rem;
            color: white;
        }
    }

    &.normalBooster {
        background-color: $normal-booster-light-color;
        border-color: $normal-booster-dark-color;

        .booster-header {
            border-color: $normal-booster-dark-color;
        }
    }

    &.specialBooster {
        background-color: $special-booster-light-color;
        border-color: $special-booster-dark-color;

        .booster-header {
            border-color: $special-booster-dark-color;
        }
    }

    &.legendaryBooster {
        background-color: $legendary-booster-light-color;
        border-color: $legendary-booster-dark-color;

        .booster-header {
            border-color: $legendary-booster-dark-color;
        }
    }

    &.correct-added-animation {
        .booster-add-button {
            opacity: 1;
           .add-button {
               animation: correct-added-animation linear 0.3s;
               z-index: 1;
           }
        }
    }
}

@keyframes correct-added-animation {
    0% {
        background:$add-button-color;
    }
    50% {
        background:$add-button-success-color;
        transform: scale(1.5);
    }
    100% {
        background:$add-button-color;
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {
    .booster-content {
        height: 270px;
        width: 200px;
    }
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .booster-content {
        height: 125px;
        width: 125px;
        border-radius: 0 30px 0 30px;

         &.open-mode {
            height: 100px;
            width: 100px;
            border-radius: 0 30px 0 30px;

            .booster-header {
                padding: 2px;
                font-size: 0.5rem;
                justify-content: flex-start;
            }

            .booster-body {
                display: flex;
                height: 80%;
                width: 100%;
                justify-content: center;
                align-items: center;
            }

            .booster-user-quantity {
                position: absolute;
                display: flex;
                top: -10px;
                right: -5px;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                font-size: 0.7rem;
            }
        }

        .not-available {
            border-radius: 0 30px 0 30px;
            .not-available-text {
                padding: 10px;
                font-size: 0.5rem;
            }
        }

        .booster-header {
            font-size: 0.5rem;
        }
        
        .booster-bottom {
            .cards-cost {
                width: 30px;
                height: 20px;
                font-size: 2.5rem;

                .card-cost-text {
                    top: 2px;
                    width: 30px;
                    height: 20px;
                    font-size: 0.4rem;
                }
            }

            .cards-win-row-cost {
                display: flex;
                width: 15px;
                height: 15px;
                font-size: 0.4rem;
            }
        }

        .booster-add-button {
            .add-button {
                height: 25px;
                width: 25px;
                border-radius: 5px;
            }

            .open-button {
                height: 25px;
                width: 25px;
                border-radius: 5px;
                font-size: 0.8rem;
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .booster-content {
        height: 100px;
        width: 100px;
        border-radius: 0 30px 0 30px;

        &.open-mode {
            height: 100px;
            width: 100px;
            border-radius: 0 30px 0 30px;

            .booster-header {
                padding: 2px;
                font-size: 0.5rem;
                justify-content: flex-start;
            }

            .booster-body {
                display: flex;
                height: 80%;
                width: 100%;
                justify-content: center;
                align-items: center;
            }

            .booster-user-quantity {
                position: absolute;
                display: flex;
                top: -10px;
                right: -5px;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                font-size: 0.7rem;
            }
        }

        .not-available {
            border-radius: 0 30px 0 30px;
            .not-available-text {
                padding: 10px;
                font-size: 0.5rem;
            }
        }

        .booster-header {
            font-size: 0.4rem;
        }
        
        .booster-bottom {
            .cards-cost {
                width: 30px;
                height: 20px;
                font-size: 2.5rem;

                .card-cost-text {
                    top: 2px;
                    width: 30px;
                    height: 20px;
                    font-size: 0.4rem;
                }
            }

            .cards-win-row-cost {
                display: flex;
                width: 15px;
                height: 15px;
                font-size: 0.4rem;
            }
        }

        .booster-add-button {
            .add-button {
                height: 25px;
                width: 25px;
                border-radius: 5px;
            }

            .open-button {
                height: 25px;
                width: 25px;
                border-radius: 5px;
                font-size: 0.8rem;
            }
        }
    }
}
/* End BoosterComponent customization */
</style>
<template>
    <div class="battle-reward-content" v-if="rewardedCards.length">
        <div class="battle-reward-time-limit">
            <div class="battle-reward-time-limit-text">
                {{$t('battleReward.timeLimitTitle')}}
            </div>
            <div :class="['battle-reward-time-limit-circle', {stable: expiredTime >= 30}, {lightDanger: expiredTime > 10 && expiredTime < 30}, 
                {danger: expiredTime <= 10}]">
                <div class="quarter-circle"></div>
                <div class="limit-circle-text">
                    {{expiredTime}}
                </div>
            </div>   
        </div>
        <div v-if="rewardType === BATTLE_REWARD_TYPE.SIMPLE_REWARD" class="battle-reward-text-content">
            {{$t('battleReward.simpleRewardMsg')}}
        </div>
        <div v-else class="battle-reward-text-content">
            {{$t('battleReward.perfectRewardMsg')}}
        </div>
        <div class="battle-reward-cards-content">
            <gameCard v-for="card in rewardedCards" :key="card.userCardId" :card="card" 
                :battlePhase="BATTLE_PHASE.REWARD_PHASE" :rewardType="rewardType">
            </gameCard>
        </div>
        <div :class="['battle-reward-button-content', {active: rewardSelected || rewardType === BATTLE_REWARD_TYPE.PERFECT_REWARD}]">
            <div v-if="rewardSelected || rewardType === BATTLE_REWARD_TYPE.PERFECT_REWARD" class="battle-reward-button" @click="claimReward">
                {{ $t("battleReward.claimRewardButton") }}
            </div>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';
import BATTLE_REWARD_TYPE from '@/constants/BattleRewardType';
import BATTLE_PHASE from '@/constants/BattlePhase';

import gameCard from '@/components/game/deck/GameCard';

export default {
    name : 'battleRewardComponent',
    props: {
        battleData: {
            type: Object,
            required: true
        },
    },
    components: {
        gameCard
    },
    data() {
        return {
            BATTLE_REWARD_TYPE: BATTLE_REWARD_TYPE,
            BATTLE_PHASE: BATTLE_PHASE,

            rewardedCards: [],
            rewardSelected: null,
            rewardType: null,
            expiredTime: null,
            countDown: null,

            player: this.$localStorage.getUser()
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$root.$on(EVENT.BATTLE_REWARD_SELECTION, this.callbackRewardSelection);

        this.setBattleReward();
    },
    destroyed: function() {
        this.$root.$off(EVENT.BATTLE_REWARD_SELECTION);
    },
    methods: {
        setBattleReward: function() {
            this.$battle.setData(this.battleData);

            this.rewardType = this.$battle.getRewardType();
            this.rewardedCards = this.$battle.getRewardedCards(this.player.id);

            this.expiredTime = this.getExpiredTime();
            if (this.expiredTime === 0) {
                this.showErrorExpiredTime();
            } else {
                this.countDown = this.setCountDown();
            }
        },
        claimReward: function() {
            var data = {
                battleId: this.$battle.getId(),
                userCardId: this.rewardSelected !== null ? this.rewardSelected.userCardId : null
            }

            this.$webSocket.sendComplexAction(ACTION.CLAIM_BATTLE_REWARD, this.$options.name, data, this.callBackClaimBattleReward);
        },
        getExpiredTime: function() {
            var diff = parseInt((this.$battle.getRewardExpiredTime() - new Date) / 1000);

            return diff > 0 ? diff : 0;
        },
        showErrorExpiredTime: function() {
            this.$root.$emit(EVENT.ERROR_EVENT, {message: 'battleError_11', phase: 4});
        },
        setCountDown: function() {
            var that = this;
          
            var countDown = setInterval(function() {
                that.expiredTime = that.getExpiredTime();
                console.log(that.expiredTime);
                if (that.expiredTime === 0) {
                    that.showErrorExpiredTime();
                    clearInterval(that.countDown);
                } 
            }, 1000);

            return countDown;
        },

        callbackRewardSelection: function(data) {
            if (this.rewardSelected && data !== null) {
                data.cardRewardedSelected = false;
                return;
            }

            this.rewardSelected = data !== null ? data.card : null;
        },
        callBackClaimBattleReward: function(response) {
            this.$router.push('/game/deck');
        }
    }
};
</script>

<style lang="scss" scoped>
/* BattleReward customization */
    $button-background-color: #1a73e8;
    $circle-background-color-stable: #0de070;
    $circle-quarter-background-color-stable: #09c78e;
    $circle-background-color-lightDanger: #efe42e;
    $circle-quarter-background-color-lightDanger: #e47208;
    $circle-background-color-danger: #ef6d2a;
    $circle-quarter-background-color-danger: #ff0000;

    .battle-reward-content {
        position: relative;
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;

        .battle-reward-text-content {
            display: flex;
            height: 35%;
            width: 70%;
            align-items: center;
            justify-content: center;
            font-family: 'Audiowide', cursive;
            font-size: 2.5rem;
            text-transform: capitalize;
        }

        .battle-reward-cards-content {
            display: flex;
            height: 35%;
            width: 70%;
            align-items: center;
            justify-content: space-evenly;
        }

        .battle-reward-button-content {
            display: flex;
            width: 0%;
            height: 15%;
            justify-content: center;
            transition: width .15s ease-out;
            
            &.active {
                width: 70%;
            }

            .battle-reward-button {
                display: flex;
                width: 25%;
                height: 50%;
                align-items: center;
                justify-content: center;
                padding: 20px;
                color: white;
                font-family: 'Audiowide', cursive;
                background: $button-background-color;
                box-shadow: 0 10px 6px -6px rgba(0, 0, 0, 0.6);
                cursor: pointer;
            }
        }

        .battle-reward-time-limit {
            position: absolute;
            display: flex;
            height: 150px;
            width: 200px;
            top: 0;
            right: 50px;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            
            .battle-reward-time-limit-text {
                display: flex;
                height: 30%;
                width: 100%;
                align-items: center;
                justify-content: center;
                font-family: 'Audiowide', cursive;
                font-size: 1.5rem;
                text-transform: capitalize;
            }

            .battle-reward-time-limit-circle {
                position: relative;
                height: 80px;
                width: 80px;
                border-radius: 80px;

                &.stable {
                    background: $circle-background-color-stable;
                    .quarter-circle {
                        background: $circle-quarter-background-color-stable;
                    }
                }
                &.lightDanger {
                    background: $circle-background-color-lightDanger;
                    .quarter-circle {
                        background: $circle-quarter-background-color-lightDanger;
                    }
                }
                &.danger {
                    background: $circle-background-color-danger;
                    .quarter-circle {
                        background: $circle-quarter-background-color-danger;
                    }
                    .limit-circle-text {
                        color: black;
                        font-size: 2.2rem;
                    }
                }

                .quarter-circle {
                    height: 40px;
                    width: 40px;
                    border-radius: 40px 0 0 0;
                    top: 40px * -1;
                    transform-origin: 100% 100%;
                    animation: quarter-circle-animation 1s infinite linear;
                }

                .limit-circle-text {
                    position: absolute;
                    display: flex;
                    height: 100%;
                    width: 100%;
                    top: 0;
                    left: 0;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: 'Audiowide', cursive;
                    font-size: 2rem;
                }
            }
        }
    }

    @keyframes quarter-circle-animation {
      to {
          transform: rotate(360deg);
      }
      from {
          transform: rotate(0deg);
      }
    }
/* End BattleReward customization */
</style>
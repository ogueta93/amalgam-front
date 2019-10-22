<template>
    <div :data-id="data.id" class="notification-item new-batle-notification" v-if="data.type == types.NEW_BATTLE">
        <div class="notification-item-icon">
            <i class="fab fa-affiliatetheme"></i>
        </div>
        <div class="notification-item-content">
            <div class="notification-item-message">
                {{ $t('notification.challengeMsg', {nickName: data.createdBy.nickName}) }}
            </div>
            <div class="notification-item-buttons">
                <div class="notification-button" @click="acceptChallenge">
                    {{ $t('notification.acceptChallenge') }}
                </div>
                <div class="notification-button" @click="refuseBattle">
                    {{ $t('notification.refuse') }}
                </div>
            </div>
        </div>
        <div class="notification-close-button" @click="closeNotification">
            <i class="fas fa-times-circle"></i>
        </div>
    </div>

    <div :data-id="data.id" class="notification-item accepted-batle-notification" v-else-if="data.type == types.ACCEPT_BATTLE">
        <div class="notification-item-icon">
            <i class="fas fa-chess"></i>
        </div>
        <div class="notification-item-content">
            <div class="notification-item-message">
                {{ $t('notification.battleIsReadyMsg', {nickName: data.acceptedBy.nickName}) }}
            </div>
            <div class="notification-item-buttons">
                <div class="notification-button" @click="goToChallenge">
                    {{ $t('notification.goToChallenge') }}
                </div>
            </div>
        </div>
        <div class="notification-close-button" @click="closeNotification">
            <i class="fas fa-times-circle"></i>
        </div>
    </div>

    <div :data-id="data.id" class="notification-item battle-turn-movement-notification" v-else-if="data.type == types.BATTLE_TURN_MOVEMENT">
        <div class="notification-item-icon">
            <i class="fas fa-forward"></i>
        </div>
        <div v-if="!data.battleResult" class="notification-item-content">
            <div class="notification-item-message">
                {{ $t('notification.battleTurnMovementMsg', {nickName: data.user.nickName}) }}
            </div>
            <div class="notification-item-buttons">
                <div class="notification-button" @click="goToChallenge">
                    {{ $t('notification.goToBattle') }}
                </div>
            </div>
        </div>
        <div v-else class="notification-item-content">
             <div v-if="data.battleResult.winner && data.battleResult.winner.user.id !== data.user.id" class="notification-item-message">
                {{ $t('notification.battleTurnMovementWinnerMsg', {nickName: data.user.nickName, wPoints: data.battleResult.winner.cardsCount, lPoints: data.battleResult.loser.cardsCount}) }}
            </div>
            <div v-else-if="data.battleResult.loser && data.battleResult.loser.user.id !== data.user.id" class="notification-item-message">
                {{ $t('notification.battleTurnMovementLoserMsg', {nickName: data.user.nickName, wPoints: data.battleResult.winner.cardsCount, lPoints: data.battleResult.loser.cardsCount}) }}
            </div>
            <div v-else class="notification-item-message">
                {{ $t('notification.battleTurnMovementDrawMsg', {nickName: data.user.nickName}) }}
            </div>

            <div v-if="data.battleResult.winner && data.battleResult.winner.user.id !== data.user.id" class="notification-item-buttons">
                <div class="notification-button" @click="goToChallenge">
                    {{ $t('notification.claimReward') }}
                </div>
            </div>
        </div>
        <div class="notification-close-button" @click="closeNotification">
            <i class="fas fa-times-circle"></i>
        </div>
    </div>

    <div :data-id="data.id" class="notification-item battle-reward-claimed-notification" v-else-if="data.type == types.BATTLE_REWARD_CLAIMED">
        <div class="notification-item-icon">
            <i class="fas fa-exclamation"></i>
        </div>
        <div class="notification-item-content">
            <div v-if="data.rewardType === battleRewardTypes.SIMPLE_REWARD" class="notification-item-message">
                {{ $t('notification.battleRewardClaimedSimple', {nickName: data.user.nickName, cardName: data.cards[0].name}) }}
            </div>
            <div v-else class="notification-item-message">
                {{ $t('notification.battleRewardClaimedPerfect', {nickName: data.user.nickName}) }}
            </div>
        </div>
        <div class="notification-close-button" @click="closeNotification">
            <i class="fas fa-times-circle"></i>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';

import BATTLE_REWARD_TYPE from '@/constants/BattleRewardType';
import NOTIFICATION_TYPE from '@/constants/NotificationType';

export default {
    name : 'notificationiTemComponent',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            types: NOTIFICATION_TYPE,
            battleRewardTypes: BATTLE_REWARD_TYPE,
            componentNameEvent: this.$options.name + '-' + this.data.id
        }
    },
    mounted() {
        var that = this;
        /** Initial module instance */
        this.$webSocket.setEvent(ACTION.REFUSE_BATTLE_ACTION, this.componentNameEvent, this.closeNotificationByBattleId)
        this.$webSocket.setEvent(ACTION.ACCEPT_BATTLE_ACTION, this.componentNameEvent, this.closeNotificationByBattleId)

        if (this.data.visibility) {
            setTimeout(() => {
                that.$el.classList.toggle('visible');
            }, 100);
        }
    },
    destroyed() {
        this.$webSocket.$wsOff(ACTION.REFUSE_BATTLE_ACTION, this.componentNameEvent);
        this.$webSocket.$wsOff(ACTION.ACCEPT_BATTLE_ACTION, this.componentNameEvent);
    },
    watch: {
        'data.visibility'() {
            this.$el.classList.toggle('visible');
        }
    },
    methods: {
        closeNotification() {
            var that = this;

            this.$el.addEventListener('transitionend', () => {
                that.$root.$emit(EVENT.CLOSE_NOTIFICATION_EVENT, that.data.id); 
            });

            this.$el.classList.toggle('visible');
        },
        closeNotificationByBattleId(response) {
            if (this.data.battleId !== undefined && this.data.battleId === response.id) {
                this.closeNotification();
            }
        },
        acceptChallenge() {
            var that = this;

            var eventIdentificator = this.componentNameEvent + '-button';
            var data = {
                battleId: this.data.battleId
            };
            var callback = (response) => {
                that.$router.push({path: `/game/battle/${response.id}`});
            };

            this.$webSocket.sendComplexAction(ACTION.ACCEPT_BATTLE_ACTION, eventIdentificator, data, callback);
        },
        refuseBattle() {
            var data = {
                battleId: this.data.battleId
            };

            this.$webSocket.sendAction(ACTION.REFUSE_BATTLE_ACTION, data);
        },
        goToChallenge() {
            this.$router.push('/game/battle/' + this.data.battleId);
            this.closeNotification();
        },
    }
};
</script>

<style lang="scss" scoped>
/* notificationItem customization */
$new-battle-notification-dark-color: #1a73e8;
$new-battle-notification-light-color: #4e96f5;

$accepted-battle-notification-dark-color: #6110b9;
$accepted-battle-notification-light-color: #9244e6;

$battle-turn-movement-notification-dark-color: #e88e1a;
$battle-turn-movement-notification-light-color: #f5ac4e;

$battle-reward-claimed-notification-dark-color: #0b0c0c;
$battle-reward-claimed-notification-light-color: #424b52;

.notification-item {
    position: absolute;
    display: flex;
    right: -100%;
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    padding: 5px;
    margin: 20px 0 20px 0;
    transition: right .5s ease-out;

    &.visible{
        position: relative;
        right: 0;
    }

    .notification-item-icon {
        display: flex;
        height: 100%;
        width: 10%;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
    }

    .notification-item-content {
        display: flex;
        height: 100%;
        width: 90%;
        flex-direction: column;
        justify-content: center;
        padding: 5px;
        font-family: 'Audiowide', cursive;
        
        .notification-item-message {
            font-size: 0.9rem;
            margin: 0 0 10px 0;
        }

        .notification-item-buttons {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            font-size: 0.8rem;
            text-transform: uppercase;

            .notification-button {
                display: flex;
                width: auto;
                height: 20px;
                align-items: center;
                padding: 15px;
                box-shadow: 0 8px 5px -4px rgba(0, 0, 0, 0.6);
                cursor: pointer;
            }
        }
    }

    .notification-close-button {
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px 10px 0 0;
        font-size: 1.5rem;
        color: white;
        cursor: pointer;
    }
    
    &.new-batle-notification {
        color: white;

        .notification-item-icon {
            background-color: $new-battle-notification-dark-color;
        }

        .notification-item-content {
            background-color: $new-battle-notification-light-color;

            .notification-item-buttons {
                .notification-button {
                    background-color: $new-battle-notification-dark-color;
                }
            }
        }
    }

    &.accepted-batle-notification {
        color: white;

        .notification-item-icon {
            background-color: $accepted-battle-notification-dark-color;
        }

        .notification-item-content {
            background-color: $accepted-battle-notification-light-color;

            .notification-item-buttons {
                .notification-button {
                    background-color: $accepted-battle-notification-dark-color;
                }
            }
        }
    }

    &.battle-turn-movement-notification {
        color: white;

        .notification-item-icon {
            background-color: $battle-turn-movement-notification-dark-color;
        }

        .notification-item-content {
            background-color: $battle-turn-movement-notification-light-color;

            &.winner {
                background-color: green;
            }
            &.loser {
                background-color: red;
            }
            &.draw {
                background-color: grey;
            }

            .notification-item-buttons {
                .notification-button {
                    background-color: $battle-turn-movement-notification-dark-color;
                }
            }
        }
    }
    
    &.battle-reward-claimed-notification {
        color: white;

        .notification-item-icon {
            background-color: $battle-reward-claimed-notification-dark-color;
            color: red;
        }

        .notification-item-content {
            background-color: $battle-reward-claimed-notification-light-color;

            .notification-item-buttons {
                .notification-button {
                    background-color: $battle-reward-claimed-notification-dark-color;
                }
            }
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
    .notification-item {
        height: 60px;
        padding: 5px;
        margin: 2px 0 2px 0;

        .notification-item-icon {
            font-size: 0.8rem;
        }

        .notification-item-content {
            padding: 5px;
            
            .notification-item-message {
                font-size: 0.5rem;
                margin: 0 0 5px 0;
            }

            .notification-item-buttons {
                font-size: 0.5rem;

                .notification-button {
                    height: 15px;
                    padding: 5px;
                    box-shadow: 0 5px 5px -4px rgba(0, 0, 0, 0.6);
                }
            }
        }
        
        .notification-close-button {
            padding: 3px 5px 0 0;
            font-size: 0.8rem;
            color: white;
            cursor: pointer;
        }
    }
}
/* End notificationItem customization */
</style>
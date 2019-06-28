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
</template>

<script>
import EVENT from '@/constants/Event';
import NOTIFICATION_TYPE from '@/constants/NotificationType';
import ACTION from '@/constants/Action';

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
            componentNameEvent: this.$options.name + '-' + this.data.id
        }
    },
    mounted: function() {
        var that = this;
        /** Initial module instance */
        this.$webSocket.setEvent(ACTION.REFUSE_BATTLE_ACTION, this.componentNameEvent, this.closeNotificationByBattleId)
        this.$webSocket.setEvent(ACTION.ACCEPT_BATTLE_ACTION, this.componentNameEvent, this.closeNotificationByBattleId)

        if (this.data.visibility) {
            setTimeout(function() {
                that.$el.classList.toggle('visible');
            }, 100);
        }
    },
    destroyed: function() {
        this.$webSocket.$wsOff(ACTION.REFUSE_BATTLE_ACTION, this.componentNameEvent);
        this.$webSocket.$wsOff(ACTION.ACCEPT_BATTLE_ACTION, this.componentNameEvent);
    },
    watch: {
        'data.visibility': function() {
            this.$el.classList.toggle('visible');
        }
    },
    methods: {
        closeNotification: function() {
            var that = this;

            this.$el.addEventListener('transitionend', function(){
                that.$root.$emit(EVENT.CLOSE_NOTIFICATION_EVENT, that.data.id); 
            });

            this.$el.classList.toggle('visible');
        },
        closeNotificationByBattleId: function(response) {
            if (this.data.battleId !== undefined && this.data.battleId === response.id) {
                this.closeNotification();
            }
        },
        acceptChallenge: function() {
            var that = this;

            var eventIdentificator = this.componentNameEvent + '-button';
            var data = {
                battleId: this.data.battleId
            };
            var callback = function(response) {
                that.$router.push({path: `/game/battle/${response.id}`});
            };

            this.$webSocket.sendComplexAction(ACTION.ACCEPT_BATTLE_ACTION, eventIdentificator, data, callback);
        },
        refuseBattle: function() {
            var data = {
                battleId: this.data.battleId
            };

            this.$webSocket.sendAction(ACTION.REFUSE_BATTLE_ACTION, data);
        },
        goToChallenge: function() {
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
        font-size: 1.5em;
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
            font-size: 0.9em;
            margin: 0 0 10px 0;
        }

        .notification-item-buttons {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            font-size: 0.8em;
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
        font-size: 1.5em;
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
}
/* End notificationItem customization */
</style>
<template>
    <div v-if="data.length" class="notification-system">
        <div v-if="data.length > maxItems" class="notification-counter">
            <div class="notification-counter-number">
                +{{data.length - maxItems}}
            </div>
        </div>
        <div class="notification-content">
            <div v-for="notification in data" :key="notification.id">
                <notificationItem ref="not" :data="notification"></notificationItem>
            </div>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';
import NOTIFICATION_TYPE from '@/constants/NotificationType';

import notificationItem from '@/components/system/notification/NotificationItem';

export default {
    name : 'notificationComponent',
    components: {
        notificationItem
    },
    data() {
        return {
           data: [],
           lastId: 1,
           maxItems: 4
        }
    },
    mounted() {
        /** Initial module instance */
        this.$root.$on(EVENT.CLOSE_NOTIFICATION_EVENT, this.callBackCloseNotification);
        this.$webSocket.setEvent(ACTION.NOTIFICATION_ACTION, this.$options.name, this.callBackNotification);
    },
    methods: {
        filterNotification(data) {
            var that = this;
            var filterNotification = false;

            switch (data.type) {
                case NOTIFICATION_TYPE.BATTLE_TURN_MOVEMENT: 
                    var regexGameRoute = new RegExp("^\/game\/battle\/" + data.battleId, "i");
                    if (regexGameRoute.test(that.$router.currentRoute.fullPath)) {
                        filterNotification = true;
                    }
                    break;
                default:
                    break;
            }

            return filterNotification;
        },

        callBackNotification(response) {
            var data = response;
            
            if (this.filterNotification(data)) {
                return;
            }

            data.id = this.lastId++;
            data.visibility = this.data.length < this.maxItems ? true : false;

            this.data.push(data);
        },
        callBackCloseNotification(id) {
            var that = this;

            var newData = this.data.filter((obj) => {
                return obj.id != id;
            });

            for (var i = 0; i < this.maxItems; i++) {
                if (newData[i] instanceof Object) {
                    newData[i].visibility = true;
                }
            }

            this.data = newData;
        }
    }
};
</script>

<style lang="scss" scoped>
/* notification customization */
$notification-counter-background-color: #1a73e8;

.notification-system {
    position: absolute;
    right: 0;
    top: 0;
    height: auto;
    width: 30%;
    z-index: 3;

    .notification-content {
        display: flex;
        width: 100%;
        flex-direction: column-reverse;
        flex-shrink: 0;
        padding: 0 10px 0 10px;
    }

    .notification-counter {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: center;

        .notification-counter-number {
            display: flex;
            height: 50px;
            width: 50px;
            align-items: center;
            justify-content: center;
            margin: 20px 0 0 0;
            border-radius: 25px;
            background: $notification-counter-background-color;
            color: white;
            font-size: 1.2rem;
            font-family: 'Audiowide', cursive;
            box-shadow: 0 12px 5px -8px rgba(0, 0, 0, 0.6);
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
    .notification-system {
        width: 55%;
        .notification-counter {
            .notification-counter-number {
                height: 20px;
                width: 20px;
                border-radius: 20px;
                font-size: 0.7rem;
            }
        }
    }
}
/* END notification customization */
</style>
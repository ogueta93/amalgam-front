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
           maxItems: 5
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$root.$on(EVENT.CLOSE_NOTIFICATION_EVENT, this.callBackCloseNotification);
        this.$webSocket.setEvent(ACTION.NOTIFICATION_ACTION, this.$options.name, this.callBackNotification);
    },
    methods: {
        callBackNotification: function(response) {
            var data = response;

            data.id = this.lastId++;
            data.visibility = this.data.length < this.maxItems ? true : false;

            this.data.push(data);
        },
        callBackCloseNotification: function(id) {
            var that = this;

            var newData = this.data.filter(function(obj) {
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
        z-index: 2;

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
                font-size: 1.2em;
                font-family: 'Audiowide', cursive;
                box-shadow: 0 12px 5px -8px rgba(0, 0, 0, 0.6);
            }
        }
        
    }
/* END notification customization */
</style>
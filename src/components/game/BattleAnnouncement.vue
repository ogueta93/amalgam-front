<template>
    <div class="battle-announcement-content">
       <div v-if="msg" :class="['announcement-text', animationClass]">{{msg}}</div>
    </div>
</template>

<script>
import ANNOUNCEMENT from '@/constants/Announcement';

export default {
    name : 'battleAnnouncementomponent',
    props: {
        announcement: {
            type: String,
            required: true
        },
        extra: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            ANNOUNCEMENT: ANNOUNCEMENT,
            textPrefix: 'battleAnnouncement.messages.',
            msg: null,
            animationClass: null,
            steps: []
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.setAnnouncement();
        this.start();
    },
    destroyed: function() {
    },
    methods: {
        setAnnouncement: function() {
            switch(this.announcement) {
                case ANNOUNCEMENT.COIN_THROW:
                    this.setCointThrowAnnouncement();
                    break;
                default:
                    break;
            }
        },
        setCointThrowAnnouncement: function() {
            var that = this; 
            
            var announcement = this.announcement;
            var turn = this.extra.initialTurn === 1 ? 'A' : 'B';
            var user =  this.$localStorage.getUser();

            this.steps = [
                {msg: that.$i18n.t(that.textPrefix + 'coinThrow1', {nickName: user.nickName}), class: 'coinThrow1'},
                {global: announcement},
                {msg: that.$i18n.t(that.textPrefix + 'coinThrow3' + turn), class: 'coinThrow3' + turn},
                {msg: that.$i18n.t(that.textPrefix + 'coinThrow4' + turn), class: 'coinThrow4' + turn},
                {msg: that.$i18n.t(that.textPrefix + 'coinThrow5', {nickName: user.nickName}), class: 'coinThrow5'}
            ];
        },
        start: function() {
            this.msg = this.animationClass = null;
            this.nextTick();
        },

        nextTick: function(numTick) {
            if (numTick === undefined) {
                numTick = 1;
            }

            var that = this;
            var obj = this.steps[numTick - 1];
            var numStep = numTick.toString();

            if (obj.global !== undefined) {
                var global = obj.global + numStep

                this.msg = that.$i18n.t(that.textPrefix + global);
                this.animationClass = global;
            } else {
                var suffix = obj.automatic !== undefined ? numStep : '';

                this.msg = obj.automatic !== undefined ? this.$i18n.t(this.textPrefix + obj.msg + suffix) : obj.msg;
                this.animationClass = obj.class + suffix;
            }

            this.$nextTick(function() {
                var element = that.$el.querySelector('.' + that.animationClass);
                element.addEventListener('animationend', function() {
                    if (numTick < that.steps.length) {
                        that.msg = that.animationClass = null;
                        
                        that.$nextTick(function() {
                            that.nextTick(++numTick);
                        });
                    }
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
/* Deck customization */
$primary-gradient-color: #1a73e8;
$secondary-gradient-color: #e8391a;

.battle-announcement-content {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;

    .announcement-text {
        position: relative;
        font-family: 'Audiowide', cursive;
        text-transform: uppercase;
        font-size: 3.5em;
        letter-spacing: 4px;
        background: linear-gradient(90deg, black, #fff, black);
        color: rgba(255, 255, 255, 0);

        &.coinThrow1 {
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 5s linear;
        }

        &.coinThrow2 {
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 5s linear;
        }

        &.coinThrow3A {
            background: linear-gradient(90deg, $primary-gradient-color, #fff, $primary-gradient-color);
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 3s linear;
        }

        &.coinThrow3B {
            background: linear-gradient(90deg, $secondary-gradient-color, #fff, $secondary-gradient-color);
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 3s linear;
        }

        &.coinThrow4A {
            background: linear-gradient(90deg, $primary-gradient-color, #fff, $primary-gradient-color);
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 5s linear;
        }
        
        &.coinThrow4B {
            background: linear-gradient(90deg, $secondary-gradient-color, #fff, $secondary-gradient-color);
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 5s linear;
        }

        &.coinThrow5 {
            background-size: 70%;
            background-clip: text;
            background-repeat: no-repeat;
            animation: animate 5s linear;
        }
    }
}

@keyframes animate {
    0% {
        background-position: -100%;
    }
    100% {
        background-position: 400%;
    }
}
/* End Deck customization */
</style>
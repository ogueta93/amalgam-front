<template>
    <div class="login-view-container">
        <div class="login-register-container">
            <div class="login-register-buttons">
                <div :class="['button-container', {active: loginActive}]" @click="changeForm($event)">
                    {{$t('loginView.login')}}
                </div> 
                <div :class="['button-container', {active: !loginActive}]" @click="changeForm($event)">
                    {{$t('loginView.register')}}
                </div> 
            </div>
            <div class="login-register-content">
                <login :visible="loginActive"></login>
                <register :visible="!loginActive"></register>
            </div>
        </div>
    </div>
</template>

<script>
import login from '@/components/login/Login';
import register from '@/components/login/Register';

export default {
    name : 'loginView',
    components: {
        login,
        register
    },
    data() {
        return {
            loginActive: true
        }
    },
    mounted: function() {
        /** Initial module instance */
        var that = this;
    },
    updated: function() {
        /** after render */
    },
    methods: {
        changeForm: function(event) {
            if (event.target.classList.contains('active')) {
                return false;
            }

            this.loginActive = !this.loginActive;
        }
    }
};
</script>

<style lang="scss" scoped>
/* LoginView customization */
$login-register-background-color: #f0f3f5;
$login-register-background-shadow: 0 4px 10px 4px  rgba(0, 0, 0, 0.3);
$button-background-color: #1a73e8;
$button-background-color-inactive: #6597da;
$button-background-color-hover: #1b5baf;

.login-view-container {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-family: 'Audiowide', cursive;

    .login-register-container {
        display: flex;
        height: 50%;
        width: 40%;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 40px 0 40px 0;
        background-color: $login-register-background-color;
        box-shadow: $login-register-background-shadow;

        .login-register-buttons {
            display: flex;
            height: 10%;
            width: 90%;

            .button-container {
                display: flex;
                height: 100%;
                width: 100%;
                justify-content: center;
                align-items: center;
                background-color: $button-background-color-inactive;
                color: white;
                cursor: default;

                &.active {
                    background-color: $button-background-color;
                }

                &:not(.active):hover {
                    background-color: $button-background-color-hover;
                }

                &:not(.active){
                    cursor: pointer;
                    
                }
            }
        }
        .login-register-content {
            display: flex;
            height: 85%;
            width: 90%;
        }
    }
}

/* End LoginView customization */
</style>
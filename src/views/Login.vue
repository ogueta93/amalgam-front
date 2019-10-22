<template>
        <div v-if="isBrowser || pwaMode" class="login-view-container">
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
    <div v-else class="pwa-container">
        <pwa></pwa>
    </div>
</template>

<script>
import login from '@/components/login/Login';
import register from '@/components/login/Register';
import pwa from '@/components/pwa/Pwa';

export default {
    name : 'loginView',
    components: {
        login,
        register,
        pwa
    },
    data() {
        return {
            loginActive: true,
            promp: null,
            isBrowser: this.$root.isBrowser,
            pwaMode: this.$root.pwaMode
        }
    },
    mounted() {
        /** Initial module instance */
        var that = this;
    },
    updated() {
        /** after render */
    },
    methods: {
        changeForm(event) {
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

.pwa-container {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
}


/* Desktops ----------- */
@media (min-width: 1281px) { 

}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {
   
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
   .login-view-container {
        .login-register-container {
            height: 90%;
            width: 80%;
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .login-view-container {
        .login-register-container {
            height: 90%;
            width: 80%;

            .login-register-buttons {
                font-size: 0.7rem;
            }
        }
    }
}
/* End LoginView customization */
</style>
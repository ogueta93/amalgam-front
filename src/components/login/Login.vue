<template>
    <div class="login-container" :class="[{visible: visible}]">
        <div class="login-title">
            {{$t('login.title')}}
        </div>
        <div class="login-content">
            <form class="login-form" id="login-form" name="form" @keyup.enter="submitLogin">
                <input class="input-form-flex" type="email" name="email" v-model="email" :placeholder="this.$i18n.t('login.emailPlaceHolder')" autocomplete="off">
                <input class="input-form-flex" type="password" name="password" v-model="password" :placeholder="this.$i18n.t('login.passwordPlaceHolder')" autocomplete="off">
                <div class="forgot-password">
                    {{$t('login.forgotPassword')}}
                </div>
                <div class="submit-button" @click="submitLogin">
                    {{$t('login.logingButton')}}
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';

export default {
    name: 'loginComponent',
     props: {
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            email: null,
            password: null
        }
    },
    mounted()
    {
        /** Initial module instance */
    },
    updated()
    {
        /** after render */
    },
    methods: {
        submitLogin() {
            document.activeElement.blur();

            var data = {
                email: this.email,
                password: this.password
            };
            
            this.$webSocket.sendComplexAction(ACTION.LOGIN_ACTION, this.$options.name, data, this.callBackLogin);
        },

        callBackLogin(response, error) {
            if (error) {
                console.log('Error', response);
            } else {
               this.$router.push('/game');
            }
        },
    }
};
</script>
<style lang="scss" scoped>
/* LoginComponent customization */
.login-container {
    display: flex;
    height: 0;
    width: 0;
    opacity: 0;
    padding: 40px 0 0 0;
    align-content: space-between;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
    transition: opacity 0.5s ease-out;

    &.visible {
        height: 100%;
        width: 100%;
        opacity: 1;
        overflow: auto;
    }

    .login-title {
        display: flex;
        height: 20%;
        width: 100%;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        text-transform: uppercase;
    }
    .login-content {
        display: flex;
        height: 70%;
        width: 70%;

        .login-form {
            display: flex;
            height: 100%;
            width: 100%;
            align-content: space-around;
            justify-content: center;
            flex-wrap: wrap;

            .forgot-password {
                display: flex;
                width: 100%;
                justify-content: flex-end;
                color: $primary-color;
                font-size: 0.8rem;
            }
        }

        .submit-button {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            padding: 10px;
            background-color: $primary-color;
            color:white;
            cursor: pointer;
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .login-container {
        .login-content {
            .login-form {
                .forgot-password {
                    font-size: 0.8rem;
                }
            }
            
            .submit-button {
                padding: 7px;
                font-size: 0.9rem; 
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .login-container {
        .login-content {
            .login-form {
                .forgot-password {
                    font-size: 0.6rem;
                }
            }

            .submit-button {
                padding: 5px;
                font-size: 0.7rem; 
            }
        }
    }
}
/* END LoginComponent customization */
</style>
<template>
    <div class="register-container" :class="[{visible: visible}]">
        <div class="register-title">
            {{$t('register.title')}}
        </div>
        <div class="register-content">
            <form class="register-form" id="register-form" name="form" @keyup.enter="submitRegister">
                <div class="input-group-flex inline">
                    <input class="input-form-flex" type="text" name="name" v-model="name" :placeholder="this.$i18n.t('register.namePlaceHolder')" autocomplete="off">
                    <input class="input-form-flex" type="text" name="lastName" v-model="lastName" :placeholder="this.$i18n.t('register.lastNamePlaceHolder')" autocomplete="off">
                </div>
                <input class="input-form-flex" type="date" name="birthday" v-model="birthday">
                <input class="input-form-flex" type="email" name="email" v-model="email" :placeholder="this.$i18n.t('register.emailPlaceHolder')" autocomplete="off">
                <input class="input-form-flex" type="password" name="password" v-model="password" :placeholder="this.$i18n.t('register.passwordPlaceHolder')" autocomplete="off">
                <div class="submit-button" @click="submitRegister">
                    {{$t('register.registerButton')}}
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';

export default {
    name: 'registerComponent',
     props: {
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            name: null,
            lastName: null,
            birthday: null,
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
        submitRegister() {
            document.activeElement.blur();

            var data = {
                name: this.name,
                lastName: this.lastName,
                birthday: this.birthday,
                email: this.email,
                password: this.password
            };
            
            this.$webSocket.sendComplexAction(ACTION.REGISTER_ACTION, this.$options.name, data, this.callBackRegister);
        },

        callBackRegister(response, error) {
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
/* ReigsterComponent customization */
.register-container {
    display: flex;
    height: 0;
    width: 0;
    opacity: 0;
    padding: 40px 0 0 0;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    transition: opacity 0.5s ease-out;

    &.visible {
        height: 100%;
        width: 100%;
        opacity: 1;
        overflow: auto;
    }

    .register-title {
        display: flex;
        height: 10%;
        width: 100%;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        text-transform: uppercase;
    }

    .register-content {
        display: flex;
        height: 85%;
        width: 70%;

        .register-form {
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
@media (min-width: 768px) and (max-width: 1024px) {
   .register-container {
        .register-title {
            font-size: 1.3rem;
        }

        .register-content {
            .submit-button {
                padding: 5px;
                font-size: 0.9rem;
            }
        }
    }

    .input-form-flex {
        font-size: 0.8rem;
    }
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .register-container {
        .register-title {
            font-size: 1.2rem;
        }

        .register-content {
            .submit-button {
                padding: 5px;
                font-size: 0.9rem;
            }
        }
    }

    .input-form-flex {
        font-size: 0.8rem;
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .register-container {
        .register-title {
            font-size: 1rem;
        }

        .register-content {
            .submit-button {
                padding: 2px;
                font-size: 0.7rem;
            }
        }
    }

    .input-form-flex {
        font-size: 0.6rem;
    }
}
/* END ReigsterComponent customization */
</style>
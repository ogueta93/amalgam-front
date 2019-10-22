<template>
    <div class="pwa-container-content">
        <div :class="['pwa-text', {'with-promp': promp}]">
            <template v-if="promp && !acceptInstall">
                {{$t('pwa.availableMsg')}}
            </template>
            <template v-else-if="!acceptInstall">
                {{$t('pwa.nonAvailableMsg')}}
            </template>
            <template v-else>
                {{$t('pwa.acceptedInstallMsg')}}
            </template>
        </div>
        <div :class="['pwa-button', {'with-promp': promp}]" @click="install">
            <i v-if="!acceptInstall" class="fas fa-gamepad"></i>
            <i v-else class="fas fa-check"></i>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';

export default {
    name: 'pwaComponent',
    data() {
        return {
            promp: null,
            acceptInstall: false
        }
    },
    mounted()
    {
        /** Initial module instance */
        var that = this;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            that.promp = e;
        });
    },
    updated()
    {
        /** after render */
    },
    methods: {
        install() {
            if (!this.promp) {
                return;
            }
            
            var that = this;
            this.promp.prompt();
            
            this.promp.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    that.acceptInstall = true;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
/* PwaComponent customization */
$add-button-icon-color: #3cbd82;

.pwa-container-content {
    display: flex;
    height: 60%;
    width: 60%;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    font-family: 'Audiowide', cursive;

    .pwa-text {
        display: flex;
        height: 50%;
        width: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 0.8rem;

        &.with-promp {
            font-size: 1rem;
            cursor: pointer;
        }
    }
    
    .pwa-button {
        display: flex;
        height: 30%;
        width: 50%;
        justify-content: center;
        align-items: center;
        color: red;
        box-shadow: 0 0px 7px 3px rgba(0, 0, 0, 0.6);

        i {
            font-size: 4.8rem;
        }

        &.with-promp {
            color: $add-button-icon-color;
            cursor: pointer;
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {
    .pwa-container-content {
        .pwa-text {
            font-size: 1.5rem;
        }

        .pwa-button {
           i {
                font-size: 10rem;
            }
        }
    }
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .pwa-container-content {
       .pwa-text {
            height: 40%;
            font-size: 0.7rem;
        }

        .pwa-button {
            height: 40%;
            i {
                font-size: 8rem;
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .pwa-container-content {
        .pwa-text {
            height: 40%;
            font-size: 0.7rem;
        }

        .pwa-button {
            height: 40%;
            i {
                font-size: 5rem;
            }
        }
    }
}
/* END PwaComponent customization */
</style>
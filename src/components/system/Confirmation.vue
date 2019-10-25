<template>
    <div v-if="confirmationMsg !== null" class="confirmation-content">
        <div class="confirmation-header">
            {{this.confirmationTitle}}
        </div>
        <div class="confirmation-body">
            <div class="confirmation-symbol">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="confirmation-text">
                {{this.confirmationMsg}}
            </div>
        </div>
        <div class="confirmation-button">
            <div class="button" @click="confirmationButton">
                {{ $t('confirmation.buttons.default') }}
            </div>
            <div v-if="confirmationId === CONFIRMATION_TYPE.PURCHASE_HAS_FINISHED" class="button" @click="goToInventory">
                {{ $t('confirmation.buttons.puchaseHasFinished') }}
            </div>
        </div>
    </div>
</template>

<script>
import CONFIRMATION_TYPE from '@/constants/ConfirmationType';
import EVENT_CONSTANTS from '@/constants/Event';

export default {
    name: 'confirmationComponent',
    data() {
        return {
            CONFIRMATION_TYPE: CONFIRMATION_TYPE,

            el: null,
            confirmationId: null,
            confirmationMsgPrefix: 'confirmation.messages.',
            confirmationTitlePrefix: 'confirmation.titles.',
            confirmationMsg: null,
            confirmationTitle: null,
        }
    },
    mounted()
    {
        /** Initial module instance */
        this.$root.$on(EVENT_CONSTANTS.CONFIRMATION_EVENT, this.callBackProcessConfirmation);
        this.el = document.querySelector('.app-confirmation');
    },
    methods: {
        callBackProcessConfirmation(confirmationId) {
            this.confirmationId = confirmationId;
            this.confirmationTitle = this.$i18n.t(this.confirmationTitlePrefix + confirmationId);
            this.confirmationMsg =  this.$i18n.t(this.confirmationMsgPrefix + confirmationId);

            this.el.style.display = 'flex';
            this.$loading.clean();
        },
        closeConfirmation() {
            this.el.style.display = 'none';
            this.confirmationId = null;
            this.confirmationMsg = null;
            this.confirmationTitle = null;
        },
        confirmationButton() {
            switch (this.confirmationId) {
                default:
                    break;
            }

            this.closeConfirmation();
        },
        goToInventory() {
            this.$router.push('/game/shopInventory');
            this.closeConfirmation();
        }
    }
};
</script>
<style lang="scss" scoped>
/* confirmationComponent customization */
$confirmation-content-background-color: #f8f9fa;
$confirmation-header-background-color: #f0f3f5;
$confirmation-border-color: #c8ced3;

$confirmation-color-button: #508cda;

.confirmation-content {
    height: 30%;
    width: 40%;
    background-color: $confirmation-content-background-color;
    font-family: 'Audiowide', cursive;
    border: 1px solid $confirmation-border-color;

    .confirmation-header {
        height: 20%;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        font-size: 18px;
        background: $confirmation-header-background-color;
        border-bottom: 1px solid $confirmation-border-color;
    }

    .confirmation-body {
        height: 60%;
        width: 100%;
        padding: 10px;

        .confirmation-symbol {
            height: 50%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: $confirmation-color-button;
        }

        .confirmation-text {
            height: 50%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }
    }

    .confirmation-button {
        height: 20%;
        width: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        border-top: 1px solid $confirmation-border-color;

        .button {
            display: flex;
            height: 20px;
            width: auto;
            justify-content: center;
            align-items: center;
            padding: 15px;
            background: $confirmation-color-button;
            box-shadow: 0 12px 4px -8px rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 0.8rem;
            cursor: pointer;
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {
    .confirmation-content {
        height: 50%;
        width: 60%;

        .confirmation-body {
            .confirmation-text {
                font-size: 11px;
            }
        }
    }
}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .confirmation-content {
        height: 80%;
        width: 80%;

        .confirmation-body {
            .confirmation-text {
                font-size: 10px;
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .confirmation-content {
        height: 80%;
        width: 80%;

        .confirmation-body {
            .confirmation-text {
                font-size: 10px;
            }
        }
    }
}
/* END confirmationComponent customization */
</style>
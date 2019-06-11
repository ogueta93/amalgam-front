<template>
    <div v-if="errorMsg !== null" class="error-content">
        <div class="error-header">
            {{ $t("error.errorTitle") }}
        </div>
        <div class="error-body">
            <div class="error-symbol">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="error-text">
                {{this.errorMsg}}
            </div>
        </div>
        <div class="error-bottom">
            <b-button variant="outline-primary" size="sm" @click="errorButton">{{ $t("error.errorButton") }}</b-button>
        </div>
    </div>
</template>

<script>
import ERROR_CONSTANTS from '@/constants/Error';
import EVENT_CONSTANTS from '@/constants/Event';

export default {
    name: 'errorComponent',
    data() {
        return {
            el: null,
            errorMsg: null,
            phase: null,
        }
    },
    mounted: function()
    {
        /** Initial module instance */
        this.el = document.querySelector('.app-error');
        this.$root.$on(EVENT_CONSTANTS.ERROR_EVENT, this.callBackProcessError);
    },
    updated: function()
    {
        /** after render */
    },
    methods: {
        callBackProcessError: function(data) {
            this.errorTitle = data.title;
            this.errorMsg = data.message;
            
            if (data.phase !== undefined) {
                this.phase = data.phase;
            }

            this.el.style.display = 'flex';

            this.$loading.clean();
        },
        errorButton: function() {
            var that = this;

            this.el.style.display = 'none';
            this.errorMsg = null;
            
            switch(this.phase) {
                case ERROR_CONSTANTS.WS_AMALGAN_PHASE_FATAL_ERROR:
                    console.log('error');
                    that.$router.push('/');
                    break;
                default:
                    that.$router.push('/');
            }
        }
    }
};
</script>
<style lang="scss">
/* Error customization */
$error-content-background-color: #f8f9fa;
$error-header-background-color: #f0f3f5;
$error-border-color: #c8ced3;

.error-content {
    height: 30%;
    width: 30%;
    background-color: $error-content-background-color;
    font-family: 'Audiowide', cursive;
    border: 1px solid $error-border-color;

    .error-header {
        height: 20%;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        font-size: 18px;
        background: $error-header-background-color;
        border-bottom: 1px solid $error-border-color;
    }

    .error-body {
        height: 60%;
        width: 100%;
        padding: 10px;

        .error-symbol {
            height: 50%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: red;
        }

        .error-text {
            height: 50%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
    }

    .error-bottom {
        height: 20%;
        width: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-top: 1px solid $error-border-color;
    }
}

@media (max-width: 768px) {
    .error-content {
        height: 80%;
        width: 80%;
    }
}
/* END Error customization */
</style>
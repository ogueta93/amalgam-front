<template>
    <div class="game-content">
        <div class="game-content-header">
            <div class="game-header-title">{{ $t("resumeSelection.headerTitle") }}</div>
        </div>
        <div class="game-content-body">
            <div class="game-body-content">
                <div v-if="cardsSelected.length" class="resume-content">
                    <div v-for="card in cardsSelected" :key="card.userCardId" class="resume-item">
                        {{card.name}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BATTLE_TYPE from '@/constants/BattleType';
import ACTION from '@/constants/Action';
import EVENT from '@/constants/Event';

export default {
    name : 'resumeSelectionComponent',
    data() {
        return {
            cardsSelected: []
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$root.$on(EVENT.BATTLE_DECK_RESUME_SELECTION, this.callbackDeckResumeSelection);
    },
    destroyed: function() {
        this.$root.$off(EVENT.BATTLE_DECK_RESUME_SELECTION);
    },
    updated: function() {
        /** after render */
    },
    methods: {
        callbackDeckResumeSelection: function(data) {
            this.cardsSelected = data;
        }
    }
};
</script>

<style lang="scss">
/* ResumeSelection customization */
    .resume-content {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;

        .resume-item {
            display: flex;
            height: 25px;
            width: 100%;
            flex-direction: column;
        }
    }
/* End ResumeSelection customization */
</style>
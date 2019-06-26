<template>
    <div v-if="data !== null" class="battle-field">

        <div v-if="battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE" class="battle-field-deck-selection">
            <div class="battle-field-deck-selection-resume">
                 <resumeSelection></resumeSelection>
            </div>
            <div class="battle-field-deck">
                <deck :battlePhase="battlePhase"></deck>
            </div>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import BATTLE_PHASE from '@/constants/BattlePhase';
import LOADING from '@/constants/Loading';

import deck from '@/components/game/Deck';
import resumeSelection from '@/components/game/ResumeSelection';

export default {
    name : 'battleFieldView',
    components: {
        deck,
        resumeSelection
    },
    data() {
        return {
            battleId: this.$route.params.id,
            BATTLE_PHASE: BATTLE_PHASE,

            data: null,
            battlePhase: null
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$webSocket.setEvent(ACTION.SET_CARDS_SELECTION, this.$options.name, this.callBackSetBattleSelection);

        this.findBattle();
    },
    destroyed: function() {
        this.$root.$off(EVENT.SET_CARDS_SELECTION);
    },
    updated: function() {
        /** after render */
    },
    methods: {
       findBattle: function() {
           var data = {
               battleId: this.battleId
           };

           this.$webSocket.sendComplexAction(ACTION.FIND_BATTLE_ACTION, this.$options.name, data, this.callBackFindBattle);
        },
        setData: function(data) {
            this.$battle.setData(data);

            this.data = this.$battle.getData();
            this.battlePhase = this.$battle.getPhase();
        },

       callBackFindBattle: function(response) {
           this.setData(response);
       },
       callBackSetBattleSelection: function(response) {
           this.$loading.end(LOADING.RESUME_SELECTION_LOADING);
           
           console.log('here');
           this.setData(response);
       },
    }
};
</script>

<style lang="scss">
/* battleFieldView customization */
.battle-field {
    height: 100%;
    width: 100%;

    .battle-field-deck-selection {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .battle-field-deck-selection-resume {
            height: 30%;
            width: 70%;
        }

        .battle-field-deck {
            height: 65%;
            width: 100%;
        }
    }
}
/* End battleFieldView customization */
</style>
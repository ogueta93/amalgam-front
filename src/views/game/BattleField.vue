<template>
    <div v-if="data !== null" class="battle-field">
        <div class="battle-field-deck-selection">
            <div>DECK-SELECTION</div>
        </div>
         <div class="battle-field-deck">
            <deck></deck>
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import deck from '@/components/game/Deck';

export default {
    name : 'battleFieldView',
    components: {
        deck,
    },
    data() {
        return {
            data: null,
            battleId: this.$route.params.id
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.findBattle();
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

       callBackFindBattle: function(response) {
           this.data = response;
       }
    }
};
</script>

<style lang="scss">
/* battleFieldView customization */
.battle-field {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;

    .battle-field-deck-selection {
        height: 20%;
        width: 100%;
    }

    .battle-field-deck {
        height: 80%;
        width: 100%;
    }
}
/* End battleFieldView customization */
</style>
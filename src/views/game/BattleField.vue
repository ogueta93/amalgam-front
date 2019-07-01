<template>
    <div class="battle-field">
        <div v-if="battlePhase === BATTLE_PHASE.CARD_SELECTION_PHASE && !cardsSelected.length" class="battle-field-deck-selection">
            <div class="battle-field-deck-selection-resume">
                 <resumeSelection></resumeSelection>
            </div>
            <div class="battle-field-deck">
                <deck :battlePhase="battlePhase"></deck>
            </div>
        </div>
        <div v-if="battlePhase === BATTLE_PHASE.COIN_THROW_PHASE && !userShowColor" class="battle-field-coin-throw">
            <battleAnnouncement :announcement="ANNOUNCEMENT.COIN_THROW" :extra="{initialTurn: initialTurn}"></battleAnnouncement>
        </div>
        <div v-if="battlePhase === BATTLE_PHASE.BATTLE_PHASE">
            LOAD BATTLE ARENA MODULE
        </div>
    </div>
</template>

<script>
import ACTION from '@/constants/Action';
import BATTLE_PHASE from '@/constants/BattlePhase';
import LOADING from '@/constants/Loading';
import ANNOUNCEMENT from '@/constants/Announcement';

import deck from '@/components/game/Deck';
import resumeSelection from '@/components/game/ResumeSelection';
import battleAnnouncement from '@/components/game/BattleAnnouncement';

export default {
    name : 'battleFieldView',
    components: {
        deck,
        resumeSelection,
        battleAnnouncement
    },
    data() {
        return {
            BATTLE_PHASE: BATTLE_PHASE,
            ANNOUNCEMENT: ANNOUNCEMENT,

            battleId: this.$route.params.id,
            userId: this.$localStorage.getUser().id,
            data: null,
            battlePhase: null,
            cardsSelected: [],
            initialTurn: null,
            userShowColor: false
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$webSocket.setEvent(ACTION.SET_CARDS_SELECTION, this.$options.name, this.callBackFindBattle);
        this.$webSocket.setEvent(ACTION.SHOW_THROW_ANNOUNCEMENT, null, this.callBackFindBattle);

        this.findBattle();
    },
    destroyed: function() {
        this.$webSocket.$wsOff(ACTION.SET_CARDS_SELECTION, this.$options.name);
        this.$webSocket.$wsOff(ACTION.SHOW_THROW_ANNOUNCEMENT);
    },
    updated: function() {
        /** after render */
    },
    watch: {
        '$route.params.id' : function() {
            this.battleId = this.$route.params.id;
            this.findBattle();
        }
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
            this.cardsSelected = this.$battle.getCardsSelected(this.userId);
            this.initialTurn = this.$battle.getInitialTurn(this.userId);
            this.userShowColor = this.$battle.checkUserShowColor(this.userId);

            this.callPhaseEvents();
        },
        callPhaseEvents: function() {
            switch (this.battlePhase) {
                case BATTLE_PHASE.CARD_SELECTION_PHASE:
                    if (this.cardsSelected.length) {
                        this.$loading.start(LOADING.RESUME_SELECTION_LOADING, '.battle-field', LOADING.RESUME_SELECTION_LOADING_MSG);
                    }
                    break;
                case BATTLE_PHASE.COIN_THROW_PHASE:
                    this.$loading.end(LOADING.RESUME_SELECTION_LOADING);
                    if (this.userShowColor) {
                        this.$loading.start(LOADING.COIN_THROW_LOADING, '.battle-field', LOADING.COIN_THROW_LOADING_MSG);
                    }
                    break;
                case BATTLE_PHASE.BATTLE_PHASE:
                    this.$loading.end(LOADING.COIN_THROW_LOADING);
                default:
                    break;
            }
        },

        callBackFindBattle: function(response) {
            this.setData(response);
        }
    }
};
</script>

<style lang="scss" scoped>
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

    .battle-field-coin-throw {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
    }
}
/* End battleFieldView customization */
</style>
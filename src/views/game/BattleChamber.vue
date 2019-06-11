<template>
    <div class="battle-chamber">
        <div class="battle-chamber-finder">
            <userFinder></userFinder>
        </div>
        <div class="battle-chamber-list">
            <battleList></battleList>
        </div>
    </div>
</template>

<script>
import userFinder from '@/components/game/UserFinder';
import battleList from '@/components/game/BattleList';

export default {
    name : 'battleChamberView',
    components: {
        userFinder,
        battleList
    },
    data() {
        return {
         
        }
    },
    mounted: function() {
        /** Initial module instance */
    },
    updated: function() {
        /** after render */
    },
    methods: {
       
    }
};
</script>

<style lang="scss">
/* BattleChamber customization */
    .battle-chamber {
        display: flex;
        height: 100%;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-around ;

        .battle-chamber-finder {
            height: 70%;
            width: 35%;
        }

        .battle-chamber-list {
            height: 100%;
            width: 60%;
        }
    }

/* End BattleChamber customization */
</style>
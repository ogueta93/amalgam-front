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
    mounted() {
        /** Initial module instance */
    },
    updated() {
        /** after render */
    },
    methods: {
       
    }
};
</script>

<style lang="scss" scoped>
/* BattleChamberView customization */
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

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
     .battle-chamber {
        .battle-chamber-finder {
            height: 100%;
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .battle-chamber {
        .battle-chamber-finder {
            height: 100%;
        }
    }   
}
/* End BattleChamberView customization */
</style>
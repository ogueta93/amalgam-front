<template>
    <deck></deck>
</template>

<script>
import deck from '@/components/game/Deck';
import ACTION from '@/constants/Action';

export default {
    name : 'deckComponent',
    components: {
        deck
    },
    data() {
        return {
           
        }
    },
    mounted: function() {
        /** Initial module instance */
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
/* Deck customization */

/* End Deck customization */
</style>
<template>
    <div id="app">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css?family=Audiowide|Press+Start+2P" rel="stylesheet">

        <router-view></router-view>
        
        <div class="app-error">
            <error></error>
        </div>
        <div class="app-confirmation">
            <confirmation></confirmation>
        </div>
    </div>
</template>

<script>
import error from '@/components/system/Error';
import confirmation from '@/components/system/Confirmation';

export default {
    name : 'app',
    components: {
        error,
        confirmation
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

<style lang="scss">
    @import 'node_modules/bootstrap/scss/bootstrap';
</style>

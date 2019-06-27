<template>
    <div class="game">
        <div class="game-header">
            <navbar></navbar>
        </div>
        
        <div class="game-navigation">
            <!-- Sidebar  -->
            <sidebar></sidebar>
            <!-- Page Content  -->
            <div id="content">
                <router-view></router-view>
            </div>
        </div>
        <notification></notification>
    </div>
</template>

<script>
import navbar from '@/components/menu/NavBar';
import sidebar from '@/components/menu/SideBar';
import notification from '@/components/system/Notification';

export default {
    name: 'gameView',
    components: {
        navbar,
        sidebar,
        notification
    },
    data() {
        return {
           name: null
        }
    },
    mounted: function()
    {
        /** Initial module instance */
        this.$root.$on('newBattleNotification', function(response){
            console.log('NEW BATTLE NOTIFICATION', response);
        });
    },
    updated: function()
    {
        /** after render */
    },
    methods: {
        
    }
};
</script>
<style lang="scss">
/* game customization */
.game {
    height: 100%;
    width: 100%;

    .game-header {
        height: 66px;
        width: 100%;
    }

    .game-navigation {
        height: calc(100% - 66px);
        width: 100%;
        display: inline-flex;

        #content {
            width: 100%;
            height: 100%;
            padding: 20px;
            transition: width .25s ease-out;
        }

        #content.active {
            width: 100%;
        }
    }
}
/* END game customization */
</style>
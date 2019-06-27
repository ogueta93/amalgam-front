<template>
    <b-navbar toggleable="lg" type="dark" variant="light" class="nav-game">
        <b-navbar-nav left>
            <i @click="toggleSideBar()" type="dark" class="fas fa-bars side-bar-button"></i>
        </b-navbar-nav>

        <b-navbar-brand class="ml-auto" center>
            <b-img :src="require('@/assets/img/logo.png')" width="40px" height="40px" rounded alt="logo"></b-img>
        </b-navbar-brand>

        <b-navbar-nav class="ml-auto" right>
            <b-nav-item-dropdown text="Lang" right>
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">ES</b-dropdown-item>
                <b-dropdown-item href="#">RU</b-dropdown-item>
                <b-dropdown-item href="#">FA</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right>
                <template slot="button-content"><em>User</em></template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import EVENT from '@/constants/Event';

export default {
    name : 'navbar',
    data() {
        return {
            sideMenu: '.sidebar-game',
            content: '#content'
        }
    },
    mounted: function() {
        /** Initial module instance */
        this.$root.$on(EVENT.MENU_TOGGLE_EVENT, this.toggleSideBar);
    },
    updated: function() {
        /** after render */
    },
    methods: {
        toggleSideBar: function() {
            var sideMenuEl = document.querySelector(this.sideMenu);
            var content = document.querySelector(this.content);

            content.classList.toggle('active');
            sideMenuEl.classList.toggle('active');
        }
    }
};
</script>

<style lang="scss" scoped>
/* navbar customization */
.nav-game {
    width: 100%;

    .navbar-nav {
        flex-direction: row;
    }
}

.navbar-dark .navbar-nav .nav-link {
    color: black
}

.navbar-dark .navbar-nav .nav-link:hover {
    color: black;
    font-weight: bold;
}

.navbar-dark .navbar-nav .show > .nav-link, .navbar-dark .navbar-nav .active > .nav-link, .navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .nav-link.active {
    color: black;
    font-weight: bold;
}

.side-bar-button {
    font-size: 20px; 
    font-weight: bold; 
    cursor: pointer;
}
/* END navbar customization */
</style>
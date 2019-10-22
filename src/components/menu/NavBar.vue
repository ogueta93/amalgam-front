<template>
    <div class="nav-bar">
        <div class="nav-bar-control-buttons">
            <i @click="toggleSideBar()" class="fas fa-bars side-bar-button"></i>
        </div>
        <div class="nav-bar-logo">
            <img :src="require('@/assets/img/logo.png')" class="logo" alt="logo"></img>
        </div>
    </div>
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
    mounted() {
        /** Initial module instance */
        this.$root.$on(EVENT.MENU_TOGGLE_EVENT, this.toggleSideBar);
    },
    updated() {
        /** after render */
    },
    methods: {
        toggleSideBar() {
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
$background-color: white;

.nav-bar {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    background: $background-color;

    .nav-bar-control-buttons {
        display: flex;
        width: 10%;
        height: 100%;
        align-items: center;
        justify-content: center;

        .side-bar-button {
            font-size: 1.5rem;
            font-weight: bold; 
            cursor: pointer;
        }
    }

    .nav-bar-logo {
        display: flex;
        width: 90%;
        height: 100%;
        align-items: center;
        justify-content: center;

        .logo {
            width: 40px;
            height: 40px;
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .nav-bar {
        .nav-bar-logo {
            .logo {
                width: 25x;
                height: 25px;   
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .nav-bar {
        .nav-bar-logo {
            .logo {
                width: 25x;
                height: 25px;   
            }
        }
    }
}
/* END navbar customization */
</style>
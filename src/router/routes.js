import Vue from 'vue';

/** Views */
import login from '@/views/Login.vue';

/** Game */
import game from '@/views/Game';
import home from '@/views/game/Home';
import deck from '@/views/game/Deck';
import bchamber from '@/views/game/BattleChamber';
import bfield from '@/views/game/BattleField';

/** Debug */
import freeCards from '@/views/game/debug/FreeCards';

/** Constants */
import ACTION from '@/constants/Action';

const routes = [
    { 
        path: '/', component: login,
        meta: {
            title: process.env.VUE_APP_TITLE
        }
    },
    {
        path: '/game', component: game,
        children: [
            { path: '', component: home},
            { path: 'deck', component: deck},
            { path: 'bchamber/:type', component: bchamber},
            { path: 'battle/:id', component: bfield},
            { path: 'debug/freeCards', component: freeCards}
        ]
    }
];

export default routes;
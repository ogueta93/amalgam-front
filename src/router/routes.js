/** Game */

/** Views */
import login from '@/views/Login.vue';

import game from '@/views/Game';
import home from '@/views/game/Home';
import deck from '@/views/game/Deck';
import bchamber from '@/views/game/BattleChamber';
import bfield from '@/views/game/BattleField';

const routes = [
    { 
        path: '/', component: login,
    },
    {
        path: '/game', component: game,
        children: [
            { path: '', component: home},
            { path: 'deck', component: deck},
            { path: 'bchamber/:type', component: bchamber},
            { path: 'battle/:id', component: bfield}
        ]
    }
];

export default routes;
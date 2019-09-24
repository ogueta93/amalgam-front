/** Views */
import login from '@/views/Login.vue';

/** Game */
import game from '@/views/Game';
import home from '@/views/game/Home';
import deck from '@/views/game/Deck';
import bchamber from '@/views/game/BattleChamber';
import bfield from '@/views/game/BattleField';
import shop from '@/views/game/Shop';
import shopInventory from '@/views/game/ShopInventory';

/** Debug */
import freeCards from '@/views/game/debug/FreeCards';

/** Constants */
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
            {path: '', component: home},
            {path: 'deck', component: deck},
            {path: 'bchamber/:type', component: bchamber},
            {path: 'battle/:id', component: bfield},
            {path: 'shop', component: shop},
            {path: 'shopInventory', component: shopInventory},
            {path: 'debug/freeCards', component: freeCards}
        ]
    }
];

export default routes;
export default [
    {
        id: 1,
        name: 'sidebar.home',
        href: '/game'
    },
    {
        id: 2,
        name: 'sidebar.battleChamber',
        href: null,
        childs: [
            {
                id: 1,
                name: 'sidebar.simpleMatch',
                href: '/game/bchamber/simpleMatch'
            }
        ]
    },
    {
        id: 3,
        name: 'sidebar.nook',
        href: null,
        childs: [
            {
                id: 1,
                name: 'sidebar.deck',
                href: '/game/deck'
            }
        ]
    },
    {
        id: 4,
        name: 'sidebar.shop',
        href: null,
        childs: [
            {
                id: 1,
                name: 'sidebar.storeFront',
                href: '/game/shop'
            },
            {
                id: 2,
                name: 'sidebar.shopInventory',
                href: '/game/shopInventory'
            }
        ]
    },
    {
        id: 5,
        name: 'Debug',
        href: null,
        debug: true,
        childs: [
            {
                id: 1,
                name: 'Free Cards',
                href: '/game/debug/freeCards'
            }
        ]
    }
];
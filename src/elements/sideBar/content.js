export default [
    {
        id: 1,
        name: 'Home',
        href: '/game'
    },
    {
        id: 2,
        name: 'Battle Chamber',
        href: null,
        childs: [
            {
                id: 1,
                name: 'Simple Battle',
                href: '/game/bchamber/simpleMatch'
            }
        ]
    },
    {
        id: 3,
        name: 'Your Nook',
        href: null,
        childs: [
            {
                id: 1,
                name: 'Deck',
                href: '/game/deck'
            }
        ]
    },
]
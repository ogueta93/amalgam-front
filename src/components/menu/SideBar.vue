<template>
    <div class="sidebar-game active">
        <nav id="sidebar">
            <ul class="list-unstyled components">
                <p>Dummy Heading</p>
                
                <li v-for="item in data" :key="item.id">
                    <template v-if="!item.debug || (isDevEnvironment && item.debug)">
                        <template v-if="!item.childs">
                        <a :data-href="item.href" @click="goTo(item.href)">{{$t(item.name)}}</a>
                        </template>
                        <template v-else>
                            <a v-b-toggle="'menu-toggle-' + item.id" class="dropdown-toggle" :data-href="item.href" @click="goTo(item.href)">{{$t(item.name)}}</a>
                            <b-collapse :id="'menu-toggle-'+item.id">
                                <ul class="list-unstyled">
                                    <li v-for="child in item.childs" :key="child.id">
                                        <a :data-href="child.href" @click="goTo(child.href)">{{$t(child.name)}}</a>
                                    </li>
                                </ul>
                            </b-collapse>
                        </template>
                    </template>
                </li>
            </ul>
            
            <ul class="list-unstyled CTAs">
                <li>
                    <b-button variant="danger" >Button</b-button>
                </li>
                <li>
                    <b-button variant="success">Button</b-button>
                </li>
                <li>
                    <b-button variant="secondary">Button</b-button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import sideBarContent from '@/elements/sideBar/content';
import EVENT from '@/constants/Event';

export default {
    name : 'sidebar',
    data() {
        return {
            isDevEnvironment: process.env.VUE_APP_ENVIRONMENT === 'dev' ? true : false,
            active: null,
            data: sideBarContent
        }
    },
    mounted: function()
    {
        /** Initial module instance */
        this.setInitialActive();
    },
    updated: function()
    {
        /** after render */
    },
    watch: {
        $route (to, from)
        {
            this.changeActive(to, from);
        }
    },
    methods: {
        setInitialActive: function() {
            this.active = this.$route.path;

            var el = document.querySelector('a[data-href="' + this.active + '"]');
            if (el) {
                 el.parentNode.classList.toggle('active');

                var parentToggle = el.closest('.collapse');
                if (parentToggle) {
                    this.$root.$emit('bv::toggle::collapse', parentToggle.id)
                }
            } 
        },
        changeActive: function(to, from) {
            this.active = from.path;

            var elementTo = document.querySelector('a[data-href="' + to.path + '"]');
            if (elementTo) {
                elementTo.parentNode.classList.toggle('active');
            }

            var elementFrom = document.querySelector('a[data-href="' + this.active + '"]');
            if (elementFrom) {
                elementFrom.parentNode.classList.toggle('active');
            }
        },
        goTo: function(href) {
            if (href) {
                this.$router.push(href);
                this.$root.$emit(EVENT.MENU_TOGGLE_EVENT);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
/* sidebar customization */
.sidebar-game {
    position: absolute;
    left: -250px;
    z-index: 3;
    height: 100%;
    width: 250px;
    transition: left .25s ease-out;

    #sidebar {
        overflow-y: auto;
        height: 100%;
        background: #2f353a;
        color: #fff;

        ul ul a {
            font-size: 0.7em !important;
            padding-left: 30px !important;
            background: #262a2e;
        }

        li.active {
            background: #20a8d8;
        }
            
        a {
            color: #fff;
            cursor: pointer;
        }

        ul ul li.active a {
            background: #20a8d8;
        }

        .CTAs {
            li {
                padding: 20px;
            }
            button {
                width: 100%;
            }
        }

        .dropdown-toggle::after {
            display: block;
            position: relative;
            right: 20px;
        }
    }

    #sidebar ul.components {
        padding: 20px 0;
        border-bottom: 1px solid #47748b;
    }

    #sidebar ul p {
        padding: 10px;
    }

    #sidebar ul li a {
        padding: 10px;
        font-size: 0.8em;
        display: block;
    }

    #sidebar ul li a:hover {
        background: #20a8d8;
    }

    #sidebar a[aria-expanded="true"] :not(.active){
        background: #262a2e;
    }

    #sidebar a[data-toggle="collapse"] {
        position: relative;
    }
}

.sidebar-game.active {
    left: 0;
}

@media (max-width: 768px) {
    .sidebar-game {
        width: 150px;
    }
}
/* END sidebar customization */
</style>
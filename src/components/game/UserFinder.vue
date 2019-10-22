<template>
    <div class="game-content">
        <div class="game-content-header">
            <div class="game-header-title">{{ $t("userFinder.headerTitle") }}</div>
            <div class="game-header-controls">
                <i type="dark" @click="toggleFilters" class="fas fa-bars side-bar-button"></i>
            </div>
        </div>
        <div class="game-content-body">
            <div class="game-filters">
                  <div class="game-filters-content">
                    <form id="user-search-form" name="form" @submit.prevent="onSubmit">
                        <div class="input-group-flex">
                            <div class="include-label">
                                <div class="input-label">{{ $t('userFinder.userNameFilter') }}</div>
                                <input class="input-form-flex" type="text" v-model="filters.nickName">
                            </div>
                            <div class="include-label">
                                <div class="input-label">{{ $t('userFinder.onlineUserFilter') }}</div>
                                <div class="switch">
                                    <input checked type="checkbox" :value="filterOptions.online" v-model="filters.optionsSelected">
                                    <div class="slider">
                                        <div class="round"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="game-filters-bottom">
                    <div @click="getUsers" class="search-filters-button">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <div class="game-body-content">
                 <div class="user-content" v-if="users !== null">
                    <div class="user-content-element" v-for="user in users" :key="user.id">
                        <div class="user-img">
                            <img :src="require('@/assets/img/profile.png')"/>
                        </div>
                        <div class="user-nickname">{{user.nickName}}</div>
                        <div class="user-actions">
                            <i class="fas fa-meteor" @click="newBattle(user.id)"></i>
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BATTLE_TYPE from '@/constants/BattleType';
import ACTION from '@/constants/Action';

export default {
    name : 'userFinderComponent',
    data() {
        return {
            users: null,
            startFilter: true,
            filters: {
                nickName: "",
                optionsSelected: ['online']
            },
            filterOptions: {
                online: 'online',
            },
            loadingName: 'userFinderLoading',
            battleTypes: BATTLE_TYPE
        }
    },
    mounted() {
        /** Initial module instance */
        if (this.startFilter) {
            this.toggleFilters();
        }
    },
    updated() {
        /** after render */
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            
            this.getUsers();
        },
        toggleFilters() {
            document.querySelector('.game-filters').classList.toggle('show-filters');
            document.querySelector('.game-body-content').classList.toggle('show-filters');
        },
        getUsers() {
            document.activeElement.blur();

            var filters = {
                nickName: this.filters.nickName,
                options: this.filters.optionsSelected
            };

            this.$webSocket.sendComplexAction(ACTION.GET_USERS_ACTION, this.$options.name, filters, this.callBackGetUsers);
            this.$loading.start(this.loadingName, '.battle-chamber-finder');
        },
        newBattle(userId) {
            var data = {
                users: [userId],
                type: this.battleTypes[this.$route.params.type.toUpperCase()]
            };

            this.$webSocket.sendAction(ACTION.NEW_BATTLE_ACTION, data);
        },
        
        callBackGetUsers(response) {
            this.users = response;

            if (this.users.length > 0) {
                this.toggleFilters();
            }

            this.$loading.end(this.loadingName);
        }
    }
};
</script>

<style lang="scss" scoped>
/* UserFinder customization */
.user-content {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;

    .user-content-element {
        display: flex;
        height: 50px;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0 5px 0;
        padding: 5px;
        box-shadow: 0 8px 6px -8px rgba(0, 0, 0, 0.6);
        
        .user-img {
            height: 35px;
            width: 35px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 20px;
            }
        }

        .user-nickname {
            font-size: 0.9em;
        }

        .user-actions {
            width: 10%;
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;

            i {
                font-size: 0.9rem;
                cursor: pointer;

                &:hover {
                    transform: scale(1.5);
                }
            } 
        }
    }
}

/* Tablets ----------- */
@media (min-width: 768px) and (max-width: 1024px) {}

/* Big Smartphones (landscape) ----------- */
@media (max-height: 450px) and (min-width: 768px) and (max-width: 1024px) {
    .game-content {
        .game-content-header {
            .game-header-title, .game-header-controls {
                font-size: 0.8rem;
            }
        }

        .game-content-body {
            .game-filters {
                font-size: 0.8rem;
                &.show-filters {
                    height: 100%;
                    border-bottom: none;
                }
            }
            .game-body-content {
                &.show-filters {
                    height: 0%;
                    overflow: hidden;
                    padding: 0;
                }
            }
        }
    }

    .user-content {
        .user-content-element {    
            height: 30px;

             .user-img {
                height: 20px;
                width: 20px;

                img {

                    border-radius: 20px;
                }
            }

            .user-nickname {
                font-size: 0.7rem;
            }

            .user-actions {
                width: 20%;
                i {
                    font-size: 0.6rem;
                } 
            }
        }
    }
}

/* Smartphones (landscape) ----------- */
@media (min-width: 481px) and (max-width: 767px) {
    .game-content {
        .game-content-header {
            .game-header-title, .game-header-controls {
                font-size: 0.8rem;
            }
        }

        .game-content-body {
            .game-filters {
                font-size: 0.8rem;
                &.show-filters {
                    height: 100%;
                    border-bottom: none;
                }
            }
            .game-body-content {
                &.show-filters {
                    height: 0%;
                    overflow: hidden;
                    padding: 0;
                }
            }
        }
    }

    .user-content {
        .user-content-element {    
            height: 30px;

             .user-img {
                height: 20px;
                width: 20px;

                img {

                    border-radius: 20px;
                }
            }

            .user-nickname {
                font-size: 0.7rem;
            }

            .user-actions {
                width: 20%;
                i {
                    font-size: 0.6rem;
                } 
            }
        }
    }
}
/* End UserFinder customization */
</style>
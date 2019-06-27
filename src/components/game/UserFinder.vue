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
                    <b-form inline @submit="onSubmit">
                        <b-form-group class="marging-element" :label="$t('userFinder.userNameFilter')">
                            <b-input-group>
                                <b-form-input v-model="filters.nickName"></b-form-input>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group class="marging-element" :label="$t('userFinder.optionsFilter')">
                            <b-form-checkbox-group :options="filterOptions" v-model="filters.optionsSelected" switches stacked>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-form>
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
            filterOptions: [
                { text: this.$i18n.t('userFinder.onlineUserFilter'), value: 'online' },
                { text: this.$i18n.t('userFinder.onlyFriendsFilter'), value: 'friends' }
            ],
            loadingName: 'userFinderLoading',
            battleTypes: BATTLE_TYPE
        }
    },
    mounted: function() {
        /** Initial module instance */
        if (this.startFilter) {
            this.toggleFilters();
        }
    },
    updated: function() {
        /** after render */
    },
    methods: {
        onSubmit: function(evt) {
            evt.preventDefault();
            
            this.getUsers();
        },
        toggleFilters: function() {
            document.querySelector('.game-filters').classList.toggle('show-filters');
            document.querySelector('.game-body-content').classList.toggle('show-filters');
        },
        getUsers: function() {
            document.activeElement.blur();

            var filters = {
                nickName: this.filters.nickName,
                options: this.filters.optionsSelected
            };

            this.$webSocket.sendComplexAction(ACTION.GET_USERS_ACTION, this.$options.name, filters, this.callBackGetUsers);
            this.$loading.start(this.loadingName, '.battle-chamber-finder');
        },
        newBattle: function(userId) {
            var data = {
                users: [userId],
                type: this.battleTypes[this.$route.params.type.toUpperCase()]
            };

            this.$webSocket.sendAction(ACTION.NEW_BATTLE_ACTION, data);
        },
        
        callBackGetUsers: function(response) {
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
                font-size: 0.9em;
                cursor: pointer;

                &:hover {
                    transform: scale(1.5);
                }
            } 
        }
    }
}
/* End UserFinder customization */
</style>
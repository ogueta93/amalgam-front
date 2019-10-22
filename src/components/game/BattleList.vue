<template>
    <div class="game-content">
        <div class="game-content-header">
            <div class="game-header-title">{{ $t("battleList.battleListHeader") }}</div>
            <div class="game-header-controls">
                <i type="dark" class="fas fa-bars side-bar-button"></i>
            </div>
        </div>
        <div class="game-content-body">
            <div class="game-body-content">
                 <div class="battle-list-content" v-if="battleList !== null">
                    <div class="battle-list-item" v-for="battle in battleList" :key="battle.id">
                        <div class="battle-last-update">
                            {{battle.lastChange}}
                        </div>
                        <div class="battle-rival">
                            <span class="battle-vs">v . S</span> {{battle.rival.nickName}}
                        </div>
                        <div class="battle-status">
                            <div class="battle-status-icon">
                                <i v-if="battle.status.id == battleStatus.PENDING" class="fas fa-hourglass-half"></i>
                                <i v-if="battle.status.id == battleStatus.STARTED" class="fas fa-spinner"></i>
                            </div>
                            <div class="battle-status-text">
                                {{battle.status.name}}
                            </div>
                        </div>
                        <div class="battle-actions">
                            <div v-if="battle.action == suitableActions.wait" class="battle-wait-spinner">
                                <i class="fas fa-circle-notch"></i>
                            </div>
                            <div v-if="battle.action == suitableActions.choose" class="battle-accept-button" @click="acceptBattle(battle.id)">
                                <i class="fas fa-check-square"></i>
                            </div>
                            <div v-if="battle.action == suitableActions.figth" class="battle-fight-button" @click="goToBattle(battle.id)">
                                <i class="fab fa-affiliatetheme"></i>
                            </div>
                            <div v-if="battle.canRemove" class="battle-refuse-button" @click="refuseBattle(battle.id)">
                                <i class="fas fa-window-close"></i>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="battle-list-paginator">
                     Paginator Location
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BATTLE_STATUS from '@/constants/BattleStatus';
import BATTLE_TYPE from '@/constants/BattleType';
import BATTLE_PHASE from '@/constants/BattlePhase';
import EVENT from '@/constants/Event';
import ACTION from '@/constants/Action';

export default {
    name : 'battleListComponent',
    data() {
        return {
            battleResults: null,
            battleList: null,
            loadings: {
                getUserBattleList: 'getUserBattleListLoading'
            },
            suitableActions: {
                wait: 1,
                choose: 2,
                figth: 3
            },
            battleTypes: BATTLE_TYPE,
            battleStatus: BATTLE_STATUS,
            battlePhase: BATTLE_PHASE
        }
    },
    mounted() {
        /** Initial module instance */
        this.getUserBattleList();

        this.$webSocket.setEvent(ACTION.NEW_BATTLE_ACTION, this.$options.name, this.getUserBattleList);
        this.$webSocket.setEvent(ACTION.REFUSE_BATTLE_ACTION, this.$options.name, this.getUserBattleList);
        this.$webSocket.setEvent(ACTION.ACCEPT_BATTLE_ACTION, this.$options.name, this.getUserBattleList);
    },
    destroyed() {
        this.$webSocket.$wsOff(ACTION.NEW_BATTLE_ACTION, this.$options.name);
        this.$webSocket.$wsOff(ACTION.REFUSE_BATTLE_ACTION, this.$options.name);
        this.$webSocket.$wsOff(ACTION.ACCEPT_BATTLE_ACTION, this.$options.name);
    },
    methods: {
        getUserBattleList() {
            var data = {
                type: this.battleTypes[this.$route.params.type.toUpperCase()]
            }

            this.$webSocket.sendComplexAction(ACTION.GET_USER_BATTLE_LIST_ACTION, this.$options.name, data, this.callBackGetUserBattleList);
            this.$loading.start(this.loadings.getUserBattleList, '.battle-chamber-list');
        },
        getBattleList() {
            var that = this;
            var list = [];

            this.battleResults.forEach((element, index) => {
                var battlePhase = element.data.progress !== undefined ? element.data.progress.main.phase : null;
                
                list.push(
                    {
                        id: element.id,
                        status: element.battleStatus,
                        rival: that.getAdversary(element.data.users),
                        action: that.getSuitableAction(element),
                        canRemove: (!battlePhase || battlePhase === that.battlePhase.CARD_SELECTION_PHASE) ? true : false,
                        lastChange: element.data.lastChange
                    }
                )
            });

            return list.length > 0 ? list : null;
        },
        getAdversary(users) {
            var adversary = null;
            var currentUser = this.$localStorage.getUser();

            users.forEach((element) => {
                if (element.user.id !== currentUser.id) {
                    adversary = element.user;
                    return;
                }
            });

            return adversary;
        },
        getSuitableAction(element) {
            var currentUser = this.$localStorage.getUser();

            if (element.data.createdBy.id === currentUser.id && element.data.status.id === this.battleStatus.PENDING) {
                return this.suitableActions.wait;
            } else if (element.data.createdBy.id !== currentUser.id && element.data.status.id === this.battleStatus.PENDING) {
                return this.suitableActions.choose;
            } else {
                return this.suitableActions.figth;
            }
        },
        refuseBattle(battleId) {
            var data = {
                battleId: battleId
            };

            this.$webSocket.sendAction(ACTION.REFUSE_BATTLE_ACTION, data);
        },
        acceptBattle(battleId) {
            var data = {
                battleId: battleId
            };

            var eventIdentificator = this.$options.name + "-manual";
            this.$webSocket.sendComplexAction(ACTION.ACCEPT_BATTLE_ACTION, eventIdentificator, data, this.callBackAcceptBattle);
        },
        goToBattle(battleId) {
            this.$router.push('/game/battle/' + battleId);
        },

        callBackGetUserBattleList(response) {
            this.battleResults = response;
            this.battleList = this.getBattleList();

            this.$loading.end(this.loadings.getUserBattleList);
        },
        callBackAcceptBattle(response) {
            this.goToBattle(response.id);
        }
    }
};
</script>

<style lang="scss" scoped>
/* battleList customization */
$battle-accept-button-color:#3bda9a;
$battle-refuse-button-color:#ef5a68;
$battle-fight-button-color: #1a73e8;
$battle-vs-text-color: #1a73e8;

.battle-list-content {
    display: flex;
    height: 90%;
    width: 100%;
    flex-direction: column;
    overflow-y: auto;

    .battle-list-item {
        display: flex;
        height: 75px;
        width: 100%;
        flex-direction: row;
        flex-shrink: 0;
        justify-content: space-around;
        align-items: center;
        margin: 5px 0 5px 0;
        padding: 5px 15px 5px 15px;
        border: 1px black solid;
        box-shadow: 0 10px 6px -6px rgba(0, 0, 0, 0.6);

        .battle-status {
            display: flex;
            flex-direction: row;
            align-items: center;

            .battle-status-icon {
                font-size: 1.5rem;
                margin-right: 20px;
            }

            .battle-status-text {
                text-transform: capitalize;
            }
        }

        .battle-rival {
            .battle-vs {
                color: $battle-vs-text-color;
                font-size: 1.5rem;
                font-weight: bold;
                margin-right: 20px;
            }
        }

        .battle-actions {
            display: flex;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;

            .battle-wait-spinner {
                cursor: default;
                color: $battle-fight-button-color;
                font-size: 1.2rem;
                animation: battle-wait-spinner-animation linear 1s infinite;
            }

            .battle-accept-button {
                color: $battle-accept-button-color;
                &:hover {
                    font-size: 1.3rem;
                }
            }

            .battle-refuse-button {
                color: $battle-refuse-button-color;
                &:hover {
                    font-size: 1.3rem;
                }
            }

            .battle-fight-button {
                color: $battle-fight-button-color;
                font-size: 1.3rem;
                &:hover {
                    font-size: 1.5rem;
                }
            }
        }
    }
}

.battle-list-paginator {
    height: 10%;
    width: 100%;
}

@keyframes battle-wait-spinner-animation {
    from {
          transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
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
    }

    .battle-list-content {
        .battle-list-item {
            height: 40px;
            margin: 3px 0 3px 0;
            padding: 5px 5px 5px 5px;

            .battle-last-update {
                font-size: 0.5rem;
            }

            .battle-status {
                margin-right: 10px;
                .battle-status-icon {
                    font-size: 0.7rem;
                    margin-right: 10px;
                }

                .battle-status-text {
                    font-size: 0.7rem;
                }
            }

            .battle-rival {
                font-size: 0.7rem;
                .battle-vs {
                    font-size: 0.7rem;
                }
            }

            .battle-actions {
                .battle-wait-spinner {                
                    font-size: 0.7rem;
                }

                .battle-accept-button {
                    font-size: 0.7rem;
                    &:hover {
                        font-size: 1rem;
                    }
                }

                .battle-refuse-button {
                    font-size: 0.7rem;
                    &:hover {
                        font-size: 1rem;
                    }
                }

                .battle-fight-button {
                    font-size: 0.7rem;
                    &:hover {
                        font-size: 1rem;
                    }
                }
            }
        }

    }

    .battle-list-paginator {
        font-size: 0.7rem;
        height: 10%;
        width: 100%;
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
    }

    .battle-list-content {
        .battle-list-item {
            height: 40px;
            margin: 3px 0 3px 0;
            padding: 5px 5px 5px 5px;

            .battle-last-update {
                font-size: 0.5rem;
            }

            .battle-status {
                margin-right: 10px;
                .battle-status-icon {
                    font-size: 0.7rem;
                    margin-right: 10px;
                }

                .battle-status-text {
                    font-size: 0.7rem;
                }
            }

            .battle-rival {
                font-size: 0.7rem;
                .battle-vs {
                    font-size: 0.7rem;
                }
            }

            .battle-actions {
                .battle-wait-spinner {                
                    font-size: 0.7rem;
                }

                .battle-accept-button {
                    font-size: 0.7rem;
                    &:hover {
                        font-size: 1rem;
                    }
                }

                .battle-refuse-button {
                    font-size: 0.7rem;
                    &:hover {
                        font-size: 1rem;
                    }
                }

                .battle-fight-button {
                    font-size: 0.7rem;
                    &:hover {
                        font-size: 1rem;
                    }
                }
            }
        }

    }

    .battle-list-paginator {
        font-size: 0.7rem;
        height: 10%;
        width: 100%;
    }
}
/* End battleList customization */
</style>
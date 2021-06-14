// vuex
const store = new Vuex.Store({
    state: {
        dictionary: {},
        monster: {},
        weakness: {}
    },
    getters: {
        getDictionary: state => {
            return state.dictionary;
        },
        getMonster: state => {
            return state.monster;
        },
        getWeakness: state => {
            return state.weakness;
        }
    },
    mutations: {
        mutationDictionary (state, obj) {
            state.dictionary = obj;
        },
        mutationMonster (state, obj) {
            state.monster = obj;
        },
        mutationWeakness (state, obj) {
            state.weakness = obj;
        }
    },
    actions: {
        actionDictionary ({commit}, obj) {
            commit('mutationDictionary', obj);
        },
        actionMonster ({commit}, obj) {
            commit('mutationMonster', obj);
        },
        actionWeakness ({commit}, obj) {
            commit('mutationWeakness', obj);
        }
    }
})

// vue
const main = new Vue({
    el: '#main',
    data() {
        return {
            msg: 'hello',
            nowMonster: '1'
        }
    },
    created() {
        // 字典檔載入
        axios
            .get('https://script.google.com/macros/s/AKfycbzTN0YUTLoxxH4lLXjqaX6TKOeTV7Hd7x_xED_KbRuNI8VNV5N_vywDKuWKx0ees6jlEA/exec?type=dictionary')
            .then((res) => {
                const objBack = {};
                for (var i = 1; i < res.data.length; i++) {
                    objBack[res.data[i][0]] = res.data[i][1];
                }
                store.dispatch('actionDictionary', objBack);
            });

        // 魔物列表
        axios
            .get('https://script.google.com/macros/s/AKfycbzTN0YUTLoxxH4lLXjqaX6TKOeTV7Hd7x_xED_KbRuNI8VNV5N_vywDKuWKx0ees6jlEA/exec?type=monster')
            .then((res) => {
                const objBack = {};
                for (var i = 1; i < res.data.length; i++) {
                    objBack[res.data[i][0]] = {
                        dictionary: res.data[i][1],
                        danger: res.data[i][2]
                    };
                }
                store.dispatch('actionMonster', objBack);
            });

        // 弱點列表
        axios
            .get('https://script.google.com/macros/s/AKfycbzTN0YUTLoxxH4lLXjqaX6TKOeTV7Hd7x_xED_KbRuNI8VNV5N_vywDKuWKx0ees6jlEA/exec?type=weakness')
            .then((res) => {
                const objBack = {};
                for (var i = 1; i < res.data.length; i++) {
                    objBack[res.data[i][0]] = {};
                    for (var j = 1; j < res.data[i].length; j++) {
                        objBack[res.data[i][0]][res.data[0][j]] = res.data[i][j];
                    }
                }
                store.dispatch('actionWeakness', objBack);
            });
    },
    computed: {
        dictionaryList() {
            return store.getters.getDictionary;
        },
        monsterList() {
            return store.getters.getMonster;
        },
        weaknessList() {
            return store.getters.getWeakness;
        }
    }
})

Vue.component('skill-box', {
    template: `
        <div class="skill-box">
            <div class="skill-name">
                {{ skillname }}
            </div>
            <span>{{ skillpoint }}</span>
            <el-button type="success" @click="skillUpdate">+ 花費{{ skillpoint * 10 }}</el-button>
        </div>
    `,
    props: {
        skillclass: String,
        skillname: String,
        skillpoint: Number
    },
    methods: {
        skillUpdate() {
            this.$emit('update', this.skillclass);
        }
    }
})
// vuex
const store = new Vuex.Store({
    state: {
        dictionary: {},
        monster: {},
        weakness: {},
        fleshy: {}
    },
    getters: {
        getDictionary: state => { return state.dictionary; },
        getMonster: state => { return state.monster; },
        getWeakness: state => { return state.weakness; },
        getFleshy: state => { return state.fleshy; }
    },
    mutations: {
        mutationDictionary (state, obj) { state.dictionary = obj; },
        mutationMonster (state, obj) { state.monster = obj; },
        mutationWeakness (state, obj) { state.weakness = obj; },
        mutationFleshy (state, obj) { state.fleshy = obj; }
    },
    actions: {
        actionDictionary ({ commit }, obj) { commit('mutationDictionary', obj); },
        actionMonster ({ commit }, obj) { commit('mutationMonster', obj); },
        actionWeakness ({ commit }, obj) { commit('mutationWeakness', obj); },
        actionFleshy ({ commit }, obj) { commit('mutationFleshy', obj); }
    }
})

// vue
const main = new Vue({
    el: '#main',
    data() {
        return {
            nowMonster: '1',
            contentList: {
                detail: 'S_MEN_DET',
                fleshy: 'S_MEN_FLE'
            },
            nowContent: 'detail'
        }
    },
    created() {
        const url = 'https://script.google.com/macros/s/AKfycbzTN0YUTLoxxH4lLXjqaX6TKOeTV7Hd7x_xED_KbRuNI8VNV5N_vywDKuWKx0ees6jlEA/exec';
        // 字典檔載入
        axios
            .get(`${url}?type=dictionary`)
            .then((res) => {
                const objBack = {};
                for (var i = 1; i < res.data.length; i++) {
                    objBack[res.data[i][0]] = res.data[i][1];
                }
                store.dispatch('actionDictionary', objBack);
            });

        // 魔物列表
        axios
            .get(`${url}?type=monster`)
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
            .get(`${url}?type=weakness`)
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

        // 肉質
        axios
            .get(`${url}?type=fleshy`)
            .then((res) => {
                const objBack = {
                    weakness: res.data[0].slice(2)
                };
                for (var i = 1; i < res.data.length; i++) {
                    if (!objBack[res.data[i][0]]) objBack[res.data[i][0]] = [];
                    objBack[res.data[i][0]].push({
                        dictionary: res.data[i][1],
                        weakpoint: res.data[i].slice(2)
                    });
                }
                store.dispatch('actionFleshy', objBack);
            });
    },
    computed: {
        dictionaryList() { return store.getters.getDictionary; },
        monsterList() { return store.getters.getMonster; },
        weaknessList() { return store.getters.getWeakness; },
        fleshyList() { return store.getters.getFleshy; }
    },
    methods: {
        itemClass(index) {
            let classList = `list-item list-item${index}`;
            if (this.nowMonster === index) classList += ' active';
            return classList;
        },
        contentUp() {
            const contentKey = Object.keys(this.contentList);
            let nowKey = contentKey.indexOf(this.nowContent) - 1;
            if (nowKey < 0) nowKey = contentKey.length - 1;
            this.nowContent = contentKey[nowKey];
        },
        contentDown() {
            const contentKey = Object.keys(this.contentList);
            let nowKey = contentKey.indexOf(this.nowContent) + 1;
            if (nowKey === contentKey.length) nowKey = 0;
            this.nowContent = contentKey[nowKey];
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
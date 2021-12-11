'use strict';

Vue.component('account', {
    props: {
        pageSize: {
            type: Number,
            default: 5
        }
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        onTask (id) {
            this.$root.$emit('task', id);
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'task',
                view: 'listByStudent',
                length: this.pageSize,
                start: page * this.pageSize
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                gradeTitle: this.getValueTitle('grade', item),
                stateCss: this.getStateCss(item._state),
                stateTitle: this.getValueTitle('_state', item),
                question: item.question?._id,
                questionTitle: item.question?._title,
            }));
        },
        getStateCss (state) {
            switch (state) {
                case 'draft': return 'text-danger';
                case 'closed': return 'text-success';
            }
        }
    },
    template: '#account'
});
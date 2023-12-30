'use strict';

Vue.component('companies', {
    props: {
        pageSize: {
            type: Number,
            default: 4
        },
        userMoney: Number
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
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const {pageSize} = this;
            const data = await this.fetchJson('list', {
                class: 'company',
                view: 'publicList',
                length: pageSize,
                start: page * pageSize
            });
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                name: item.name,
                logo: this.getThumbnailUrl(item.logo)
            }));
        },
    },
    template: '#companies'
});
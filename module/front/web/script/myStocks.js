'use strict';

Vue.component('my-stocks', {
    props: {
        pageSize: {
            type: Number,
            default: 5
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
        onStock (id) {
            this.$root.$emit('my-stock', id);
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const {pageSize} = this;
            const data = await this.fetchJson('list', {
                class: 'stock',
                view: 'userStocks',
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
                company: item.company?._id,
                companyTitle: item.company?._title,
                shares: item.shares,
                logo: this.getThumbnailUrl(item.logo)
            }));
        },
    },
    template: '#my-stocks'
});
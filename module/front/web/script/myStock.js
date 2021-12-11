'use strict';

Vue.component('my-stock', {
    props: {
        stock: String,
        userMoney: Number
    },
    data () {
        return {
            id: null,
            logo: null,
            company: null,
            companyTitle: null,
            shares: 0
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onChange () {
            this.$refs.lots.reload();
        },
        onDeal () {
            this.$refs.lots.reload();
            this.$emit('deal');
        },
        onLot ({id, state}) {
            this.$refs.lot.show(id, state);
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'stock',
                view: 'list',
                id: this.stock
            });
            this.id = data._id;
            this.shares = data.shares;
            this.company = data.company?._id;
            this.companyTitle = data.company?._title;
            this.logo = this.getThumbnailUrl(data.company?.logo);
        }
    },
    template: '#my-stock'
});
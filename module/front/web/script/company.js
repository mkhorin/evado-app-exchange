'use strict';

Vue.component('company', {
    props: {
        company: String,
        userMoney: Number
    },
    data () {
        return {
            id: null,
            name: null,
            logo: null,
            description: null,
            shares: 0,
            stocked: 0,
        };
    },
    async created () {
        await this.load();
    },
    methods: {
        onDeal () {
            this.$refs.lots.reload();
            this.$emit('deal');
        },
        onLot ({id}) {
            this.$refs.lot.show(id);
        },
        async load () {
            const data = await this.fetchJson('read', {
                class: 'company',
                view: 'publicView',
                id: this.company
            });
            this.id = data._id;
            this.name = data.name;
            this.description = data.description;
            this.shares = data.shares;
            this.stocked = data.stocked;
            this.logo = this.getThumbnailUrl(data.logo);
        }
    },
    template: '#company'
});
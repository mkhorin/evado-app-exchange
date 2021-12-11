'use strict';

Vue.component('lots', {
    props: {
        activeNew: Boolean,
        company: String,
        exclude: {
            type: Array,
            default () {
                return [];
            }
        },
        lotRow: {
            type: String,
            default: 'lot-row'
        },
        metaView: {
            type: String,
            default: 'activeView'
        },
        pageSize: {
            type: Number,
            default: 5
        },
        stock: String
    },
    data () {
        return {
            activeFilter: null,
            items: []
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$root.$on('deal', this.onDeal);
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        isCell (name) {
            return !this.exclude.includes(name);
        },
        onDeal () {
            this.reload();
        },
        onLot () {
            this.$emit('lot', ...arguments);
        },
        onNew () {
            this.$emit('new');
        },
        changeFilter (value) {
            if (this.activeFilter !== value) {
                this.activeFilter = value;
                this.reload();
            }
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'lot',
                view: this.metaView,
                master: this.getMaster(),
                filter: this.getFilter(),
                length: this.pageSize,
                start: page * this.pageSize
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        getMaster () {
            if (this.company) {
                return {
                    class: 'company',
                    attr: 'activeLots',
                    id: this.company
                };
            }
            if (this.stock) {
                return {
                    class: 'stock',
                    attr: 'lots',
                    id: this.stock
                };
            }
        },
        getFilter () {
            if (this.activeFilter) {
                return [{
                    attr: 'type',
                    op: 'equal',
                    value: this.activeFilter
                }];
            }
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                company: item.company?._id,
                companyTitle: item.company?._title,
                owner: item.owner?._id,
                ownerTitle: item.owner?._title,
                shares: item.shares,
                state: item._state,
                stateTitle: this.getValueTitle('_state', item),
                type: item.type,
                typeTitle: this.getValueTitle('type', item),
                value: item.value
            }));
        }
    },
    template: '#lots'
});
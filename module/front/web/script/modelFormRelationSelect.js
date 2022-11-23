'use strict';

Vue.component('model-form-relation-select', {
    extends: Vue.component('model-form-attr'),
    data () {
        return {
            items: []
        };
    },
    async created () {
        if (!this.readOnly) {
            this.items = await this.resolveItems();
        }
    },
    methods: {
        async resolveItems () {
            const {items} = await this.fetchJson('list-select', {
                class: this.refClass,
                pageSize: 10
            });
            return this.formatItems(items);
        },
        formatItems (data) {
            return Object.keys(data).map(key => ({
                text: data[key],
                value: key
            }));
        },
        serialize () {
            return this.value || null;
        }
    },
    template: '#model-form-relation-select'
});
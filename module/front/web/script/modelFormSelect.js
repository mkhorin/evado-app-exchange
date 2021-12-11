'use strict';

Vue.component('model-form-select', {
    extends: Vue.component('model-form-attr'),
    data () {
        return {
            items: []
        };
    },
    async created () {
        this.items = this.resolveItems();
    },
    methods: {
        resolveItems () {
            const items = this.element.enums?.[0]?.items || [];
            for (const item of items) {
                item.text = this.translate(item.text);
            }
            return items;
        }
    },
    template: '#model-form-select'
});
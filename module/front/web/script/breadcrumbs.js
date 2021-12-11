'use strict';

Vue.component('breadcrumbs', {
    props: {
        userMoney: Number
    },
    methods: {
        onActiveLots () {
            this.$root.$emit('active-lots');
        }
    },
    template: '#breadcrumbs'
});
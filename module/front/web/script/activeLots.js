'use strict';

Vue.component('active-lots', {
    props: {
        userMoney: Number
    },
    methods: {
        onDeal () {
            this.$refs.lots.reload();
            this.$emit('deal');
        },
        onLot ({id}) {
            this.$refs.lot.show(id);
        }
    },
    template: '#active-lots'
});
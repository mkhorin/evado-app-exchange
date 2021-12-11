'use strict';

Vue.component('my-lots', {
    props: {
        userMoney: Number
    },
    methods: {
        onChange () {
            this.$refs.lots.reload();
        },
        onLot ({id, state}) {
            this.$refs.lot.show(id, state);
        },
        onNewLot () {
            this.$refs.new.show();
        },
        onCreate () {
            const form = this.$refs.newForm;
            if (form.validate()) {
                this.create(form.serialize());
            }
        },
        async create (data) {
            try {
                await this.fetchText('create', {
                    class: 'lot',
                    data
                });
                this.$refs.new.hide();
                this.$refs.lots.reload();
            } catch (err) {
                this.showError(err);
            }
        },
    },
    template: '#my-lots'
});
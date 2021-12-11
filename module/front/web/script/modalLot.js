'use strict';

Vue.component('modal-lot', {
    props: {
        metaView: {
            type: String,
            default: 'activeView'
        },
        title: {
            type: String,
            default: 'Active lot'
        }
    },
    data () {
        return {
            active: false,
            draft: false,
            lot: null,
            own: true,
            readOnly: true
        }
    },
    computed: {
        fullTitle () {
            return `${this.title} - ${this.lot}`;
        }
    },
    methods: {
        onActivate () {
            this.executeRequest('transit', {
                transition: 'activate'
            });
        },
        onDeactivate () {
            this.executeRequest('transit', {
                transition: 'deactivate'
            });
        },
        async onDelete () {
            await Jam.dialog.confirmDeletion();
            this.executeRequest('delete');
        },
        onSave () {
            const form = this.$refs.form;
            if (form.validate()) {
                this.executeRequest('update', {
                    data: form.serialize()
                });
            }
        },
        async executeRequest (action, data) {
            try {
                await this.fetchText(action, {
                    class: 'lot',
                    id: this.lot,
                    ...data
                });
                this.hide();
                this.$emit('change');
            } catch (err) {
                this.showError(err);
            }
        },
        async onDeal () {
            await Jam.dialog.confirm('Make a deal now?');
            try {
                const result = await this.fetchText('utility', {
                    id: 'deal',
                    action: 'update',
                    meta: 'edit.lot',
                    model: this.lot
                });
                this.hide();
                Jam.dialog.info(result);
                this.$emit('deal');
            } catch (err) {
                this.hide();
                this.showError(err);
            }
        },
        onLoad (data) {
            this.own = data.owner.user === this.$root.userId;
            this.active = data._state === 'active';
            this.draft = data._state === 'draft';
        },
        show (id, state) {
            this.readOnly = state !== 'draft';
            this.lot = id;
            return this.$refs.modal.show();
        },
        hide () {
            return this.$refs.modal.hide();
        }
    },
    template: '#modal-lot'
});
/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Lot = class Lot extends Front.Loadable {

    init () {
        super.init();
        this.$modal = this.$container.closest('.modal');
        this.$modalError = this.$modal.find('.modal-error');
        this.bindEvents();
    }

    bindEvents () {
        this.$modal.on('click', '[data-command="deal"]', this.onDeal.bind(this));
        this.front.on('action:lot', this.onLot.bind(this));
    }

    hideModal () {
        this.$modal.modal('hide');
    }

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'lot',
            view: 'activeView',
            id: this.id
        };
    }

    render (data) {
        this.data = data;
        this.owned = this.front.isUser(data.owner.user);
        data.type = data.type_title;
        data.company = data.company._title;
        data.owner = data.owner._title;
        return this.resolveTemplate('lot', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        this.$modal.toggleClass('owned', this.owned);
        super.onAfterDone();
    }

    onLot (event, {lot}) {
        this.id = lot;
        this.$content.html('');
        this.$modalError.addClass('hidden');
        this.$modal.addClass('owned');
        this.$modal.modal();
        this.load();
    }

    onDeal () {
        Jam.dialog.confirm('Make a deal now?').then(() => {
            this.post('utility', {
                id: 'deal',
                action: 'update',
                meta: 'edit.lot',
                model: this.id
            }).done(data => {
                this.front.getHandler('LotList').load();
                this.front.money.load();
                Jam.dialog.info(data);
            });
        });
    }

    post (action, data, reopen) {
        data.class = 'lot';
        this.toggleLoader(true);
        return this.front.ajaxQueue.post(this.getUrl(action), data)
            .done(this.onModalDone.bind(this, reopen))
            .fail(this.onModalFail.bind(this));
    }

    onModalDone (reopen, data) {
        this.toggleLoader(false);
        reopen ? this.onLot(null, {lot: this.id}) : this.hideModal();
    }

    onModalFail (data) {
        this.toggleLoader(false);
        this.$modalError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};

Front.MyLot = class MyLot extends Front.Lot {

    bindEvents () {
        this.$modal.on('click', '[data-command="activate"]', this.onActivate.bind(this));
        this.$modal.on('click', '[data-command="deactivate"]', this.onDeactivate.bind(this));
        this.$modal.on('click', '[data-command="save"]', this.onSave.bind(this));
        this.$modal.on('click', '[data-command="delete"]', this.onDelete.bind(this));
        this.front.on('action:myLot', this.onLot.bind(this));
        this.$delete = this.getCommand('delete');
        this.$save = this.getCommand('save');
        this.$activate = this.getCommand('activate');
        this.$deactivate = this.getCommand('deactivate');
    }

    getCommand (name) {
        return this.$modal.find(`[data-command="${name}"]`);
    }

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getForm () {
        return this.getHandler('Form');
    }

    getPostData () {
        return {
            class: 'lot',
            view: 'edit',
            id: this.id
        };
    }

    render (data) {
        this.data = data;
        this.type = data.type;
        this.state = data._state;
        data.company = data.company._title;
        data.type = data.type_title;
        data.state = data._state_title;
        data.owner = data.owner._title;
        data.getter = data.getter?._title;
        data.dealDate = Jam.FormatHelper.asDatetime(data.dealDate);
        const template = this.state === 'draft' ? 'edit' : 'read';
        return this.resolveTemplate(template, data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        super.onAfterDone();
        const form = this.getForm();
        if (form) {
            form.setValue('type', this.type);
        }
        this.$delete.hide();
        this.$save.hide();
        this.$activate.hide();
        this.$deactivate.hide();
        switch(this.state) {
            case 'draft':
                this.$delete.show();
                this.$save.show();
                this.$activate.show();
                break;
            case 'active':
                this.$deactivate.show();
                break;
        }
    }

    onLot (event, {lot}) {
        this.id = lot;
        this.$content.html('');
        this.$modalError.addClass('hidden');
        this.$modal.modal();
        this.load();
    }

    onActivate () {
        this.post('transit', {
            id: this.id,
            transition: 'activate'
        }, true);
    }

    onDeactivate () {
        this.post('transit', {
            id: this.id,
            transition: 'deactivate'
        }, true);
    }

    onDelete () {
        Jam.dialog.confirmDeletion().then(() => {
            this.post('delete', {id: this.id});
        });
    }

    onSave () {
        const form = this.getForm();
        if (form.validate()) {
            this.post('update', {
                id: this.id,
                data: form.serialize()
            });
        }
    }

    onModalDone (reopen, data) {
        this.toggleLoader(false);
        this.front.getHandler('MyLotList').load();
        reopen ? this.onLot(null, {lot: this.id}) : this.hideModal();
    }
};

Front.NewLot = class NewLot extends Front.Loadable {

    init () {
        super.init();
        this.$modal = this.$container.closest('.new-lot-modal');
        this.$modalError = this.$modal.find('.modal-error');
        this.$modal.on('click', '[data-command="create"]', this.onCreate.bind(this));
        this.front.on('action:newLot', this.onNewLot.bind(this));
    }

    getCommand (name) {
        return this.$modal.find(`[data-command="${name}"]`);
    }

    getUrl (action = 'defaults') {
        return super.getUrl(action);
    }

    getForm () {
        return this.getHandler('Form');
    }

    getPostData () {
        return {
            class: 'lot'
        };
    }

    onBeforeDone (result) {
        const def = $.Deferred();
        this.front.ajaxQueue.post(this.getUrl('list'), {
            class: 'company'
        }).then(data => {
            result.companies = data.items;
            def.resolve(result);
        }).fail(def.reject.bind(def));
        return def;
    }

    render (data) {
        this.data = data;
        data.companies = data.companies.map(this.renderCompany, this).join('');
        return this.resolveTemplate('lot', data);
    }

    renderCompany (data) {
        return `<option value="${data._id}">${data._title}</option>`;
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAfterDone () {
        super.onAfterDone();
        const form = this.getForm();
    }

    onNewLot (event) {
        this.$content.html('');
        this.$modalError.addClass('hidden');
        this.$modal.modal();
        this.load();
    }

    onCreate () {
        const form = this.getForm();
        if (!form.validate()) {
            return false;
        }
        const data = {
            class: 'lot',
            data: form.serialize()
        };
        data.data.company = {links: [data.data.company]};
        this.front.ajaxQueue.post(this.getUrl('create'), data)
            .done(this.onCreateDone.bind(this))
            .fail(this.onCreateFail.bind(this));
    }

    onCreateDone (data) {
        this.$modal.modal('hide');
        this.front.getHandler('MyLotList').load();
    }

    onCreateFail (data) {
        this.$modalError.removeClass('hidden').html(data.responseText || data.statusText);
    }
};
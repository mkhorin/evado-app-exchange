/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.LotList = class LotList extends Front.Loadable {

    init () {
        super.init();
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = 5;
        this.on('change:pagination', this.onChangePagination.bind(this));
        this.on('click', '[data-filter]', this.onFilter.bind(this));
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        const data = {
            class: 'lot',
            view: 'activeView',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
        const type = this.getActiveFilterData();
        if (type !== 'all') {
            data.filter = [{
                attr: 'type',
                op: 'equal',
                value: type
            }];
        }
        return data;
    }

    onChangePagination () {
        this.load();
    }

    resolveTemplate (name, data) {
        return super.resolveTemplate(name, data, '##', '##');
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('') || this.resolveTemplate('empty');
        return this.resolveTemplate('list', {items});
    }

    renderItem (data) {
        data.type = data.type_title;
        data.companyId = data.company._id;
        data.company = data.company._title;
        data.owner = data.owner._title;
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDone (data) {
        const activeFilter = this.getActiveFilterData();
        super.onDone(data);
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        this.setFilter(activeFilter);
        Jam.t(this.$container);
    }

    onDetail (event) {
        event.preventDefault();
        const {id, task, state} = $(event.currentTarget).closest('.task-item').data();
        const action = state === 'draft' ? 'fillForm' : 'request';
        this.front.trigger(`action:${action}`, {id, task});
    }

    onFilter (event) {
        this.filter(event.currentTarget.dataset.filter);
    }

    filter (type) {
        if (this.getActiveFilterData() !== type) {
            this.setFilter(type);
            this.pagination.page = 0;
            this.load();
        }
    }

    setFilter (type) {
        this.getActiveFilter().removeClass('active');
        this.getFilter().find(`[data-filter="${type}"]`).addClass('active');
    }

    getActiveFilterData () {
        return this.getActiveFilter().data('filter') || 'all';
    }

    getActiveFilter () {
        return this.getFilter().find('.active');
    }

    getFilter () {
        return this.find('.lot-filter');
    }
};

Front.CompanyLotList = class CompanyLotList extends Front.LotList {

    init () {
        super.init();
        this.company = this.getData('company');
        this.load();
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            master: {
                id: this.company,
                class: 'company',
                attr: 'activeLots'
            }
        });
    }
};

Front.MyLotList = class MyLotList extends Front.LotList {

    getPostData () {
        const data = super.getPostData();
        data.view = 'userLots';
        return data;
    }

    renderItem (data) {
        data.type = data.type_title;
        data.companyId = data.company._id;
        data.company = data.company._title;
        data.state = data._state_title;
        return this.resolveTemplate('item', data);
    }
};

Front.StockLotList = class StockLotList extends Front.LotList {

    init () {
        super.init();
        this.stock = this.getData('stock');
        this.load();
    }

    getUrl (action = 'list-related') {
        return super.getUrl(action);
    }

    getPostData () {
        return Object.assign(super.getPostData(), {
            view: 'stockLots',
            master: {
                id: this.stock,
                class: 'stock',
                attr: 'lots'
            }
        });
    }

    renderItem (data) {
        data.type = data.type_title;
        data.state = data._state_title;
        return this.resolveTemplate('item', data);
    }
};
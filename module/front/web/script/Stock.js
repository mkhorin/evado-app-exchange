'use strict';

Front.Stock = class Stock extends Front.Loadable {

    init () {
        super.init();
        //this.front.on('action:lot', this.onLot.bind(this));
    }

    getUrl (action = 'read') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'stock',
            view: 'list',
            id: this.id
        };
    }

    render (data) {
        this.data = data;
        data.logo = data.company.logo;
        data.companyId = data.company._id;
        data.company = data.company._title;
        return this.resolveTemplate('stock', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.StockList = class StockList extends Front.Loadable {

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'stock',
            view: 'list'
        };
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('') || this.resolveTemplate('empty');
        return this.resolveTemplate('list', {items});
    }

    renderItem (data) {
        data.logo = data.company.logo;
        data.companyId = data.company._id;
        data.company = data.company._title;
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onDetail (event) {
        event.preventDefault();
        const {id, task, state} = $(event.currentTarget).closest('.task-item').data();
        const action = state === 'draft' ? 'fillForm' : 'request';
        this.front.trigger(`action:${action}`, {id, task});
    }
};

Front.MyStockList = class MyStockList extends Front.StockList {

    getPostData () {
        const data = super.getPostData();
        data.view = 'userStocks';
        return data;
    }
};
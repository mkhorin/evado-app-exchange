/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.CompanyList = class CompanyList extends Front.Loadable {

    init () {
        super.init();
        this.load();
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'company',
            view: 'publicList'
        };
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No companies found')});
    }

    renderItem (data) {
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};
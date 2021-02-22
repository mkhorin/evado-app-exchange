/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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
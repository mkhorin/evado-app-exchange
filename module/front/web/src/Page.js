/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Page = class Page extends Front.Element {

    init () {
        this.name = this.getData('page');
        this.front.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        this.front.togglePage(this.name);
    }

    showPage () {
        this.front.showPage(this.name, ...arguments);
    }
};

Front.MainPage = class MainPage extends Front.Page {
};

Front.CompanyPage = class CompanyPage extends Front.Page {

    init () {
        super.init();
        this.company = this.getHandler('Company');
        this.front.on('action:company', this.onCompany.bind(this));
    }

    onCompany (event, {company}) {
        this.showPage();
        this.company.setInstance(company);
    }
};

Front.LotsPage = class LotsPage extends Front.Page {

    init () {
        super.init();
        this.list = this.getHandler('LotList');
        this.front.on('action:lots', this.showPage.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }
};

Front.MyLotsPage = class MyLotsPage extends Front.Page {

    init () {
        super.init();
        this.list = this.getHandler('MyLotList');
        this.front.on('action:myLots', this.showPage.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }
};

Front.MyStocksPage = class MyStocksPage extends Front.Page {

    init () {
        super.init();
        this.list = this.getHandler('MyStockList');
        this.front.on('action:myStocks', this.showPage.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }
};

Front.StockPage = class StockPage extends Front.Page {

    init () {
        super.init();
        this.stock = this.getHandler('Stock');
        this.front.on('action:stock', this.onStock.bind(this));
    }

    onStock (event, {stock}) {
        this.showPage();
        this.stock.setInstance(stock);
    }
};
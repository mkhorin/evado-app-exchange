/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class StockLotsFilter extends Base {

    async apply (query, model) {
        const trader = model.get('owner');
        query.and(['or', {owner: trader}, {getter: trader}]);
        query.and({company: model.get('company')});
    }
};
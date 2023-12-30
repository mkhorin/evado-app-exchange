/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class LotSharesValidator extends Base {

    async validateAttr (name, model) {
        const type = 'sale';
        if (model.get('type') !== type) {
            return true;
        }
        const {meta} = model.class;
        const company = model.get('company');
        const owner = model.get('owner');
        const stockQuery = meta.getClass('stock').find({company, owner});
        const stock = await stockQuery.one();
        if (!stock) {
            return model.addError(name, 'Trader stock not found');
        }
        const saleSharesQuery = model.class.find({company, owner, type})
            .and(['!=', '_state', 'closed']) // not closed state
            .and(model.getNotIdCondition()); // except this share
        const saleShares = await saleSharesQuery.column('shares'); // get IDs
        const reducer = (total, value) => total + value;
        const modelShares = model.get('shares');
        const total = saleShares.reduce(reducer, 0) + modelShares;
        const stockShares = stock.get('shares');
        if (total > stockShares) {
            return model.addError(name, 'Too many shares');
        }
    }
};
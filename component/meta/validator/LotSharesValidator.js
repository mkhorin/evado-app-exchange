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
        const meta = model.class.meta;
        const company = model.get('company');
        const owner = model.get('owner');
        const stock = await meta.getClass('stock').find().and({company, owner}).one();
        if (!stock) {
            return model.addError(name, 'Trader stock not found');
        }
        const saleShares = await model.class.find()
            .and({company, owner, type})
            .and(['!=', '_state', 'closed'])
            .and(model.getNotIdCondition())
            .column('shares');
        const total = saleShares.reduce((total, value) => total + value, 0) + model.get('shares');
        if (total > stock.get('shares')) {
            return model.addError(name, 'Too many shares');
        }
    }
};
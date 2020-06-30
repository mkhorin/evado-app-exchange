/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class LotValueValidator extends Base {

    async validateAttr (name, model) {
        const type = 'purchase';
        if (model.get('type') !== type) {
            return true;
        }
        const trader = await model.related.resolve('owner');
        if (!trader) {
            return model.addError(name, 'Trader not found');
        }
        if (model.get('value') > trader.get('money')) {
            return model.addError(name, 'Not enough money');
        }
    }
};
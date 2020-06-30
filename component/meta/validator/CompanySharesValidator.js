/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class CompanySharesValidator extends Base {

    async validateAttr (name, model) {
        const company = await model.related.resolve('company');
        if (company) {
            const old = model.getOldValue('shares') || 0;
            const stocked = company.get('stocked') - old + model.get('shares');
            if (stocked > company.get('shares')) {
                model.addError(name, 'Too many shares');
            }
        }
    }
};
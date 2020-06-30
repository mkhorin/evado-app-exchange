/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class StockUsersRule extends Base {

    constructor (config) {
        super({
            objectFilter: true, // filter objects in a list
            ...config
        });
    }

    execute () {
        return this.isObjectTarget()
            ? this.checkRefUser()
            : this.isAllowType();
    }

    async checkRefUser () {
        const trader = await this.resolveRefUser();
        const target = this.getTarget();
        const matched = this.isEqual(target.get('owner'), trader) || this.isEqual(target.get('getter'), trader);
        return this.isAllowType() ? matched : !matched;
    }

    async getObjectFilter () {
        const trader = await this.resolveRefUser();
        return this.objectFilter ? ['OR', {owner: trader}, {getter: trader}] : null;
    }

    async resolveRefUser () {
        if (!this._refUser) {
            const metaClass = this.getTarget().class.getAttr('owner').getRefClass();
            this._refUser = await metaClass.find().and({user: this.getUserId()}).id();
        }
        return this._refUser;
    }
};
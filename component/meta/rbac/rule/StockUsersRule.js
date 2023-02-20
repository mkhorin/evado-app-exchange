/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/meta/rbac/rule/BaseRule');

module.exports = class StockUsersRule extends Base {

    constructor (config) {
        super({
            objectFilter: true,
            ...config
        });
    }

    execute () {
        return this.isObjectTarget()
            ? this.checkRefUser()
            : this.isAllow();
    }

    async checkRefUser () {
        const trader = await this.resolveRefUser();
        const target = this.getTarget();
        const owner = target.get('owner');
        const getter = target.get('getter');
        const matched = this.isEqual(owner, trader) || this.isEqual(getter, trader);
        return this.isAllow() ? matched : !matched;
    }

    /**
     * Filter objects in list
     */
    async getObjectFilter () {
        if (!this.objectFilter) {
            return null;
        }
        const trader = await this.resolveRefUser();
        return ['or', {owner: trader}, {getter: trader}];
    }

    async resolveRefUser () {
        if (!this._refUserId) {
            const user = this.getUserId();
            const target = this.getTarget();
            const userClass = target.class.getAttr('owner').getRefClass();
            this._refUserId = await userClass.find({user}).id();
        }
        return this._refUserId;
    }
};
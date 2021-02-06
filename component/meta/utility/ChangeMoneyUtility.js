/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/utility/MetaUtility');

module.exports = class ChangeMoneyUtility extends Base {

    async execute () {
        const params = await this.resolveMetaParams();
        const trader = params.model;
        const amount = parseInt(this.postParams.money);
        if (!this.validateMoney(amount, trader)) {
            throw new BadRequest('Invalid amount');
        }
        trader.set('money', trader.get('money') + amount);
        await trader.update();
        const recipient = trader.get('user');
        await this.module.notify('balanceChanged', recipient, {amount});
        this.controller.sendText('Balance has been changed');
    }

    validateMoney (money, trader) {
        return money && money < 100000 && trader.get('money') + money >= 0;
    }
};

const BadRequest = require('areto/error/http/BadRequest');
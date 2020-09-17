/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/utility/MetaUtility');

module.exports = class DealUtility extends Base {

    async isActive () {
        if (!this.enabled || !this.isUpdateAction()) {
            return false;
        }
        const {model} = await this.resolveMetaParams();
        if (!model || model.class.name !== 'lot' || model.getStateName() !== 'active') {
            return false;
        }
        const owner = await model.related.resolve('owner');
        return !this.isUserId(owner.get('user'));
    }

    async execute () {
        const data = await this.resolveMetaParams();
        const getter = await data.class.meta.getClass('trader').find({user: this.getUserId()}).one();
        if (!getter) {
            throw new BadRequest('Trader not found');
        }
        const lot = data.model;
        const method = lot.get('type') === 'sale' ? 'buy' : 'sell';
        await this[method](lot, getter);
        await this.createLotNotification(lot);
        this.controller.sendText('Deal done');
    }

    async createLotNotification (lot) {
        const company = await lot.related.resolve('company');
        const owner = await lot.related.resolve('owner');
        const recipient = owner.get('user');
        return this.module.createNotification('dealDone', recipient, {
            company: company.header.resolve(),
            type: lot.getDisplayValue('type'),
            shares: lot.get('shares'),
            value: lot.get('value')
        });
    }

    // move shares from owner to getter
    // move money from getter to owner

    async buy (lot, getter) {
        const getterMoney = getter.get('money');
        const lotValue = lot.get('value');
        if (getterMoney < lotValue) {
            throw new BadRequest('Not enough money');
        }
        const company = lot.get('company');
        const owner = await lot.related.resolve('owner');
        const ownerStock = await this.getStock(company, owner);
        if (!ownerStock) {
            throw new BadRequest('Owner has no stock');
        }
        const ownerShares = ownerStock.get('shares');
        const lotShares = lot.get('shares');
        if (ownerShares < lotShares) {
            throw new BadRequest('Owner does not have enough shares');
        }
        const getterStock = await this.resolveStock(company, getter);
        owner.set('money', owner.get('money') + lotValue);
        getter.set('money', getterMoney - lotValue);
        ownerStock.set('shares', ownerShares - lotShares);
        getterStock.set('shares', getterStock.get('shares') + lotShares);
        lot.set('getter', getter.getId());
        lot.set('dealDate', new Date);
        lot.setState('closed');

        await owner.update();
        await getter.update();
        await ownerStock.update();
        await getterStock.update();
        await lot.update();
    }

    // move shares from getter to owner
    // move money from owner to getter

    async sell (lot, getter) {
        const owner = await lot.related.resolve('owner');
        const ownerMoney = owner.get('money');
        const lotValue = lot.get('value');
        if (ownerMoney < lotValue) {
            throw new BadRequest('Owner does not have enough money');
        }
        const company = lot.get('company');
        const getterStock = await this.getStock(company, getter);
        if (!getterStock) {
            throw new BadRequest('Stock not found');
        }
        const getterShares = getterStock.get('shares');
        const lotShares = lot.get('shares');
        if (getterShares < lotShares) {
            throw new BadRequest('Not enough shares');
        }
        const ownerStock = await this.resolveStock(company, owner);
        getter.set('money', getter.get('money') + lotValue);
        owner.set('money', ownerMoney - lotValue);
        getterStock.set('shares', getterShares - lotShares);
        ownerStock.set('shares', ownerStock.get('shares') + lotShares);
        lot.set('getter', getter.getId());
        lot.set('dealDate', new Date);
        lot.setState('closed');

        await owner.update();
        await getter.update();
        await ownerStock.update();
        await getterStock.update();
        await lot.update();
    }

    async resolveStock () {
        return await this.getStock(...arguments)
            || await this.createStock(...arguments);
    }

    async getStock (company, trader) {
        const owner = trader.getId();
        return trader.class.meta.getClass('stock').find({company, owner}).one();
    }

    async createStock (company, trader) {
        const model = await this.createModel(trader.class.meta.getClass('stock'));
        model.set('company', company);
        model.set('owner', trader.getId());
        if (await model.save()) {
            return model;
        }
        throw new BadRequest(model.getFirstError());
    }
};

const BadRequest = require('areto/error/http/BadRequest');
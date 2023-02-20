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
        const traderClass = data.class.meta.getClass('trader');
        const traderQuery = traderClass.find({
            user: this.getUserId()
        });
        const getter = await traderQuery.one();
        if (!getter) {
            throw new BadRequest('Trader not found');
        }
        const lot = data.model;
        const method = lot.get('type') === 'sale' ? 'buy' : 'sell';
        await this[method](lot, getter);
        await this.notifyAboutDeal(lot);
        this.controller.sendText('Deal done');
    }

    async notifyAboutDeal (lot) {
        const company = await lot.related.resolve('company');
        const owner = await lot.related.resolve('owner');
        const recipient = owner.get('user');
        const data = {
            company: company.header.resolve(),
            type: lot.getDisplayValue('type'),
            shares: lot.get('shares'),
            value: lot.get('value')
        };
        return this.module.notify('dealDone', recipient, data);
    }

    /**
     * Mve shares from owner to getter
     * Move money from getter to owner
     */
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
        const getterShares = getterStock.get('shares');
        const getterStock = await this.resolveStock(company, getter);
        const ownerMoney = owner.get('money');
        owner.set('money', ownerMoney + lotValue);
        getter.set('money', getterMoney - lotValue);
        ownerStock.set('shares', ownerShares - lotShares);
        getterStock.set('shares', getterShares + lotShares);
        lot.set('getter', getter.getId());
        lot.set('dealDate', new Date);
        lot.setState('closed');
        await owner.update();
        await getter.update();
        await ownerStock.update();
        await getterStock.update();
        await lot.update();
    }

    /**
     * Move shares from getter to owner
     * Move money from owner to getter
     */
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
        const getterMoney = getter.get('money');
        const ownerStock = await this.resolveStock(company, owner);
        const ownerShares = ownerStock.get('shares');
        getter.set('money', getterMoney + lotValue);
        owner.set('money', ownerMoney - lotValue);
        getterStock.set('shares', getterShares - lotShares);
        ownerStock.set('shares', ownerShares + lotShares);
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
        const stockClass = trader.class.meta.getClass('stock');
        const query = stockClass.find({company, owner});
        return query.one();
    }

    async createStock (company, trader) {
        const stockClass = trader.class.meta.getClass('stock');
        const model = await this.createModel(stockClass);
        model.set('company', company);
        model.set('owner', trader.getId());
        if (await model.save()) {
            return model;
        }
        throw new BadRequest(model.getFirstError());
    }
};

const BadRequest = require('areto/error/http/BadRequest');
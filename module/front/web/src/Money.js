/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Front.Money = class Money {

    constructor (front) {
        this.front = front;
    }

    get () {
        return this._money !== undefined
            ? $.Deferred().resolve(this._money)
            : this.load();
    }

    load () {
        if (this._deferred) {
            return this._deferred;
        }
        const url = this.front.getData('dataUrl') + 'list';
        const data = {
            class: 'trader',
            view: 'list'
        };
        this._money = undefined;
        this._deferred = this.front.ajaxQueue
            .post(url, data)
            .then(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
        return this._deferred;
    }

    onDone (data) {
        this._deferred = null;
        data = data.items[0];
        this._money = data?.hasOwnProperty('money') ? data.money : null;
        this.front.trigger('money:done', {money: this._money})
    }

    onFail (data) {
        this._deferred = null;
    }
};

Front.MoneyTitle = class MoneyTitle extends Front.Element {

    init () {
        this.front.on('money:done', this.onMoneyDone.bind(this));
        this.front.money.get().then(this.set.bind(this))
    }

    set (money) {
        this.$container.html(money);
    }

    onMoneyDone (event, {money}) {
        this.set(money);
    }
};
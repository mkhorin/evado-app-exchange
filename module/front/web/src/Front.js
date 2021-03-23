/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

class Front {

    static getElementClass (name) {
        return this[name]?.prototype instanceof this.Element ? this[name] : null;
    }

    static toggle ($element, state) {
        return $element.toggleClass('hidden', !state);
    }

    static getTemplate (name, container) {
        return container.querySelector(`template[data-id="${name}"]`)?.innerHTML;
    }

    static resolveTemplate (text, data, start = '{{', end = '}}') {
        const regex = new RegExp(`${start}(\\w+)${end}`, 'gm');
        return text.replace(regex, (match, key)=> {
            const value = data[key];
            return data.hasOwnProperty(key) && value !== undefined && value !== null ? value : '';
        });
    }

    static setPageTitle (text) {
        const $title = $(document.head).find('title');
        const base = $title.data('title');        
        $title.html(text ? `${Jam.t(text)} - ${base}` : base);
    }

    static escapeData (data, keys) {
        for (const key of keys || Object.keys(data)) {
            data[key] = this.escapeHtml(data[key]);
        }
    }

    static escapeHtml (value) {
        return typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
    }

    static createHandlers (front, container) {
        const handlers = [];
        for (const element of container.querySelectorAll('[data-handler]')) {
            const name = $(element).data('handler');
            if (typeof name === 'string') {
                const Class = this.getElementClass(name);
                if (Class) {
                    handlers.push(new Class(element, front));
                } else {
                    console.error(`Handler not found: ${name}`);
                }
            }
        }
        for (const handler of handlers) {
            if (handler.init) {
                handler.init();
            }
        }
    }

    constructor () {
        this.ajaxQueue = new this.constructor.AjaxQueue;
        this.$container = $('.front');
        this.meta = new this.constructor.Meta(this);
        this.money = new Front.Money(this);
        this.constructor.createHandlers(this, document);
        this.on('click', '[data-action="main"]', this.onMain.bind(this));
        this.on('click', '[data-action="company"]', this.onCompany.bind(this));
        this.on('click', '[data-action="lots"]', this.onLots.bind(this));
        this.on('click', '[data-action="lot"]', this.onLot.bind(this));
        this.on('click', '[data-action="myLots"]', this.onMyLots.bind(this));
        this.on('click', '[data-action="myLot"]', this.onMyLot.bind(this));
        this.on('click', '[data-action="newLot"]', this.onNewLot.bind(this));
        this.on('click', '[data-action="myStocks"]', this.onMyStocks.bind(this));
        this.on('click', '[data-action="stock"]', this.onStock.bind(this));
        this.on('action:auth', this.onAuth.bind(this));
    }

    isGuest () {
        return this.getData('guest');
    }

    isUser (id) {
        return id && this.getData('user') === id;
    }

    getData (key) {
        return this.$container.data(key);
    }

    showPage (name, data) {
        this.trigger('show:page', Object.assign({name}, data));
    }

    getActivePage () {
        return this.getPages().filter(`.active`);
    }

    getPage (name) {
        return this.getPages().filter(`[data-page="${name}"]`);
    }

    getPages () {
        return this.$container.children('.page');
    }

    togglePage (name) {
        this.getPages().removeClass('active');
        this.getPage(name).addClass('active');
    }

    getActionTarget (event, key = 'id') {
        return $(event.currentTarget).closest(`[data-${key}]`).data(key);
    }

    getHandler (name) {
        return this.$container.find(`[data-handler="${name}"]`).data('handler');
    }

    getAuthAction (action) {
        return `action:${this.isGuest() ? 'auth' : action}`;
    }

    toggleLoader (state) {
        $('.global-loader').toggle(state);
        $(document.body).toggleClass('loading', state);
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }

    onMain (event) {
        event.preventDefault();
        this.showPage('main');
    }

    onAuth (event) {
        event.preventDefault();
        location.assign('auth/sign-in?returnUrl=/front');
    }

    onCompany (event) {
        event.preventDefault();
        this.trigger('action:company', {company: this.getActionTarget(event)});
    }

    onLot (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('lot'), {lot: this.getActionTarget(event)});
    }

    onLots (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('lots'));
    }

    onMyLots (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('myLots'));
    }

    onMyLot (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('myLot'), {lot: this.getActionTarget(event)});
    }

    onNewLot (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('newLot'));
    }

    onMyStocks (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('myStocks'));
    }

    onStock (event) {
        event.preventDefault();
        this.trigger(this.getAuthAction('stock'), {stock: this.getActionTarget(event)});
    }
}
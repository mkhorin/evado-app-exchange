'use strict';

Front.Company = class Company extends Front.Loadable {

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'company',
            view: 'publicView',
            id: this.id
        };
    }

    render (data) {
        //data.questions = this.renderQuestions(data.questions);
        return this.resolveTemplate('company', data);
    }

    renderQuestions (items) {
        if (!Array.isArray(items) || !items.length) {
            return this.resolveTemplate('noQuestions');
        }
        items = items.map(this.renderQuestion, this).join('');
        return this.resolveTemplate('questions', {items});
    }

    renderQuestion (data) {
        return this.resolveTemplate('question', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};

Front.CompanyList = class CompanyList extends Front.Loadable {

    init () {
        super.init();
        this.load();
    }

    getUrl () {
        return super.getUrl('list');
    }

    getPostData () {
        return {
            class: 'company',
            view: 'publicList'
        };
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No companies found')});
    }

    renderItem (data) {
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};
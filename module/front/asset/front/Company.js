/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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
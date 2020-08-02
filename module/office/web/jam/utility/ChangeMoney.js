/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.ChangeMoney = class ChangeMoneyUtility extends Jam.Utility {

    execute () {
        const content = $('[data-id="changeMoneyForm"]').html();
        Jam.dialog.show(content, {
            title: 'Change amount of money',
            cssClass: 'success',
            beforeSubmit: this.onBeforeSubmit.bind(this)
        });
        this.$form = Jam.dialog.$container.find('.form');
        this.$alert = this.$form.find('.alert');
        this.$money = this.$form.find('[name="money"]').focus();
        Jam.i18n.translateContainer(this.$form);
    }

    getMoney () {
        return parseInt(this.$money.val());
    }

    onBeforeSubmit () {
        if (!this.validate()) {
            return false;
        }
        Jam.toggleGlobalLoader(true);
        const data = this.getRequestData({
            model: this.getModel().id,
            money: this.getMoney()
        });
        Jam.Helper.post(this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.dialog.close();
        Jam.toggleGlobalLoader(false);
        this.modal.reload({saved: true}).done(() => this.getModel().notice.success(data));
    }

    onFail (data) {
        Jam.toggleGlobalLoader(false);
        this.$alert.removeClass('hidden').html(data.responseJSON || data.responseText);
    }

    validate () {
        this.clearErrors();
        this.validateMoney();
        return !this.hasError()
    }

    validateMoney () {
        if (!this.getMoney()) {
            this.addError('Invalid value', this.$money);
        }
    }

    hasError () {
        return !this.$alert.hasClass('hidden') || this.$form.find('.has-error').length > 0;
    }

    addError (message, $element) {
        const $attr = $element.closest('.form-attr');
        $attr.addClass('has-error');
        $attr.find('.error-block').html(Jam.i18n.translate(message));
    }

    clearErrors () {
        this.$alert.addClass('hidden');
        this.$form.find('.has-error').removeClass('has-error');
    }
};
/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.ChangeMoney = class ChangeMoneyUtility extends Jam.Utility {

    execute () {
        const content = $('[data-id="changeMoneyForm"]').html();
        Jam.dialog.show(content, {
            css: 'success',
            title: 'Change amount of money',
            beforeSubmit: this.onBeforeSubmit.bind(this)
        });
        this.$form = Jam.dialog.$container.find('.form');
        this.$alert = this.$form.find('.alert');
        this.$money = this.$form.find('[name="money"]').focus();
        Jam.t(this.$form);
    }

    getMoney () {
        return parseInt(this.$money.val());
    }

    onBeforeSubmit () {
        if (!this.validate()) {
            return false;
        }
        Jam.toggleLoader(true);
        const data = this.getRequestData({
            model: this.getModel().id,
            money: this.getMoney()
        });
        return Jam.post(this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.dialog.close();
        Jam.toggleLoader(false);
        return this.frame.reload({saved: true}).done(() => {
            return this.getModel().alert.success(data);
        });
    }

    onFail (data) {
        Jam.toggleLoader(false);
        this.$alert.html(data.responseJSON || data.responseText);
        this.$alert.removeClass('hidden');
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
        return !this.$alert.hasClass('hidden')
            || this.$form.find('.has-error').length > 0;
    }

    addError (message, $element) {
        const $attr = $element.closest('.form-attr');
        $attr.addClass('has-error');
        $attr.find('.error-block').html(Jam.t(message));
    }

    clearErrors () {
        this.$alert.addClass('hidden');
        this.$form.find('.has-error').removeClass('has-error');
    }
};
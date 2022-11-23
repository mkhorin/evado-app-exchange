/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.Utility.Deal = class DealUtility extends Jam.Utility {

    onItem (event) {
        this.checkModelChanges()
            ? event.preventDefault()
            : super.onItem(event);
    }

    execute () {
        const data = this.getRequestData();
        Jam.showLoader();
        return Jam.post(this.getUrl(), data)
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
    }

    onDone (data) {
        Jam.hideLoader();
        return this.frame.reload({saved: true}).done(() => {
            this.getModel().alert.success(data);
        });
    }

    onFail (data) {
        Jam.hideLoader();
        this.parseModelError(data);
    }
};
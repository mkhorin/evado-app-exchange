'use strict';

const parent = require('evado/config/default-utilities');

module.exports = {

    ...parent,

    'changeMoney': {
        Class: 'component/meta/utility/ChangeMoneyUtility',
        enabled: true,
        name: 'Change amount of money',
        frontClass: 'ChangeMoney',
        targetClass: 'trader'
    },
    'deal': {
        Class: 'component/meta/utility/DealUtility',
        enabled: true,
        name: 'Deal',
        hint: 'Get this lot',
        confirmation: 'Get this lot now?',
        css: 'btn-success',
        frontClass: 'Deal',
        targetClass: 'lot'
    }
};
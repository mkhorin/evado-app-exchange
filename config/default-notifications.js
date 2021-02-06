'use strict';

module.exports = {

    'balanceChanged': {
        active: true,
        subject: 'Balance changed',
        text: 'Your balance changed: {amount}',
        methods: ['popup']
    },
    'dealDone': {
        active: true,
        subject: 'Deal done: {type}',
        text: '{type}: {company}. Shares: {shares}. Value: {value}',
        methods: ['popup']
    },
};
'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {type: 'all'}
    }, {
        description: 'Public access',
        roles: ['guest', 'trader'],
        type: 'allow',
        actions: 'read',
        targets: [{
            type: 'class',
            class: ['company', 'logo']
        }, {
            type: 'view',
            class: 'lot',
            view: ['activeView', 'activePurchases', 'activeSales', 'activeCompanyLots']
        }, {
            type: 'view',
            class: 'trader',
            view: 'publicView'
        }]
    }, {
        description: 'User can read his own trader',
        roles: 'trader',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'trader'
        },
        rule: 'User'
    }, {
        description: 'Trader can read his own stocks',
        roles: 'trader',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'stock'
        },
        rule: 'Owner user'
    }, {
        description: 'Trader can manage his own lots',
        roles: 'trader',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: 'lot'
        },
        rule: 'Owner user'
    }, {
        description: 'Trader can read received lots',
        roles: 'trader',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'lot'
        },
        rule: 'Getter user'
    }, {
        description: 'Trader can read any active lots',
        roles: 'trader',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'state',
            class: 'lot',
            state: 'active'
        }
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Admin module',
            description: 'Access to Admin module'
        },
        'moduleOffice': {
            label: 'Office module',
            description: 'Access to Office module'
        },
        'moduleStudio': {
            label: 'Studio module',
            description: 'Access to Studio module'
        },
        'utilityChangeMoney': {
            label: 'Change money utility',
            description: 'Access to change user`s cash balance'
        },
        'utilityDeal': {
            label: 'Deal utility',
            description: 'Access to deal'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to all',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'upload',
                'utilityChangeMoney'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        },
        'trader': {
            label: 'Trader',
            description: 'Seller and buyer of lots',
            children: [
                'moduleOffice',
                'utilityDeal'
            ]
        }
    },

    assignments: {
        'Adam': 'administrator',
        'Bart': 'trader',
        'Sara': 'trader',
        'Tim': 'trader'
    },

    rules: {
        'Getter user': {
            description: 'Check user is a trader-getter',
            config: '{"Class": "evado/component/meta/rbac/rule/RefUserRule", "attr": "getter"}'
        },
        'Owner user': {
            description: 'Check user is a trader-owner',
            config: '{"Class": "evado/component/meta/rbac/rule/RefUserRule", "attr": "owner"}'
        },
        'User': {
            description: 'Check user binding',
            config: '{"Class": "evado/component/meta/rbac/rule/UserRule"}'
        }
    }
};
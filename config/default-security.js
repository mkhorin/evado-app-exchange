'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'all'
        }
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
        rule: 'user'
    }, {
        description: 'Trader can read his own stocks',
        roles: 'trader',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'stock'
        },
        rule: 'owner'
    }, {
        description: 'Trader can manage his own lots',
        roles: 'trader',
        type: 'allow',
        actions: 'all',
        targets: {
            type: 'class',
            class: 'lot'
        },
        rule: 'owner'
    }, {
        description: 'Trader can read received lots',
        roles: 'trader',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'lot'
        },
        rule: 'getter'
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
        'moduleApiBaseUpload': {
            label: 'Upload files',
            description: 'Uploading files via basic metadata API module'
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
                'moduleApiBaseUpload',
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
                'moduleApiBaseUpload',
                'utilityDeal'
            ]
        }
    },

    rules: {
        'getter': {
            label: 'Getter user',
            description: 'Check user is a trader-getter',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserRule',
                attr: 'getter'
            }
        },
        'owner': {
            label: 'Owner user',
            description: 'Check user is a trader-owner',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserRule',
                attr: 'owner'
            }
        },
        'user': {
            label: 'User',
            description: 'Check user binding',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule',
                attr: 'user'
            }
        }
    },

    assignments: {
        'Adam': 'administrator',
        'Bart': 'trader',
        'Sara': 'trader',
        'Tim': 'trader'
    }
};
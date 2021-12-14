'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        fileUrl: String,
        metaUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        return {
            activePage: 'companies',
            activeCompany: null,
            activeStock: null,
            userMoney: null
        };
    },
    computed: {
        activePageProps () {
            return {
                ...this.defaultPageProps,
                ...this.pageProps
            };
        },
        defaultPageProps () {
            return {
                userMoney: this.userMoney
            };
        },
        pageProps () {
            switch (this.activePage) {
                case 'company':
                    return {
                        key: this.activeCompany,
                        company: this.activeCompany
                    };
                case 'my-stock':
                    return {
                        key: this.activeStock,
                        stock: this.activeStock
                    };
            }
        }
    },
    created () {
        this.$on('account', this.onAccount);
        this.$on('active-lots', this.onActiveLots);
        this.$on('companies', this.onCompanies);
        this.$on('company', this.onCompany);
        this.$on('my-lots', this.onMyLots);
        this.$on('my-stock', this.onMyStock);
        this.$on('my-stocks', this.onMyStocks);
        this.loadUserMoney();
    },
    methods: {
        onAccount () {
            if (this.requireAuth()) {
                this.activePage = 'account';
            }
        },
        onActiveLots () {
            this.activePage = 'active-lots';
        },
        onCompanies () {
            this.activePage = 'companies';
        },
        onCompany (id) {
            this.activePage = 'company';
            this.activeCompany = id;
        },
        onDeal () {
            this.loadUserMoney();
        },
        onMyLots () {
            if (this.requireAuth()) {
                this.activePage = 'my-lots';
            }
        },
        onMyStock (id) {
            this.activePage = 'my-stock';
            this.activeStock = id;
        },
        onMyStocks () {
            if (this.requireAuth()) {
                this.activePage = 'my-stocks';
            }
        },
        async loadUserMoney () {
            if (this.isGuest()) {
                return false;
            }
            this.userMoney = null;
            const {items} = await this.fetchJson('list', {
                class: 'trader'
            });
            this.userMoney = items[0]?.money || 0;
        }
    }
});
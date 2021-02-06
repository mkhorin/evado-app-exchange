'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Administrator': 'Администратор',
    'Amount': 'Сумма',

    'Balance changed': 'Баланс изменен',
    'Balance has been changed': 'Баланс был изменен',

    'Change amount of money': 'Изменить количество денег',

    'Deal': 'Сделка',
    'Deal done': 'Сделка проведена',

    'Get this lot': 'Получить данный лот',
    'Get this lot now?': 'Получить данный лот?',

    'Not enough money': 'Недостаточно денег',

    'Owner does not have enough money': 'У владельца недосточно денег',
    'Owner does not have enough shares': 'У владельца недосточно акций',
    'Owner has no stock': 'У владельца нет акций',

    'Too many shares': 'Слишком много долей',
    'Trader': 'Торговец',
    'Trader not found': 'Торговец не найден'
});

// METADATA

Jam.I18n.meta = {

    'Activate': 'Активировать',
    'Active lots': 'Активные лоты',

    'Companies': 'Компании',
    'Company': 'Компания',

    'Deactivate': 'Деактивировать',
    'Deal date': 'Дата сделки',
    'Description': 'Описание',

    'Getter': 'Получатель',

    'Logo': 'Логотип',
    'Lot': 'Лот',
    'Lots': 'Лоты',

    'Make this lot available for dealing': 'Сделать лот доступным для сделки',
    'Money': 'Деньги',
    'My lots': 'Мои лоты',
    'My stocks': 'Мои акции',
    'My trader': 'Мой торговец',

    'Name': 'Название',

    'Owner': 'Владелец',

    'Purchase': 'Покупка',

    'Sale': 'Продажа',
    'Shares': 'Доли',
    'Shares for sale': 'Доли на продажу',
    'Shares for purchase': 'Доли на покупку',
    'Shares held by traders': 'Доли, принадлежащие торговцам',
    'State': 'Состояние',
    'Stock': 'Акции',
    'Stocks': 'Акции',

    'Trader': 'Торговец',
    'Type': 'Тип',

    'User': 'Пользователь',
};

Jam.I18n['meta.class.lot'] = {

    'Active': 'Активно',

    'Closed': 'Закрыто',

    'Draft': 'Черновик',

    'Value': 'Стоимость'
};
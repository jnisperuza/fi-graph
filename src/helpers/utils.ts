export const INTL = {
    code: 'es-CO',
    currency: 'COP'
};

export const currencyFormat = (money: number) => {
    if (money === undefined || money === null) return;
    return new Intl.NumberFormat(INTL.code,
        {
            style: 'currency',
            currency: INTL.currency,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }
    ).format(money);
}

export const numberFormat = (number: number) => {
    if (number === undefined || number === null) return;
    return new Intl.NumberFormat(INTL.code).format(number);
}

export const groupBy = (xs: any[], key: string | number) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export const hexColor = () => {
    const genLetters = () => {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const number = (Math.random() * 15).toFixed(0);
        return letters[number];
    }

    let color = '';
    for (var i = 0; i < 6; i++) {
        color = color + genLetters();
    }
    return '#' + color;
}

export const SHORT_MONTH_NAMES = {
    1: 'Ene',
    2: 'Feb',
    3: 'Mar',
    4: 'Abr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Ago',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dic'
}

export const stringFormat = (
    template: string,
    data: { [key: string]: string }
): string => {
    if (template && data instanceof Object && Object.keys(data).length) {
        for (const prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                const regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                template = template.replace(regexp, data[prop]);
            }
        }
        return template;
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.today = exports.dateConvert = void 0;
const dateConvert = (date) => {
    if ((date === null || date === void 0 ? void 0 : date.search('/')) != -1) {
        const format = {
            year: date.split('/')[2],
            month: date.split('/')[1],
            day: date.split('/')[0]
        };
        return format['year'] + '-' + format['month'] + '-' + format['day'];
    }
    else
        return date;
};
exports.dateConvert = dateConvert;
const today = () => {
    const objectDate = new Date().toLocaleString('en-GB');
    const dateToday = objectDate.split(',')[0];
    const now = objectDate.split(',')[1].replace(' ', '');
    return {
        dateToday,
        now
    };
};
exports.today = today;

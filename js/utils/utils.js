export class Utils {
    static utf8ToIso(arrayBuffer) {
        let encoder = new TextDecoder("ISO-8859-1");
        arrayBuffer = new Uint8Array(arrayBuffer);
        return encoder.decode(arrayBuffer);
    }
    static parseHTML(text) {
        return (new DOMParser()).parseFromString(text, "text/html");
    }
    static responseToHtml(response) {
        return response.arrayBuffer()
            .then(Utils.utf8ToIso)
            .then(Utils.parseHTML);
    }
    static removeTildesFromString(value) {
        return value.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "");
    }
    static formToDataString(form) {
        return Array.from(form).reduce((a, b) => (typeof a == 'string' ? `${a}&` : `${a[0]}=${escape(a[1])}&`) +
            `${b[0]}=${escape(b[1])}`);
    }
    static arrayBinarySearch(array, desiredValue, compareFuntion = null, valueGetterFunction = null) {
        let lastPosition = 0;
        let currentPosition = Math.round(this.length / 2);
        let valueIndex = null;
        valueGetterFunction = typeof valueGetterFunction !== 'function' ?
            (v) => v : valueGetterFunction;
        compareFuntion = typeof compareFuntion !== 'function' ?
            (a, b) => a - b : compareFuntion;
        while (valueIndex === null && currentPosition < array.length) {
            const currentValue = valueGetterFunction(array[currentPosition]);
            const compareResult = compareFuntion(currentValue, desiredValue);
            if (compareResult < 0) {
                currentPosition += Math.round((lastPosition + currentPosition) / 2);
            }
            else if (compareResult > 0) {
                currentPosition -= Math.round((lastPosition + currentPosition) / 2);
            }
            else {
                valueIndex = currentPosition;
            }
            lastPosition = currentPosition;
        }
        return valueIndex;
    }
    static jsonSafeParse(json) {
        try {
            return JSON.parse(json);
        }
        catch (e) {
            return undefined;
        }
    }
    static get isMobileVersion() {
        return this._isMobileVersion;
    }
    static parseFCDate(dateString) {
        const msInADay = 1000 * 60 * 60 * 24;
        if (typeof dateString !== 'string') {
            let invalid = new Date();
            invalid.setTime(NaN);
            return invalid;
        }
        const dateChunks = dateString.split(',')
            .map(s => s.trim());
        const monthsTranslations = {
            'ene': 'jan',
            'abr': 'apr',
            'ago': 'aug',
            'dic': 'dec'
        };
        const date = new Date();
        if (['Hoy', 'Ayer'].includes(dateChunks[0])) {
            date.setTime(Math.floor(Date.now() / msInADay) * msInADay +
                (date.getTimezoneOffset() * 1000 * 60));
            if (dateChunks[0] === 'Ayer')
                date.setTime(date.getTime() - msInADay);
        }
        else {
            let [day, month, year] = dateChunks[0].split('-');
            if (monthsTranslations.hasOwnProperty(month))
                month = monthsTranslations[month];
            date.setTime(Date.parse([day, month, year].join('-')));
        }
        if (dateChunks.length > 1) {
            let hour = Date.parse(`1-1-1970 ${dateChunks[1]} GMT`);
            date.setTime(date.getTime() + hour - (new Date().getTimezoneOffset()));
        }
        return date;
    }
}
Utils._isMobileVersion = location.host.split('.')[0] === 'm';

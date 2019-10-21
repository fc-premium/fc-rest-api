import superagent from 'superagent';
import { Urls } from './urls';
import { Utils } from './utils';
export class Token {
    constructor(token) {
        this.parseRawToken(token);
    }
    parseRawToken(token) {
        this.guest = [undefined, null, '', 'guest'].includes(token);
        if (!this.guest) {
            const tokenChunks = token.split('-');
            this.timestamp = parseInt(tokenChunks[0]);
            this.hmac = tokenChunks[1];
        }
    }
    getTimestamp() {
        return this.timestamp;
    }
    getHMAC() {
        return this.hmac;
    }
    isGuest() {
        return this.guest;
    }
    hasExpired() {
        return !this.isGuest() && Date.now() < (this.timestamp + Token.timeUntilExpires);
    }
    getRawToken() {
        if (this.isGuest())
            return 'guest';
        return `${this.timestamp}-${this.hmac}`;
    }
    async update() {
        if (this.isGuest())
            return;
        const newRawToken = superagent.post(Urls.ajax.href)
            .send(`securitytoken=${this.getRawToken()}&do=securitytoken`)
            .then((response) => Utils.parseHTML(response.text)).then(doc => {
            return doc.getElementsByTagName('securitytoken')[0].innerText;
        });
        this.parseRawToken(newRawToken);
    }
}
Token.timeUntilExpires = 60 * 60 * 1000;

import { User } from './user';
export class BasicUser {
    constructor(id = null, nickname = null) {
        this.id = null;
        this.nickname = null;
        this.id = id;
        this.nickname = nickname.trim();
    }
    getUser(update = true) {
        return new User(this.id, update);
    }
    static fromHTML(html) {
        const id = (function () {
            if (html.hasAttribute('userid'))
                return parseInt(html.getAttribute('userid'));
            if (html.hasAttribute('href'))
                return parseInt(html.getAttribute('href').split('=')[1]);
            throw new Error('HTML tag is not valid');
        })();
        const nickname = html.innerText;
        return new BasicUser(id, nickname);
    }
}

import Cookies from 'ts-cookies';
import { Urls } from './urls';
import { Utils } from './utils';
import { Token } from './token';
import { Thread } from './thread';
import { User, BasicUser, CurrentUser } from './user';
export class FC {
    static async getUserData(id) {
        return new User(id).get();
    }
    static async getThreadData(id) {
        return new Thread(id).get();
    }
    static async getCurrentUserId(force_update = false) {
        const isLoggedIn = Cookies.get('bbsessionhash') !== undefined;
        if (isLoggedIn === false)
            return -1;
        if (FC.currentUserId !== null && force_update !== true)
            return FC.currentUserId;
        return fetch(Urls.usercp.href)
            .then(Utils.responseToHtml)
            .then(html => {
            const anchor = html.querySelector('a[href^="member.php?u"]');
            if (anchor !== null) {
                let uid = anchor.getAttribute('href');
                if (uid !== undefined)
                    uid = uid.split('=')[1];
                FC.currentUserId = parseInt(uid);
            }
            return FC.currentUserId;
        });
    }
    static async getCurrentUser() {
        return new CurrentUser().get();
    }
    static async getSecurityToken() {
        if (this.currentToken === null) {
            const rawToken = await fetch(Urls.onlineUsers.href)
                .then(Utils.responseToHtml)
                .then(html => {
                return html.querySelector('[name="securitytoken"]').value;
            });
            this.currentToken = new Token(rawToken);
        }
        if (this.currentToken.hasExpired())
            await this.currentToken.update();
        return this.currentToken.getRawToken();
    }
    static async searchForPartialNickname(nicknameFragment) {
        const form = new FormData();
        form.set('do', 'usersearch');
        form.set('fragment', nicknameFragment);
        form.set('securitytoken', await FC.getSecurityToken());
        return fetch(Urls.userSearch.href, {
            method: 'POST',
            body: form
        }).then(Utils.responseToHtml)
            .then(xml => {
            const userTags = Array.from(xml.querySelectorAll('user'));
            return userTags.map((userTag) => {
                return BasicUser.fromHTML(userTag);
            });
        });
    }
}
FC.currentUserId = null;
FC.currentToken = null;
FC.Urls = Urls;
FC.Utils = Utils;

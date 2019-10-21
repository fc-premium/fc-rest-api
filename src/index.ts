import superagent from 'superagent'
import Cookies from 'ts-cookies'

import { Urls } from './urls'
import { Utils } from './utils'
import { Token } from './token'
import { Thread } from './thread'
import { User, BasicUser, CurrentUser, Nickname } from './user'

export class FC {

	private static currentUserId: number = null;
	private static currentToken: Token = null;

	static readonly Urls = Urls;
	static readonly Utils = Utils;

	static async getUserData(id: number): Promise<User> {
		return new User(id).get();
	}

	static async getThreadData(id: number): Promise<Thread> {
		return new Thread(id).get();
	}

	static async getCurrentUserId(force_update: boolean = false): Promise<number> {
		const isLoggedIn = Cookies.get('bbsessionhash') !== undefined;

		if (isLoggedIn === false)
			return -1;

		if (FC.currentUserId !== null && force_update !== true)
			return FC.currentUserId;

		return fetch(Urls.usercp.href)
			.then(Utils.responseToHtml)
			.then(html => {
				const anchor = html.querySelector('a[href^="member.php?u"]');

				// Anchor not found
				if (anchor !== null) {
					let uid = anchor.getAttribute('href');

					if (uid !== undefined)
						uid = uid.split('=')[1];

					FC.currentUserId = parseInt(uid)
				}

				return FC.currentUserId;
			});
	}

	static async getCurrentUser(): Promise<CurrentUser> {
		return new CurrentUser().get();
	}

	static async getSecurityToken(): Promise<string> {

		if (this.currentToken === null) {
			const rawToken = <string>await fetch(Urls.onlineUsers.href)
				.then(Utils.responseToHtml)
				.then(html => {
					return html.querySelector<HTMLInputElement>('[name="securitytoken"]').value;
				});

			this.currentToken = new Token(rawToken);
		}

		if (this.currentToken.hasExpired())
			await this.currentToken.update();


		return this.currentToken.getRawToken();
	}

	static async searchForPartialNickname(nicknameFragment: Nickname): Promise<BasicUser[]> {

		const form = new FormData();

		form.set('do', 'usersearch');
		form.set('fragment', nicknameFragment);
		form.set('securitytoken', await FC.getSecurityToken());

		return fetch(Urls.userSearch.href, {
			method: 'POST',
			body: form
		}).then(Utils.responseToHtml)
			.then(xml => {
				const userTags = Array.from(xml.querySelectorAll<HTMLElement>('user'));

				return userTags.map((userTag: HTMLElement) => {
					return BasicUser.fromHTML(userTag);
				});
			});
	}
}

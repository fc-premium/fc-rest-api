import superagent from 'superagent'
import { Urls } from './urls'
import { Utils } from './utils'

export class Token {

	public static readonly timeUntilExpires: number = 60 * 60 * 1000;

	private is_guest: boolean;
	private timestamp: number;
	private hmac: string;

	constructor(token: string) {
		this.parseRawToken(token);
	}

	private parseRawToken(token: string): void {

		this.is_guest = [undefined, null, '', 'guest'].includes(token);

		if (!this.is_guest) {
			const tokenChunks = token.split('-');

			this.timestamp = parseInt(tokenChunks[0]);
			this.hmac = tokenChunks[1];
		}
	}

	public getTimestamp(): number {
		return this.timestamp;
	}

	public getHMAC(): string {
		return this.hmac;
	}

	public isGuest(): boolean {
		return this.is_guest;
	}

	public hasExpired(): boolean {
		return !this.isGuest() && Date.now() < (this.timestamp + Token.timeUntilExpires);
	}

	public getRawToken(): string {
		if (this.isGuest())
			return 'guest';

		return `${this.timestamp}-${this.hmac}`;
	}

	public async update(): Promise<void> {

		if (this.isGuest())
			return;

		const newRawToken = superagent.post(Urls.ajax.href)
			.send(`securitytoken=${this.getRawToken()}&do=securitytoken`)
			.then((response) =>
				Utils.parseHTML(response.text)
			).then(doc => {
				return (<HTMLElement>doc.getElementsByTagName('securitytoken')[0]).innerText;
			});

		this.parseRawToken(newRawToken);
	}
}

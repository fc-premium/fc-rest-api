var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Urls } from '../urls';
import { Utils } from '../utils';
import { Dynamic } from '../dynamic';
import { UserStats } from './user-stats';
import { UserAbouts } from './user-abouts';
export class User extends Dynamic {
    constructor(id, update = true) {
        super();
        this.exists = true;
        this.nickname = null;
        this.avatar = null;
        this.isConnected = null;
        this.title = null;
        this.stats = new UserStats();
        this.about = new UserAbouts();
        this.error = null;
        this.id = id;
        if (update)
            this.update();
    }
    async update() {
        if (this.exists === false)
            return this;
        return fetch(`${Urls.user}${this.id}&simple=1`)
            .then(Utils.responseToHtml)
            .then(html => {
            const errorMessage = html.querySelector('.panelsurround');
            if (errorMessage !== null) {
                this.error = errorMessage.innerText.trim();
                this.exists = false;
            }
            else {
                this.nickname = html.querySelector('#username_box > h1').innerText.trim();
                this.avatar = html.querySelector('img.avatar');
                this.isConnected = html.querySelector('#username_box img')
                    .getAttribute('src').search('online') >= 0;
                this.title = html.querySelector('#username_box > h2').innerText.trim();
                let tempData = Array.from(html.querySelectorAll('.statistics_group .shade'))
                    .map((span) => {
                    const li = span.parentNode;
                    let x = li.innerText.split(':');
                    return [
                        Utils.removeTildesFromString(x[0]).trim(),
                        x.slice(1).join(':')
                    ];
                });
                tempData = Object.fromEntries(tempData);
                this.stats.messageCount = parseInt(tempData['Mensajes Total'].replace('.', ''));
                const lastActivity = Utils.parseFCDate(tempData['Ultima Actividad']);
                this.stats.lastActivity = isNaN(lastActivity.getTime()) ?
                    null : lastActivity;
                const signupDate = Utils.parseFCDate(tempData['Fecha de Registro']);
                this.stats.signupDate = isNaN(signupDate.getTime()) ?
                    null : signupDate;
                tempData = Array.from(html.querySelectorAll('.list_no_decoration .profilefield_list > *'))
                    .map((element, index) => {
                    let value;
                    if (index % 2 === 0) {
                        value = Utils.removeTildesFromString(element.innerText);
                    }
                    else {
                        value = element.childNodes[0].nodeValue;
                    }
                    return value.trim();
                }).map((value, index, self) => {
                    return index % 2 === 0 ?
                        [value, self[index + 1]] : undefined;
                }).filter(x => x !== undefined);
                tempData = Object.fromEntries(tempData);
                this.about.car = tempData.hasOwnProperty('Coche') ?
                    tempData['Coche'] : null;
                this.about.place = tempData.hasOwnProperty('Lugar') ?
                    tempData['Lugar'] : null;
                this.about.interests = tempData.hasOwnProperty('Intereses') ?
                    tempData['Intereses'] : null;
                this.about.occupation = tempData.hasOwnProperty('Ocupacion') ?
                    tempData['Ocupacion'] : null;
                this.about.signature = html.querySelector('#signature')
                    .innerHTML.trim();
            }
            return this;
        }).catch(() => {
            return this;
        });
    }
}
__decorate([
    Dynamic.DynamicLock,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "update", null);

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Utils } from './utils';
import { Dynamic, DynamicLock } from './dynamic';
export class Post extends Dynamic {
    constructor(number, update = true) {
        super();
        this.id = null;
        this.threadId = null;
        this.ownerId = null;
        this.number = null;
        this.content = null;
        this.creationDate = null;
        this.editDate = null;
        this.number = number;
        if (update)
            this.update();
    }
    async update() {
        return this;
    }
    updateFromHTML(html) {
        if (html.tagName !== 'TABLE' || !html.id.startsWith('post'))
            throw 'No a valid post';
        this.id = parseInt(html.id.slice(4));
        this.threadId = parseInt((/t\=([\d]+)/).exec(html.querySelector('[href^="showthread.php?t="]').href)[1]);
        this.ownerId = parseInt(html.querySelector('.bigusername').href.split('=')[1]);
        this.number = parseInt(html.querySelector('[id^="postcount"]').name);
        this.content = html.querySelector('[name="HOTWordsTxt"] > div').outerHTML;
        this.creationDate = Utils.parseFCDate(html.querySelector('td.thead').innerText);
        this.editDate = (function () {
            const editPhrase = html.querySelector('td[class^="alt1"][valign="bottom"] em');
            if (editPhrase === null)
                return null;
            let fcDateString = editPhrase.innerText.split('fecha: ')[1]
                .replace(' a las', ',').slice(0, -1);
            return Utils.parseFCDate(fcDateString);
        })();
        return this;
    }
    static fromHTML(html) {
        return new Post(null, false).updateFromHTML(html);
    }
}
__decorate([
    DynamicLock,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Post.prototype, "update", null);

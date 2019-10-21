var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Urls } from './urls';
import { Utils } from './utils';
import { Dynamic } from './dynamic';
import { Post } from './post';
import { BasicUser } from './user';
export class Thread extends Dynamic {
    constructor(id, update = true) {
        super();
        this.authorId = null;
        this.zoneId = null;
        this.title = null;
        this.creationDate = null;
        this.postCount = null;
        this.exists = true;
        this.error = null;
        this.id = id;
        if (update)
            this.update();
    }
    get pageCount() {
        return Math.ceil(this.postCount / Thread.DEFAULT_POSTS_PER_PAGE);
    }
    updateFromHTML(html) {
        const errorPanel = html.querySelector('.panelsurround');
        const errorOccurred = errorPanel !== null &&
            errorPanel.querySelector('textarea') === null &&
            document.querySelector('.panelsurround').querySelector('fieldset') === null;
        if (errorOccurred === true) {
            this.error = errorPanel.innerText.trim();
            this.exists = false;
        }
        else {
            if (this.authorId === null) {
                this.authorId = parseInt(html.querySelector('.bigusername').getAttribute('href').split('=')[1]);
                this.zoneId = parseInt(html.querySelector('.navbar + .navbar + .navbar > [href*="forumdisplay.php?f="]')
                    .getAttribute('href').split('=')[1]);
                this.creationDate = Utils.parseFCDate(html.querySelector('[id*="post"] td.thead').innerText);
            }
            this.title = html.querySelector('.cmega').innerText;
            let navNext = html.querySelector('.pagenav .mfont');
            if (navNext !== null) {
                this.postCount = parseInt(navNext.title.split(' ').slice(-1)[0].replace('.', ''));
            }
            else {
                this.postCount = html.querySelectorAll('[id*="postcount"]').length;
            }
        }
    }
    async update() {
        if (this.exists === false)
            return this;
        return fetch(`${Urls.thread}${this.id}`)
            .then(Utils.responseToHtml)
            .then(html => {
            this.updateFromHTML(html);
            return this;
        }).catch(() => {
            return this;
        });
    }
    async getWhoPosted() {
        return fetch(`${Urls.whoPosted}${this.id}`)
            .then(Utils.responseToHtml)
            .then(html => {
            const postCountByUser = new Map();
            const rows = Array.from(html.querySelectorAll('.tborder > tbody > tr')).slice(2, -1);
            rows.forEach(row => {
                const cols = row.querySelectorAll('td > a');
                const userId = parseInt(cols[0].href.split('=')[1]);
                const nickname = cols[0].innerText.trim();
                const postsCount = parseInt(cols[1].innerText);
                postCountByUser.set(new BasicUser(userId, nickname), postsCount);
            });
            return postCountByUser;
        });
    }
    async getPost(number) {
        return fetch(`${Urls.thread}${this.id}`)
            .then(Utils.responseToHtml)
            .then(html => {
            const postHTML = html.querySelector(`[name="${number}"]`)
                .parentNode.parentNode.parentNode.parentNode;
            return Post.fromHTML(postHTML);
        });
    }
    async getMultiplePosts(numbers) {
        numbers.sort((a, b) => a - b);
        const numbersByPage = (function () {
            const pages = new Map;
            numbers.forEach(n => {
                const page = Math.ceil(n / Thread.MAX_POSTS_PER_PAGE);
                if (!pages.has(page))
                    pages.set(page, []);
                pages.get(page).push(n);
            });
            return pages;
        })();
        const pageNumbers = Array.from(numbersByPage.keys());
        const pagesRequests = Array.from(numbersByPage.keys()).map(pageNumber => {
            return fetch(`${Urls.thread}${this.id}&page=${pageNumber}&pp=${Thread.MAX_POSTS_PER_PAGE}`)
                .then(Utils.responseToHtml);
        });
        const posts = new Map();
        (await Promise.all(pagesRequests)).map((html, i) => {
            const numbersInCurrentPage = numbersByPage.get(pageNumbers[i]);
            numbersInCurrentPage.forEach(number => {
                const postHTML = html.querySelector(`[name="${number}"]`)
                    .parentNode.parentNode.parentNode.parentNode;
                posts.set(number, Post.fromHTML(postHTML));
            });
        });
        return posts;
    }
    async getPostsInPage(pageNumber = 1, postsPerPage = Thread.DEFAULT_POSTS_PER_PAGE, update = true) {
        if (postsPerPage < 0)
            throw 'postsPerPage can not be negative';
        if (postsPerPage > Thread.MAX_POSTS_PER_PAGE)
            postsPerPage = Thread.MAX_POSTS_PER_PAGE;
        return fetch(`${Urls.thread}${this.id}&page=${pageNumber}&pp=${postsPerPage}`)
            .then(Utils.responseToHtml)
            .then(html => {
            if (update === true)
                this.updateFromHTML(html);
            const posts = Array.from(html.querySelectorAll('table[id^="post"]'));
            return posts.map((html) => {
                return Post.fromHTML(html);
            });
        });
    }
    async getPostInRange(start = null, end = null, update = true) {
        if (start === null || end === null)
            throw 'Must introduce start - end range';
        if (start >= end)
            throw 'Start position must be less than end postition';
        const startPage = Math.ceil(start / Thread.MAX_POSTS_PER_PAGE);
        const endPage = Math.ceil(start / Thread.MAX_POSTS_PER_PAGE);
        const range = endPage - startPage;
        const postsInPages = new Array(range).fill(undefined).map(({}, index) => {
            const pageNumber = index + startPage;
            return this.getPostsInPage(pageNumber, Thread.MAX_POSTS_PER_PAGE, update);
        });
        const posts = (await Promise.all(postsInPages)).flat();
        return posts.slice(0, range);
    }
}
Thread.DEFAULT_POSTS_PER_PAGE = 30;
Thread.MAX_POSTS_PER_PAGE = 60;
__decorate([
    Dynamic.DynamicLock,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Thread.prototype, "update", null);

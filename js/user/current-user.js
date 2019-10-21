import { Urls } from '../urls';
import { Utils } from '../utils';
import { FC } from '../index';
import { User } from './user';
import { BasicUser } from './basic-user';
export class CurrentUser extends User {
    constructor() {
        super(null, false);
        const self = this;
        (async function () {
            self.id = await FC.getCurrentUserId();
            await self.update();
        })();
    }
    async getIgnoredUserList() {
        return fetch(Urls.ignoreList.href)
            .then(Utils.responseToHtml)
            .then((html) => {
            const ignoredUserTagList = html.querySelectorAll('.userlist [href*="member.php?u="]');
            return Array.from(ignoredUserTagList).map(tag => BasicUser.fromHTML(tag));
        });
    }
    async getContactList() {
        return fetch(Urls.contactList.href)
            .then(Utils.responseToHtml)
            .then((html) => {
            const contactUserList = html.querySelectorAll('.userlist [href*="member.php?u="]');
            return Array.from(contactUserList).map(tag => BasicUser.fromHTML(tag));
        });
    }
    async unignoreUsers(userIds) {
        const userIdList = typeof userIds === 'number' ?
            [userIds] : userIds;
        const currentIgnoredUsers = await this.getIgnoredUserList();
        const updateForm = new FormData();
        updateForm.set('s', '');
        updateForm.set('do', 'updatelist');
        updateForm.set('userlist', 'ignore');
        updateForm.set('securitytoken', await FC.getSecurityToken());
        currentIgnoredUsers.forEach((user => {
            const id = user.id;
            if (!userIdList.includes(id))
                updateForm.set(`listbits[ignore][${id}]`, id.toString());
            updateForm.set(`listbits[ignore_original][${id}]`, id.toString());
        }));
        return fetch(`${Urls.profile.href}?do=updatelist&userlist=ignore`, {
            method: 'POST',
            body: updateForm
        });
    }
}

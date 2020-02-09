declare module 'urls' {
	export class Urls {
	    static readonly absolutePath: URL;
	    static readonly thread: URL;
	    static readonly whoPosted: URL;
	    static readonly post: URL;
	    static readonly deletePost: URL;
	    static readonly user: URL;
	    static readonly quote: URL;
	    static readonly newPost: URL;
	    static readonly private: URL;
	    static readonly ignoreList: URL;
	    static readonly contactList: URL;
	    static readonly profile: URL;
	    static readonly usercp: URL;
	    static readonly userSearch: URL;
	    static readonly onlineUsers: URL;
	    static readonly ajax: URL;
	    static readonly forumDisplay: URL;
	    static readonly showThread: URL;
	}

}
declare module 'utils/utils' {
	export class Utils {
	    private static _isMobileVersion;
	    static utf8ToIso(arrayBuffer: ArrayBuffer): string;
	    static parseHTML(text: string): HTMLDocument;
	    static responseToHtml(response: Response): Promise<HTMLDocument>;
	    static removeTildesFromString(value: string): string;
	    static formToDataString(form: FormData): string;
	    static arrayBinarySearch(array: Array<any>, desiredValue: any, compareFuntion?: Function, valueGetterFunction?: Function): number;
	    static jsonSafeParse(json: string): any;
	    static readonly isMobileVersion: boolean;
	    static parseFCDate(dateString: string): Date;
	}

}
declare module 'utils/index' {
	export * from 'utils/utils';

}
declare module 'token' {
	export class Token {
	    static readonly timeUntilExpires: number;
	    private guest;
	    private timestamp;
	    private hmac;
	    constructor(token: string);
	    private parseRawToken;
	    getTimestamp(): number;
	    getHMAC(): string;
	    isGuest(): boolean;
	    hasExpired(): boolean;
	    getRawToken(): string;
	    update(): Promise<void>;
	}

}
declare module 'dynamic' {
	import 'reflect-metadata';
	export class Dynamic {
	    private __dynamicCurrentPromise;
	    private waitUntilLoadingIsComplete;
	    get(): Promise<this>;
	}
	export namespace Dynamic {
	    function DynamicLock(target: Dynamic, propertyName: string, descriptor: PropertyDescriptor): void;
	}

}
declare module 'post' {
	import { Dynamic } from 'dynamic';
	export class Post extends Dynamic {
	    id: number;
	    threadId: number;
	    ownerId: number;
	    number: number;
	    content: string;
	    creationDate: Date;
	    editDate: Date;
	    constructor(number: number, update?: boolean);
	    update(): Promise<this>;
	    updateFromHTML(html: HTMLElement): this;
	    static fromHTML(html: HTMLElement): Post;
	}

}
declare module 'user/constants' {
	export type UserID = number;
	export type Nickname = string;

}
declare module 'user/user-abouts' {
	export class UserAbouts {
	    car: string;
	    place: string;
	    interests: string;
	    occupation: string;
	    signature: string;
	}

}
declare module 'user/user-stats' {
	export class UserStats {
	    messageCount: number;
	    signupDate: Date;
	    lastActivity: Date;
	    readonly messagesPerDay: number;
	}

}
declare module 'user/user' {
	import { Dynamic } from 'dynamic';
	import { UserStats } from 'user/user-stats';
	import { UserAbouts } from 'user/user-abouts';
	import { UserID, Nickname } from 'user/constants';
	export class User extends Dynamic {
	    readonly id: UserID;
	    exists: boolean;
	    nickname: Nickname;
	    avatar: HTMLImageElement;
	    isConnected: boolean;
	    title: string;
	    readonly stats: UserStats;
	    readonly about: UserAbouts;
	    error: string;
	    constructor(id: UserID, update?: boolean);
	    update(): Promise<this>;
	}

}
declare module 'user/basic-user' {
	import { UserID, Nickname } from 'user/constants';
	import { User } from 'user/user';
	export class BasicUser {
	    readonly id: UserID;
	    readonly nickname: Nickname;
	    constructor(id?: UserID, nickname?: Nickname);
	    getUser(update?: boolean): User;
	    static fromHTML(html: HTMLElement): BasicUser;
	}

}
declare module 'user/current-user' {
	import { UserID } from 'user/constants';
	import { User } from 'user/user';
	import { BasicUser } from 'user/basic-user';
	export class CurrentUser extends User {
	    id: UserID;
	    constructor();
	    getIgnoredUserList(): Promise<BasicUser[]>;
	    getContactList(): Promise<BasicUser[]>;
	    unignoreUsers(userIds: UserID | UserID[]): Promise<Response>;
	}

}
declare module 'user/index' {
	export * from 'user/constants';
	export * from 'user/user-abouts';
	export * from 'user/user-stats';
	export * from 'user/basic-user';
	export * from 'user/user';
	export * from 'user/current-user';

}
declare module 'thread' {
	import { Dynamic } from 'dynamic';
	import { Post } from 'post';
	import { BasicUser } from 'user';
	export type PostCountByUser = Map<BasicUser, number>;
	export class Thread extends Dynamic {
	    readonly id: number;
	    authorId: number;
	    zoneId: number;
	    title: string;
	    creationDate: Date;
	    postCount: number;
	    readonly pageCount: number;
	    exists: boolean;
	    error: string;
	    static readonly DEFAULT_POSTS_PER_PAGE = 30;
	    static readonly MAX_POSTS_PER_PAGE = 60;
	    constructor(id: number, update?: boolean);
	    private updateFromHTML;
	    update(): Promise<this>;
	    getWhoPosted(): Promise<PostCountByUser>;
	    getPost(number: number): Promise<Post>;
	    getMultiplePosts(numbers: number[]): Promise<Map<number, Post>>;
	    getPostsInPage(pageNumber?: number, postsPerPage?: number, update?: boolean): Promise<Post[]>;
	    getPostInRange(start?: number, end?: number, update?: boolean): Promise<Post[]>;
	}

}
declare module 'index' {
	import { Urls } from 'urls';
	import { Utils } from 'utils';
	import { Thread } from 'thread';
	import { User, BasicUser, CurrentUser, Nickname } from 'user';
	export class FC {
	    private static currentUserId;
	    private static currentToken;
	    static readonly Urls: typeof Urls;
	    static readonly Utils: typeof Utils;
	    static getUserData(id: number): Promise<User>;
	    static getThreadData(id: number): Promise<Thread>;
	    static getCurrentUserId(force_update?: boolean): Promise<number>;
	    static getCurrentUser(): Promise<CurrentUser>;
	    static getSecurityToken(): Promise<string>;
	    static searchForPartialNickname(nicknameFragment: Nickname): Promise<BasicUser[]>;
	}

}

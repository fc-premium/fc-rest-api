import 'reflect-metadata';
export class Dynamic {
    constructor() {
        this.__dynamicCurrentPromise = null;
    }
    async waitUntilLoadingIsComplete() {
        if (this.__dynamicCurrentPromise !== null && this.__dynamicCurrentPromise.constructor === Promise)
            await this.__dynamicCurrentPromise;
        return;
    }
    async get() {
        await this.waitUntilLoadingIsComplete();
        return this;
    }
}
(function (Dynamic) {
    function DynamicLock(target, propertyName, descriptor) {
        const isDynamicInstance = target instanceof Dynamic;
        const isAsyncMethod = Reflect.getMetadata("design:returntype", target, propertyName) === Promise;
        if (isDynamicInstance === true && isAsyncMethod === true) {
            const methodBackup = descriptor.value;
            descriptor.value = async function (...args) {
                this.__currentPromise = methodBackup.apply(this, ...args);
                await this.__currentPromise;
                this.__currentPromise = null;
            };
        }
    }
    Dynamic.DynamicLock = DynamicLock;
})(Dynamic || (Dynamic = {}));

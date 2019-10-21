import { Dynamic } from './dynamic';
export function DynamicLock(target, {}, descriptor) {
    const originalMethod = descriptor.value;
    if (target instanceof Dynamic && originalMethod.constructor.name == 'AsyncFunction') {
        descriptor.value = async function (...args) {
            this.__currentPromise = originalMethod.apply(this, ...args);
            await this.__currentPromise;
            this.__currentPromise = null;
        };
    }
}

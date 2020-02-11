import 'reflect-metadata'

/**
 * Represents a class with async dependent properties
 */

export class Dynamic {
	private __dynamicCurrentPromise: Promise<any> = null;

	/*
	 * Returns a promise that waits for any current promise and returns the class instace
	 */
	public async get(): Promise<this> {

		if (this.__dynamicCurrentPromise !== null && this.__dynamicCurrentPromise.constructor === Promise)
			await this.__dynamicCurrentPromise;

		return this;
	}
}

export namespace Dynamic {
	/**
	 * Decorates an async function that updates its class properties
	 */
	export function Locked(target: Dynamic, propertyName: string, descriptor: PropertyDescriptor) {

		const isDynamicInstance: boolean = target instanceof Dynamic;
		const isAsyncMethod: boolean = Reflect.getMetadata("design:returntype", target, propertyName) === Promise;

		if (isDynamicInstance === true && isAsyncMethod === true) {
			const methodBackup = <Function>descriptor.value;

			descriptor.value = async (...args: any[]) => {
				this.__dynamicCurrentPromise = methodBackup.apply(this, ...args);

				await this.__dynamicCurrentPromise;
				this.__dynamicCurrentPromise = null;
			};
		}
	}

}

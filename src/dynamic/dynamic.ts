import 'reflect-metadata'

/**
 * Describes a class that its properties depends on async functions
 */

export class Dynamic {
	private __dynamicCurrentPromise: Promise<any> = null;

	private async waitUntilLoadingIsComplete(): Promise<void> {
		if (this.__dynamicCurrentPromise !== null && this.__dynamicCurrentPromise.constructor === Promise)
			await this.__dynamicCurrentPromise;

		return;
	}

	public async get(): Promise<this> {
		await this.waitUntilLoadingIsComplete();
		return this;
	}
}

export namespace Dynamic {
	export function DynamicLock(target: Dynamic, propertyName: string, descriptor: PropertyDescriptor) {

		const isDynamicInstance: boolean = target instanceof Dynamic;
		const isAsyncMethod: boolean = Reflect.getMetadata("design:returntype", target, propertyName) === Promise;

		if (isDynamicInstance === true && isAsyncMethod === true) {
			const methodBackup = descriptor.value;

			descriptor.value = async function(...args: any[]) {
				this.__currentPromise = methodBackup.apply(this, ...args);

				await this.__currentPromise;
				this.__currentPromise = null;
			};
		}
	}

}

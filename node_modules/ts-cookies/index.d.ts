declare namespace Cookies {
    export function set(key: string, value: any): void;

    export function get(key: string): any;

    export function remove(key: string): void;

    export function getJSON(key?: string): JSON;

    export function withConverter(converter: any): void;
}

declare function Cookies(): void;

export default Cookies;

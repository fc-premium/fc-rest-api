# ts-cookies

A simple, lightweight JavaScript API for handling cookies with TypeScript.


## Installation
```
npm i ts-cookie
```

```javascript
import Cookies from "ts-cookies";
```
## Basic Usage

Create a cookie, valid across the entire site:

```javascript
Cookies.set('name', 'value');
```

Create a cookie that expires 7 days from now, valid across the entire site:

```javascript
Cookies.set('name', 'value', { expires: 7 });
```

Create an expiring cookie, valid to the path of the current page:

```javascript
Cookies.set('name', 'value', { expires: 7, path: '' });
```

Read cookie:

```javascript
Cookies.get('name'); // => 'value'
Cookies.get('nothing'); // => undefined
```

Read all visible cookies:

```javascript
Cookies.get(); // => { name: 'value' }
```

Delete cookie:

```javascript
Cookies.remove('name');
```

Delete a cookie valid to the path of the current page:

```javascript
Cookies.set('name', 'value', { path: '' });
Cookies.remove('name'); // fail!
Cookies.remove('name', { path: '' }); // removed!
```

*IMPORTANT! when deleting a cookie, you must pass the exact same path and domain attributes that was used to set the cookie, unless you're relying on the [default attributes](#cookie-attributes).*

*Note: Removing unexisting cookie does not raise any exception nor return any value*


More information at the [js-cookie](https://github.com/js-cookie/js-cookie) ➞






# Typed Request
The type definition for [`request`](https://github.com/request/request)

## LICENSE
MIT

## Usage

`typed-request` exposes both the the signature of the `request` function,
as well as various interfaces. You can access them from the `request`
namespace:

````typescript
import * as request from "request";

// Access the interfaces:
let cookieJar: request.CookieJar;
let requestOptions: request.Options;
// ...

let callback: request.RequestCallback;

````

## Contributing

```sh
# Fork this repo
npm install

npm run watch

# add tests, make changes, pass tests ... then [ctrl+c]
npm run publish
```

## Updating
Update `typings.json/version` to match the source version you are typing against.
e.g. if you are creating typings for `chai@3.5.0`, then:
```js
// typings.json
{
  "version": "3.5.0"
  // ...
}
```

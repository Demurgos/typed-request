import {Cookie, Store, SetCookieOptions} from 'tough-cookie';

export function parse(str: string | {uri: string}): Cookie;

/**
 * Cookies
 */
// Request wraps the `tough-cookies`'s CookieJar in a synchronous RequestJar
// https://github.com/request/request/blob/master/lib/cookies.js
export interface RequestJar {
  // In reality, this a class with a private constructor:
  // constructor (store: Store);

  // RequestJar.prototype.setCookie = function(cookieOrStr, uri, options) {
  //   var self = this
  //   return self._jar.setCookieSync(cookieOrStr, uri, options || {})
  // }
  setCookie(cookieOrStr: Cookie | string, uri: string, options?: SetCookieOptions): Cookie;

  // RequestJar.prototype.getCookieString = function(uri) {
  //   var self = this
  //   return self._jar.getCookieStringSync(uri)
  // }
  getCookieString(uri: string): string;

  // RequestJar.prototype.getCookies = function(uri) {
  //   var self = this
  //   return self._jar.getCookiesSync(uri)
  // }
  getCookies(uri: string): Cookie[];
}

export function jar(store: Store): RequestJar;

export {Cookie, Store, SetCookieOptions} from 'tough-cookie';

import {Stream} from 'stream';
import {Agent, ClientRequest, IncomingMessage} from 'http';
import * as FormData from 'form-data';
import * as toughCookie from 'tough-cookie';

declare var request: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;

declare namespace request {
  export interface RequestAPI<TRequest extends Request,
    TOptions extends CoreOptions,
    TUriUrlOptions> {

    (uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    (uri: string, callback?: RequestCallback): TRequest;
    (options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    // -------------------
    // Convenience methods
    // -------------------

    /**
     * This method returns a wrapper around the normal request API that defaults to whatever options you pass to it.
     *
     * Note: `request.defaults()` does not modify the global request API; instead, it returns a wrapper that has your
     *   default settings applied to it.
     *
     * Note: You can call `.defaults()` on the wrapper that is returned from request.defaults to add/override defaults
     *   that were previously defaulted.
     *
     * For example:
     * ```js
     * //requests using baseRequest() will set the 'x-token' header
     * var baseRequest = request.defaults({
     *   headers: {'x-token': 'my-token'}
     * })
     *
     * //requests using specialRequest() will include the 'x-token' header set in
     * //baseRequest and will also include the 'special' header
     * var specialRequest = baseRequest.defaults({
     *   headers: {special: 'special value'}
     * })
     * ```
     */
    defaults(options: TOptions): RequestAPI<TRequest, TOptions, RequiredUriUrl>;
    defaults(options: RequiredUriUrl & TOptions): DefaultUriUrlRequestApi<TRequest, TOptions, OptionalUriUrl>;

    /**
     * Same as `request()`, but defaults to method: "PUT".
     */
    put(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    put(uri: string, callback?: RequestCallback): TRequest;
    put(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    /**
     * Same as `request()`, but defaults to method: "PATCH".
     */
    patch(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    patch(uri: string, callback?: RequestCallback): TRequest;
    patch(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    /**
     * Same as request(), but defaults to method: "POST".
     */
    post(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    post(uri: string, callback?: RequestCallback): TRequest;
    post(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    /**
     * Same as request(), but defaults to method: "HEAD".
     */
    head(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    head(uri: string, callback?: RequestCallback): TRequest;
    head(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    /**
     * Same as request(), but defaults to method: "DELETE".
     */
    del(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    del(uri: string, callback?: RequestCallback): TRequest;
    del(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;
    delete(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    delete(uri: string, callback?: RequestCallback): TRequest;
    delete(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    /**
     * Same as request() (for uniformity).
     */
    get(uri: string, options?: TOptions, callback?: RequestCallback): TRequest;
    get(uri: string, callback?: RequestCallback): TRequest;
    get(options: TUriUrlOptions & TOptions, callback?: RequestCallback): TRequest;

    /**
     * Function that creates a new cookie.
     */
    cookie(str: string): Cookie;

    /**
     * Function that creates a new cookie jar.
     */
    jar(): CookieJar;

    forever(agentOptions: any, optionsArg: any): TRequest;

    initParams: any;
    /**
     * Set `require('request').debug = true` at any time to debug.
     */
    debug: boolean;
  }

  interface DefaultUriUrlRequestApi<TRequest extends Request,
    TOptions extends CoreOptions,
    TUriUrlOptions>	extends RequestAPI<TRequest, TOptions, TUriUrlOptions> {

    defaults(options: TOptions): DefaultUriUrlRequestApi<TRequest, TOptions, OptionalUriUrl>;
    defaults(options: RequiredUriUrl & TOptions): DefaultUriUrlRequestApi<TRequest, TOptions, OptionalUriUrl>;
    (): TRequest;
    get(): TRequest;
    post(): TRequest;
    put(): TRequest;
    head(): TRequest;
    patch(): TRequest;
    del(): TRequest;
  }

  interface CoreOptions {
    /**
     * fully qualified uri string used as the base url. Most useful with request.defaults,
     *   for example when you want to do many requests to the same domain. If baseUrl is
     *   https://example.com/api/, then requesting /end/point?test=true will fetch
     *   https://example.com/api/end/point?test=true. When baseUrl is given, uri must also
     *   be a string.
     */
    baseUrl?: string;
    /**
     * alternatively pass the request's callback in the options object
     */
    callback?: (error: any, response: IncomingMessage, body: any) => void;
    jar?: boolean | CookieJar;
    /**
     * Data to pass for a multipart/form-data request.
     */
    formData?: any; // Object
    /**
     * when passed an object or a querystring, this sets body to a querystring representation of
     *   value, and adds Content-type: application/x-www-form-urlencoded header. When passed no
     *   options, a FormData instance is returned (and is piped to request).
     */
    form?: any; // Object or string
    /**
     * A hash containing values user || username, pass || password, and sendImmediately (optional).
     */
    auth?: AuthOptions;
    /**
     * Options for OAuth HMAC-SHA1 signing.
     */
    oauth?: OAuthOptions;
    /**
     * object containing AWS signing information. Should have the properties key, secret.
     * Also requires the property bucket, unless you’re specifying your bucket as part of the path,
     *   or the request doesn’t use a bucket (i.e. GET Services). If you want to use AWS sign
     *   version 4 use the parameter sign_version with value 4 otherwise the default is version 2.
     * Note: you need to npm install aws4 first.
     */
    aws?: AWSOptions;
    /**
     * Options for Hawk signing. The credentials key must contain the necessary signing info,
     *   see hawk docs for details.
     */
    hawk?: HawkOptions;
    /**
     * object containing querystring values to be appended to the uri
     */
    qs?: any;
    /**
     * sets body to JSON representation of value and adds Content-type: application/json header.
     * Additionally, parses the response body as JSON.
     */
    json?: boolean;
    /**
     * array of objects which contain their own headers and body attributes.
     *   Sends a multipart/related request.
     * Alternatively you can pass in an object `{chunked: false, data: []}` where chunked is
     *   used to specify whether the request is sent in chunked transfer encoding In non-chunked
     *   requests, data items with body streams are not allowed.
     */
    multipart?: RequestPart[] | Multipart;
    /**
     * `http(s).Agent` instance to use
     */
    agent?: any;
    /**
     * alternatively specify your agent's class name
     */
    agentOptions?: any;
    /**
     * and pass its options.
     */
    agentClass?: any;
    /**
     * set to true to use the [forever-agent]
     * Note: Defaults to `http(s).Agent({keepAlive:true})` in node 0.12+
     */
    forever?: any;
    host?: string;
    port?: number;
    method?: string;
    headers?: Headers;
    /**
     * entity body for PATCH, POST and PUT requests. Must be a Buffer, String or ReadStream.
     * If json is true, then body must be a JSON-serializable object.
     */
    body?: any;
    followRedirect?: boolean | ((response: IncomingMessage) => boolean);
    followAllRedirects?: boolean;
    maxRedirects?: number;
    encoding?: string;
    pool?: any;
    /**
     * Integer containing the number of milliseconds to wait for a server to send response headers
     *   (and start the response body) before aborting the request. Note that if the underlying TCP
     *   connection cannot be established, the OS-wide TCP connection timeout will overrule the
     *   timeout option (the default in Linux can be anywhere from 20-120 seconds).
     */
    timeout?: number;
    proxy?: any;
    strictSSL?: boolean;
    gzip?: boolean;
    /**
     * append a newline/CRLF before the boundary of your multipart/form-data request.
     */
    preambleCRLF?: boolean;
    /**
     * append a newline/CRLF at the end of the boundary of your multipart/form-data request.
     */
    postambleCRLF?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    ca?: Buffer;
    /**
     * A HAR 1.2 Request Object, will be processed from HAR format into options overwriting matching
     *   values
     */
    har?: HttpArchiveRequest;
    useQuerystring?: boolean;

    /**
     * a reviver function that will be passed to JSON.parse() when parsing a JSON response body.
     */
    jsonReviver?: Function;
    /**
     * a replacer function that will be passed to JSON.stringify() when stringifying a JSON request body.
     */
    jsonReplacer?: Function;
  }

  interface UriOptions {
    uri: string;
  }
  interface UrlOptions {
    url: string;
  }
  export type RequiredUriUrl = UriOptions | UrlOptions;

  interface OptionalUriUrl {
    uri?: string;
    url?: string;
  }

  export type OptionsWithUri = UriOptions & CoreOptions;
  export type OptionsWithUrl = UrlOptions & CoreOptions;
  export type Options = OptionsWithUri | OptionsWithUrl;

  export interface RequestCallback {
    /**
     * @param error An error when applicable (usually from `http.ClientRequest` object)
     * @param response An `http.IncomingMessage` object
     * @param body The third is the response body (String or Buffer, or JSON object if the json option is supplied)
     */
    (error: any, response: IncomingMessage, body: any): void;
  }

  export interface HttpArchiveRequest {
    url?: string;
    method?: string;
    headers?: NameValuePair[];
    postData?: {
      mimeType?: string;
      params?: NameValuePair[];
    };
  }

  export interface NameValuePair {
    name: string;
    value: string;
  }

  export interface Multipart {
    chunked?: boolean;
    data?: {
      'content-type'?: string,
      body: string
    }[];
  }

  export interface RequestPart {
    headers?: Headers;
    body: any;
  }

  export interface Request extends Stream {
    readable: boolean;
    writable: boolean;

    getAgent(): Agent;
    // start(): void;
    // abort(): void;
    pipeDest(dest: any): void;
    setHeader(name: string, value: string, clobber?: boolean): Request;
    setHeaders(headers: Headers): Request;
    qs(q: Object, clobber?: boolean): Request;
    form(): FormData;
    form(form: any): Request;
    multipart(multipart: RequestPart[]): Request;
    json(val: any): Request;
    aws(opts: AWSOptions, now?: boolean): Request;
    auth(username: string, password: string, sendInmediately?: boolean, bearer?: string): Request;
    oauth(oauth: OAuthOptions): Request;
    jar(jar: CookieJar): Request;

    on(event: string, listener: Function): this;
    on(event: 'request', listener: (req: ClientRequest) => void): this;
    on(event: 'response', listener: (resp: IncomingMessage) => void): this;
    on(event: 'data', listener: (data: Buffer | string) => void): this;
    on(event: 'error', listener: (e: Error) => void): this;
    on(event: 'complete', listener: (resp: IncomingMessage, body?: string | Buffer) => void): this;

    write(buffer: Buffer, cb?: Function): boolean;
    write(str: string, cb?: Function): boolean;
    write(str: string, encoding: string, cb?: Function): boolean;
    write(str: string, encoding?: string, fd?: string): boolean;
    end(): void;
    end(chunk: Buffer, cb?: Function): void;
    end(chunk: string, cb?: Function): void;
    end(chunk: string, encoding: string, cb?: Function): void;
    pause(): void;
    resume(): void;
    abort(): void;
    destroy(): void;
    toJSON(): Object;
  }

  export interface Headers {
    [key: string]: any;
  }

  export interface AuthOptions {
    user?: string;
    username?: string;
    pass?: string;
    password?: string;
    sendImmediately?: boolean;
    bearer?: string;
  }

  export interface OAuthOptions {
    callback?: string;
    consumer_key?: string;
    consumer_secret?: string;
    token?: string;
    token_secret?: string;
    verifier?: string;
  }

  export interface HawkOptions {
    credentials: any;
  }

  export interface AWSOptions {
    secret: string;
    bucket?: string;
  }

  /**
   * Cookies
   */
  // Request wraps the `tough-cookies`'s CookieJar in a synchronous RequestJar
  // https://github.com/request/request/blob/master/lib/cookies.js
  export type Cookie = toughCookie.Cookie;
  export type CookieStore = toughCookie.Store;
  export type SetCookieOptions = toughCookie.SetCookieOptions;

  export interface CookieJar {
    // RequestJar.prototype.setCookie = function(cookieOrStr, uri, options) {
    //   var self = this
    //   return self._jar.setCookieSync(cookieOrStr, uri, options || {})
    // }
    setCookie(cookieOrString: Cookie | string, uri: string, options?: SetCookieOptions): Cookie;

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
}

export = request;

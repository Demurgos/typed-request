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
    baseUrl?: string;
    callback?: (error: any, response: IncomingMessage, body: any) => void;
    jar?: boolean | CookieJar;
    formData?: any; // Object
    form?: any; // Object or string
    auth?: AuthOptions;
    oauth?: OAuthOptions;
    aws?: AWSOptions;
    hawk?: HawkOptions;
    qs?: any;
    json?: any;
    multipart?: RequestPart[] | Multipart;
    agentOptions?: any;
    agentClass?: any;
    forever?: any;
    host?: string;
    port?: number;
    method?: string;
    headers?: Headers;
    body?: any;
    followRedirect?: boolean | ((response: IncomingMessage) => boolean);
    followAllRedirects?: boolean;
    maxRedirects?: number;
    encoding?: string;
    pool?: any;
    timeout?: number;
    proxy?: any;
    strictSSL?: boolean;
    gzip?: boolean;
    preambleCRLF?: boolean;
    postambleCRLF?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    ca?: Buffer;
    har?: HttpArchiveRequest;
    useQuerystring?: boolean;
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

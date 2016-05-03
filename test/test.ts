import * as test from 'blue-tape';
import * as Bluebird from "bluebird";

import * as request from 'request';

test('request-general', (t) => {
  t.plan(1);
  t.equal(typeof request, 'function');
});


test('request-get', (t) => {
  const URL = "https://api.typings.org/entries/npm/request";

  let options: request.CoreOptions & request.UriOptions = {
    headers: {},
    timeout: 60000,
    qs: {},
    uri: URL,
    method: "GET",
    jar: null,
    gzip: true
  };

  return Bluebird.fromCallback((cb) => {
    request(options, (error, response, body) => {
      if (error) {
        return cb(error);
      }
      t.equal(typeof response.statusCode, "number");
      return cb(null, null);
    });
  });
});

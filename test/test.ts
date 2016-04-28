import * as test from 'blue-tape';

import * as request from 'request';

test('request', (t) => {
  t.plan(1);
  t.equal(typeof request, 'function');
});

/* eslint-disable jest/no-test-callback */
/* eslint-disable jest/expect-expect */
import { ClientFunction } from 'testcafe';

// from https://stackoverflow.com/a/60218517
const fetchRequestClientFunction = ClientFunction(
  (details, endpoint, method) => {
    return window
      .fetch(endpoint, {
        method,
        headers: new Headers({
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      })
      .then(httpResponse => {
        if (httpResponse.ok) {
          return httpResponse.json();
        }
        return {
          err: true,
          errorMessage: 'There was an error trying to send the data'
        };
      });
  }
);

const createFetchRequest = async (t, details, endpoint, method = 'POST') => {
  const apiResponse = await fetchRequestClientFunction(
    details,
    endpoint,
    method
  );
  await t.expect(apiResponse.err).eql(undefined, apiResponse.errorMessage);
  return apiResponse;
};

/*
 * To run fixture tests for https://github.com/DevExpress/testcafe-hammerhead/issues/2258
 * 1. Download/install Mockoon from https://mockoon.com/#download
 * 2. Run `C:\Users\{user}\AppData\Local\Programs\mockoon\Mockoon.exe`
 * 3. Click play button for "Demo users API" on http://localhost:3000
 * 4. Run `yarn build-e2e`
 * 5. Run `yarn test-issue2258` to run tests
 */
fixture`Reproduce window.fetch error on localhost servers (https://github.com/DevExpress/testcafe-hammerhead/issues/2258)`.page(
  '../../app/app.html'
);

test('window.fetch should POST (localhost) without Unexpected end of JSON input', async t => {
  const postedLocalhostResponse = await createFetchRequest(
    t,
    {},
    'http://127.0.0.1:3000/users',
    'POST'
  );
  console.log({ postedLocalhostResponse });
});

test('window.fetch should GET (localhost) without Unexpected end of JSON input', async t => {
  const gotLocalhostResponse = await createFetchRequest(
    t,
    {},
    'http://127.0.0.1:3000/users/1',
    'GET'
  );
  console.log({ gotLocalhostResponse });
});

// This test passes when interacting with non-localhost api
test('window.fetch should POST (remote) without Unexpected end of JSON input', async t => {
  const postedRemoteResponse = await createFetchRequest(
    t,
    {},
    'http://5e5d3b0e97d2ea0014797323.mockapi.io/crud',
    'POST'
  );
  console.log({ postedRemoteResponse });
});

// This test passes when interacting with non-localhost api
test('window.fetch should GET (remote) without Unexpected end of JSON input', async t => {
  const gotRemoteResponse = await createFetchRequest(
    t,
    {},
    'http://5e5d3b0e97d2ea0014797323.mockapi.io/crud',
    'GET'
  );
  console.log({ gotRemoteResponse });
});

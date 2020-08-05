## express-requid

An Express.js middleware to generate unique id for incoming requests. The generated id will have a prefix and a sequence number.

In case a request has the request id header header valued, then the middleware will use it.

Promise is required in order to 'promisify' crypto functionalities.

```js
Promise = require('bluebird');
const express = require('express');
const requid = require('./lib/express-requid');

const app = express();

app.use(requid());

app.get('/', function (req, res, next) {
    res.json({
        requestId: req.rid
    });
});

const server =
    app.listen(3000, '0.0.0.0')
        .on('listening', () => {
            console.log(`server listening on ${server.address().address}:${server.address().port}`);
        })
        .on('error', (err) => {
            console.error(err);
            process.exit(1);
        });
```

To test the sample:
```bash
$ curl -i localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Express
request-id: redrock/4f1704658fdd4d797c833563-0000000000000001

$ curl -i localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Express
request-id: redrock/4f1704658fdd4d797c833563-0000000000000002

...
...
$ curl -i localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Express
request-id: redrock/4f1704658fdd4d797c833563-0000000000002491
```

When the sequence id reach the max (default is Number.MAX_DAFE_INTEGER = 9007199254740991 on a 64bit machine), the unique part of the prefix will be regenerated and the sequence restart from 0 (so the first id will be ...00001).
```bash
$ curl -i localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Express
request-id: redrock/4f1704658fdd4d797c833563-9007199254740991

$ curl -i localhost:3000
HTTP/1.1 200 OK
X-Powered-By: Express
request-id: redrock/dafbb8dd5eb2193ee436e8b4-0000000000000001

```
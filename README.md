## express-requid

An Express.js middleware to generate unique id for incoming requests. The generated id will have a prefix and a sequence number.

In case a request has the _request-id_ header valued, then the middleware will use it (header name can be configured).

#### Install
```bash
npm install express-requid
```
#### Request id format
The request id will be composed of the three parts. The first two will form the _prefix_ while the third will be the _sequence id_ part:
* prefix
    * machine hostname
    * unique part (generated)
* sequence id (number)

Theese parts will be composed in the form of _hostname_**/**_unique_part_**-**_sequenceid_

As an example, a reuest id might be something like this: _**redrock/4f1704658fdd4d797c833563-0000000000000001**_.

The prefix separator "/" and the sequence id separator "-" can be configured.

#### Sample usage
```js
const express = require('express');
const requid = require('express-requid');

const app = express();

app.use(requid());

app.get('/', function (req, res, next) {
    return res.sendStatus(200);
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

#### Max id and unique part regeneration
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
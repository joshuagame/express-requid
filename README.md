## express-requid

An Express.js middleware to generate unique id for incoming requests. The generated id will have a prefix and a sequence number.

In case a request has the request id header header valued, then the middleware will use it.

```js
const express = require('express');
const requid = require('express-requid');

app.use(requid());

app.get('/', function(req, res, next) {
    res.json({
        requestId: req.rid
    });
});

app.listen(3000, () => {
    console.log(`server listening on ${server.address().address}:${server.addredd().port}`);
});
```

To test the sample:
```bash
$ curl localhost:3000
{"requestId":"redrock/8aa8fcf4a0af9d153f1f0772-0000000000000001"}
```
Promise = require('bluebird');
const express = require('express');
const requid = require('../lib/express-requid');

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
/*!
 * express-requid
 * Express.js request id middleware
 *
 * Copyright(c) 2020 Luca Stasio <joshuagame@gmail.com>
 *
 * Use of this source code is governed by a MIT license.
 * You can find the MIT license term for this source code
 * in the LICENSE file.
 *
 * index.js
 */

// module.exports = require('./lib/express-requid');
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
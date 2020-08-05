/*!
 * express-requid
 *
 * Copyright(c) 2020 The express-requid authors.
 * Use of this source code is governed by a MIT license.
 * You can find the MIT license term for this source code
 * in the LICENSE file.
 *
 * test/express-requid.test.js
 *
 * Authors:
 *   Luca Stasio <joshuagame@gmail.com>
 */

Promise = require('bluebird');
const requid = require('../lib/express-requid');
const supertest = require('supertest');
const express = require('express');
const os = require('os');

describe('Request ID in requests', function () {

    it('should have "rid" as request attribute', async function (done) {
        const app = express();
        app.use(requid());
        app.get('/', function (req, res) {
            expect(req).exists;
            expect(req).toHaveProperty('rid');
            res.send('it works');
        });

        await supertest(app).get('/').expect(200);

        done();
    });

    it('should have rid with prefix === hostname', async function (done) {
        const app = express();
        app.use(requid());
        app.get('/', function (req, res) {
            expect(req).exists;
            expect(req.rid).toMatch(new RegExp(os.hostname(), 'gi'));
            res.send('it works');
        });

        await supertest(app).get('/').expect(200);

        done();
    });

    it('should have rid ending with "000001"', async function (done) {
        const app = express();
        app.use(requid());
        app.get('/', function (req, res) {
            expect(req).exists;
            // this is the third test request, so the rid must end with ..000..003
            expect(req.rid).toMatch(/.*00001.?$/i);
            res.send('it works');
        });

        await supertest(app).get('/').expect(200);

        done();
    });

    it('should have rid with default separators', async function (done) {
        const app = express();
        app.use(requid());
        app.get('/', function (req, res) {
            expect(req).exists;
            expect(req.rid).toMatch(/.*\/.*-.*?$/i);
            res.send('it works');
        });

        await supertest(app).get('/').expect(200);

        done();
    });

    it('should have rid with "#" as prefix separator and "@" as sequence separator', async function (done) {
        const app = express();
        app.use(requid({ prefixSeparator: '#', idSeparator: '@' }));
        app.get('/', function (req, res) {
            expect(req).exists;
            expect(req.rid).toMatch(/.*#.*@.*?$/i);
            res.send('it works');
        });

        await supertest(app).get('/').expect(200);

        done();
    });

    it('should have response "request-id" header', async function (done) {
        const app = express();
        app.use(requid());
        app.get('/', function (req, res) {
            res.send('it works');
        });

        const res = await supertest(app).get('/').expect(200);
        expect(res.header).toHaveProperty('request-id');

        done();
    });

    it('should have custom response header "X-Request-Id"', async function (done) {
        const app = express();
        app.use(requid({ header: 'X-Request-Id' }));
        app.get('/', function (req, res) {
            res.send('it works');
        });

        const res = await supertest(app).get('/');
        expect(res.header).toHaveProperty('x-request-id');

        done();
    });
});
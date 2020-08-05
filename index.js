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

module.exports = {
    requidAsync: require('./lib/express-requidAsync'),
    requid: require('./lib/express-requid')
}

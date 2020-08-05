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
 * lib/express-requid.js
 */

const Promise = require('bluebird');
const crypto = Promise.promisifyAll(require('crypto'));

module.exports = ({
    setHeader = true,
    header = 'request-id',
    attribute = 'rid',
    prefixSeparator = '/',
    prefixBytes = 12,
    idSeparator = '-',
    idMax = Number.MAX_SAFE_INTEGER,
} = {}) => {
    const rp = { seqId: 0, prefixUnique: '', idPadLen: idMax.toString().length };

    return (req, res, next) => {
        Promise.resolve((async (req, res, next) => {
            // best case: we have the request id as request header, so use it.
            const ridFromReq = req.headers[header.toLowerCase()];
            if (ridFromReq) {
                req[attribute] = ridFromReq;
                setHeader && res.setHeader(header, req[attribute]);
                return next();
            }

            // worst case: no rid from request, so generate it

            // reset prefix unique part if we reach the max (super-worst case!!!)
            if (rp.seqId === idMax || rp.seqId === 0) {
                rp.seqId = 0;
                const buf = await crypto.randomBytesAsync(prefixBytes);
                rp.prefixUnique = buf.toString('hex');
            }
            rp.seqId = rp.seqId + 1;

            const id = rp.seqId.toString().padStart(rp.idPadLen, '0');
            req[attribute] = `${require('os').hostname()}${prefixSeparator}${rp.prefixUnique}${idSeparator}${id}`;
            setHeader && res.setHeader(header, req[attribute]);

            return next();

        })(req, res, next)).catch(next);
    }

}
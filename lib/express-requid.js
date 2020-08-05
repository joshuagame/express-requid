/*!
 * express-requid
 * Express.js request id middleware
 *
 * Copyright(c) 2020 Luca Stasio <joshuagame@gmail.com>
 *
 * Use of this source code is governed by a MIT license.
 * You can find the MIT license terms for this source code
 * in the LICENSE file.
 *
 * lib/express-requid.js
 */

const crypto = require('crypto');
const hostname = require('os').hostname();

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

    const generateId = () => {
        // reset prefix unique part if we reach the max (super-worst case!!!)
        if (rp.seqId === idMax || rp.seqId === 0) {
            rp.seqId = 0;
            const buf = crypto.randomBytes(prefixBytes);
            rp.prefixUnique = buf.toString('hex');
        }
        rp.seqId = rp.seqId + 1;
        const id = rp.seqId.toString().padStart(rp.idPadLen, '0');
        return `${hostname}${prefixSeparator}${rp.prefixUnique}${idSeparator}${id}`;
    }

    return (req, res, next) => {
        req[attribute] = req.headers[header.toLowerCase()] || generateId();
        setHeader && res.setHeader(header, req[attribute]);
        next();
    }
}
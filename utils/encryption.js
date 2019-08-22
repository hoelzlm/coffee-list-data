const crypto = require('crypto')

class Encryption {

    /**
     * Encrypt a given password and return salt and hash
     * @param {string} password
     */
    static encryptPasswort(password) {
        var salt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return { "salt": salt, "hash": hash };
    }

    /**
     * validate a password to hash
     * @param {string} password 
     * @param {string} salt 
     * @param {string} hash 
     */
    static validatePasswort(password, salt, hash) {
        var test_hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === test_hash;
    }
}

module.exports = Encryption;
const { HTTP_CODES } = require('../../config');

class NoContentException extends Error {
    constructor(message, err = null) {
        super(message);
        this.type = 'No Content';
        this.statusCode = HTTP_CODES.NO_CONTENT;
        this.err = err;
    }
}

module.exports = NoContentException;

const schema = require('./schema/schema');
const qh = require('./query-helper');

class Dal {

    constructor(opts) {
        if (opts.db == null) throw new Error('Parameter `db` missing!');
        if (opts.log == null) throw new Error('Parameter `log` missing!');

        let self = this;

        self._db = opts.db;
        self._log = opts.log;
    }

    init(callback) {
        let self = this;
        let log = self._log;

        log.info('initializing storage');

        callback();
    }

    storeEvent(opts, callback) {

    }
}

exports.Dal = Dal;

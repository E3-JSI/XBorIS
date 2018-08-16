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

    storeEvents(events, callback) {
        let self = this;
        let log = self._log;

        let queries = [];

        for (let event of events) {
            if (log.debug()) {
                log.debug('storing event with options %s', JSON.stringify(event));
            }

            let query = schema.events.insert(event);
            queries.push(query);
        }

        self._db.executeBatch(queries, callback);
    }

    getEventsPublic(opts, callback) {
        let self = this;
        let log = self._log;

        if (log.debug()) {
            log.debug('fetching events with options %s', JSON.stringify(opts));
        }

        let query = schema.eventsPublic.select(
            schema.eventsPublic.star());

        query = qh.applyOptions(query, schema.eventsPublic, opts);

        self._db.query(query, callback);
    }
}

exports.Dal = Dal;

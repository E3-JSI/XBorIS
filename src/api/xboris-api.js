
class XBorISApi {

    constructor(opts) {
        let self = this;

        if (opts.api == null) { throw new Error('Parameter `api` missing!'); }
        if (opts.storage == null) { throw new Error('Parameter `storage` missing!'); }
        if (opts.log == null) { throw new Error('Parameter `log` missing!'); }

        self._api = opts.api;
        self._storage = opts.storage;
        self._log = opts.log;
    }

    init(callback) {
        let self = this;
        let log = self._log;

        log.info('initializing XBorISApi');

        let api = self._api;
        api.initApi('events');

        api.on('events', 'getEvents', function (session, opts, callback) {
            self._getEvents(opts, callback);
        })

        callback();
    }

    _getEvents(opts, callback) {
        let self = this;
        let log = self._log;

        let storage = self._storage;

        if (log.debug()) {
            log.debug('fetching events with opts `%s`', JSON.stringify(opts));
        }

        storage.getEventsPublic(opts, callback);
    }
}

exports.XBorISApi = XBorISApi;

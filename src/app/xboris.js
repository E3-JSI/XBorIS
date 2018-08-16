
class XBorIS {

    constructor(opts) {
        let self = this;

        if (opts.adapters == null) { throw new Error('Parameter `adapters` missing!'); }
        if (opts.storage == null) { throw new Error('Parameter `storage` missing!'); }
        if (opts.log == null) { throw new Error('Parameter `log` missing!'); }

        self._adapters = opts.adapters;
        self._storage = opts.storage;
        self._log = opts.log;
    }

    init(callback) {
        let self = this;
        let log = self._log;

        log.info('initializign XBorIS');

        let adapters = self._adapters;

        log.debug('registering callbacks with adapters');
        for (let adapter of adapters) {
            adapter.register(function (events, callback) {
                self._processMessages(events, callback);
            })
        }

        callback();
    }

    _processMessages(events, callback) {
        let self = this;
        let log = self._log;

        let storage = self._storage;

        if (log.debug()) {
            log.debug('received %d events', events.length);
        }

        storage.storeEvents(events, function (e) {
            if (e != null) return callback(e);
            callback();
        });
    }
}

exports.XBorIS = XBorIS;

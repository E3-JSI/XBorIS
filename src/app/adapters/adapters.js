let async = require('async');

class HttpPostAdapter {

    constructor(opts) {
        let self = this;

        if (opts.server == null) { throw new Error("Parameter `server` missing!"); }
        if (opts.log == null) { throw new Error("Parameter `log` missing!"); }

        self._msgCallbacks = [];

        self._server = opts.server;
        self._log = opts.log;
    }

    init(callback) {
        let self = this;
        let log = self._log;

        log.info('initializing HttpPostAdapter');

        let server = self._server;

        server.initApi('events');

        server.on('events', 'push', function (session, events, callback) {
            try {
                let tasks = self._msgCallbacks.map(pushFunc => function (xcb) {
                    try {
                        pushFunc(events, xcb);
                    } catch (e) {
                        xcb(e);
                    }
                })
                async.parallel(tasks, function (e) {
                    if (e != null) return callback(e);
                    callback();
                });
            } catch (e) {
                callback(e);
            }
        })

        callback();
    }

    register(callback) {
        let self = this;
        let log = self._log;

        log.info('HttpPostAdapter registering message callback');

        self._msgCallbacks.push(callback);
    }
}

exports.HttpPostAdapter = HttpPostAdapter;

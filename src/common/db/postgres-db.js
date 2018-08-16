let async = require('async');
let Pool = require('pg').Pool;
let format = require('pg-promise').as;

let sql = require('sql');

sql.setDialect('postgres');

class PostgresDb {

    constructor(opts) {
        let self = this;

        if (opts.log == null) throw new Error('Parameter `log` missing!');

        self._opts = opts.settings;
        self._log = opts.log;

        self._pool = null;
    }

    init(callback) {
        let self = this;

        let opts = self._opts;
        let log = self._log;

        log.info('initializing Postres database');

        self._pool = new Pool({
            user: opts.user,
            host: opts.host,
            database: opts.database,
            password: opts.password
        })
        callback();
    }

    shutdown(callback) {
        let self = this;

        let tasks = [
            async.reflect(function flushBuffers(xcb) {
                self._queryBuffer.flushAll(xcb);
            }),
            async.reflect(function shutdownPool(xcb) {
                self._pool.end(xcb);
            })
        ]
        async.series(tasks, callback);
    }

    get queryHelper() { return sql; }

    query(sql, callback) {
        try {
            let self = this;
            let log = self._log;

            // if (typeof sql != 'string') { sql = sql.toQuery(); }
            sql = self._preprocessQuery(sql);

            if (log.trace())
                log.trace('executing sql:\n%s', JSON.stringify(sql));

            self._pool.query(sql, function (e, res) {
                if (e != null) { return callback(e); }
                let rows = res.rows;

                if (log.trace()) {
                    if (rows != null) {
                        if (res.rows.length == 0) {
                            log.trace('query result: %s', JSON.stringify(res));
                        } else {
                            log.trace('found %d rows', res.rows.length);
                        }
                    } else
                        log.trace('query executed!');
                }

                callback(undefined, rows);
            });
        } catch (e) {
            callback(e);
        }
    }

    executeBatch(queries, callback) {
        let self = this;
        let log = self._log;

        try {
            let formatted = queries.map(query => {
                let q = query.toQuery();
                if (log.trace())
                    log.trace('executing in batch `%s` with parameters `%s`', q.text, JSON.stringify(q.values));
                return format.format(q.text, q.values);
            })
            let singleQuery = formatted.join(';');
            self._pool.query(singleQuery, callback);
        } catch (e) {
            callback(e);
        }
    }

    _preprocessQuery(sql) {
        // console.log('preprocessing: ' + JSON.stringify(sql));
        if (typeof sql === 'string' || sql.text !== undefined) {
            return sql;
        } else {
            return sql.toQuery();
        }
    }
}

exports.Database = PostgresDb;

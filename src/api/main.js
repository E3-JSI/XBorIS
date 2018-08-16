const async = require('async');

const srv = require('../common/server/server');
const app = require('./xboris-api');
const db = require('../common/db/postgres-db');
const dal = require('../common/db/dal');

const args = require('../common/arguments');
const log = require('../common/logger');

const settings = args.settings;

//==================================
// STORAGE
//==================================

let database = new db.Database({
    settings: settings.database,
    log: log
})
let storage = new dal.Dal({
    db: database,
    log: log
})

//==================================
// SERVER
//==================================

let server = new srv.StaticAndApiServer({
    settings: settings.api.server,
    log: log
});

//==================================
// APP
//==================================

let xborisApi = new app.XBorISApi({
    settings: settings.api,
    api: server,
    storage: storage,
    log: log
})

//==================================
// INITIALIZATION
//==================================

log.info('initializing');

let tasks = [
    function (xcb) {
        database.init(xcb);
    },
    function (xcb) {
        storage.init(xcb);
    },
    function (xcb) {
        xborisApi.init(xcb);
    },
    function (xcb) {
        server.init(xcb);
    }
]
async.series(tasks, function (e) {
    if (e != null) {
        log.fatal(e, 'Failed to initialize XBorIS! Terminating!');
        process.exit(1);
    }

    log.info('API server initialized!');
})

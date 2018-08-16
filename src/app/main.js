const async = require('async');

const srv = require('../common/server/server');
const db = require('../common/db/postgres-db');
const dal = require('../common/db/dal');
const modAdapters = require('./adapters/adapters');
const app = require('./xboris');

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
// ADAPTERS
//==================================

let server = new srv.ApiServer({
    settings: settings.app.server,
    log: log
});

let adapters = [
    new modAdapters.HttpPostAdapter({
        server: server,
        log: log
    })
]

//==================================
// APP
//==================================

let xboris = new app.XBorIS({
    settings: settings.app,
    adapters: adapters,
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
        xboris.init(xcb);
    },
    function (xcb) {
        let adapterTasks = adapters.map(adapter => function (xcb) {
            adapter.init(xcb);
        })
        async.series(adapterTasks, xcb);
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

    log.info('initialized!');
})

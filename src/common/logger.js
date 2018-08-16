let bunyan = require('bunyan');
let args = require('./arguments');

function extractLogLevel(args) {
    if (args.v != null) {
        return 'trace';
    } else if (args.log != null) {
        return args.log;
    } else {
        return 'info';
    }
}

// function equipLogFunction(fn) {
//     if (args.w != null) {
//         let workerN = args.w;
//         return function () {
//             if (arguments.length > 0) {
//                 let args = Array.from(arguments);
//                 if (typeof args[0] == 'string') {
//                     args[0] = 'worker ' + workerN + ': ' + args[0];
//                 } else if (args.length >= 2 && typeof args[1] == 'string') {
//                     args[1] = 'worker ' + workerN + ': ' + args[1];
//                 }
//                 return fn.apply(this, args);
//             } else {
//                 return fn.apply(this)
//             }
//         }
//     } else {
//         return fn;
//     }
// }

let level = extractLogLevel(args);

var log = bunyan.createLogger({
    name: 'ApartmaKranjska',
    level: level,
    src: args.showline != null
});

// log.trace = equipLogFunction(log.trace);
// log.debug = equipLogFunction(log.debug);
// log.info = equipLogFunction(log.info);
// log.warn = equipLogFunction(log.warn);
// log.error = equipLogFunction(log.error);
// log.fatal = equipLogFunction(log.fatal);

log.info('logger initialized using level `%s`', level);

module.exports = exports = log;

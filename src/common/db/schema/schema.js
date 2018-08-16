// autogenerated by sql-generate v1.5.0 on Thu Aug 16 2018 12:55:33 GMT+0200 (CEST)

var sql = require('sql');


/**
 * SQL definition for public.events
 */
exports.events = sql.define({
	name: 'events',
	columns: [
		{ name: 'eventId' },
		{ name: 'itemId' },
		{ name: 'destinationCountry' },
		{ name: 'eventTimestamp' }
	]
});


/**
 * SQL definition for public.eventsPublic
 */
exports.eventsPublic = sql.define({
	name: 'eventsPublic',
	columns: [
		{ name: 'itemId' },
		{ name: 'destinationCountry' },
		{ name: 'eventTimestamp' }
	]
});



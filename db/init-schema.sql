CREATE TABLE IF NOT EXISTS "events" (
    "eventId" BIGSERIAL PRIMARY KEY,
    "itemId" VARCHAR(32) NOT NULL,
    "destinationCountry" VARCHAR(32),
    "eventTimestamp" TIMESTAMP NOT NULL
);

CREATE VIEW "eventsPublic" AS
    SELECT "itemId",
           "destinationCountry",
           "eventTimestamp"
        FROM "events";

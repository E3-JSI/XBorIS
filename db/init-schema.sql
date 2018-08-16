CREATE TABLE IF NOT EXISTS "events" (
    "itemId" VARCHAR(32) PRIMARY KEY,
    "destinationCountry" VARCHAR(32),
    "eventTimestamp" TIMESTAMP NOT NULL
);

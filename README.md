# Prerequisites

Install Postgres.

# Create the database

```
createuser -d xboris -P
createdb -O xboris xboris
```

# Install dependencies

```
npm install
```

# Run

## Run the main XBorIS server

```
cd bin
./run-debug
```

## Run the API server

```
cd bin
./run-api-debug
```

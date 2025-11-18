#!/bin/sh
set -e

echo "[entrypoint] Running Drizzle schema push..."
# Wait a bit for Postgres to be ready (simple, not perfect)
sleep 5

npx drizzle-kit push

echo "[entrypoint] Seeding database with fake data..."
# Parse DATABASE_URL: postgres://user:password@host:port/database
DB_URL="${DATABASE_URL#postgres://}"
DB_CREDENTIALS="${DB_URL%%@*}"
DB_USER="${DB_CREDENTIALS%%:*}"
DB_PASS="${DB_CREDENTIALS#*:}"
DB_HOST_PORT="${DB_URL#*@}"
DB_HOST="${DB_HOST_PORT%%:*}"
DB_PORT="${DB_HOST_PORT#*:}"
DB_PORT="${DB_PORT%%/*}"
DB_NAME="${DB_URL##*/}"

export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f seed.sql

echo "[entrypoint] Starting Node server..."
exec "$@"

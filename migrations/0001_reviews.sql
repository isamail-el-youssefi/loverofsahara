-- Reviews of Lover of Sahara trips. Email is stored for the owner only and is never returned by the API.
CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY,
  trip        TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT NOT NULL,
  lang        TEXT NOT NULL DEFAULT 'en',
  date        TEXT NOT NULL,                 -- YYYY-MM-DD
  photos      TEXT NOT NULL DEFAULT '[]',    -- JSON array of https URLs
  reply_text  TEXT,
  reply_date  TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS reviews_trip_created ON reviews (trip, created_at DESC);

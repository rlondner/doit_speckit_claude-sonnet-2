CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS goals (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(100) NOT NULL,
  end_date     DATE         NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

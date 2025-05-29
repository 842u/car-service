ALTER TABLE service_logs
  DROP category;

DROP TYPE service_category;

CREATE TYPE service_category AS enum(
  'battery',
  'body',
  'brakes',
  'electrical',
  'engine',
  'interior',
  'other',
  'suspension',
  'tires'
);

ALTER TABLE service_logs
  ADD category service_category[] NOT NULL;

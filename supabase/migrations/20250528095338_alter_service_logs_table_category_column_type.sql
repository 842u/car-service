ALTER TABLE service_logs
  ALTER category TYPE service_category[]
  USING ARRAY[category];

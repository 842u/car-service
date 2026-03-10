ALTER TABLE service_logs
  DROP CONSTRAINT service_logs_created_by_fkey;

ALTER TABLE service_logs
  ADD CONSTRAINT service_logs_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users (id);

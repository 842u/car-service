ALTER TABLE cars
  ALTER COLUMN custom_name SET NOT NULL;

ALTER TABLE cars
  DROP CONSTRAINT custom_name_length;

ALTER TABLE cars
  ADD CONSTRAINT custom_name_length CHECK (char_length(custom_name) <= 30);

ALTER TABLE cars
  ADD COLUMN created_by uuid DEFAULT auth.uid();

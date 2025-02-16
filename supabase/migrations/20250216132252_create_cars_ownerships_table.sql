CREATE TABLE cars_ownerships(
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_primary_owner boolean NOT NULL DEFAULT TRUE,
  PRIMARY KEY (car_id, owner_id)
);

CREATE UNIQUE INDEX one_primary_owner_per_car ON cars_ownerships(car_id)
WHERE
  is_primary_owner = TRUE;

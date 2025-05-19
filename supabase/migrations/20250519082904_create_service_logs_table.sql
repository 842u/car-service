CREATE TABLE service_logs(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id),
  category service_category NOT NULL,
  service_date date NOT NULL,
  mileage integer,
  service_cost numeric,
  notes text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT service_cost_scale CHECK (scale(service_cost) <= 2),
  CONSTRAINT notes_length CHECK (char_length(notes) <= 1000)
);

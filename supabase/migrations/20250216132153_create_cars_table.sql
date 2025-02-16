CREATE TABLE cars(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image_url text,
  custom_name text,
  brand text,
  model text,
  license_plates text,
  vin text,
  fuel_type fuel,
  additional_fuel_type fuel,
  transmission_type transmission,
  drive_type drive,
  production_year integer,
  engine_capacity integer,
  mileage integer,
  insurance_expiration date,
  created_at date DEFAULT CURRENT_DATE,
  PRIMARY KEY (id),
  CONSTRAINT custom_name_length CHECK (custom_name IS NULL OR
    char_length(custom_name) BETWEEN 1 AND 30),
  CONSTRAINT brand_length CHECK (brand IS NULL OR char_length(brand) BETWEEN 2 AND 25),
  CONSTRAINT model_length CHECK (model IS NULL OR char_length(model) BETWEEN 1 AND 25),
  CONSTRAINT license_plates_length CHECK (license_plates IS NULL OR
    char_length(license_plates) BETWEEN 1 AND 15),
  CONSTRAINT vin_length CHECK (vin IS NULL OR char_length(vin) = 17),
  CONSTRAINT production_year_period CHECK (production_year IS NULL OR
    production_year BETWEEN 1885 AND extract(YEAR FROM now()) + 5),
  CONSTRAINT engine_capacity_positive CHECK (engine_capacity IS NULL OR
    engine_capacity >= 0),
  CONSTRAINT mileage_positive CHECK (mileage IS NULL OR mileage >= 0)
);

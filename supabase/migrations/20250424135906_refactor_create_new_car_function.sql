DROP FUNCTION create_new_car(text, text, text, text, text, fuel, fuel,
  transmission, drive, int, int, int, date);

CREATE FUNCTION create_new_car(custom_name text, brand text DEFAULT NULL, model
  text DEFAULT NULL, license_plates text DEFAULT NULL, vin text DEFAULT NULL,
  fuel_type fuel DEFAULT NULL, additional_fuel_type fuel DEFAULT NULL,
  transmission_type transmission DEFAULT NULL, drive_type drive DEFAULT NULL,
  production_year int DEFAULT NULL, engine_capacity int DEFAULT NULL, mileage
  int DEFAULT NULL, insurance_expiration date DEFAULT NULL,
  technical_inspection_expiration date DEFAULT NULL)
  RETURNS uuid
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
DECLARE
  new_car_id uuid;
BEGIN
  SELECT
    gen_random_uuid() INTO new_car_id;
  INSERT INTO public.cars(id, custom_name, brand, model, license_plates, vin,
    fuel_type, additional_fuel_type, transmission_type, drive_type,
    production_year, engine_capacity, mileage, insurance_expiration,
    technical_inspection_expiration)
    VALUES (new_car_id, custom_name, brand, model, license_plates, vin,
      fuel_type, additional_fuel_type, transmission_type, drive_type,
      production_year, engine_capacity, mileage, insurance_expiration,
      technical_inspection_expiration);

  RETURN new_car_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'New car creation failed: %', SQLERRM;
END;

$$;

REVOKE ALL ON FUNCTION create_new_car(text, text, text, text, text, fuel, fuel,
  transmission, drive, int, int, int, date, date) FROM public;

REVOKE ALL ON FUNCTION create_new_car(text, text, text, text, text, fuel, fuel,
  transmission, drive, int, int, int, date, date) FROM authenticated;

REVOKE ALL ON FUNCTION create_new_car(text, text, text, text, text, fuel, fuel,
  transmission, drive, int, int, int, date, date) FROM anon;

GRANT EXECUTE ON FUNCTION create_new_car(text, text, text, text, text, fuel,
  fuel, transmission, drive, int, int, int, date, date) TO authenticated;

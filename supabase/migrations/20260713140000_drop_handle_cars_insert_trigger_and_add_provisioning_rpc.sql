-- The application now owns car birth: creating a Car and establishing its
-- creator as primary owner is one atomic operation the domain drives, not a
-- database trigger. Drop the trigger and its function, add a SECURITY
-- INVOKER RPC that inserts both rows in one transaction, and add the RLS
-- policy that lets a self-primary birth row through (the trigger used to
-- bypass RLS entirely via SECURITY DEFINER, which this RPC no longer needs
-- to do).
--
-- The RPC extracts each jsonb key explicitly rather than populating a row
-- type from the whole object, so a missing or misnamed key fails loudly
-- instead of silently defaulting.

DROP TRIGGER handle_cars_insert ON cars;

DROP FUNCTION private.handle_cars_insert();

CREATE FUNCTION create_car_with_primary_owner(car jsonb, primary_owner jsonb)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $$
BEGIN
  INSERT INTO public.cars(id, image_url, custom_name, brand, model, license_plates,
    vin, fuel_type, additional_fuel_type, transmission_type, drive_type,
    production_year, engine_capacity, mileage, insurance_expiration,
    technical_inspection_expiration)
  VALUES (
    (car ->> 'id')::uuid,
    car ->> 'image_url',
    car ->> 'custom_name',
    car ->> 'brand',
    car ->> 'model',
    car ->> 'license_plates',
    car ->> 'vin',
    (car ->> 'fuel_type')::public.fuel,
    (car ->> 'additional_fuel_type')::public.fuel,
    (car ->> 'transmission_type')::public.transmission,
    (car ->> 'drive_type')::public.drive,
    (car ->> 'production_year')::integer,
    (car ->> 'engine_capacity')::integer,
    (car ->> 'mileage')::integer,
    (car ->> 'insurance_expiration')::date,
    (car ->> 'technical_inspection_expiration')::date);

  INSERT INTO public.cars_ownerships(car_id, owner_id, is_primary_owner)
  VALUES (
    (primary_owner ->> 'car_id')::uuid,
    (primary_owner ->> 'owner_id')::uuid,
    (primary_owner ->> 'is_primary_owner')::boolean);
END;
$$;

REVOKE ALL ON FUNCTION create_car_with_primary_owner(jsonb, jsonb) FROM public;

REVOKE ALL ON FUNCTION create_car_with_primary_owner(jsonb, jsonb) FROM authenticated;

REVOKE ALL ON FUNCTION create_car_with_primary_owner(jsonb, jsonb) FROM anon;

GRANT EXECUTE ON FUNCTION create_car_with_primary_owner(jsonb, jsonb) TO authenticated;

-- The subquery's own alias (o) must qualify every reference to its columns,
-- including the one meant to correlate back to the row being inserted:
-- an unqualified car_id inside the subquery binds to the subquery's own
-- FROM clause, not the outer row, collapsing the correlation into a
-- self-tautology (o.car_id = o.car_id, always true for any existing row).
CREATE POLICY "primary owner can birth their own ownership row" ON public.cars_ownerships
  FOR INSERT TO authenticated
    WITH CHECK (owner_id = auth.uid() AND is_primary_owner = TRUE AND NOT EXISTS (
      SELECT 1 FROM public.cars_ownerships o WHERE o.car_id = cars_ownerships.car_id));

DROP POLICY "car ownership are visible only for owners" ON public.cars_ownerships;

CREATE POLICY "owners can see all co-owners of their cars" ON public.cars_ownerships
  FOR SELECT TO authenticated
    USING (private.is_user_owner_of_car(auth.uid(), car_id));

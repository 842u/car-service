-- Rename switch_primary_car_owner to promote_primary_car_owner.
--
-- The function promotes an existing co-owner to primary; it never switches in
-- a stranger. The name predates that correction. The body, security definer
-- setting, and grants are unchanged, so a plain rename is sufficient.

ALTER FUNCTION switch_primary_car_owner(uuid, uuid) RENAME TO promote_primary_car_owner;

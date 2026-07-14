-- Category non-empty/dedupe/enum-membership is now enforced by the
-- ServiceCategories value object in the application layer; every write goes
-- through a use case that constructs the aggregate, so this trigger is
-- redundant.

DROP TRIGGER dedupe_service_category ON service_logs;

DROP FUNCTION private.dedupe_service_category();

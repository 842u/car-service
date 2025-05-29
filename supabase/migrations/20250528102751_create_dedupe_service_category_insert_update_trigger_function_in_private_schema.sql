CREATE FUNCTION private.dedupe_service_category()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  deduped_category public.service_category[];
BEGIN
  SELECT
    array_agg(DISTINCT category_rows) INTO deduped_category
  FROM
    unnest(NEW.category) AS category_rows;

  NEW.category := deduped_category;

  RETURN NEW;
END;
$$;

CREATE TRIGGER dedupe_service_category
  BEFORE INSERT OR UPDATE ON service_logs
  FOR EACH ROW
  EXECUTE PROCEDURE private.dedupe_service_category();

REVOKE ALL ON FUNCTION private.dedupe_service_category() FROM public;

REVOKE ALL ON FUNCTION private.dedupe_service_category() FROM authenticated;

REVOKE ALL ON FUNCTION private.dedupe_service_category() FROM anon;

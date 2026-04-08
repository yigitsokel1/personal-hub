-- Enforce single-row semantics by allowing only id=1.
ALTER TABLE "site_settings"
ADD CONSTRAINT "site_settings_single_row_id_check"
CHECK ("id" = 1);

psql -U postgres
CREATE DATABASE hyper_aigent_db;
\c hyper_aigent_db
ALTER TABLE gg_sheets
ALTER COLUMN id SET DEFAULT nextval('gg_sheet_id_seq');
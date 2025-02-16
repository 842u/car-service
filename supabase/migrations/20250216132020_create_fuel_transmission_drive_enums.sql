CREATE TYPE fuel AS ENUM(
  'gasoline',
  'diesel',
  'CNG',
  'LPG',
  'hybrid',
  'electric',
  'hydrogen',
  'ethanol'
);

CREATE TYPE transmission AS ENUM(
  'manual',
  'automatic',
  'CVT'
);

CREATE TYPE drive AS ENUM(
  'FWD',
  'RWD',
  '4WD',
  'AWD'
);

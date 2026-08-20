// The first car was built in 1885, so every production year and every date the
// domain accepts sits at or after this floor. Value objects derive their lower
// bound and their message from here rather than restating the year.
export const FIRST_CAR_PRODUCTION_YEAR = 1885;
export const FIRST_CAR_PRODUCTION_DATE = `${FIRST_CAR_PRODUCTION_YEAR}-01-01`;
export const BEFORE_FIRST_CAR_MESSAGE = `Hey! First car was made in ${FIRST_CAR_PRODUCTION_YEAR}.`;

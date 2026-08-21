/**
 * Signals that the caller asked for something that does not exist, as opposed
 * to something having gone wrong while trying to answer them. The terminal
 * error handler checks for this type to render a 404 instead of a 500 --
 * everything not of this type keeps the existing 500 path.
 */
export class NotFoundError extends Error {}

export default NotFoundError;

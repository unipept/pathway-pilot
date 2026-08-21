/**
 * Base URL of the PathwayPilot backend.
 *
 * Defaults to production, so a build with no environment configuration
 * behaves exactly as before. Set `VITE_API_BASE_URL` in `web/.env.local`
 * to point a local frontend at a local backend.
 */
export const API_BASE_URL: string =
    import.meta.env.VITE_API_BASE_URL ?? "https://pathwaypilot.ugent.be/api";

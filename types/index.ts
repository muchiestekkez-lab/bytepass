import type { User, Platform, Flight } from '@prisma/client';

/** Full flight with relations */
export type FlightWithPlatforms = Flight & {
  from: Platform;
  to: Platform;
};

/** User with flights included */
export type UserWithFlights = User & {
  flights: FlightWithPlatforms[];
};

/** Auth payload stored in JWT */
export type AuthPayload = {
  userId: string;
  username: string;
};

/** API response shape */
export type ApiResponse<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

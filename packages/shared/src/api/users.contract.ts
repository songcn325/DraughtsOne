import type { ApiEndpoint, EmptyRequest } from "../common.js";
import type { User } from "./auth.contract.js";

export type PatchMeRequest = Partial<Pick<User, "displayName" | "avatarUrl">>;

export type UserProfileView = User & {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  learningStreakDays: number;
  gems: number;
};

export type UsersApiContract = {
  "GET /me": ApiEndpoint<EmptyRequest, UserProfileView>;
  "PATCH /me": ApiEndpoint<PatchMeRequest, UserProfileView>;
};


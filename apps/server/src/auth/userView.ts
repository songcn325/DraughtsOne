import type { User } from "@draughtsone/shared";

type StoredUser = {
  id: string;
  accountType: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  displayName: string;
  avatarUrl: string | null;
  rating: number;
  createdAt: Date;
};

export function userView(user: StoredUser): User {
  return {
    id: user.id,
    accountType: user.accountType === "registered" ? "registered" : "guest",
    username: user.username ?? undefined,
    email: user.email ?? undefined,
    phoneNumber: user.phoneNumber ?? undefined,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? undefined,
    rating: user.rating,
    createdAt: user.createdAt.toISOString()
  };
}

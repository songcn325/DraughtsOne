import type { ApiEndpoint, EmptyRequest, ID, ISODateTime } from "../common";

export type User = {
  id: ID;
  username: string;
  email?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  createdAt: ISODateTime;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  expiresAt: ISODateTime;
};

export type RegisterRequest = {
  username: string;
  password: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  verification?: VerificationCodeConfirmation;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type VerificationChannel = "email" | "sms";
export type VerificationCodePurpose = "login" | "register" | "reset_password";

export type VerificationTarget = {
  channel: VerificationChannel;
  target: string;
};

export type VerificationCodeConfirmation = VerificationTarget & {
  code: string;
};

export type SendVerificationCodeRequest = {
  channel: VerificationChannel;
  target: string;
  purpose: VerificationCodePurpose;
};

export type SendVerificationCodeResult = {
  channel: VerificationChannel;
  deliveryTarget: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  supportedInCurrentMvp: boolean;
};

export type VerificationCodeLoginRequest = {
  channel: VerificationChannel;
  target: string;
  code: string;
};

export type PasswordResetIdentity = { username: string; email?: never } | { email: string; username?: never };

export type RequestPasswordResetRequest = PasswordResetIdentity;

export type RequestPasswordResetResult = {
  channel: "email";
  deliveryTarget: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
};

export type ResetPasswordRequest = PasswordResetIdentity & {
  code: string;
  newPassword: string;
};

export type ResetPasswordResult = {
  passwordReset: true;
};

export type LogoutResult = {
  loggedOut: true;
};

export type AuthApiContract = {
  "POST /auth/register": ApiEndpoint<RegisterRequest, AuthSession>;
  "POST /auth/login": ApiEndpoint<LoginRequest, AuthSession>;
  "POST /auth/verification-code/send": ApiEndpoint<SendVerificationCodeRequest, SendVerificationCodeResult>;
  "POST /auth/verification-code/login": ApiEndpoint<VerificationCodeLoginRequest, AuthSession>;
  "POST /auth/password-reset/request": ApiEndpoint<RequestPasswordResetRequest, RequestPasswordResetResult>;
  "POST /auth/password-reset/confirm": ApiEndpoint<ResetPasswordRequest, ResetPasswordResult>;
  "POST /auth/logout": ApiEndpoint<EmptyRequest, LogoutResult>;
};

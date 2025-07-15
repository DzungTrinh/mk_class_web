export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  mfaRequired?: boolean;
  deviceId?: string;
}
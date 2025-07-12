export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  firebaseToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  tokens: AuthTokens;
}

export interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
}

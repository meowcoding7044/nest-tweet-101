export interface IAuthConfig {
  secret: string;
  audience?: string;
  issuer?: string;
  expiresIn: number | string;
  refreshTokenExpiresIn: number | string;
}
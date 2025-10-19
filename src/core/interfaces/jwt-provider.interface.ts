export interface ITokenProvider {
  verifyAsync<T = any>(token: string): Promise<T>;
  signAsync(
    payload: Record<string, any>,
    options: { expiresIn: number },
  ): Promise<string>;
  // signAsync<T>(payload: T, expiresIn: number): Promise<string>;
  // verifyToken<T>(token: string): Promise<T>;
}

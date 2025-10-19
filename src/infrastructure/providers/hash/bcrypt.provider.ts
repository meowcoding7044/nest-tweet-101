import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashProvider } from '../../../core/interfaces/hashing-provider.interface';

@Injectable()
export class BcryptHashProvider implements IHashProvider {
  private readonly rounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}

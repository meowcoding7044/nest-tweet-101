import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashProvider } from '../../../core/interfaces/hashing-provider.interface';

@Injectable()
export class BcryptHashProvider implements IHashProvider {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

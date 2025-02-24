import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class CryptoService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static generateRandomToken(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }
}

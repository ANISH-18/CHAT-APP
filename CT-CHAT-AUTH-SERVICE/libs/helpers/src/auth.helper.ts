import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { resolve } from 'path';
import { buffer } from 'stream/consumers';

export class AuthHelper {
  // Encode User Password
  async encodePassword(password: string) {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Validate User's password
  async isPasswordValid(password: string, userPassword: string) {
    return bcrypt.compareSync(password, userPassword);
  }

  async generateSecretKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const secretKey = buffer.toString('hex');
          resolve(secretKey);
        }
      });
    });
  }

  async generateAuthCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(8, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const secretKey = buffer.toString('hex');
          resolve(secretKey);
        }
      });
    });
  }

  async generateAPIKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(8, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const secretKey = buffer.toString('hex');
          resolve(secretKey);
        }
      });
    });
  }
}

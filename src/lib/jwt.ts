import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '@/lib/config';

export function signJWT(
  payload: string | Record<string, unknown> | Buffer,
  options: SignOptions = { expiresIn: '1d' },
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, env.JWT_SECRET, options, (err, token) => {
      if (err) return reject(err);
      return resolve(token ?? '');
    });
  });
}

export function verifyJWT(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
}

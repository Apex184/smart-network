import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

import { AlphabetOptions, AlphabetType } from './types';

export function generateRandomString(
  length: number = 15,
  { type = 'alphanumeric', prefix = '', suffix = '', hasSymbols = false, alphabet = '' }: AlphabetOptions = {},
) {
  if (type === 'custom' && !alphabet) {
    throw new Error('Alphabet must be specified when type is "custom"');
  }

  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{};:,./<>?`~';
  const alpha = `${lower}${upper}`;
  const alphanumeric = `${alpha}${numbers}`;
  const alphanumericLower = `${lower}${numbers}`;
  const alphanumericUpper = `${upper}${numbers}`;

  const typeMap: Record<AlphabetType, string> = {
    alpha,
    alphanumeric,
    numeric: numbers,
    lower,
    upper,
    alphanumericLower,
    alphanumericUpper,
    custom: alphabet,
  };

  if (hasSymbols) {
    return `${prefix}${customAlphabet(typeMap[type] + symbols, length)()}${suffix}`;
  }

  return `${prefix}${customAlphabet(typeMap[type], length)()}${suffix}`;
}

export function hash(str: string, salt: string | number = 10) {
  return bcrypt.hash(str, salt);
}

export function compareHash(str: string, hash: string) {
  return bcrypt.compare(str, hash);
}

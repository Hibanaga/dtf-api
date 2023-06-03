import { hash } from 'bcrypt';

export function hashPassword(password: string, salt = 4): Promise<string> {
  return hash(password, salt);
}

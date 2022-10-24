import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

interface IJwtPayload {
  userId: number,
  username: string
}

@Injectable()
export class AuthService {
  // захэшировать пароль
  async hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }

  // проверить равенство пароля с его хэшем
  async checkPwEquality(password: string, hashedPassword: string): Promise<boolean> {
    const isEqual = await compare(password, hashedPassword);
    return isEqual;
  }

  // сформировать токен
  getToken(payload: IJwtPayload) {
    const token = this.jwtConfig({
      userId: payload.userId,
      username: payload.username
    });
    // for exp time check in JwtConfig  expiresIn !!!
    const expirationTime = +process.env.JWT_EXP || 24 * 3600000; // token lifetime (1d = 24h)
    return {
      token,
      expiresIn: expirationTime,
      userId: payload.userId,
      username: payload.username
    }
  }

  // проверить токен
  verifyToken(token: string): IJwtPayload | null {
    let decodedToken: null | IJwtPayload = null;
    try {
      decodedToken = verify(token, process.env.JWT_SECRET || 'JWT_SECRET') as IJwtPayload;
      if (!decodedToken) return null;
      return decodedToken;
    } catch(e) {
      return null
    }
  }

  // конфигурация jwt
  private jwtConfig(payload: IJwtPayload): string {
    const token = sign(
      {
        userId: payload.userId,
        username: payload.username
      },
      process.env.JWT_SECRET ?? 'JWT_SECRET',
      {
        expiresIn: +process.env.JWT_EXP || '1d'
      }
    );
    return token;
  }
}
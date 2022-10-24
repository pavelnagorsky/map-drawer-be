import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Request } from "express";

import { AuthService } from "../../users-module/auth-service/auth.service";

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(private authService: AuthService){}

  // проверка на наличия токена в заголовке запроса
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const header = request.headers['authorization'];
    if (header && typeof header == 'string') {
      const token = request.headers['authorization'].split(' ')[1] ?? '';
      const payload = this.authService.verifyToken(token);
      if (payload !== null) {
        request['userId'] = payload.userId;
        return true;
      } else {
        throw new ForbiddenException('Not authorized')
      }
    } else {
      throw new ForbiddenException('Not authorized')
    }
  }
}

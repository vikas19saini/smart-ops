import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLE_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // If no roles are required, allow access

    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];

    try {
      const payload = this.jwtService.verify(accessToken);
      const userRole = payload.user.type;

      const hasRole = requiredRoles.some((role) => userRole === role);
      if (!hasRole) {
        this.logger.warn(
          `User role ${userRole} does not have required roles: ${requiredRoles}`,
        );
        throw new UnauthorizedException(
          `Access denied: insufficient permissions for role ${userRole} to access this resource required {${requiredRoles}} permissions.`,
        );
      }
    } catch (err) {
      this.logger.error('Token verification failed', err);
      throw new UnauthorizedException(err.message || 'Unauthorized access');
    }

    return true;
  }
}

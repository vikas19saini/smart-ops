import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

@Injectable({ scope: Scope.REQUEST })
export class TenantProvider {
  constructor(
    @Inject(REQUEST) private readonly request: FastifyRequest,
    private readonly jwtService: JwtService,
  ) {}

  getTenant(): number | null {
    const bearerToken = this.request.headers.authorization;
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return null;
    }

    const accessToken = bearerToken.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(accessToken) as {
      tenantId?: number;
    };

    return decodedToken?.tenantId ?? null;
  }
}

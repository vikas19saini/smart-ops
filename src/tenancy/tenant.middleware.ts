import { NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TenantContext } from './tenant.context';

export class TenantMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: (error?: any) => void) {
    const tenantId = (req.headers['x-tenant-id'] as string) ?? 'master';
    TenantContext.run(tenantId, () => next());
  }
}

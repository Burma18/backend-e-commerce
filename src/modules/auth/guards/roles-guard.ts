// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { JwtGuard } from './jwt-guard';

// @Injectable()
// export class AdminGuard extends JwtGuard implements CanActivate {
//   override async canActivate(context: ExecutionContext): Promise<boolean> {
//     const userCanActivate = await super.canActivate(context);
//     if (!userCanActivate) {
//       return false;
//     }

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (user.role !== 'ADMIN') {
//       throw new ForbiddenException('Access denied. Admins only.');
//     }

//     return true;
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOWED_ROLES_KEY } from '@src/common/decorators/allowed-roles.decorator';
import { Roles } from '@src/common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      ALLOWED_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.role === role);
  }
}

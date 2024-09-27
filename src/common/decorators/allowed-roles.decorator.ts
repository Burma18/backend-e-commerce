import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/roles.enum';

export const ALLOWED_ROLES_KEY = 'roles';

export const AllowedRoles = (roles: Roles[]): CustomDecorator<string> => {
  return SetMetadata(ALLOWED_ROLES_KEY, roles);
};

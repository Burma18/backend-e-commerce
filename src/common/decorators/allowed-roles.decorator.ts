import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

export const ALLOWED_ROLES_KEY = 'roles';

export const AllowedRoles = (roles: UserRole[]): CustomDecorator<string> => {
  return SetMetadata(ALLOWED_ROLES_KEY, roles);
};

import { UserRole } from '@src/modules/users/enums/user-role.enum';

export interface IJwtPayload {
  id: number;
  role: UserRole;
}

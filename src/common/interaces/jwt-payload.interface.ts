import { Roles } from '../enums/roles.enum';

export interface IJwtPayload {
  id: number;
  role: Roles;
}

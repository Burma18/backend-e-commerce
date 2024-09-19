import { UserRole } from '@src/modules/users/enums/user-role.enum';

export interface IUser {
  id: number;
  username: string;
  telegramId: string;
  balance: number;
  role: UserRole;
  isBlocked: boolean;
  registrationDate: Date;
}

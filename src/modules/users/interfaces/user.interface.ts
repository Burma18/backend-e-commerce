import { UserRole } from '@src/modules/users/enums/user-role.enum';

export interface IUser {
  id: number;
  username: string;
  telegramId: string;
  role: UserRole;
  balance: string;
  isBlocked: boolean;
  registrationDate: Date;
}

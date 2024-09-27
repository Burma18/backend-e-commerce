import { IJwtPayload } from './jwt-payload.interface';
import { Request } from 'express';

export interface IRequestWithUser extends Request {
  user: IJwtPayload;
}

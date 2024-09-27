import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interaces/jwt-payload.interface';
import { IRequestWithUser } from '../interaces/request-with-user.interface';

export const GetJwtPayload = createParamDecorator(
  (_: undefined, context: ExecutionContext): IJwtPayload => {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();

    return request.user;
  },
);

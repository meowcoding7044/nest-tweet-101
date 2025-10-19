import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserType } from '../interfaces/active-user-type.interface';
import { REQUEST_USER_KEY } from 'src/common/constants/constants';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: ActiveUserType = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);

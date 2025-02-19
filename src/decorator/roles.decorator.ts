import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/enum/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

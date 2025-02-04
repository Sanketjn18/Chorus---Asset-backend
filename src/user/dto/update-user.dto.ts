// update-user.dto.ts
import {
  IsOptional,
  Matches,
  IsNotEmpty,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { Role } from '../enum/roles.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+=-]*$/, {
    message:
      'First Name must contain only alpha-numeric and special characters.',
  })
  firstName?: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+=-]*$/, {
    message:
      'Last Name must contain only alpha-numeric and special characters.',
  })
  lastName?: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Hospital ID must contain only alpha-numeric characters.',
  })
  hospitalId?: string;

  @IsOptional()
  @Matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: 'Phone Number must be in the format XXX-XXX-XXXX.',
  })
  phoneNumber?: string;
}

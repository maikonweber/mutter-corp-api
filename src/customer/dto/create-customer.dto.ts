import {
  isEmail,
  MaxLength,
  MinLength,
  isString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;
}

export class LoginCustomerDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class SessionCookieDto {
  value : string;
  userid: number;
}

export class UserLogDto {
  userid: number;
  action: string;
}

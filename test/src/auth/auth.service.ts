import { BadRequestException, Injectable, Logger, UnauthorizedException, NotAcceptableException } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(private customerService: CustomerService, private jwtService: JwtService) { }

  async loginIn(username: string, password: string): Promise<any> {
    this.logger.log("Try Login With", username);

    const users = await this.customerService.getUserAndPassword(username, password);
    if (!users) throw new NotAcceptableException('could not find the user');
    const access_token: string = await this.jwtService.signAsync({
      username: users.username,
      email: users.email,
      id: users.id,
      usecase: users.usecase
    })

    return {
      access_token: access_token,
      usecase: users.usecase
    }
  }

}

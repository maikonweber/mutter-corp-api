import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { jwtConstants } from './jwtConstant';
import { Request } from 'express';
import * as jwt from '@nestjs/jwt';
import { CustomerService } from 'src/customer/customer.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  private readonly logger = new Logger(AuthGuardService.name)
  constructor(private jwtService: JwtService, private customerService: CustomerService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret
      });
      request['user'] = payload;
      await this.customerService.checkUsersExist(payload);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
function validateRequest(request: any): boolean | PromiseLike<boolean> {

  throw new Error('Function not implemented.');
}


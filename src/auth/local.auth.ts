import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { CustomerService } from "src/customer/customer.service";
import { AuthService } from "./auth.service";
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from "./jwtConstant";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(LocalStrategy.name)
  constructor(private authService : AuthService) {
    super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: any) : Promise<any> {
    console.log(payload.headers)
    return payload;
  }

}

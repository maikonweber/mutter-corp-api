import { CreateCustomerDto, SessionCookieDto } from './dto/create-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  Injectable,
  HttpException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UserLogDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as crypto from 'bcrypt'


@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name)
  constructor(private readonly prisma: PrismaService) {}
  async createUserLog(UserLogDto: UserLogDto): Promise<any> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: UserLogDto.userid
      }
    })

    const log = await this.prisma.userlog.create(
      {
        data: {
          userid: UserLogDto.userid,
        action: UserLogDto.action,
        }
      }
    )

    return log
  }

  async createSessionCookie(SessionCookieDto: SessionCookieDto): Promise<any | undefined> {
    const session = await this.prisma.cookie.create({
      data: {
        userid: SessionCookieDto.userid,
        value: SessionCookieDto.value,
      }
    })

    return session
  }

  async createUser(CreateCustomerDto: CreateCustomerDto): Promise<string | void> {
    const { hash, salt } = await this.hashPassword(CreateCustomerDto.password)
    try {
    await this.prisma.$transaction(async (prismaTx: Prisma.TransactionClient) => {
      const users = await prismaTx.user.create({
        data: {
          username: CreateCustomerDto.username,
          email: CreateCustomerDto.email,
        }
      })

      const newPass = await prismaTx.passwordhash.create({
        data: {
          userid: users.id,
          hash: hash,
          salt: salt
        }
      })

      const waller = await prismaTx.wallet.create({
        data: {
          userid: users.id
        }
      })
    }, {
        isolationLevel: 'Serializable',
        maxWait: 5000,
        timeout: 5000
    })
    return "Criou"
    } catch (error) {

    return error
    }
  }

  async getAllSession(userid: number): Promise<any | undefined> {
    const coookie = await this.prisma.cookie.findMany({
      where: {
        userid: userid
      },
      include: {
        user: true
      }
    })
    this.logger.log(coookie);
    return coookie;
  }

  async getCurrentWallet(userid: number): Promise<any> {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userid: userid
      }
    })

    return wallet
  }


  async getCookieSession(value: string): Promise<any> {
    const cookie = await this.prisma.cookie.findFirstOrThrow({
      where: {
        value: value
      },
      include: {
        user: true
      }
    })
    return cookie
  }

  async getUserAndPassword(email: string, password: string): Promise<any> {
    const users = await this.prisma.user.findFirstOrThrow({
      where: {
        email: email
      },
      include: {
        passwordhash: true
      },
    }
    )

    const hash: string = await this.encryptPassword(password, users.passwordhash.salt)
    if (hash != users.passwordhash.hash) {
      throw new UnauthorizedException('You need help to login in your account')
    }
    return users
  }

  async getUser(id: number): Promise<any> {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        id: id
      },
      include: {
        passwordhash: true,
      }
    })
  }

  async hashPassword(password: string): Promise<any> {
    try {
      const saltRound = 10;
      const salt = await crypto.genSalt(saltRound);
      const hash = await crypto.hash(password, salt);
      this.logger.log('Hash Generated');
      return {
        hash,
        salt
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async checkUsersExist(payload: any): Promise<any> {
    return this.prisma.user.findFirstOrThrow({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        usecase: true,
      }
    })

  }
  async encryptPassword(newPass: string, salt: string): Promise<string> {
    try {
      const hash = await crypto.hash(newPass, salt);
      return hash;
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}

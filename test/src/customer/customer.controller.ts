import { Controller, Get, Post, Body, Patch, Param,UseGuards, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, LoginCustomerDto } from './dto/create-customer.dto';
import { ApiTags } from '@nestjs/swagger'
import { LocalStrategy } from 'src/auth/local.auth';


@ApiTags("Customer")
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/create-users')
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createUser(createCustomerDto);
  }

  @UseGuards(LocalStrategy)
  @Get('/my-account')
  getMyAccount(@Param('id') id: string): string {
    return "Try"
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.getCurrentWallet(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
  //   return this.customerService.update(+id, updateCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}

import { ApiProperty } from "@nestjs/swagger"
export class CreateLeadDTO {
  @ApiProperty()
  firstname : string
  @ApiProperty()
  lastname  :  string
  @ApiProperty()
  email   :  string
  @ApiProperty()
  phone   :  string
  @ApiProperty()
  description : string
}

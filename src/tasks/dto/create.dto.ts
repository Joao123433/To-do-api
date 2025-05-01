import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string
  
  @IsString()
  @IsNotEmpty()
  readonly priority: string

  @IsDate()
  @IsNotEmpty()
  readonly deadline: Date
  
  @IsString()
  @IsNotEmpty()
  readonly status: string
  
  @IsString()
  readonly comment: string
}
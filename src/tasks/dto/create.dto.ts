import { IsDateString, IsNotEmpty, IsString } from "class-validator"

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string
  
  @IsString()
  @IsNotEmpty()
  readonly priority: string

  @IsDateString()
  @IsNotEmpty()
  readonly deadline: string
  
  @IsString()
  @IsNotEmpty()
  readonly status: string
  
  @IsString()
  readonly comment: string
}
import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create.dto";

export class UpdateDto extends PartialType(CreateTaskDto) {}
  
import {
  IsString,
  IsDefined,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean = false;

  @IsDate()
  @IsDefined()
  deadline: Date;

  @IsBoolean()
  @IsOptional()
  reminder: boolean = false;

  userId: number;
}

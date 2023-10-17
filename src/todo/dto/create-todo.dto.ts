import { IsString, IsDefined, IsBoolean, IsOptional } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean = false;

  userId: number;
}

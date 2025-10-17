import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { FindOperator } from 'typeorm';

export class CreateEmpleadoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo nombre no debe ser mayor a 100 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cargo es obligatorio' })
  @IsString({ message: 'El campo cargo debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo cargo no debe ser mayor a 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly cargo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo salario es obligatorio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El campo salario debe ser un número válido' },
  )
  @IsPositive({
    message: 'El salario debe ser un número positivo',
  })
  readonly salario: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo fechaIngreso es obligatorio' })
  @IsDate({
    message: 'El campo fechaIngreso debe ser una fecha válida',
  })
  readonly fechaIngreso: Date;
  fechaContratacion: Date | FindOperator<Date> | undefined;
}

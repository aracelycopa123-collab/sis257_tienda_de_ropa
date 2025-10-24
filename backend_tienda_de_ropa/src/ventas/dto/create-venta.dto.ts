import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo fecha es obligatorio' })
  @IsDateString({}, { message: 'El campo fecha debe ser de tipo fecha' })
  readonly fecha: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo total es obligatorio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El campo total debe ser un número válido' },
  )
  @IsPositive({ message: 'El total debe ser un número positivo' })
  readonly total: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idCliente es obligatorio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El campo idCliente debe ser un número válido' },
  )
  @IsPositive({ message: 'El idCliente debe ser un número positivo' })
  readonly idCliente: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idEmpleado es obligatorio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El campo idEmpleado debe ser un número válido' },
  )
  @IsPositive({ message: 'El idEmpleado debe ser un número positivo' })
  readonly idEmpleado: number;
}

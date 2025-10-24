import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductoDto {
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
  @IsNotEmpty({ message: 'El campo categoria es obligatorio' })
  @IsString({ message: 'El campo categoria debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo categoria no debe ser mayor a 50 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly categoria: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precio es obligatorio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El campo precio debe ser un número válido' },
  )
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  readonly precio: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo stock es obligatorio' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El campo stock debe ser un número válido' },
  )
  @IsPositive({ message: 'El stock debe ser un número positivo' })
  readonly stock: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion es obligatorio' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(2000, {
    message: 'El campo descripcion no debe ser mayor a 2000 caracteres',
  })
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  readonly descripcion: string;
}

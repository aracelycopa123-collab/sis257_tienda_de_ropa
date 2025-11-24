import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'usuario123', description: 'Nombre de usuario' })
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  @IsString({ message: 'El campo usuario debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El campo usuario no debe ser mayor a 15 caracteres' })
  nombreUsuario: string;

  @ApiProperty({ example: 'miPassword123', description: 'Clave del usuario' })
  @IsNotEmpty({ message: 'La clave es obligatoria' })
  @IsString({ message: 'La clave debe ser de tipo cadena' })
  clave: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del cliente' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del cliente' })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiProperty({ example: '+591 71234567', description: 'Teléfono del cliente' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', description: 'Dirección del cliente' })
  @IsOptional()
  @IsString()
  direccion?: string;
}

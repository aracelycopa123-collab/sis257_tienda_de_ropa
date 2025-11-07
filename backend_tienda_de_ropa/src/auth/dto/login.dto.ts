import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Nombre de usuario',
  })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  usuario: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}
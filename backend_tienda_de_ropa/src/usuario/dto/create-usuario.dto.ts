import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'El correo debe ser válido' })
  correo: string;

  @ApiProperty({
    example: 'juanperez',
    description: 'Nombre de usuario para login',
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
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'cliente',
    description: 'Rol del usuario',
    enum: ['admin', 'cliente'],
    default: 'cliente',
  })
  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(['admin', 'cliente'], { message: 'El rol debe ser admin o cliente' })
  rol: 'admin' | 'cliente';
}

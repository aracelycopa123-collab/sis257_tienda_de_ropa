export class CreateUsuarioDto {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: 'admin' | 'cliente';
  fecha_registro?: Date;
  estado?: 'activo' | 'inactivo';
}

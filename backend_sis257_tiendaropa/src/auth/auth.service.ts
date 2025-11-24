import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ClientesService } from 'src/clientes/clientes.service';
import { DataSource } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private jwtService: JwtService,
    private clientesService: ClientesService,
    private dataSource: DataSource,
  ) {}
  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { nombreUsuario, clave } = authLoginDto;
    const usuarioOk = await this.usuarioService.validate(nombreUsuario, clave);

    const payload = { sub: usuarioOk.id };
    const access_token = this.getAccessToken(payload);

    return { ...usuarioOk, access_token };
  }

  async register(authRegisterDto: AuthRegisterDto): Promise<any> {
    const { nombreUsuario, clave, nombre, apellido, telefono, direccion } =
      authRegisterDto;

    // Use a transaction so we don't leave an orphan Usuario if Cliente creation fails
    try {
      const result = await this.dataSource.transaction(async (manager) => {
        const usuarioRepo = manager.getRepository(Usuario);
        const clienteRepo = manager.getRepository(Cliente);

        const existe = await usuarioRepo.findOneBy({ nombreUsuario: nombreUsuario.trim() });
        if (existe) {
          throw new ConflictException('El usuario ya existe');
        }

        const nuevoUsuario = usuarioRepo.create({ nombreUsuario: nombreUsuario.trim(), clave: clave ?? (process.env.DEFAULT_PASSWORD ?? '') });
        const usuarioGuardado = await usuarioRepo.save(nuevoUsuario);

        const cliente = clienteRepo.create({ nombre: nombre?.trim(), apellido: apellido?.trim(), telefono: telefono?.trim(), direccion: direccion?.trim(), idUsuario: usuarioGuardado.id });
        const clienteGuardado = await clienteRepo.save(cliente);

        return { usuario: usuarioGuardado, cliente: clienteGuardado };
      });

      const usuario = result.usuario as Usuario;
      const cliente = result.cliente;
      const payload = { sub: usuario.id };
      const access_token = this.getAccessToken(payload);

      usuario.clave = '';
      return { usuario, cliente, access_token };
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException('Error al crear cuenta');
    }
  }

  getAccessToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN,
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    });
    return accessToken;
  }

  async verifyPayload(payload: JwtPayload): Promise<Usuario> {
    let usuario: Usuario;

    try {
      usuario = await this.usuarioService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Usuario inválido: ${payload.sub}`);
    }

    return usuario;
  }
}

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ClientesService } from 'src/clientes/clientes.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private jwtService: JwtService,
    private clientesService: ClientesService,
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

    // create usuario with provided password
    let usuario: Usuario;
    try {
      usuario = await this.usuarioService.createWithPassword(nombreUsuario, clave);
    } catch (err) {
      // bubble up conflict exception if user exists
      throw err;
    }

    // create cliente linked to usuario
    const clienteDto: any = {
      nombre,
      apellido,
      telefono,
      direccion,
      idUsuario: usuario.id,
    };

    const cliente = await this.clientesService.create(clienteDto);

    const payload = { sub: usuario.id };
    const access_token = this.getAccessToken(payload);

    // hide password
    usuario.clave = '';

    return { usuario, cliente, access_token };
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

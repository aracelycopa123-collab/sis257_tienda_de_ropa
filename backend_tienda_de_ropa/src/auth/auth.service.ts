import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { usuario, password } = loginDto;
    
    const user = await this.usuarioService.findOneByUsername(usuario);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas - usuario');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas - password');
    }

    const payload = { 
      sub: user.idUsuario,
      usuario: user.usuario,
      rol: user.rol
    };

    return {
      user: {
        id: user.idUsuario,
        usuario: user.usuario,
        rol: user.rol,
      },
      token: this.jwtService.sign(payload),
    };
  }
}
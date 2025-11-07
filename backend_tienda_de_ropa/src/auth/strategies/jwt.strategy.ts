import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from '../../usuario/usuario.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { usuario } = payload;
    const user = await this.usuarioService.findOneByUsername(usuario);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    // Eliminar la contraseña del objeto usuario antes de devolverlo
    const { password, ...result } = user;
    return result;
  }
}
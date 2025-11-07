import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si ya existe un usuario con el mismo correo o nombre de usuario
    const existingUser = await this.usuarioRepository.findOne({
      where: [
        { correo: createUsuarioDto.correo },
        { usuario: createUsuarioDto.usuario }
      ]
    });

    if (existingUser) {
      throw new ConflictException('El correo o nombre de usuario ya está en uso');
    }

    const { password, ...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const usuario = this.usuarioRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    await this.usuarioRepository.save(usuario);
    
    const { password: _, ...result } = usuario;
    return result;
  }

  async findAll() {
    const usuarios = await this.usuarioRepository.find({
      select: ['idUsuario', 'nombre', 'correo', 'usuario', 'rol', 'fechaRegistro']
    });
    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      select: ['idUsuario', 'nombre', 'correo', 'usuario', 'rol', 'fechaRegistro']
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return usuario;
  }

  async findOneByUsername(username: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario: username }
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario ${username} no encontrado`);
    }
    
    return usuario;
  }
}

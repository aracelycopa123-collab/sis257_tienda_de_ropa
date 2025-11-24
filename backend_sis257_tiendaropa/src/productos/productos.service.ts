import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const existe = await this.productosRepository.findOneBy({
      nombre: createProductoDto.nombre.trim(),
    });
    if (existe) throw new ConflictException('El producto ya existe');

    const producto = new Producto();
    producto.nombre = createProductoDto.nombre.trim();
    producto.descripcion = createProductoDto.descripcion.trim();
    producto.precio = createProductoDto.precio;
    producto.stock = createProductoDto.stock;
    producto.tallas = Array.isArray(createProductoDto.tallas)
      ? createProductoDto.tallas.map((t) => String(t))
      : [];
    producto.colores = Array.isArray(createProductoDto.colores)
      ? createProductoDto.colores.map((id) => String(id))
      : [];
    producto.imagenes = createProductoDto.imagenes;
    producto.idCategoria = createProductoDto.idCategoria;
    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({ relations: ['categoria'] });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    if ((updateProductoDto as any).tallas) {
      producto.tallas = (updateProductoDto as any).tallas.map((t) => String(t));
    }
    if ((updateProductoDto as any).colores) {
      producto.colores = (updateProductoDto as any).colores.map((id) => String(id));
    }
    const productoUpdate = Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(productoUpdate);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}

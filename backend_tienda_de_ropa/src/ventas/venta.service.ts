import { ConflictException, Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    let venta = await this.ventaRepository.findOneBy({
      fecha: createVentaDto.fecha,
      total: createVentaDto.total,
      idCliente: createVentaDto.idCliente,
      idEmpleado: createVentaDto.idEmpleado,
    });
    if (venta) throw new ConflictException('La venta ya existe');
    venta = this.ventaRepository.create(createVentaDto);
    return this.ventaRepository.save(venta);
  }

  async findAll() {
    return this.ventaRepository.find({ order: { fecha: 'ASC' } });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOneBy({ id });
    if (!venta) throw new ConflictException('El id es obligatorio');
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    Object.assign(venta, updateVentaDto);
    return this.ventaRepository.save(venta);
  }

  async remove(id: number): Promise<Venta> {
    const venta = await this.findOne(id);
    return this.ventaRepository.softRemove(venta);
  }
}

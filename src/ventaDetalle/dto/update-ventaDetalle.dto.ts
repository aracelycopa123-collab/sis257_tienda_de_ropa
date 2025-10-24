import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDetalleDto } from './create-ventaDetalle.dto';

export class UpdateVentaDetalleDto extends PartialType(CreateVentaDetalleDto) {}

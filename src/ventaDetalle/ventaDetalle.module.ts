import { Module } from '@nestjs/common';
import { VentaDetalleController } from './ventaDetalle.controller';
import { VentaDetalleService } from './ventaDetalle.service';

@Module({
  controllers: [VentaDetalleController],
  providers: [VentaDetalleService],
})
export class VentaDetalleModule {}

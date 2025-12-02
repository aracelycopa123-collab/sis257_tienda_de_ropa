import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Color } from '../colores/entities/color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Color])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}

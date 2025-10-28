import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// EmpleadosModule y ClientesModule eliminados: la gestión de roles queda en `usuario`
import { VentaModule } from './ventas/venta.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entities/*.{ts,js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductosModule,
    VentaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

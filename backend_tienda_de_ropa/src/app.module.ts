import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './config/env.validation';
import { VentaModule } from './ventas/venta.module';
import { CarritoModule } from './carrito/carrito.module';
import { ClientesModule } from './clientes/clientes.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VentaDetalleModule } from './ventaDetalle/ventaDetalle.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'BD_tiendaropa',
      entities: [__dirname + '/**/entities/*.{ts,js}'],
      synchronize: true, // Solo en desarrollo, en producción debe ser false
      autoLoadEntities: true,
    }),
    ProductosModule,
    VentaModule,
    CarritoModule,
    ClientesModule,
    EmpleadosModule,
    UsuarioModule,
    VentaDetalleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

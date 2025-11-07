import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Rest Tienda de Ropa SIS257')
    .setDescription(
      'Backend API REST para la Tienda de Ropa - Desarrollo de Aplicación Int/Internet II\n\n' +
      'Endpoints disponibles para:\n' +
      '- Gestión de Productos\n' +
      '- Gestión de Ventas\n' +
      '- Carrito de Compras\n' +
      '- Gestión de Clientes\n' +
      '- Gestión de Empleados\n' +
      '- Gestión de Usuarios\n' +
      '- Detalles de Ventas'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('productos', 'Operaciones con productos')
    .addTag('ventas', 'Operaciones de ventas')
    .addTag('carrito', 'Operaciones del carrito de compras')
    .addTag('clientes', 'Gestión de clientes')
    .addTag('empleados', 'Gestión de empleados')
    .addTag('usuarios', 'Gestión de usuarios y autenticación')
    .addTag('venta-detalle', 'Detalles de las ventas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`Documentación de la API disponible en http://localhost:3000/api-docs`);
}

bootstrap();

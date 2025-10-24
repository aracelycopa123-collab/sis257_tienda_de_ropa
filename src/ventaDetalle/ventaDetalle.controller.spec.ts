import { Test, TestingModule } from '@nestjs/testing';
import { VentaDetalleController } from './ventaDetalle.controller';

describe('VentaDetalleController', () => {
  let controller: VentaDetalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaDetalleController],
    }).compile();

    controller = module.get<VentaDetalleController>(VentaDetalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

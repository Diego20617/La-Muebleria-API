import { jest } from '@jest/globals';

// Mock del módulo antes de importarlo
jest.unstable_mockModule('../../src/models/Producto_model.js', () => ({
  default: {
    find: jest.fn(),
  },
}));

// Importa asíncronamente los módulos mockeados
const { getProducto } = await import('../../src/controller/Producto_controller.js');
const producto_model = await import('../../src/models/Producto_model.js');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getProducto', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe responder con un array de productos', async () => {
    const req = {};
    const res = mockResponse();

    producto_model.default.find.mockResolvedValue([{ nombre: 'Producto1' }, { nombre: 'Producto2' }]);

    await getProducto(req, res);

    expect(producto_model.default.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ nombre: 'Producto1' }, { nombre: 'Producto2' }]);
  });

  it('debe manejar errores y responder con status 500', async () => {
    const req = {};
    const res = mockResponse();

    producto_model.default.find.mockRejectedValue(new Error('Error de BD'));

    await getProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error de BD' });
  });
});

import { jest } from '@jest/globals';

// Mock del modelo usuario_model antes de importarlo
jest.unstable_mockModule('../models/usuario_model.js', () => ({
  default: {
    deleteOne: jest.fn(),
  },
}));

const usuario_model = await import('../../src/models/usuario_model.js');
const { deleteUsuario } = await import('../../src/controller/usuario_controller.js');

// Helper para mockear res con métodos encadenables
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('deleteUsuario', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe responder con status 200 y mensaje de éxito cuando se elimina un usuario', async () => {
    const req = { params: { id: '123' } };
    const res = mockResponse();

    // Simular que deleteOne elimina un documento
    usuario_model.default.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteUsuario[1](req, res);

    expect(usuario_model.default.deleteOne).toHaveBeenCalledWith({ _id: '123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario eliminado correctamente' });
  });

  it('debe responder con status 404 cuando no se encuentra el usuario para eliminar', async () => {
    const req = { params: { id: '123' } };
    const res = mockResponse();

    // Simular que deleteOne no elimina ningún documento
    usuario_model.default.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await deleteUsuario[1](req, res);

    expect(usuario_model.default.deleteOne).toHaveBeenCalledWith({ _id: '123' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('debe responder con status 500 si ocurre un error', async () => {
    const req = { params: { id: '123' } };
    const res = mockResponse();

    const errorMessage = 'Error de base de datos';
    usuario_model.default.deleteOne.mockRejectedValue(new Error(errorMessage));

    await deleteUsuario[1](req, res);

    expect(usuario_model.default.deleteOne).toHaveBeenCalledWith({ _id: '123' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

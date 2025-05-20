import { jest } from '@jest/globals';

// Mock del módulo material_model antes de importarlo
jest.unstable_mockModule('../../src/models/material_model.js', () => {
  return {
    default: jest.fn().mockImplementation((data) => ({
      save: jest.fn(),
      ...data,
    })),
  };
});

const material_model = await import('../../src/models/material_model.js');
const { createMaterial } = await import('../../src/controller/MaterialController.js');

// Helper para mockear res con métodos encadenables
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createMaterial', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe responder con status 201 y el material creado', async () => {
    const req = {
      body: { material: 'Madera' },
    };
    const res = mockResponse();

    const saveMock = jest.fn().mockResolvedValue(req.body);
    material_model.default.mockImplementation(() => ({
      save: saveMock,
    }));

    await createMaterial[1](req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('debe manejar errores y responder con status 500', async () => {
    const req = {
      body: { material: 'Madera' },
    };
    const res = mockResponse();

    const errorMessage = 'Error al guardar';
    const saveMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    material_model.default.mockImplementation(() => ({
      save: saveMock,
    }));

    await createMaterial[1](req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

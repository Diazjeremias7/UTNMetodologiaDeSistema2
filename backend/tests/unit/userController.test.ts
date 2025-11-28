import UserController from '../../src/controllers/UserController';
import UserService from '../../src/services/UserService';

jest.mock('../../src/services/UserService');

const mockedUserService = UserService as unknown as jest.Mocked<typeof UserService>;

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as any;
};

const mockRequest = (body = {}, params = {}) => ({ body, params } as any);

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  test('create - éxito', async () => {
    const user = { id: 1, name: 'Juan', email: 'a@b.com' };
    mockedUserService.createUser = jest.fn().mockResolvedValue(user as any);

    const req = mockRequest({ name: 'Juan', email: 'a@b.com', password: '1234' });
    const res = mockResponse();

    await UserController.create(req, res);

    expect(mockedUserService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: user });
  });

  test('create - error del servicio', async () => {
    mockedUserService.createUser = jest.fn().mockRejectedValue(new Error('El email ya está registrado'));

    const req = mockRequest({ name: 'Juan', email: 'a@b.com', password: '1234' });
    const res = mockResponse();

    await UserController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'El email ya está registrado' });
  });

  test('login - missing fields', async () => {
    const req = mockRequest({ email: '', password: '' });
    const res = mockResponse();

    await UserController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Email y contraseña son requeridos' });
  });

  test('login - éxito', async () => {
    const user = { id: 2, email: 'c@d.com', name: 'Ana' } as any;
    mockedUserService.authenticate = jest.fn().mockResolvedValue(user);

    const req = mockRequest({ email: 'c@d.com', password: 'pwd' });
    const res = mockResponse();

    await UserController.login(req, res);

    expect(mockedUserService.authenticate).toHaveBeenCalledWith('c@d.com', 'pwd');
    expect(res.json).toHaveBeenCalled();
    const sent = (res.json as jest.Mock).mock.calls[0][0];
    expect(sent.success).toBe(true);
    expect(sent.token).toBeDefined();
    expect(sent.data).toEqual(user);
  });

  test('getById - usuario no encontrado', async () => {
    mockedUserService.getUserById = jest.fn().mockResolvedValue(undefined);

    const req = mockRequest({}, { id: '999' });
    const res = mockResponse();

    await UserController.getById(req, res);

    expect(mockedUserService.getUserById).toHaveBeenCalledWith(999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Usuario no encontrado' });
  });

  test('updatePhone - faltó phone', async () => {
    const req = mockRequest({}, { id: '1' });
    const res = mockResponse();

    await UserController.updatePhone(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Teléfono requerido' });
  });
});

import ReservationController from '../../src/controllers/ReservationController';
import ReservationService from '../../src/services/ReservationService';

jest.mock('../../src/services/ReservationService');

const mockedReservationService = ReservationService as unknown as jest.Mocked<typeof ReservationService>;

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as any;
};

const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query } as any);

describe('ReservationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create - usa userId del token y responde 201', async () => {
    const reservation = { id: 1, user_id: 2, date: '2025-01-01' };
    mockedReservationService.createReservation = jest.fn().mockResolvedValue(reservation as any);

    const req: any = mockRequest({ date: '2025-01-01', timeSlot: '08:00-09:00', services: [] }, {}, {});
    req.userId = 2; // middleware auth
    const res = mockResponse();

    await ReservationController.create(req, res);

    expect(mockedReservationService.createReservation).toHaveBeenCalled();
    // verificar que userId fue inyectado en body
    expect(mockedReservationService.createReservation).toHaveBeenCalledWith(expect.objectContaining({ userId: 2 }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: reservation });
  });

  test('create - error del servicio devuelve 400', async () => {
    mockedReservationService.createReservation = jest.fn().mockRejectedValue(new Error('Invalid'));

    const req: any = mockRequest({ date: '2025-01-01', timeSlot: '08:00-09:00', services: [] });
    const res = mockResponse();

    await ReservationController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Invalid' });
  });

  test('getAvailability - fecha faltante devuelve 400', async () => {
    const req = mockRequest({}, {}, {});
    const res = mockResponse();

    await ReservationController.getAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Fecha requerida' });
  });

  test('getByUser - éxito', async () => {
    const data = [{ id: 1 }, { id: 2 }];
    mockedReservationService.getReservationsByUser = jest.fn().mockResolvedValue(data as any);

    const req = mockRequest({}, { userId: '5' });
    const res = mockResponse();

    await ReservationController.getByUser(req, res);

    expect(mockedReservationService.getReservationsByUser).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });

  test('cancel - éxito', async () => {
    mockedReservationService.cancelReservation = jest.fn().mockResolvedValue(undefined);

    const req = mockRequest({}, { id: '3' });
    const res = mockResponse();

    await ReservationController.cancel(req, res);

    expect(mockedReservationService.cancelReservation).toHaveBeenCalledWith(3);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Reserva cancelada' });
  });
});

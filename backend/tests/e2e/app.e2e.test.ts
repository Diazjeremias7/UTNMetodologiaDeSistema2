import request from 'supertest';
import app from '../../src/app';
import Database from '../../src/config/database';

describe('E2E - API', () => {
  let db: any;

  beforeAll(async () => {
    db = Database.getInstance();
    await db.connect();
    await db.initializeTables();
    // limpiar tablas para un entorno consistente
    await db.run('DELETE FROM reservations');
    await db.run('DELETE FROM users');
  });

  afterAll(async () => {
    await db.close();
  });

  test('registro -> login -> crear reserva (flujo completo)', async () => {
    const unique = Date.now();
    const email = `test+${unique}@example.com`;
    const password = 'pass1234';

    // Registro
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({ name: 'E2E User', email, password })
      .expect(201);

    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data).toBeDefined();

    // Login
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email, password })
      .expect(200);

    expect(loginRes.body.success).toBe(true);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    // Crear reserva
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const iso = date.toISOString().split('T')[0];

    const reservationRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: iso, timeSlot: '08:00-09:00', services: [] })
      .expect(201);

    expect(reservationRes.body.success).toBe(true);
    expect(reservationRes.body.data).toBeDefined();
  }, 20000);
});

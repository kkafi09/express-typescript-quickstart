import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/index';

dotenv.config();

const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET || 'secret';

describe('Authentication endpoints', () => {
  let user: any = null;
  const testPassword = 'rahasia';

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    user = await prisma.user.create({
      data: {
        name: 'Kafanal Kafi',
        username: 'kafanalkafi',
        password: hashedPassword,
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: user.id
      }
    });

    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /login', () => {
    it('returns a token when provided with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/user/login')
        .send({ username: 'kafanalkafi', password: testPassword });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Success Login');
      expect(response.body.data[0].user.id).toBe(user.id);
      expect(response.body.data[0].token).toBeTruthy();

      const decoded = jwt.verify(response.body.data[0].token, jwt_secret) as {
        iat: number;
        exp: number;
        [key: string]: any;
      };
      expect(decoded.userId).toBe(response.body.data[0].user.id);
      expect(decoded.iat).toEqual(Math.floor(Date.now() / 1000));
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('returns a 404 error when provided with an invalid username', async () => {
      const response = await request(app)
        .post('/api/v1/user/login')
        .send({ username: 'randomUser', password: testPassword });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Invalid username and password');
    });

    it('returns a 400 error when provided with an invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/user/login')
        .send({ username: 'kafanalkafi', password: 'passwordsalah' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid username and password');
    });
  });

  describe('POST /register', () => {
    it('registers a new user when provided with valid data', async () => {
      const response = await request(app).post('/api/v1/user/register').send({
        name: 'Kafanal Kafi 2',
        username: 'kafanalkafi123',
        password: 'kafanalkafi123',
        role: 'USER'
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Success register');
      expect(response.body.data[0].user.id).toBeTruthy();
      expect(response.body.data[0].token).toBeTruthy();

      await prisma.user.delete({
        where: {
          id: response.body.data[0].user.id
        }
      });
    });

    it('returns a 409 error when attempting to register a user with an existing username', async () => {
      const response = await request(app).post('/api/v1/user/register').send({
        name: 'Kafanal Kafi 3',
        username: 'kafanalkafi',
        password: 'kafanalkafi123',
        role: 'USER'
      });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe('User with this username already exists');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean test data
    await prismaService.client.refreshToken.deleteMany();
    await prismaService.client.user.deleteMany();
  });

  describe('/api/v1/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.status).toBe('healthy');
          expect(res.body.data.timestamp).toBeDefined();
        });
    });
  });

  describe('/api/v1/auth/login (POST)', () => {
    it('should return 400 for invalid request body', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);
    });

    it('should return 400 for missing firebaseToken', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ someOtherField: 'value' })
        .expect(400);
    });
  });

  describe('/api/v1/auth/refresh (POST)', () => {
    it('should return 400 for invalid request body', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400);
    });

    it('should return 400 for missing refreshToken', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ someOtherField: 'value' })
        .expect(400);
    });
  });

  describe('/api/v1/auth/logout (POST)', () => {
    it('should return 400 for invalid request body', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({})
        .expect(400);
    });

    it('should always return success for logout (idempotent)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .send({ refreshToken: 'any-token' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Logout successful');
        });
    });
  });

  describe('/api/v1/auth/verify (GET)', () => {
    it('should return 401 for missing authorization header', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/verify')
        .expect(401);
    });

    it('should return 401 for invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
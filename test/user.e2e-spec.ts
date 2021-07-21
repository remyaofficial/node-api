import * as request from 'supertest';
import * as assert from 'assert';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/user/entities/user.entity';

describe('User module', () => {
  let app: INestApplication;
  const user = {
    role_id: 2,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.gmail.com',
    phone_code: '+1',
    phone: '9999999999',
    password: '123456',
    active: true,
  };
  let userDocument: User;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('autheticate as admin', () => {
    it('/auth/local (login and get token)', (done) => {
      return request(app.getHttpServer())
        .post('/auth/local')
        .set('Accept', 'application/json')
        .send({
          username: 'admin@admin.com',
          password: '123456',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.data?.token);
          token = response.body.data?.token;
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('CRUD', () => {
    it('/user (getAll)', (done) => {
      return request(app.getHttpServer())
        .get('/user')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(true, Array.isArray(response.body.data?.users));
          assert.strictEqual(true, !isNaN(response.body.data?.offset));
          assert.strictEqual(true, !isNaN(response.body.data?.limit));
          assert.strictEqual(true, !isNaN(response.body.data?.count));
          done();
        })
        .catch((err) => done(err));
    });

    it('/user (Create)', (done) => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          assert.strictEqual(
            user.first_name,
            response.body.data?.user?.first_name,
          );
          assert.strictEqual(undefined, response.body.data?.user?.password);
          userDocument = response.body.data?.user;
          done();
        })
        .catch((err) => done(err));
    });

    it('/user (Create duplicate email)', () => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('/user/:id (GetById)', (done) => {
      return request(app.getHttpServer())
        .get('/user/' + userDocument.id)
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(
            user.first_name,
            response.body.data?.user?.first_name,
          );
          assert.strictEqual(undefined, response.body.data?.user?.password);
          done();
        })
        .catch((err) => done(err));
    });

    it('/user/:id (Update)', (done) => {
      userDocument.first_name = 'User1';
      return request(app.getHttpServer())
        .put('/user/' + userDocument.id)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send(userDocument)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(
            userDocument.first_name,
            response.body.data?.user?.first_name,
          );
          assert.strictEqual(undefined, response.body.data?.user?.password);
          done();
        })
        .catch((err) => done(err));
    });

    it('/user/:id (Delete)', (done) => {
      return request(app.getHttpServer())
        .delete('/user/' + userDocument.id)
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(
            userDocument.first_name,
            response.body.data?.user?.first_name,
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('/user/:id (GetById deleted record)', () => {
      return request(app.getHttpServer())
        .get('/user/' + userDocument.id)
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(404);
    });

    describe('Create - required properties missing', () => {
      const required = [
        'first_name',
        'last_name',
        'email',
        'phone_code',
        'phone',
        'password',
      ];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badUser = { ...user };
        delete badUser[field];
        it('/user (Create)', () => {
          return request(app.getHttpServer())
            .post('/user')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('Create - invalid properties', () => {
      const bad = {
        first_name: 123,
        last_name: 123,
        email: '123',
        phone_code: false,
        phone: 999,
        password: '45',
      };
      for (const prop in bad) {
        const badUser = { ...user };
        badUser[prop] = bad[prop];
        it('/user (Create)', () => {
          return request(app.getHttpServer())
            .post('/user')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('Update - required properties missing', () => {
      const required = [];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badUser = { ...user };
        delete badUser[field];
        it('/user (Update)', () => {
          return request(app.getHttpServer())
            .put('/user/' + userDocument.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('Update - invalid properties', () => {
      const bad = {
        first_name: 123,
        last_name: 123,
      };
      for (const prop in bad) {
        const badUser = { ...user };
        badUser[prop] = bad[prop];
        it('/user (Update)', () => {
          return request(app.getHttpServer())
            .put('/user/' + userDocument.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badUser)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });
  });

  describe('logout', () => {
    it('/auth/logout (logout)', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send({})
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

import * as request from 'supertest';
import * as assert from 'assert';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Page } from '../src/modules/page/entities/page.entity';

describe('Page', () => {
  let app: INestApplication;
  const page = {
    name: 'page_1 ' + Date.now(),
    title: 'Page 1',
    content: 'Page content',
    allow_html: true,
  };
  let pageDocument: Page;
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
    it('/page (getAll)', (done) => {
      return request(app.getHttpServer())
        .get('/page')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(true, Array.isArray(response.body.data?.pages));
          assert.strictEqual(true, !isNaN(response.body.data?.offset));
          assert.strictEqual(true, !isNaN(response.body.data?.limit));
          assert.strictEqual(true, !isNaN(response.body.data?.count));
          done();
        })
        .catch((err) => done(err));
    });

    it('/page (Create)', (done) => {
      return request(app.getHttpServer())
        .post('/page')
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send(page)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          assert.strictEqual(page.name, response.body.data?.page?.name);
          pageDocument = response.body.data?.page;
          done();
        })
        .catch((err) => done(err));
    });

    it('/page/:id (GetById)', (done) => {
      return request(app.getHttpServer())
        .get('/page/' + pageDocument.id)
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(page.name, response.body.data?.page?.name);
          done();
        })
        .catch((err) => done(err));
    });

    it('/page/:id (Update)', (done) => {
      pageDocument.title = 'Page 1 Edit';
      return request(app.getHttpServer())
        .put('/page/' + pageDocument.id)
        .set('Accept', 'application/json')
        .set({ Authorization: `Bearer ${token}` })
        .send(pageDocument)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(
            pageDocument.title,
            response.body.data?.page?.title,
          );
          done();
        })
        .catch((err) => done(err));
    });

    it('/page/:id (Delete)', (done) => {
      return request(app.getHttpServer())
        .delete('/page/' + pageDocument.id)
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          assert.strictEqual(pageDocument.name, response.body.data?.page?.name);
          done();
        })
        .catch((err) => done(err));
    });

    it('/page/:id (GetById deleted record)', () => {
      return request(app.getHttpServer())
        .get('/page/' + pageDocument.id)
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(404);
    });

    describe('Create - required properties missing', () => {
      const required = ['name', 'title', 'content', 'allow_html'];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badPage = { ...page };
        delete badPage[field];
        it('/page (Create)', () => {
          return request(app.getHttpServer())
            .post('/page')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badPage)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('Create - invalid properties', () => {
      const bad = {
        name: 123,
        title: 123,
        content: 123,
        allow_html: 123,
      };
      for (const prop in bad) {
        const badPage = { ...page };
        badPage[prop] = bad[prop];
        it('/page (Create)', () => {
          return request(app.getHttpServer())
            .post('/page')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badPage)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('Update - required properties missing', () => {
      const required = ['title', 'content'];
      for (let index = 0; index < required.length; index++) {
        const field = required[index];
        const badPage = { ...page };
        delete badPage[field];
        it('/page (Update)', () => {
          return request(app.getHttpServer())
            .put('/page/' + pageDocument.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badPage)
            .expect('Content-Type', /json/)
            .expect(400);
        });
      }
    });

    describe('Update - invalid properties', () => {
      const bad = {
        title: 123,
        content: 123,
      };
      for (const prop in bad) {
        const badPage = { ...page };
        badPage[prop] = bad[prop];
        it('/page (Update)', () => {
          return request(app.getHttpServer())
            .put('/page/' + pageDocument.id)
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
            .send(badPage)
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

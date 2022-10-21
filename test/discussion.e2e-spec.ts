import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PostModule } from '../src/modules/post/post.module';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('POST discussion', () => {
    it('should return a 200 for a valid discussion', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid poster', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid name', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid facilitator', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid facilitator and a valid facilitator', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 400 for an poster trying to create a discussion for another user', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 401 for no Bearer Token provided', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 404 for the poster not found', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
    it('should return a 404 for a facilitator not found', () => {
      return request(app.getHttpServer()).post('/discussion').expect({
        data: {},
      });
    });
  });

  describe('PATCH discussion/:discussionId/metadata', () => {
    it('should return a 200 for a valid discussion metadata update', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
    it('should return a 400 for an invalid facilitator id', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
    it('should return a 400 for trying to change participants in the array', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
    it('should return a 403 for a user that is not the discussion creator', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
    it('should return a 404 for a discussion not found', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
    it('should return a 404 for a facilitator update not existing', () => {
      return request(app.getHttpServer())
        .patch('/discussion/123/metadata')
        .expect({
          data: {},
        });
    });
  });

  describe('GET discussion/:discussionId', () => {
    it('should return a 200 for the discussion found', () => {
      return request(app.getHttpServer()).get('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid discussion id', () => {
      return request(app.getHttpServer()).get('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer()).get('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 403 for a user that is not a member of the discussion', () => {
      return request(app.getHttpServer()).get('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 404 for a discussion not found', () => {
      return request(app.getHttpServer()).get('/discussion/123').expect({
        data: {},
      });
    });
  });

  describe('POST discussion/:discussionId/archive', () => {
    it('should return a 200 for a discussion successfully archived', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/archive')
        .expect({
          data: {},
        });
    });
    it('should return a 400 for an invalid discussionId', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/archive')
        .expect({
          data: {},
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/archive')
        .expect({
          data: {},
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/archive')
        .expect({
          data: {},
        });
    });
    it('should return a 403 for a user that is not the discussion creator', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/archive')
        .expect({
          data: {},
        });
    });
  });

  describe('POST discussion/:discussionId/duplicate', () => {
    it('should return a 200 for a duplicated discussion', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/duplicate')
        .expect({
          data: {},
        });
    });
    it('should return a 400 for an invalid discussionId', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/duplicate')
        .expect({
          data: {},
        });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/duplicate')
        .expect({
          data: {},
        });
    });
    it('should return a 403 for a user that is not the a discussion facilitator', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/duplicate')
        .expect({
          data: {},
        });
    });
    it('should return a 403 for a user with insufficient plan coverage', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/duplicate')
        .expect({
          data: {},
        });
    });
    it('should return a 404 for a discussion that does not exist', () => {
      return request(app.getHttpServer())
        .post('/discussion/123/duplicate')
        .expect({
          data: {},
        });
    });
  });

  describe('GET users/:userId/discussions', () => {});

  describe('DELETE discussion/:discussionId', () => {
    it('should return a 200 for a discussion that was successfully deleted', () => {
      return request(app.getHttpServer()).delete('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 400 for a discussion that already has posts', () => {
      return request(app.getHttpServer()).delete('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 400 for an invalid discussionId', () => {
      return request(app.getHttpServer()).delete('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 401 for an unauthorized user', () => {
      return request(app.getHttpServer()).delete('/discussion/123').expect({
        data: {},
      });
    });
    it('should return a 403 for an user that is not the creator', () => {
      return request(app.getHttpServer()).delete('/discussion/123').expect({
        data: {},
      });
    });
  });

  afterAll(async () => {
    await app?.close();
  });
});

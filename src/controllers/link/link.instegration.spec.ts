import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { link as Link, project as Project } from '@prisma/client';
import LinkCtrl from './index';
import Server from '../../server';
import getTestingToken from '../../utils/get-testing-token';

describe('Given LinkCtrl', () => {
  let token: string;
  let request: SuperTest.SuperTest<SuperTest.Test>;
  const validLink: Omit<Link, 'id'> = {
    type: 'GITHUB',
    url: 'test link url',
    projectId: 1,
  };

  beforeAll(async () => {
    token = await getTestingToken();
  });

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [LinkCtrl],
      },
    }),
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('When GET /rest/link is called', () => {
    it('Should then return a 200 with an array of links', async () => {
      const response = await request
        .get('/rest/link')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length >= 0).toEqual(true);
    });
  });

  describe('When GET /rest/link/:id is called with a valid ID', () => {
    let id: number;

    beforeEach(async () => {
      const response = await request
        .post('/rest/link')
        .set('Authorization', `Bearer ${token}`)
        .send(validLink);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 200 with an the link with matching ID', async () => {
      const response = await request
        .get(`/rest/link/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body).toStrictEqual({
        ...validLink,
        id,
      });
    });
  });

  describe('When GET /rest/link/:id is called with a invalid ID', () => {
    const invalidId = 'marklar';

    it('Should then return a 400', async () => {
      await request
        .get(`/rest/link/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When GET /rest/link/:id is called with an ID not matching any link', () => {
    const invalidId = -1;

    it('Should then return a 404', async () => {
      await request
        .get(`/rest/link/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('When POST /rest/link is called with a valid link', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 201 with the created link', async () => {
      const response = await request
        .post('/rest/link')
        .set('Authorization', `Bearer ${token}`)
        .send(validLink)
        .expect(201);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validLink,
        id,
      });
    });
  });

  describe('When POST /rest/link is called with a link with a missing type field', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 400', async () => {
      const invalidLink: Partial<Link> = {
        ...validLink,
        type: undefined,
      };
      await request
        .post('/rest/link')
        .send(invalidLink)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When POST /rest/link is called with a link with a missing url field', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 400', async () => {
      const invalidLink: Partial<Link> = {
        ...validLink,
        url: undefined,
      };
      await request
        .post('/rest/link')
        .send(invalidLink)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When PUT /rest/link/:id is called with an invalid link id and valid fields', () => {
    const id = 'marklar';
    const validFields: Omit<Link, 'id'> = {
      type: 'LIVE',
      url: 'changed test url',
      projectId: 2,
    };

    it('Should then return a 400', async () => {
      await request
        .put(`/rest/link/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When PUT /rest/link/:id is called with a link id not matching any link and valid fields', () => {
    const id = -1;
    const validFields: Omit<Link, 'id'> = {
      type: 'LIVE',
      url: 'changed test url',
      projectId: 2,
    };

    it('Should then return a 404', async () => {
      await request
        .put(`/rest/link/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('When PUT /rest/link/:id is called with a valid link id and valid fields', () => {
    let id: number;
    let projectId: number;
    const validFields: Omit<Link, 'id'> = {
      type: 'LIVE',
      url: 'changed test url',
      projectId: 1,
    };

    const validProject: Omit<Project, 'id'> = {
      name: 'test project',
      description: 'test project description',
      image: 'test project image',
    };

    beforeEach(async () => {
      const projectResponse = await request
        .post('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .send(validProject);
      const response = await request
        .post('/rest/link')
        .set('Authorization', `Bearer ${token}`)
        .send(validLink);
      console.log('LINK', response.body);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 200 with the created link', async () => {
      const response = await request
        .put(`/rest/link/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validFields,
        id,
      });
    });
  });

  describe('When PUT /rest/link/:id is called with a valid link id and no fields', () => {
    let id: number;
    const validFields: Partial<Link> = {};

    beforeEach(async () => {
      const response = await request
        .post('/rest/link')
        .set('Authorization', `Bearer ${token}`)
        .send(validLink);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 400', async () => {
      await request
        .put(`/rest/link/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When DELTE /rest/link is called with an invalid link id', () => {
    const id = 'marklar';
    it('Should then return a 400', async () => {
      await request
        .delete(`/rest/link/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When DELTE /rest/link is called with a link id not matching any link', () => {
    const id = -1;
    it('Should then return a 404', async () => {
      await request
        .delete(`/rest/link/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('When DELETE /rest/link is called with a valid link id', () => {
    let id: number;
    beforeEach(async () => {
      const response = await request
        .post('/rest/link')
        .set('Authorization', `Bearer ${token}`)
        .send(validLink);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/link/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 200 with the deleted link', async () => {
      const response = await request
        .delete(`/rest/link/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validLink,
        id,
      });
    });
  });
});

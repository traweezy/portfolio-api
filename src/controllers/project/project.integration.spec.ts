import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { project as Project } from '@prisma/client';
import ProjectCtrl from './index';
import Server from '../../server';
import getTestingToken from '../../utils/get-testing-token';

describe('Given ProjectCtrl', () => {
  let token: string;
  let request: SuperTest.SuperTest<SuperTest.Test>;
  const validProject: Omit<Project, 'id'> = {
    name: 'test project',
    description: 'test project description',
    image: 'test project image',
    technologies: [],
    isWorkInProgress: false,
    sortIndex: 0,
  };

  beforeAll(async () => {
    token = await getTestingToken();
  });

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [ProjectCtrl],
      },
    }),
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('When GET /rest/project is called', () => {
    it('Should then return a 200 with an array of projects', async () => {
      const response = await request
        .get('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length >= 0).toEqual(true);
    });
  });

  describe('When GET /rest/project/:id is called with a valid ID', () => {
    let id: number;

    beforeEach(async () => {
      const response = await request
        .post('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 200 with an the project with matching ID', async () => {
      const response = await request
        .get(`/rest/project/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body).toStrictEqual({
        ...validProject,
        links: [],
        id,
      });
    });
  });

  describe('When GET /rest/project/:id is called with a invalid ID', () => {
    const invalidId = 'marklar';

    it('Should then return a 400', async () => {
      await request
        .get(`/rest/project/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When GET /rest/project/:id is called with an ID not matching any project', () => {
    const invalidId = -1;

    it('Should then return a 404', async () => {
      await request
        .get(`/rest/project/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('When POST /rest/project is called with a valid project', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 201 with the created project', async () => {
      const response = await request
        .post('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .send(validProject)
        .expect(201);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validProject,
        id,
      });
    });
  });

  describe('When POST /rest/project is called with a project with a missing name field', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 400', async () => {
      const invalidProject: Partial<Project> = {
        ...validProject,
        name: undefined,
      };
      await request
        .post('/rest/project')
        .send(invalidProject)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When POST /rest/project is called with a project with a missing description field', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 400', async () => {
      const invalidProject: Partial<Project> = {
        ...validProject,
        description: undefined,
      };
      await request
        .post('/rest/project')
        .send(invalidProject)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When PUT /rest/project/:id is called with an invalid project id and valid fields', () => {
    const id = 'marklar';
    const validFields: Omit<Project, 'id'> = {
      name: 'changed test name',
      description: 'changed test description',
      image: 'changed test image',
      technologies: [],
      isWorkInProgress: false,
      sortIndex: 0,
    };

    it('Should then return a 400', async () => {
      await request
        .put(`/rest/project/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When PUT /rest/project/:id is called with a project id not matching any project and valid fields', () => {
    const id = -1;
    const validFields: Omit<Project, 'id'> = {
      name: 'changed test name',
      description: 'changed test description',
      image: 'changed test image',
      technologies: [],
      isWorkInProgress: false,
      sortIndex: 0,
    };

    it('Should then return a 404', async () => {
      await request
        .put(`/rest/project/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('When PUT /rest/project/:id is called with a valid project id and valid fields', () => {
    let id: number;
    const validFields: Omit<Project, 'id'> = {
      name: 'changed test name',
      description: 'changed test description',
      image: 'changed test image',
      technologies: [],
      isWorkInProgress: false,
      sortIndex: 0,
    };

    beforeEach(async () => {
      const response = await request
        .post('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 200 with the created project', async () => {
      const response = await request
        .put(`/rest/project/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validFields,
        links: [],
        id,
      });
    });
  });

  describe('When PUT /rest/project/:id is called with a valid project id and no fields', () => {
    let id: number;
    const validFields: Partial<Project> = {};

    beforeEach(async () => {
      const response = await request
        .post('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 400', async () => {
      await request
        .put(`/rest/project/${id}`)
        .send(validFields)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When DELTE /rest/project is called with an invalid project id', () => {
    const id = 'marklar';
    it('Should then return a 400', async () => {
      await request
        .delete(`/rest/project/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  });

  describe('When DELTE /rest/project is called with a project id not matching any project', () => {
    const id = -1;
    it('Should then return a 404', async () => {
      await request
        .delete(`/rest/project/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('When DELETE /rest/project is called with a valid project id', () => {
    let id: number;
    beforeEach(async () => {
      const response = await request
        .post('/rest/project')
        .set('Authorization', `Bearer ${token}`)
        .send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request
          .delete(`/rest/project/${id}`)
          .set('Authorization', `Bearer ${token}`);
      }
    });

    it('Should then return a 200 with the deleted project', async () => {
      const response = await request
        .delete(`/rest/project/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validProject,
        links: [],
        id,
      });
    });
  });
});

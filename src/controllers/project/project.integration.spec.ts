import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { project as Project } from '@prisma/client';
import ProjectController from './index';
import Server from '../../server';

describe('Given ProjectController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  const validProject: Omit<Project, 'id'> = {
    name: 'test project',
    description: 'test project desacription',
    image: 'test project image',
  };

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [ProjectController],
      },
    }),
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('When GET /rest/project is called', () => {
    it('Should then return a 200 with an array of projects', async () => {
      const response = await request.get('/rest/project').expect(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length >= 0).toEqual(true);
    });
  });

  describe('When GET /rest/project/:id is called with a valid ID', () => {
    let id: number;

    beforeEach(async () => {
      const response = await request.post('/rest/project').send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 200 with an the project with matching ID', async () => {
      const response = await request.get(`/rest/project/${id}`).expect(200);
      expect(response.body).toStrictEqual({
        ...validProject,
        id,
      });
    });
  });

  describe('When GET /rest/project/:id is called with a invalid ID', () => {
    const invalidId = 'marklar';

    it('Should then return a 400', async () => {
      await request.get(`/rest/project/${invalidId}`).expect(400);
    });
  });

  describe('When GET /rest/project/:id is called with an ID not matching any project', () => {
    const invalidId = -1;

    it('Should then return a 404', async () => {
      await request.get(`/rest/project/${invalidId}`).expect(404);
    });
  });

  describe('When POST /rest/project is called with a valid project', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 201 with the created project', async () => {
      const response = await request
        .post('/rest/project')
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
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 400', async () => {
      const invalidProject: Partial<Project> = {
        ...validProject,
        name: undefined,
      };
      await request.post('/rest/project').send(invalidProject).expect(400);
    });
  });

  describe('When POST /rest/project is called with a project with a missing description field', () => {
    let id: number;

    afterEach(async () => {
      if (id) {
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 400', async () => {
      const invalidProject: Partial<Project> = {
        ...validProject,
        description: undefined,
      };
      await request.post('/rest/project').send(invalidProject).expect(400);
    });
  });

  describe('When PUT /rest/project/:id is called with an invalid project id and valid fields', () => {
    const id = 'marklar';
    const validFields: Omit<Project, 'id'> = {
      name: 'changed test name',
      description: 'changed test description',
      image: 'changed test image',
    };

    it('Should then return a 400', async () => {
      await request.put(`/rest/project/${id}`).send(validFields).expect(400);
    });
  });

  describe('When PUT /rest/project/:id is called with a project id not matching any project and valid fields', () => {
    const id = -1;
    const validFields: Omit<Project, 'id'> = {
      name: 'changed test name',
      description: 'changed test description',
      image: 'changed test image',
    };

    it('Should then return a 404', async () => {
      await request.put(`/rest/project/${id}`).send(validFields).expect(404);
    });
  });

  describe('When PUT /rest/project/:id is called with a valid project id and valid fields', () => {
    let id: number;
    const validFields: Omit<Project, 'id'> = {
      name: 'changed test name',
      description: 'changed test description',
      image: 'changed test image',
    };

    beforeEach(async () => {
      const response = await request.post('/rest/project').send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 200 with the created project', async () => {
      const response = await request
        .put(`/rest/project/${id}`)
        .send(validFields)
        .expect(200);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validFields,
        id,
      });
    });
  });

  describe('When PUT /rest/project/:id is called with a valid project id and no fields', () => {
    let id: number;
    const validFields: Partial<Project> = {};

    beforeEach(async () => {
      const response = await request.post('/rest/project').send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 400', async () => {
      await request.put(`/rest/project/${id}`).send(validFields).expect(400);
    });
  });

  describe('When DELTE /rest/project is called with an invalid project id', () => {
    const id = 'marklar';
    it('Should then return a 400', async () => {
      await request.delete(`/rest/project/${id}`).expect(400);
    });
  });

  describe('When DELTE /rest/project is called with a project id not matching any project', () => {
    const id = -1;
    it('Should then return a 404', async () => {
      await request.delete(`/rest/project/${id}`).expect(404);
    });
  });

  describe('When DELETE /rest/project is called with a valid project id', () => {
    let id: number;
    beforeEach(async () => {
      const response = await request.post('/rest/project').send(validProject);
      id = response?.body?.id;
    });

    afterEach(async () => {
      if (id) {
        await request.delete(`/rest/project/${id}`);
      }
    });

    it('Should then return a 200 with the deleted project', async () => {
      const response = await request.delete(`/rest/project/${id}`).expect(200);

      id = response?.body?.id;
      expect(response.body).toStrictEqual({
        ...validProject,
        id,
      });
    });
  });
});

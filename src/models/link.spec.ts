import { link as Link } from '@prisma/client';
import { LinkModel } from './link';

describe('Given LinkModel', () => {
  const validLink: Link = {
    id: 1,
    type: 'GITHUB',
    url: 'test url',
    projectId: 1,
  };
  describe('When a link model is created with a valid link object', () => {
    it('Should then return a new link model', async () => {
      const linkModel = new LinkModel(validLink);
      expect(validLink).toEqual(linkModel);
    });
  });
});

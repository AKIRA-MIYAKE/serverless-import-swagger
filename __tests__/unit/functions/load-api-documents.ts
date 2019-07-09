import path from 'path';

import loadAPIDocuments from '../../../src/functions/load-api-documents';

describe('unit', () => {
  const config = {
    all: true,
    serviceName: 'service',
    basePath: false,
    input: null,
    outDir: null,
    common: null,
    force: false,
    options: {
      cors: false,
      optionsMethod: false,
      authorizer: null,
      operationId: false,
    },
  };

  describe('functions/load-openapi', () => {
    it('Should return specified definition.', async () => {
      const result = await loadAPIDocuments({
        ...config,
        input: [path.resolve(__dirname, '../../resources/openapi.yaml')],
      });
      expect(result.length).toBe(1);
    });

    it('Should return definition of default name on app root.', async () => {
      const result = await loadAPIDocuments(
        config, path.resolve(__dirname, '../../resources')
      );
      expect(result.length).toBe(1);
    });

    it('Should return multiple definitions.', async () => {
      const result = await loadAPIDocuments({
        ...config,
        input: [
          path.resolve(__dirname, '../../resources/openapi.yaml'),
          path.resolve(__dirname, '../../resources/openapi.admin.yaml')
        ],
      });
      expect(result.length).toBe(2);
    });
  });
});

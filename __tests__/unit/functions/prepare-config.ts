import path from 'path';

import prepareConfig from '../../../src/functions/prepare-config';

describe('unit', () => {
  describe('functions/prepare-config', () => {
    describe('prepareConfig()', () => {
      it('Shoud return default config without input.', async () => {
        const result = await prepareConfig({});

        expect(result).toEqual({
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
        });
      });

      it('Shoud return config with app root config.', async () => {
        const result = await prepareConfig({}, path.resolve(__dirname, '../../resources'));

        expect(result).toEqual({
          all: true,
          serviceName: 'api',
          basePath: false,
          input: null,
          outDir: null,
          common: null,
          force: false,
          options: {
            cors: true,
            optionsMethod: false,
            authorizer: null,
            operationId: true,
          },
        });
      });

      it('Shoud return config with config option.', async () => {
        const result = await prepareConfig({
          config: path.resolve(__dirname, '../../resources/sis.config.json'),
        });

        expect(result).toEqual({
          all: true,
          serviceName: 'api',
          basePath: false,
          input: null,
          outDir: null,
          common: null,
          force: false,
          options: {
            cors: true,
            optionsMethod: false,
            authorizer: null,
            operationId: true,
          },
        });
      });

      it('Shoud return config with cli options.', async () => {
        const result = await prepareConfig({
          input: ['./openapi.yaml'],
          outDir: './services',
          common: './serverless.common.yml',
          force: true,
        });

        expect(result).toEqual({
          all: true,
          serviceName: 'service',
          basePath: false,
          input: ['./openapi.yaml'],
          outDir: './services',
          common: './serverless.common.yml',
          force: true,
          options: {
            cors: false,
            optionsMethod: false,
            authorizer: null,
            operationId: false,
          },
        });
      });
    });
  });
});

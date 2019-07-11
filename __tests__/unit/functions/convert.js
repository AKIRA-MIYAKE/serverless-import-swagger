import path from 'path';

import convert, {
  createIsolatedSlsServie,
  createServiceName,
  createFunctionName,
} from '../../../src/functions/convert';

import loadAPIDocuments from '../../../src/functions/load-api-documents';

describe('unit', () => {
  describe('functions/convert', () => {
    describe('convert()', () => {
      it('Should convert.', async () => {
        const config = {
          all: true,
          serviceName: 'petstore',
          basePath: false,
          input: [path.resolve(__dirname, '../../resources/openapi.yaml')],
          outDir: null,
          common: null,
          force: false,
          options: {
            cors: true,
            optionsMethod: false,
            authorizer: null,
            operationId: true,
          },
        };

        const docs = await loadAPIDocuments(config);
        const services = convert(docs, config);
        expect(services.length).toBe(1);
        expect(Object.keys(services[0].functions).length).toBe(20);
      });

      it('Should convert with base path option.', async () => {
        const config = {
          all: true,
          serviceName: 'service',
          basePath: { servicePrefix: 'api' },
          input: [path.resolve(__dirname, '../../resources/openapi.yaml')],
          outDir: null,
          common: null,
          force: false,
          options: {
            cors: true,
            optionsMethod: true,
            authorizer: null,
            operationId: true,
          },
        };

        const docs = await loadAPIDocuments(config);
        const services = convert(docs, config);
        expect(services.length).toBe(3);
      });

      it('Should convert with optioms method option.', async () => {
        const config = {
          all: true,
          serviceName: 'petstore',
          basePath: false,
          input: [path.resolve(__dirname, '../../resources/openapi.yaml')],
          outDir: null,
          common: null,
          force: false,
          options: {
            cors: true,
            optionsMethod: true,
            authorizer: null,
            operationId: true,
          },
        };

        const docs = await loadAPIDocuments(config);
        const services = convert(docs, config);
        expect(services.length).toBe(1);
        expect(Object.keys(services[0].functions).length).toBe(20 + 14);
      });
    });

    describe('createIsolatedSlsServie()', () => {
      describe('authorizer-arn', () => {
        it('should add authorizer arn to generated function', () => {
          const obj = {
            path: '/foo/bar',
            method: 'get',
            config: {
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
                authorizer: 'arn:aws:lambda:*:*:function:fake-authorizer',
                operationId: false,
              },
            },
          };
          
          const service = createIsolatedSlsServie(obj);
          expect(service.functions.getFooBar.events[0].http.authorizer).toBe('arn:aws:lambda:*:*:function:fake-authorizer');
        });
      });
    });
    
    describe('createServiceName()', () => {
      it('default configs.', () => {
        const config = {
          serviceName: 'service',
          basePath: false,
        };

        const obj = {
          path: '/foo/bar',
          method: 'get',
          config,
        };

        const result = createServiceName(obj);
        expect(result).toBe('service');
      });

      it('base-path option.', () => {
        const config = {
          basePath: { servicePrefix: 'api' },
        };

        const obj = {
          path: '/foo/bar',
          method: 'get',
          config,
        };

        const result = createServiceName(obj);
        expect(result).toBe('api-foo');
      });

      it('base-path option and none serviceName.', () => {
        const config = {
          basePath: true,
        };

        const obj = {
          path: '/foo/bar',
          method: 'get',
          config,
        };

        const result = createServiceName(obj);
        expect(result).toBe('foo');
      });
    });

    describe('createFunctionName()', () => {
      describe('none options.', () => {
        const config = {
          basePath: false,
          options: {
            operationId: false,
          },
        };

        it('Should name if path is root.', () => {
          const obj = {
            path: '/',
            method: 'get',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('get');
        });

        it('Should concatenate method and paths to create name.', () => {
          const obj = {
            path: '/foo/bar',
            method: 'get',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('getFooBar');
        });

        it('Should convert snake_case in paths to PascalCase, but preserve _ in method', () => {
          const obj = {
            path: '/i_am_snake/alreadyCamel',
            method: 'hello_world',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('hello_worldIAmSnakeAlreadyCamel');
        });

        it ('Should extract path parameter and convert it to PascalCase of 3-chars words.', () => {
          const obj = {
            path: '/foo/bar/{very_long_path}',
            method: 'get',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('getFooBarWithVerLonPat');
        });

        it('Should use the non-parametric paths just after the last path parameter.', () => {
          const obj = {
            path: '/foo/{user_id}/bar/buz',
            method: 'get',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('getBarBuzWithUseId');
        });

        it('Should concatenates 2 or more path parameter without separator.', () => {
          const obj = {
            path: '/foo/bar/{user_id}/buz/{some_key}/fuga/hoge/{another_key}',
            method: 'get',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('getFugaHogeWithUseIdSomKeyAnoKey');
        });
      });

      describe('base-path option.', () => {
        const config = {
          basePath: true,
          options: {
            operationId: false,
          },
        };

        it('Should skip the first path with basePath true.', () => {
          const obj0 = {
            path: '/base/foo/bar',
            method: 'get',
            config,
          };
          const result0 = createFunctionName(obj0);
          expect(result0).toBe('getFooBar');

          const obj1 = {
            path: '/base/another/more',
            method: 'post',
            config,
          };
          const result1 = createFunctionName(obj1);
          expect(result1).toBe('postAnotherMore');
        });
      });

      describe('operation-id option.', () => {
        const config = {
          basePath: false,
          options: {
            operationId: true,
          },
        };

        it('Should fallback to default name if operationId is not defined.', () => {
          const obj = {
            path: '/foo/bar',
            method: 'get',
            operationId: undefined,
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('getFooBar');
        });

        it('Should fallback to default name if operationId in definition is not a string', () => {
          const obj = {
            path: '/foo/bar',
            method: 'get',
            operationId: 42,
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('getFooBar');
        });

        it('Should use operationId in definition as a name', () => {
          const obj = {
            path: '/foo/bar',
            method: 'get',
            operationId: 'myName',
            config,
          };
          const result = createFunctionName(obj);
          expect(result).toBe('myName');
        });
      });
    });
  });
});

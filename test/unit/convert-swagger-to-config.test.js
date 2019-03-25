'use strict';

const assert = require('power-assert');
const converter = require('../../lib/convert-swagger-to-configs');

describe('convert-swagger-to-configs', () => {
  
  describe('extractFunctionName', () => {
    describe('default', () => {
      const option = {};
      
      it('should throw if method is null', () => {
        const definition = {
          method: 'hello',
          path: null,
        };
        assert.throws(() => converter._extractFunctionName(definition, option));
      });

      it('should name if path is root', () => {
        const definition = {
          method: 'get',
          path: '/',
        };
        assert.equal(converter._extractFunctionName(definition, option), 'get');
      });

      it('should concatenate method and paths to create name', () => {
        const definition = {
          method: 'get',
          path: '/foo/bar',
        };
        assert.equal(converter._extractFunctionName(definition, option), 'getFooBar');
      });

      it('should convert snake_case in paths to PascalCase, but preserve _ in method', () => {
        const definition = {
          method: 'hello_world',
          path: '/i_am_snake/alreadyCamel',
        };
        assert.equal(converter._extractFunctionName(definition, option), 'hello_worldIAmSnakeAlreadyCamel');
      });

      it('should extract path parameter and convert it to PascalCase of 3-chars words', () => {
        const definition = {
          method: 'get',
          path: '/foo/bar/{very_long_path}',
        };
        assert.equal(converter._extractFunctionName(definition, option), 'getFooBarWithVerLonPat')
      });

      it('should use the non-parametric paths just after the last path parameter', () => {
        const definition = {
          method: 'get',
          path: '/foo/{user_id}/bar/buz',
        };
        assert.equal(converter._extractFunctionName(definition, option), 'getBarBuzWithUseId')
      });

      it('should concatenates 2 or more path parameter without separator', () => {
        const definition = {
          method: 'get',
          path: '/foo/bar/{user_id}/buz/{some_key}/fuga/hoge/{another_key}',
        };
        assert.equal(converter._extractFunctionName(definition, option), 'getFugaHogeWithUseIdSomKeyAnoKey')
      });
    });
    
    describe('options', () => {
      describe('base-path', () => {
        it('should skip the first path', () => {
          const option = {
            basePath: true
          };

          const definition1 = {
            method: 'get',
            path: '/base/foo/bar',
          };
          assert.equal(converter._extractFunctionName(definition1, option), 'getFooBar');

          const definition2 = {
            method: 'post',
            path: '/base/another/more',
          };
          assert.equal(converter._extractFunctionName(definition2, option), 'postAnotherMore')
        });
      });

      describe('operation-id', () => {
        const option = {
          operationId: true
        };

        it('should fallback to default name if operationId is not defined', () => {
          const definition1 = {
            method: 'get',
            path: '/foo/bar',
          };
          assert.equal(converter._extractFunctionName(definition1, option), 'getFooBar');
        });

        it('should fallback to default name if operationId in definition is not a string', () => {
          const definition1 = {
            method: 'get',
            path: '/foo/bar',
            methodObject: {
              operationId: 42,
            }
          };
          assert.equal(converter._extractFunctionName(definition1, option), 'getFooBar');
        });
        
        it('should use operationId in definition as a name', () => {
          const definition1 = {
            method: 'get',
            path: '/foo/bar',
            methodObject: {
              operationId: 'myName',
            }
          };
          assert.equal(converter._extractFunctionName(definition1, option), 'myName');
        });
      });
    });
  });

  describe('definitionToConfig', () => {
    describe('authorizer-arn', () => {
      it('should add authorizer arn to generated function', () => {
        const definition = {
          method: 'get',
          path: '/foo/bar',
          methodObject: {
            tags: ["sls-api"]
          }
        }
        const option = {
          apiPrefix: "sls",
          authorizer: "arn:aws:lambda:*:*:function:fake-authorizer"
        }
        let config = converter._definitionToConfig(definition, option)
        assert.equal(config.functions.getFooBar.events[0].http.authorizer, 'arn:aws:lambda:*:*:function:fake-authorizer')
      });
    });
  });
});

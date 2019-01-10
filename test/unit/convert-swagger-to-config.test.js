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
    });
  });
});

'use strict';

const assert = require('power-assert');

const del = require('del');
const childProcess = require('child_process');
const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

describe('sis', () => {

  describe('interface testing', () => {
    before(() => {
      const command = `${appRoot.path}/bin/sis -i test/swagger.yaml -c test/serverless.common.yml -o test/src`;
      childProcess.execSync(command);
    });

    it('Should generate service.', (done) => {
      fs.readdir(path.resolve(appRoot.path, './test/src/pets'), (error, results) => {
        assert.ok(results.length === 4);
        assert.ok(results.some((result) => {
          return (result === 'serverless.yml');
        }));

        done();
      });
    });

    after(() => {
      return del(path.resolve(appRoot.path, './test/src'));
    });
  });

});

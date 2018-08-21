'use strict';

const assert = require('power-assert');

const del = require('del');
const childProcess = require('child_process');
const path = require('path');
const fs = require('graceful-fs');
const jsyaml = require('js-yaml');
const appRoot = require('app-root-path');

describe('sis', () => {

  const swaggerVersions = [
      {"name": "Swagger 2.0 (legacy)", "specFile":"test/swagger.yaml", "outDir":"test/src/swagger20"},
      {"name": "OpenAPI 3.0", "specFile":"test/openapi30.yaml", "outDir":"test/src/openapi30"}
  ];

  swaggerVersions.forEach(swaggerVersion => {
    describe(`${swaggerVersion.name}: interface testing`, () => {
      before(() => {
        const command = `${appRoot.path}/bin/sis -i ${swaggerVersion.specFile} -c test/serverless.common.yml -S sis -o ${swaggerVersion.outDir} -f -O -B`;
        childProcess.execSync(command);
      });

      it('Should generate authentication service.', (done) => {
        fs.readdir(path.resolve(appRoot.path, `${swaggerVersion.outDir}/authentication`), (error, results) => {
          assert.ok(results.some((result) => {
            return (result === 'serverless.yml');
          }));

          assert.ok(results.some((result) => {
            return (result === 'handler.js');
          }));

          done();
        });
      });

      it('Should generate test service.', (done) => {
        fs.readdir(path.resolve(appRoot.path, `${swaggerVersion.outDir}/test`), (error, results) => {
          assert.ok(results.some((result) => {
            return (result === 'serverless.yml');
          }));

          assert.ok(results.some((result) => {
            return (result === 'handler.js');
          }));

          done();
        });
      });

      after(() => {
        return del(path.resolve(appRoot.path, swaggerVersion.outDir));
      });
    });
  });
});

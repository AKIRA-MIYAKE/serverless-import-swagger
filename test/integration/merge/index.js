'use strict';

const assert = require('power-assert');

const del = require('del');
const childProcess = require('child_process');
const path = require('path');
const jsyaml = require('js-yaml');
const fs = require('graceful-fs');
const appRoot = require('app-root-path');

describe('multiple swagger yamls', () => {

  const basedir = 'test/integration/merge';
  const swaggerVersions = [
      {
        'name': 'OpenAPI 3.0',
        'specFiles': [`${basedir}/openapi30.part1.yaml`, `${basedir}/openapi30.part2.yaml`],
        'outDir':`${basedir}/src/openapi30`
      }
  ];

  swaggerVersions.forEach(swaggerVersion => {
    describe(`${swaggerVersion.name}`, () => {
      let serviceDir;

      before(() => {
        const command = `${appRoot.path}/bin/sis --operation-id -i ${swaggerVersion.specFiles.join(',')} -c ${basedir}/serverless.common.yml -o ${swaggerVersion.outDir} -f`;
        childProcess.execSync(command);
        serviceDir = path.resolve(appRoot.path, `${swaggerVersion.outDir}/test`);
      });

      it('should generate test service.', (done) => {
        fs.readdir(serviceDir, (error, results) => {
          assert.ok(results.includes('serverless.yml'));
          assert.ok(results.includes('handler.js'));
          done();
        });
      });

      it('should have functions from multiple swagger.yaml', (done) => {
        const generatedYamlFile = path.resolve(serviceDir, 'serverless.yml');
        const yaml = jsyaml.safeLoad(fs.readFileSync(generatedYamlFile, 'utf8'));
        const functionNames = Object.keys(yaml.functions);
        assert.deepEqual(functionNames, ['getCommentsWithTesIdUseId', 'myName']);
        done();
      });

      after(() => {
        return del(path.resolve(appRoot.path, swaggerVersion.outDir));
      });
    });
  });
});

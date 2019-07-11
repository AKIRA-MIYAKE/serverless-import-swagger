import childProcess from 'child_process';

import fs from 'graceful-fs';
import del from 'del';
import jsyaml from 'js-yaml';

import { resolveAppRootPath } from '../../src/utils';

describe('multiple swagger yamls', () => {
  const swaggerVersions = [
    {
      name: 'OpenAPI 3.0',
      input: [
        resolveAppRootPath('__tests__/resources/openapi.yaml'),
        resolveAppRootPath('__tests__/resources/openapi.admin.yaml')
      ],
      outDir: '__tests__/dist/merge/openapi30',
    },
  ];

  const commonFilePath = resolveAppRootPath('__tests__/resources/serverless.common.yml');

  swaggerVersions.forEach(swaggerVersion => {
    describe(`${swaggerVersion}`, () => {
      beforeAll(() => {
        const paths = swaggerVersion.input.map(p => `-i ${p}`).join(' ');
        const command = `${resolveAppRootPath('./bin/')}/sis ${paths} -c ${commonFilePath} -o ${swaggerVersion.outDir} -s api`;
        childProcess.execSync(command);
      });
      
      it('Should generate api service.', () => {
        fs.readdir(resolveAppRootPath(`${swaggerVersion.outDir}/api`), (error, results) => {
          expect(results.some(r => r === 'serverless.yml')).toBe(true);
          expect(results.some(r => r === 'handler.js')).toBe(true);
        });
      });

      it('should have functions from multiple swagger.yaml', () => {
        const generatedYamlFile = resolveAppRootPath(`${swaggerVersion.outDir}/api/serverless.yml`);
        const yaml = jsyaml.safeLoad(fs.readFileSync(generatedYamlFile, 'utf8'));
        const functionNames = Object.keys(yaml.functions);
        expect(functionNames.includes('putPet')).toBe(true);
        expect(functionNames.includes('getAdminUsers')).toBe(true);
      });

      afterAll(async () => {
        await del(resolveAppRootPath(swaggerVersion.outDir));
      });
    });
  })
});
import childProcess from 'child_process';

import fs from 'graceful-fs';
import del from 'del';

import { resolveAppRootPath } from '../../src/utils';

describe('sis', () => {
  const swaggerVersions = [
    {
      name: 'Swagger 2.0 (legacy)',
      input: resolveAppRootPath('__tests__/resources/swagger.yaml'),
      outDir: '__tests__/dist/cli/swagger20',
    },
    {
      name: 'OpenAPI 3.0',
      input: resolveAppRootPath('__tests__/resources/openapi.yaml'),
      outDir: '__tests__/dist/cli/openapi30',
    },
  ];

  const commonFilePath = resolveAppRootPath('__tests__/resources/serverless.common.yml');

  swaggerVersions.forEach(swaggerVersion => {
    describe(`${swaggerVersion.name}: interface testinng.`, () => {
      beforeAll(() => {
        const command = `${resolveAppRootPath('./bin/')}/sis -i ${swaggerVersion.input} -c ${commonFilePath} -o ${swaggerVersion.outDir} -s api`;
        childProcess.execSync(command);
      });
      
      it('Should generate api service.', () => {
        fs.readdir(resolveAppRootPath(`${swaggerVersion.outDir}/api`), (error, results) => {
          expect(results.some(r => r === 'serverless.yml')).toBe(true);
          expect(results.some(r => r === 'handler.js')).toBe(true);
        });
      });

      afterAll(async () => {
        await del(resolveAppRootPath(swaggerVersion.outDir));
      });
    });

    describe(`${swaggerVersion.name}: interface testinng with sis.config.json.`, () => {
      beforeAll(() => {
        const command = `${resolveAppRootPath('./bin/')}/sis -i ${swaggerVersion.input} -c ${commonFilePath} -o ${swaggerVersion.outDir} --config ${resolveAppRootPath('__tests__/resources/sis.config.json')}`;
        childProcess.execSync(command);
      });
      
      it('Should generate api service.', () => {
        fs.readdir(resolveAppRootPath(`${swaggerVersion.outDir}/api`), (error, results) => {
          expect(results.some(r => r === 'serverless.yml')).toBe(true);
          expect(results.some(r => r === 'handler.js')).toBe(true);
        });
      });

      afterAll(async () => {
        await del(resolveAppRootPath(swaggerVersion.outDir));
      });
    });

    describe(`${swaggerVersion.name}: interface testinng with sis.config.bp.json.`, () => {
      beforeAll(() => {
        const command = `${resolveAppRootPath('./bin/')}/sis -i ${swaggerVersion.input} -c ${commonFilePath} -o ${swaggerVersion.outDir} --config ${resolveAppRootPath('__tests__/resources/sis.config.bp.json')}`;
        childProcess.execSync(command);
      });
      
      it('Should generate pet service.', () => {
        fs.readdir(resolveAppRootPath(`${swaggerVersion.outDir}/api-pet`), (error, results) => {
          expect(results.some(r => r === 'serverless.yml')).toBe(true);
          expect(results.some(r => r === 'handler.js')).toBe(true);
        });
      });

      it('Should generate store service.', () => {
        fs.readdir(resolveAppRootPath(`${swaggerVersion.outDir}/api-store`), (error, results) => {
          expect(results.some(r => r === 'serverless.yml')).toBe(true);
          expect(results.some(r => r === 'handler.js')).toBe(true);
        });
      });

      it('Should generate user service.', () => {
        fs.readdir(resolveAppRootPath(`${swaggerVersion.outDir}/api-user`), (error, results) => {
          expect(results.some(r => r === 'serverless.yml')).toBe(true);
          expect(results.some(r => r === 'handler.js')).toBe(true);
        });
      });

      afterAll(async () => {
        await del(resolveAppRootPath(swaggerVersion.outDir));
      });
    });
  });
});
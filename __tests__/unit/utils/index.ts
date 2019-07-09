import path from 'path';

import {
  resolveAppRootPath,
  getPathIfExistsWithRegExp,
  existsItem,
  loadFileAsJSONIfExists,
} from '../../../src/utils';

describe('unit', () => {
  describe('utils', () => {
    describe('resolveAppRootPath()', () => {
      it('Should return resolved path', () => {
        const appRoot = path.resolve(__dirname, '../../../');

        const result0 = resolveAppRootPath('./test.json');
        expect(result0).toBe(path.resolve(appRoot, './test.json'));

        const result1 = resolveAppRootPath('./foo/bar.json');
        expect(result1).toBe(path.resolve(appRoot, './foo/bar.json'));
      });

      it('Should return resolved path that specified app root.', () => {
        const appRoot = '/foo/bar';
        const result = resolveAppRootPath('./test.json', appRoot);
        expect(result).toBe('/foo/bar/test.json');
      });

      it('Should return same path when passing absolute path.', () => {
        const result = resolveAppRootPath('/foo/bar/test.json');
        expect(result).toBe('/foo/bar/test.json');
      });
    });

    describe('getPathIfExistsWithRegExp()', () => {
      it('Should return matched path', async () => {
        const dirPath = path.resolve(__dirname, './');
        const result = await getPathIfExistsWithRegExp(/^index.ts$/, dirPath);
        expect(result).toBe(path.resolve(dirPath, 'index.ts'));
      });

      it('Should return undefined when not exits.', async () => {
        const dirPath = path.resolve(__dirname, './');
        const result = await getPathIfExistsWithRegExp(/^test.json$/, dirPath);
        expect(result).toBeUndefined();
      });
    });

    describe('existsItem()', () => {
      it('Shoud return true if exists.', async () => {
        const filePath = path.resolve(__dirname, './index.ts');
        const result = await existsItem(filePath);
        expect(result).toBe(true);
      });

      it('Shoud return false if not exists.', async () => {
        const filePath = path.resolve(__dirname, './test.ts');
        const result = await existsItem(filePath);
        expect(result).toBe(false);
      });
    });

    describe('loadFileAsJSONIfExists()', () => {
      it('Should return object when load json file.', async () => {
        const filePath = path.resolve(__dirname, '../../resources/sis.config.json');
        const result = await loadFileAsJSONIfExists(filePath);
        expect(result).toBeDefined();
      });

      it('Should return object when load yaml file.', async () => {
        const filePath = path.resolve(__dirname, '../../resources/serverless.common.yml');
        const result = await loadFileAsJSONIfExists(filePath);
        expect(result).toBeDefined();
      });
    });
  });
});

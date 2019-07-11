import path from 'path';
import fs from 'graceful-fs';
import { promisify } from 'util';

import jsyaml from 'js-yaml';
import appRoot from 'app-root-path';

export const resolveAppRootPath = (
  relativePath: string,
  appRootPath: string = appRoot.path
): string => {
  return path.resolve(appRootPath, relativePath);
};

export const getPathIfExistsWithRegExp = async (
  regexp: RegExp,
  dirPath: string = appRoot.path
): Promise<string | undefined> => {
  const items = await promisify(fs.readdir)(dirPath);
  const matched = items.find(item => regexp.test(item));

  return typeof matched !== 'undefined'
    ? path.resolve(dirPath, matched)
    : undefined;
};

export const existsItem = (itemPath: string): Promise<boolean> => {
  return new Promise(resolve => {
    fs.access(itemPath, error => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const loadFileAsJSONIfExists = async (
  filePath: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const dataString = await promisify(fs.readFile)(filePath, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: any;
  if (/.json$/.test(filePath)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsed = JSON.parse(dataString);
  } else if (/.ya?ml$/.test(filePath)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsed = jsyaml.safeLoad(dataString);
  }

  return parsed;
};

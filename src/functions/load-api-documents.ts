import { Library, Document } from 'apicurio-data-models';

import { InternalConfig } from '../interfaces';
import {
  resolveAppRootPath,
  getPathIfExistsWithRegExp,
  loadFileAsJSONIfExists,
} from '../utils';

export default async (
  config: InternalConfig,
  appRootPath: string | undefined = undefined
): Promise<Document[]> => {
  let filePaths: string[];
  if (config.input === null || config.input.length === 0) {
    const filePath = await getPathIfExistsWithRegExp(
      /^openapi.ya?ml$/,
      appRootPath
    );

    if (typeof filePath !== 'undefined') {
      filePaths = [filePath];
    } else {
      throw new Error('API definition file not found.');
    }
  } else {
    filePaths = config.input.map(filePath =>
      resolveAppRootPath(filePath, appRootPath)
    );
  }

  const dataArray = await Promise.all(
    filePaths.map(filePath => loadFileAsJSONIfExists(filePath))
  );

  return dataArray.map(data => Library.readDocument(data));
};

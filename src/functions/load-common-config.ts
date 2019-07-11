import { InternalConfig } from '../interfaces';
import {
  resolveAppRootPath,
  getPathIfExistsWithRegExp,
  loadFileAsJSONIfExists,
} from '../utils';

export default async (
  config: InternalConfig,
  appRootPath: string | undefined = undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  let filePath: string | undefined;
  if (config.common) {
    filePath = resolveAppRootPath(config.common, appRootPath);
  } else {
    filePath = await getPathIfExistsWithRegExp(
      /^serverless.common.ya?ml$/,
      appRootPath
    );
  }

  if (typeof filePath === 'undefined') {
    return {};
  }

  return loadFileAsJSONIfExists(filePath);
};
